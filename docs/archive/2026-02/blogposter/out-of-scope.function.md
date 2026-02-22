Plan to implement                                                                                                       
                                                                                                                         
 blogposter v2.0 - Out of Scope 7개 기능 구현 계획                                                                       
                                                                                                                         
 Context                                                                                                                 
                                                                                                                         
 blogposter MVP(94% match rate)가 완성된 상태. Plan 문서에 "Out of Scope"로 정의된 7개 기능을 전부 구현한다.             
                                                                                                                         
 - 좋아요/북마크, 이미지 업로드, 검색, 소셜 로그인, 카테고리, RSS 피드, 관리자 페이지                                    
                                                                                                                         
 구현 순서 (의존성 기반)                                                                                                 
                                                                                                                         
 ┌───────┬───────────────┬───────────────────────────────────────────────┐                                               
  Phase      기능                           이유                                                                     
 ├───────┼───────────────┼───────────────────────────────────────────────┤                                               
  1      카테고리       posts 테이블 확장, 다른 기능의 기반                                                          
 ├───────┼───────────────┼───────────────────────────────────────────────┤                                               
  2      좋아요         junction 테이블 패턴 학습, 북마크와 동일 패턴                                                
 ├───────┼───────────────┼───────────────────────────────────────────────┤                                               
  3      북마크         좋아요와 거의 동일한 패턴                                                                    
 ├───────┼───────────────┼───────────────────────────────────────────────┤                                               
  4      이미지 업로드  Supabase Storage, PostForm 수정                                                              
 ├───────┼───────────────┼───────────────────────────────────────────────┤                                               
  5      검색           pg_trgm 확장, Header에 SearchBar 추가                                                        
 ├───────┼───────────────┼───────────────────────────────────────────────┤                                               
  6      소셜 로그인    Google/GitHub OAuth, LoginForm 수정                                                          
 ├───────┼───────────────┼───────────────────────────────────────────────┤                                               
  7      관리자 페이지  모든 기능 위에 통계/관리 기능                                                                
 └───────┴───────────────┴───────────────────────────────────────────────┘                                               
                                                                                                                         
 ---                                                                                                                     
 Phase 1: 카테고리                                                                                                       
                                                                                                                         
 DB Migration (add_categories):                                                                                          
 - categories 테이블 생성 (id, name, slug, color, sort_order)                                                            
 - posts에 category_id 컬럼 추가                                                                                         
 - RLS: 누구나 읽기                                                                                                      
 - 기본 카테고리 6개 시드: 기술, 일상, 여행, 음식, 독서, 기타                                                            
                                                                                                                         
 새 파일:                                                                                                                
 - src/hooks/useCategories.ts - 카테고리 목록 훅                                                                         
 - src/components/ui/Badge.tsx - 카테고리 뱃지 UI                                                                        
 - src/components/features/CategorySelect.tsx - PostForm용 드롭다운                                                      
 - src/components/features/CategoryFilter.tsx - 목록 필터 바                                                             
                                                                                                                         
 수정 파일:                                                                                                              
 - src/types/index.ts - Category 인터페이스 추가, Post에 category_id 추가                                                
 - src/types/database.ts - categories 테이블 타입 추가                                                                   
 - src/hooks/usePosts.ts - categoryId 필터 파라미터 추가, category join                                                  
 - src/components/features/PostForm.tsx - CategorySelect 추가                                                            
 - src/components/features/PostCard.tsx - 카테고리 뱃지 표시                                                             
 - src/components/features/PostDetail.tsx - 카테고리 뱃지 표시                                                           
 - src/app/page.tsx, src/app/posts/page.tsx - CategoryFilter 추가                                                        
                                                                                                                         
 Phase 2: 좋아요                                                                                                         
                                                                                                                         
 DB Migration (add_likes):                                                                                               
 - likes 테이블 (post_id, user_id, UNIQUE 제약)                                                                          
 - posts에 like_count 컬럼 추가 (비정규화 카운터)                                                                        
 - 트리거 함수로 like_count 자동 증감                                                                                    
 - RLS: 누구나 조회, 본인만 추가/삭제                                                                                    
                                                                                                                         
 새 파일:                                                                                                                
 - src/hooks/useLikes.ts - useLike(postId) 훅 + toggleLike 함수                                                          
 - src/components/features/LikeButton.tsx - 하트 아이콘 토글 버튼                                                        
                                                                                                                         
 수정 파일:                                                                                                              
 - src/types/index.ts - Post에 like_count 추가                                                                           
 - src/types/database.ts - likes 테이블 타입                                                                             
 - src/components/features/PostCard.tsx - LikeButton 추가 (e.stopPropagation 필요)                                       
 - src/components/features/PostDetail.tsx - LikeButton 추가                                                              
                                                                                                                         
 Phase 3: 북마크                                                                                                         
                                                                                                                         
 DB Migration (add_bookmarks):                                                                                           
 - bookmarks 테이블 (post_id, user_id, UNIQUE 제약)                                                                      
 - RLS: 본인 것만 조회/추가/삭제 (좋아요와 다르게 비공개)                                                                
                                                                                                                         
 새 파일:                                                                                                                
 - src/hooks/useBookmarks.ts - useBookmark(postId), useMyBookmarks(userId, page)                                         
 - src/components/features/BookmarkButton.tsx - 북마크 아이콘 토글                                                       
 - src/app/(main)/bookmarks/page.tsx - 북마크 목록 페이지                                                                
                                                                                                                         
 수정 파일:                                                                                                              
 - src/types/index.ts, src/types/database.ts - Bookmark 타입                                                             
 - src/components/features/PostCard.tsx - BookmarkButton 추가                                                            
 - src/components/features/PostDetail.tsx - BookmarkButton 추가                                                          
 - src/components/ui/Header.tsx - "북마크" 네비 링크                                                                     
                                                                                                                         
 Phase 4: 이미지 업로드                                                                                                  
                                                                                                                         
 Supabase 설정:                                                                                                          
 - post-images 스토리지 버킷 생성 (public, 5MB 제한)                                                                     
 - 스토리지 RLS 정책 (본인 폴더만 업로드/삭제)                                                                           
                                                                                                                         
 DB Migration (add_post_image):                                                                                          
 - posts에 image_url 컬럼 추가                                                                                           
                                                                                                                         
 새 파일:                                                                                                                
 - src/lib/storage.ts - uploadPostImage, deletePostImage 유틸                                                            
 - src/components/features/ImageUpload.tsx - 드래그앤드롭 이미지 업로드                                                  
                                                                                                                         
 수정 파일:                                                                                                              
 - next.config.ts - Supabase 이미지 도메인 추가                                                                          
 - src/types/index.ts, src/types/database.ts - image_url 추가                                                            
 - src/components/features/PostForm.tsx - ImageUpload 컴포넌트 추가                                                      
 - src/components/features/PostCard.tsx - 썸네일 이미지 표시                                                             
 - src/components/features/PostDetail.tsx - 전체 이미지 표시                                                             
                                                                                                                         
 Phase 5: 검색                                                                                                           
                                                                                                                         
 DB Migration (add_search):                                                                                              
 - pg_trgm, unaccent 확장 활성화                                                                                         
 - posts에 search_vector tsvector 생성 컬럼                                                                              
 - GIN 인덱스 (search_vector + trigram)                                                                                  
 - search_posts() RPC 함수 (trigram similarity + tsvector 혼합)                                                          
                                                                                                                         
 새 파일:                                                                                                                
 - src/hooks/useSearch.ts - 디바운스된 검색 훅                                                                           
 - src/components/features/SearchBar.tsx - 헤더용 검색 입력                                                              
 - src/app/search/page.tsx - 검색 결과 페이지                                                                            
                                                                                                                         
 수정 파일:                                                                                                              
 - src/types/database.ts - search_posts 함수 타입                                                                        
 - src/components/ui/Header.tsx - SearchBar 추가                                                                         
                                                                                                                         
 Phase 6: 소셜 로그인                                                                                                    
                                                                                                                         
 Supabase 설정 (대시보드에서 수동):                                                                                      
 - Google OAuth provider 활성화                                                                                          
 - GitHub OAuth provider 활성화                                                                                          
 - Redirect URL: http://localhost:3000/auth/callback                                                                     
                                                                                                                         
 새 파일:                                                                                                                
 - src/app/auth/callback/route.ts - OAuth 콜백 라우트 핸들러                                                             
 - src/components/features/SocialLoginButtons.tsx - Google/GitHub 버튼                                                   
                                                                                                                         
 수정 파일:                                                                                                              
 - src/components/features/LoginForm.tsx - SocialLoginButtons 추가                                                       
 - src/components/features/RegisterForm.tsx - SocialLoginButtons 추가                                                    
 - src/stores/auth-store.ts - OAuth 메타데이터 name 추출 보완                                                            
                                                                                                                         
 Phase 7: 관리자 페이지                                                                                                  
                                                                                                                         
 DB Migration (add_admin_role):                                                                                          
 - admin_users 테이블 (user_id UNIQUE)                                                                                   
 - is_admin() 함수 (SECURITY DEFINER)                                                                                    
 - get_admin_stats(), get_users_list() RPC 함수                                                                          
 - 관리자용 추가 RLS 정책 (글/댓글 삭제 권한)                                                                            
                                                                                                                         
 새 파일:                                                                                                                
 - src/hooks/useAdmin.ts - useIsAdmin, useAdminStats, useUsersList                                                       
 - src/components/features/AdminGuard.tsx - 관리자 접근 가드                                                             
 - src/components/features/AdminStats.tsx - 통계 대시보드                                                                
 - src/components/features/AdminUserList.tsx - 사용자 관리                                                               
 - src/components/features/AdminPostList.tsx - 글 관리                                                                   
 - src/app/(main)/admin/page.tsx - 관리자 페이지                                                                         
                                                                                                                         
 수정 파일:                                                                                                              
 - src/types/index.ts - AdminStats, AdminUser 타입                                                                       
 - src/types/database.ts - admin_users 테이블, RPC 함수 타입                                                             
 - src/components/ui/Header.tsx - "관리자" 링크 (admin만 표시)                                                           
                                                                                                                         
 ---                                                                                                                     
 전체 요약                                                                                                               
                                                                                                                         
 새 파일: 22개 (컴포넌트 11, 훅 5, 페이지 3, lib 1, route 1, UI 1)                                                       
 수정 파일: 14개                                                                                                         
 DB 마이그레이션: 6개                                                                                                    
 새 npm 의존성: 없음 (모두 Supabase 내장 기능 + inline SVG 아이콘)                                                       
                                                                                                                         
 검증 방법                                                                                                               
                                                                                                                         
 각 Phase 완료 후:                                                                                                       
 1. npm run build - 빌드 성공 확인                                                                                       
 2. Supabase MCP list_tables - 테이블 생성 확인                                                                          
 3. Supabase MCP get_advisors (security) - 보안 이슈 확인                                                                
 4. npm run dev - 브라우저에서 기능 테스트                                                                               
                                                                                                                         
 참고: 사용자 수동 설정 필요 항목                                                                                        
                                                                                                                         
 - Phase 6 (소셜 로그인): Supabase 대시보드에서 Google/GitHub OAuth 프로바이더 활성화 + API 키 입력                      
 - Phase 7 (관리자): 첫 번째 사용자 등록 후 admin_users에 UUID 수동 삽입     