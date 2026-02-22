"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { SocialLoginButtons } from "@/components/features/SocialLoginButtons";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-center">로그인</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <SocialLoginButtons />

      <p className="mt-4 text-center text-sm text-gray-500">
        계정이 없으신가요?{" "}
        <Link href="/register" className="text-black font-medium hover:underline">
          회원가입
        </Link>
      </p>
    </Card>
  );
}
