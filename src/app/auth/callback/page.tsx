"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let redirected = false;

    function redirect(path: string) {
      if (redirected) return;
      redirected = true;
      router.replace(path);
    }

    // Supabase가 code를 자동 처리했는지 즉시 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        redirect("/");
        return;
      }

      // 자동 처리 중이면 onAuthStateChange 이벤트 대기
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN" && session) {
            subscription.unsubscribe();
            redirect("/");
          }
        }
      );

      // PKCE code가 있으면 수동 교환 시도 (자동 처리 안 됐을 경우 fallback)
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
          if (error) {
            // 교환 실패해도 session이 이미 있을 수 있음 (이중 처리 경우)
            supabase.auth.getSession().then(({ data: { session: s } }) => {
              if (s) {
                subscription.unsubscribe();
                redirect("/");
              } else {
                subscription.unsubscribe();
                redirect("/login?error=oauth_error");
              }
            });
          }
        });
      } else {
        // code 없이 hash token 방식인 경우 잠시 대기
        const timer = setTimeout(() => {
          subscription.unsubscribe();
          supabase.auth.getSession().then(({ data: { session: s } }) => {
            redirect(s ? "/" : "/login?error=oauth_error");
          });
        }, 3000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timer);
        };
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-fg-muted">로그인 처리 중...</p>
    </div>
  );
}
