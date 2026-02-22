# blogposter Design Document

> **Summary**: 사용자가 포스팅을 하고 댓글을 달 수 있는 블로그 포스팅 서비스 MVP 설계
>
> **Project**: blogposter
> **Version**: 0.1.0
> **Author**: sewha
> **Date**: 2026-02-20
> **Status**: Draft
> **Planning Doc**: [blogposter.plan.md](../../01-plan/features/blogposter.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | Schema Definition | N/A |
| Phase 2 | Coding Conventions | N/A |
| Phase 3 | Mockup | N/A |
| Phase 4 | API Spec | N/A |

---

## 1. Overview

### 1.1 Design Goals

- Supabase(PostgreSQL)를 활용하여 별도 백엔드 없이 CRUD 기능 구현
- Next.js App Router의 Server/Client Component를 적절히 활용
- 반응형 디자인으로 모바일/데스크톱 모두 지원
- 인증 상태에 따른 UI 분기 처리

### 1.2 Design Principles

- **컴포넌트 단일 책임**: 각 컴포넌트는 하나의 역할만 수행
- **Server Component 우선**: 클라이언트 상호작용이 필요한 경우에만 `"use client"` 사용
- **타입 안전성**: 모든 데이터에 TypeScript 인터페이스 정의
- **점진적 로딩**: 로딩/에러 상태를 사용자에게 명확히 표시

---

## 2. Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Hooks   │  │  Stores  │   │
│  │ (App     │  │ (UI +    │  │ (useAuth │  │ (Zustand │   │
│  │  Router) │  │ Features)│  │ usePosts)│  │  auth)   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │         │
│       └──────────────┴──────────────┴──────────────┘         │
│                              │                               │
│                     ┌────────┴────────┐                      │
│                     │ lib/supabase.ts │                      │
│                     │(Supabase Client)│                      │
│                     └────────┬────────┘                      │
└──────────────────────────────┼───────────────────────────────┘
                               │ Supabase JS SDK
                    ┌──────────┴──────────┐
                    │      Supabase       │
                    │  ┌───────────────┐  │
                    │  │  Supabase Auth│  │
                    │  │  PostgreSQL   │  │
                    │  │  (+ RLS)      │  │
                    │  └───────────────┘  │
                    └─────────────────────┘
```

### 2.2 Data Flow

```
[글 작성 흐름]
PostForm (입력) → validation → supabase.from('posts').insert(body) → 성공 → 목록으로 이동

[글 목록 흐름]
페이지 진입 → supabase.from('posts').select().order().range() → PostList 렌더링

[댓글 작성 흐름]
CommentForm (입력) → supabase.from('comments').insert(body) → 댓글 목록 갱신

[인증 흐름]
LoginForm (입력) → supabase.auth.signInWithPassword() → 세션 자동 관리 → 리다이렉트
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| Pages | Components, Hooks | UI 렌더링 |
| Components | Types | 타입 안전성 |
| Hooks | lib/supabase.ts, Stores | 데이터 통신, 상태 관리 |
| Stores | lib/supabase.ts | 인증 상태 관리 |
| lib/supabase.ts | Supabase SDK | 백엔드 통신 |

---

## 3. Data Model

### 3.1 Entity Definition

```typescript
// types/index.ts

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Post {
  id: string;
  user_id: string;
  author_name: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

// Form 입력용 타입
export interface CreatePostInput {
  title: string;
  content: string;
  tags: string[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface CreateCommentInput {
  post_id: string;
  content: string;
}
```

### 3.2 Entity Relationships

```
[User] 1 ──── N [Post]
  │                │
  │                └── 1 ──── N [Comment]
  │
  └──────────── N [Comment]
```

### 3.3 Supabase PostgreSQL Schema

#### posts 테이블

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
-- 로그인 사용자만 작성
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
-- 작성자만 수정
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (auth.uid() = user_id);
-- 작성자만 삭제
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (auth.uid() = user_id);
```

#### comments 테이블

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
-- 로그인 사용자만 작성
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
-- 작성자만 삭제
CREATE POLICY "comments_delete" ON comments FOR DELETE USING (auth.uid() = user_id);
```

---

## 4. API Specification

### 4.1 인증 API (Supabase Auth)

```typescript
// 회원가입
supabase.auth.signUp({ email, password })

// 로그인
supabase.auth.signInWithPassword({ email, password })

// 현재 사용자
supabase.auth.getUser()

// 세션 감지 (자동 토큰 갱신 포함)
supabase.auth.onAuthStateChange((event, session) => { ... })

// 로그아웃
supabase.auth.signOut()
```

### 4.2 Posts API (Supabase Client)

```typescript
// 글 목록 (페이지네이션)
supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1)

// 글 상세
supabase.from('posts').select('*').eq('id', id).single()

// 글 작성
supabase.from('posts').insert({
  user_id: user.id,
  author_name: user.name,
  title: '첫 번째 글',
  content: '블로그 포스팅 내용입니다.',
  tags: ['nextjs', 'react']
}).select().single()

// 글 수정 (RLS가 작성자 검증)
supabase.from('posts').update({ title, content, tags }).eq('id', id).select().single()

// 글 삭제 (RLS가 작성자 검증)
supabase.from('posts').delete().eq('id', id)

// 내 글 목록 (마이페이지)
supabase.from('posts').select('*').eq('user_id', userId).order('created_at', { ascending: false })
```

### 4.3 Comments API (Supabase Client)

```typescript
// 댓글 목록 (특정 글)
supabase
  .from('comments')
  .select('*')
  .eq('post_id', postId)
  .order('created_at', { ascending: true })

// 댓글 작성
supabase.from('comments').insert({
  post_id: postId,
  user_id: user.id,
  author_name: user.name,
  content: '좋은 글이네요!'
}).select().single()

// 댓글 삭제 (RLS가 작성자 검증)
supabase.from('comments').delete().eq('id', commentId)
```

---

## 5. UI/UX Design

### 5.1 페이지별 레이아웃

#### 공통 Layout

```
┌────────────────────────────────────────────┐
│  Logo          [Posts]  [My Page]  [Login]  │  ← Header (Nav)
├────────────────────────────────────────────┤
│                                            │
│             Page Content                   │
│                                            │
├────────────────────────────────────────────┤
│  © 2026 blogposter                         │  ← Footer
└────────────────────────────────────────────┘
```

#### Home / 글 목록 (`/`, `/posts`)

```
┌────────────────────────────────────────────┐
│  Header                      [글 작성] btn │
├────────────────────────────────────────────┤
│  ┌──────────────────────────────────────┐  │
│  │ 제목                    작성자  날짜  │  │  ← PostCard
│  │ 본문 미리보기 (2줄)                   │  │
│  │ #tag1  #tag2                          │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ 제목                    작성자  날짜  │  │  ← PostCard
│  │ 본문 미리보기 (2줄)                   │  │
│  │ #tag1                                 │  │
│  └──────────────────────────────────────┘  │
│                                            │
│         [< Prev]  1 2 3  [Next >]          │  ← Pagination
└────────────────────────────────────────────┘
```

#### 글 상세 (`/posts/[id]`)

```
┌────────────────────────────────────────────┐
│  Header                                    │
├────────────────────────────────────────────┤
│  제목 (h1)                                 │
│  작성자 · 2026-02-20   [수정] [삭제]       │  ← 작성자만 표시
│  #tag1  #tag2                              │
│  ──────────────────────────────────        │
│  본문 내용                                  │
│                                            │
│  ──────────────────────────────────        │
│  댓글 (3개)                                 │
│  ┌────────────────────────────────────┐    │
│  │ reader1 · 2026-02-20       [삭제]  │    │  ← CommentItem
│  │ 좋은 글이네요!                      │    │
│  └────────────────────────────────────┘    │
│  ┌────────────────────────────────────┐    │
│  │ [댓글 입력...]           [등록] btn │    │  ← CommentForm
│  └────────────────────────────────────┘    │
└────────────────────────────────────────────┘
```

#### 글 작성/수정 (`/posts/new`, `/posts/[id]/edit`)

```
┌────────────────────────────────────────────┐
│  Header                                    │
├────────────────────────────────────────────┤
│  글 작성 (h1)                               │
│                                            │
│  제목  [________________________]           │
│                                            │
│  내용                                       │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  │         Textarea (10줄)              │  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  태그  [________________________] + 추가   │
│        #tag1 ✕  #tag2 ✕                    │
│                                            │
│              [취소]  [발행] btn              │
└────────────────────────────────────────────┘
```

#### 로그인 / 회원가입 (`/login`, `/register`)

```
┌────────────────────────────────────────────┐
│  Header                                    │
├────────────────────────────────────────────┤
│              로그인 (h1)                    │
│                                            │
│        이메일 [________________]            │
│        비밀번호 [________________]          │
│                                            │
│              [로그인] btn                   │
│                                            │
│        계정이 없으신가요? 회원가입           │
└────────────────────────────────────────────┘
```

### 5.2 User Flow

```
[비로그인 사용자]
Home(글 목록) → 글 상세 보기 → 댓글 작성 시도 → 로그인 페이지로 이동

[회원가입 흐름]
회원가입 페이지 → 이메일/비밀번호 입력 → 가입 완료 → 로그인 페이지로 이동

[로그인 사용자]
로그인 → Home → 글 작성 → 발행 → 글 상세 보기
                                        ↓
                                   댓글 작성
                                        ↓
                          마이페이지 (내 글 관리)
```

### 5.3 Component List

| Component | Location | Responsibility | FR |
|-----------|----------|----------------|----|
| `Header` | `components/ui/Header.tsx` | 네비게이션, 로그인 상태 표시 | - |
| `Footer` | `components/ui/Footer.tsx` | 푸터 정보 | - |
| `Button` | `components/ui/Button.tsx` | 공통 버튼 | - |
| `Input` | `components/ui/Input.tsx` | 공통 입력 필드 | - |
| `Textarea` | `components/ui/Textarea.tsx` | 공통 텍스트 영역 | - |
| `Card` | `components/ui/Card.tsx` | 공통 카드 컨테이너 | - |
| `Pagination` | `components/ui/Pagination.tsx` | 페이지네이션 | FR-05 |
| `LoginForm` | `components/features/LoginForm.tsx` | 로그인 폼 | FR-02 |
| `RegisterForm` | `components/features/RegisterForm.tsx` | 회원가입 폼 | FR-01 |
| `PostCard` | `components/features/PostCard.tsx` | 글 목록 카드 | FR-05 |
| `PostList` | `components/features/PostList.tsx` | 글 목록 컨테이너 | FR-05 |
| `PostForm` | `components/features/PostForm.tsx` | 글 작성/수정 폼 | FR-04, FR-07 |
| `PostDetail` | `components/features/PostDetail.tsx` | 글 상세 표시 | FR-06 |
| `CommentList` | `components/features/CommentList.tsx` | 댓글 목록 | FR-09 |
| `CommentItem` | `components/features/CommentItem.tsx` | 댓글 단일 항목 | FR-09 |
| `CommentForm` | `components/features/CommentForm.tsx` | 댓글 입력 폼 | FR-09 |
| `ProtectedRoute` | `components/features/ProtectedRoute.tsx` | 인증 필요 페이지 래퍼 | FR-03 |

---

## 6. State Management

### 6.1 Auth Store (Zustand)

```typescript
// stores/auth-store.ts
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

### 6.2 세션 관리 (Supabase Auth)

```
Supabase Auth가 세션을 자동 관리:
  → 로그인 성공 → Supabase SDK가 내부적으로 세션 저장
  → 토큰 갱신 → supabase.auth.onAuthStateChange()가 자동 처리
  → 페이지 새로고침 → supabase.auth.getUser()로 복원
  → 만료 → SDK가 자동으로 refresh token 사용

Zustand auth-store는 UI 상태만 관리:
  → user 정보 캐싱
  → isAuthenticated 플래그
  → onAuthStateChange 리스너로 동기화
```

---

## 7. Error Handling

### 7.1 Error Code 정의

| Code | Message | 사용자 표시 | Handling |
|------|---------|-----------|----------|
| 400 | Bad Request | "입력 정보를 확인해주세요" | 폼 에러 메시지 표시 |
| 401 | Unauthorized | "로그인이 필요합니다" | 로그인 페이지로 이동 |
| 403 | Forbidden | "권한이 없습니다" | 이전 페이지로 이동 |
| 404 | Not Found | "글을 찾을 수 없습니다" | 404 페이지 표시 |
| 500 | Server Error | "잠시 후 다시 시도해주세요" | 에러 화면 + 재시도 |

### 7.2 Error UI 패턴

```typescript
// 공통 에러 처리 패턴
const { data, error } = await supabase.from('posts').insert(body).select().single();
if (error) {
  if (error.code === '42501') {
    // RLS 권한 에러 → 로그인 페이지로 리다이렉트
  } else {
    // 에러 메시지 toast 표시
  }
} else {
  // 성공 처리
}
```

---

## 8. Security Considerations

- [x] React의 기본 XSS 이스케이프 활용 (dangerouslySetInnerHTML 사용 금지)
- [x] Supabase Auth가 세션/토큰 자동 관리
- [x] RLS(Row Level Security)로 서버에서 권한 검증
- [x] 입력값 길이 제한 (제목 200자, 댓글 500자) - DB CHECK 제약조건
- [x] HTTPS 통신 (Supabase 기본 제공)

---

## 9. Clean Architecture

### 9.1 Layer Structure

| Layer | Responsibility | Location |
|-------|---------------|----------|
| **Presentation** | 페이지, UI 컴포넌트, 사용자 상호작용 | `src/app/`, `src/components/` |
| **Application** | 커스텀 훅, 비즈니스 로직 조합 | `src/hooks/` |
| **Domain** | 엔터티, 타입 정의 | `src/types/` |
| **Infrastructure** | Supabase 클라이언트, 상태 저장소 | `src/lib/`, `src/stores/` |

### 9.2 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| PostCard, PostForm, LoginForm | Presentation | `src/components/features/` |
| useAuth, usePosts, useComments | Application | `src/hooks/` |
| Post, Comment, User | Domain | `src/types/index.ts` |
| supabase.ts, auth-store.ts | Infrastructure | `src/lib/`, `src/stores/` |

---

## 10. Coding Convention

### 10.1 Naming Conventions

| Target | Rule | Example |
|--------|------|---------|
| Components | PascalCase | `PostCard`, `LoginForm` |
| Hooks | camelCase + use prefix | `useAuth`, `usePosts` |
| Stores | kebab-case | `auth-store.ts` |
| Types | PascalCase | `Post`, `CreatePostInput` |
| Page files | Next.js convention | `page.tsx`, `layout.tsx` |
| Folders | kebab-case | `components/features/` |

### 10.2 Import Order

```typescript
// 1. React / Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { create } from 'zustand';

// 3. Internal (absolute)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// 4. Types
import type { Post, Comment } from '@/types';
```

---

## 11. Implementation Guide

### 11.1 File Structure (최종)

```
src/
├── app/
│   ├── layout.tsx                    # Root layout + Header/Footer
│   ├── page.tsx                      # Home (최신 글 목록)
│   ├── (auth)/
│   │   ├── login/page.tsx           # 로그인 페이지
│   │   └── register/page.tsx        # 회원가입 페이지
│   ├── (main)/
│   │   └── dashboard/page.tsx       # 마이페이지 (내 글 관리)
│   └── posts/
│       ├── page.tsx                  # 전체 글 목록
│       ├── new/page.tsx              # 글 작성
│       └── [id]/
│           ├── page.tsx              # 글 상세 + 댓글
│           └── edit/page.tsx         # 글 수정
├── components/
│   ├── ui/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   └── Pagination.tsx
│   └── features/
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       ├── PostCard.tsx
│       ├── PostList.tsx
│       ├── PostForm.tsx
│       ├── PostDetail.tsx
│       ├── CommentList.tsx
│       ├── CommentItem.tsx
│       ├── CommentForm.tsx
│       └── ProtectedRoute.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── usePosts.ts
│   └── useComments.ts
├── lib/
│   └── supabase.ts
├── stores/
│   └── auth-store.ts
└── types/
    └── index.ts
```

### 11.2 Implementation Order

```
Phase 1: 기반 설정 (Infrastructure)
  1. [x] types/index.ts - 타입 정의
  2. [x] types/database.ts - Supabase DB 타입
  3. [x] lib/supabase.ts - Supabase 클라이언트
  3. [ ] stores/auth-store.ts - 인증 상태 관리
  4. [ ] components/ui/* - 공통 UI 컴포넌트

Phase 2: 인증 (FR-01, FR-02, FR-03)
  5. [ ] hooks/useAuth.ts - 인증 훅
  6. [ ] components/features/LoginForm.tsx
  7. [ ] components/features/RegisterForm.tsx
  8. [ ] components/features/ProtectedRoute.tsx
  9. [ ] app/(auth)/login/page.tsx
  10. [ ] app/(auth)/register/page.tsx

Phase 3: 글 CRUD (FR-04, FR-05, FR-06, FR-07, FR-08)
  11. [ ] hooks/usePosts.ts - 글 관련 훅
  12. [ ] components/features/PostCard.tsx
  13. [ ] components/features/PostList.tsx
  14. [ ] components/features/PostForm.tsx
  15. [ ] components/features/PostDetail.tsx
  16. [ ] app/page.tsx - Home (글 목록)
  17. [ ] app/posts/page.tsx - 전체 글 목록
  18. [ ] app/posts/new/page.tsx - 글 작성
  19. [ ] app/posts/[id]/page.tsx - 글 상세
  20. [ ] app/posts/[id]/edit/page.tsx - 글 수정

Phase 4: 댓글 (FR-09, FR-10)
  21. [ ] hooks/useComments.ts - 댓글 훅
  22. [ ] components/features/CommentForm.tsx
  23. [ ] components/features/CommentItem.tsx
  24. [ ] components/features/CommentList.tsx

Phase 5: 마이페이지 + Layout (FR-11)
  25. [ ] app/(main)/dashboard/page.tsx
  26. [ ] app/layout.tsx - Header/Footer 적용
  27. [ ] components/ui/Pagination.tsx
```

### 11.3 Dependencies to Install

```bash
npm install zustand @supabase/supabase-js
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-20 | Initial draft | sewha |
