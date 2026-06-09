"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient, ApiClientError } from "@/lib/api-client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ds/Button";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/admin" }: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await apiClient.post("/api/auth/login", values);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) setServerError(err.message);
      else setServerError("Login failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-text-secondary">
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text outline-none focus:border-accent"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs font-medium text-text-secondary"
        >
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text outline-none focus:border-accent"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      {serverError && <p className="text-xs text-red-500">{serverError}</p>}
      <Button type="submit" loading={isSubmitting} fullWidth>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
