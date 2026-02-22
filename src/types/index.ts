export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  sort_order: number;
}

export interface Post {
  id: string;
  user_id: string;
  author_name: string;
  title: string;
  content: string;
  tags: string[];
  category_id: string | null;
  category?: Category;
  like_count: number;
  image_url: string | null;
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

export interface Like {
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  tags: string[];
  category_id?: string | null;
  image_url?: string | null;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  tags?: string[];
  category_id?: string | null;
  image_url?: string | null;
}

export interface CreateCommentInput {
  post_id: string;
  content: string;
}

export interface AdminStats {
  total_users: number;
  total_posts: number;
  total_comments: number;
  total_likes: number;
  recent_posts: number;
  recent_users: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  post_count: number;
  comment_count: number;
}
