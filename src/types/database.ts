export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          user_id: string;
          author_name: string;
          title: string;
          content: string;
          tags: string[];
          category_id: string | null;
          like_count: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          author_name: string;
          title: string;
          content: string;
          tags?: string[];
          category_id?: string | null;
          like_count?: number;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          tags?: string[];
          category_id?: string | null;
          image_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          author_name: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          author_name: string;
          content: string;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          color?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      likes: {
        Row: {
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      search_posts: {
        Args: { search_query: string; result_limit?: number };
        Returns: {
          id: string;
          user_id: string;
          author_name: string;
          title: string;
          content: string;
          tags: string[];
          category_id: string | null;
          like_count: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
          rank: number;
        }[];
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      get_admin_stats: {
        Args: Record<string, never>;
        Returns: {
          total_users: number;
          total_posts: number;
          total_comments: number;
          total_likes: number;
          recent_posts: number;
          recent_users: number;
        }[];
      };
      get_users_list: {
        Args: { page_limit: number; page_offset: number };
        Returns: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
          post_count: number;
          comment_count: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
