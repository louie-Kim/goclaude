"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { SocialLoginButtons } from "@/components/features/SocialLoginButtons";

export function RegisterForm() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(email, password, name);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold text-center">회원가입</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="이름"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
        />
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
          placeholder="비밀번호를 입력하세요 (6자 이상)"
          minLength={6}
          required
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </Button>
      </form>

      <SocialLoginButtons />

      <p className="mt-4 text-center text-sm text-fg-muted">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-accent font-medium hover:underline">
          로그인
        </Link>
      </p>
    </Card>
  );
}
