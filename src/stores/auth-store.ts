"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    set({
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
      },
      session: data.session,
      isAuthenticated: true,
    });
  },

  signup: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    if (!data.user) throw new Error("회원가입에 실패했습니다.");
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAuthenticated: false });
  },

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const meta = session.user.user_metadata ?? {};
      set({
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: meta.name ?? meta.full_name ?? meta.user_name ?? undefined,
        },
        session,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata ?? {};
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: meta.name ?? meta.full_name ?? meta.user_name ?? undefined,
          },
          session,
          isAuthenticated: true,
        });
      } else {
        set({ user: null, session: null, isAuthenticated: false });
      }
    });
  },

  setSession: (session) => {
    if (session?.user) {
      set({
        user: {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
        },
        session,
        isAuthenticated: true,
      });
    } else {
      set({ user: null, session: null, isAuthenticated: false });
    }
  },
}));
