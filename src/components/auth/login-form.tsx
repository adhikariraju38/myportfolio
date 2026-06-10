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
        <label htmlFor="email" className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
          Email
        </label>
        <input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email ? true : undefined}
          className="ds-field px-4 py-2.5 text-sm"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-text-tertiary"
        >
          Password
        </label>
        <input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          className="ds-field px-4 py-2.5 text-sm"
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
