# blogposter Planning Document

> **Summary**: 사용자가 포스팅을 하고 댓글을 달 수 있는 블로그 포스팅 서비스 MVP
>
> **Project**: blogposter
> **Version**: 0.1.0
> **Author**: sewha
> **Date**: 2026-02-20
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

사용자가 블로그 글을 작성, 수정, 삭제하고, 다른 사용자의 글에 댓글을 달 수 있는 블로그 포스팅 서비스를 구축한다. 개인 블로그가 아닌, 다수의 사용자가 참여하는 커뮤니티형 블로그 플랫폼이다.

### 1.2 Background

- 간단하면서도 완전한 CRUD 기능을 갖춘 블로그 서비스 MVP
- Supabase(PostgreSQL)를 활용하여 별도 서버 구축 없이 빠르게 개발
- Next.js App Router 기반의 모던 웹 애플리케이션

### 1.3 Related Documents

- Design: `docs/02-design/features/blogposter.design.md` (예정)
- API Spec: `docs/02-design/api-spec.md` (예정)

---

## 2. Scope

### 2.1 In Scope (MVP)

- [x] 사용자 인증 (회원가입 / 로그인 / 로그아웃)
- [x] 글 작성 (제목, 본문, 태그)
- [x] 글 목록 조회 (페이지네이션)
- [x] 글 상세 보기
- [x] 글 수정 / 삭제 (작성자만)
- [x] 댓글 작성 / 삭제
- [x] 내 글 관리 (마이페이지)

### 2.2 Out of Scope (추후)

- 좋아요 / 북마크
- 이미지 업로드
- 검색 기능
- 소셜 로그인 (Google, GitHub)
- 카테고리 분류
- RSS 피드
- 관리자 페이지

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 이메일/비밀번호로 회원가입할 수 있다 | High | Pending |
| FR-02 | 이메일/비밀번호로 로그인할 수 있다 | High | Pending |
| FR-03 | 로그인 상태를 유지하고 로그아웃할 수 있다 | High | Pending |
| FR-04 | 로그인한 사용자는 글을 작성할 수 있다 (제목, 본문, 태그) | High | Pending |
| FR-05 | 모든 사용자는 글 목록을 조회할 수 있다 (페이지네이션) | High | Pending |
| FR-06 | 모든 사용자는 글 상세 페이지를 볼 수 있다 | High | Pending |
| FR-07 | 글 작성자는 자신의 글을 수정할 수 있다 | Medium | Pending |
| FR-08 | 글 작성자는 자신의 글을 삭제할 수 있다 | Medium | Pending |
| FR-09 | 로그인한 사용자는 글에 댓글을 달 수 있다 | High | Pending |
| FR-10 | 댓글 작성자는 자신의 댓글을 삭제할 수 있다 | Medium | Pending |
| FR-11 | 로그인한 사용자는 자신의 글 목록을 볼 수 있다 (마이페이지) | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 페이지 로딩 < 2초 | Lighthouse |
| Security | 인증된 사용자만 글/댓글 작성 가능 | 수동 테스트 |
| Responsive | 모바일/태블릿/데스크톱 지원 | 브라우저 테스트 |
| UX | 직관적인 UI, 로딩 상태 표시 | 사용성 검토 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 모든 Functional Requirements (FR-01 ~ FR-11) 구현 완료
- [ ] 반응형 디자인 적용
- [ ] 에러 처리 및 로딩 상태 표시
- [ ] 빌드 성공 (`npm run build`)

### 4.2 Quality Criteria

- [ ] Lint 에러 없음 (`npm run lint`)
- [ ] 빌드 성공
- [ ] 주요 플로우 수동 테스트 통과

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Supabase API 응답 지연 | Medium | Low | 로딩 UI, 에러 바운더리 적용 |
| 인증 토큰 만료 처리 | Low | Low | Supabase SDK가 자동 갱신 |
| 대량 데이터 시 목록 성능 | Medium | Low | 페이지네이션, 적절한 limit 설정 |
| XSS 공격 (댓글/글 본문) | High | Medium | 입력값 sanitize, React 기본 이스케이프 활용 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites, portfolios | ☐ |
| **Dynamic** | Feature-based modules, BaaS integration | Web apps with backend, SaaS MVPs | ☑ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems | ☐ |

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | Next.js 16 | App Router, SSR 지원, 기존 프로젝트 |
| State Management | Context / Zustand / Redux | Zustand | 경량, 간단한 API |
| API Client | fetch / axios / Supabase JS | @supabase/supabase-js | 타입 안전, 자동 RLS |
| Styling | Tailwind / CSS Modules | Tailwind CSS v4 | 기존 프로젝트 설정 |
| Backend | Supabase / Firebase / Custom | Supabase | PostgreSQL, Auth, RLS 내장 |

### 6.3 Clean Architecture Approach

```
Selected Level: Dynamic

Folder Structure:
src/
├── app/
│   ├── (auth)/login/           # 로그인
│   ├── (auth)/register/        # 회원가입
│   ├── (main)/dashboard/       # 내 글 관리
│   ├── (main)/settings/        # 설정
│   ├── posts/                  # 글 목록
│   ├── posts/[id]/             # 글 상세
│   ├── posts/new/              # 글 작성
│   └── posts/[id]/edit/        # 글 수정
├── components/
│   ├── ui/                     # Button, Input, Card...
│   └── features/               # PostCard, CommentList...
├── hooks/                      # useAuth, usePosts...
├── lib/supabase.ts             # Supabase client
├── stores/                     # auth-store.ts
└── types/                      # Post, Comment, User types
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists (Phase 2 output)
- [ ] `CONVENTIONS.md` exists at project root
- [x] ESLint configuration (`eslint.config.mjs`)
- [ ] Prettier configuration
- [x] TypeScript configuration (`tsconfig.json`)

### 7.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | Missing | 컴포넌트: PascalCase, 파일: kebab-case, 훅: camelCase | High |
| **Folder structure** | Exists | App Router route groups 규칙 | High |
| **Import order** | Missing | React > Next > 외부 > 내부 > types | Medium |
| **Error handling** | Missing | try-catch + error boundary 패턴 | Medium |

### 7.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Client | ☑ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Client | ☑ |

---

## 8. Data Model Preview

### Posts (글)

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| _id | string | auto | 고유 ID |
| userId | string | yes | 작성자 ID |
| authorName | string | yes | 작성자 이름 |
| title | string | yes | 제목 |
| content | string | yes | 본문 |
| tags | string[] | no | 태그 목록 |
| createdAt | Date | auto | 작성일 |
| updatedAt | Date | auto | 수정일 |

### Comments (댓글)

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| _id | string | auto | 고유 ID |
| postId | string | yes | 글 ID (참조) |
| userId | string | yes | 작성자 ID |
| authorName | string | yes | 작성자 이름 |
| content | string | yes | 댓글 내용 |
| createdAt | Date | auto | 작성일 |

---

## 9. Page/Route Map

| Route | Page | Auth Required | Description |
|-------|------|:------------:|-------------|
| `/` | Home | No | 최신 글 목록 |
| `/login` | Login | No | 로그인 |
| `/register` | Register | No | 회원가입 |
| `/posts` | Post List | No | 전체 글 목록 (페이지네이션) |
| `/posts/new` | New Post | Yes | 글 작성 |
| `/posts/[id]` | Post Detail | No | 글 상세 + 댓글 |
| `/posts/[id]/edit` | Edit Post | Yes (작성자) | 글 수정 |
| `/dashboard` | Dashboard | Yes | 내 글 관리 |

---

## 10. Next Steps

1. [ ] Design 문서 작성 (`/pdca design blogposter`)
2. [ ] 데이터 모델 상세 설계
3. [ ] API 엔드포인트 정의
4. [ ] UI 와이어프레임

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-02-20 | Initial draft | sewha |
