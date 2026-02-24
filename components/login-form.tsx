"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuthLogin } from "@/hooks/useAuthLogin";
import { ROUTES } from "@/lib/constants/routes";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { login, isLoading: isLoginLoading } = useAuthLogin();

  const isLoading = isLoginLoading || isSubmitting;

  // Check for error from URL params (e.g., from OAuth callback)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessage = decodeURIComponent(errorParam);
      toast.error(errorMessage);
      // Clean up URL by removing error param
      router.replace(ROUTES.AUTH.LOGIN, { scroll: false });
    }
  }, [searchParams, router]);

  const onSubmit = async (data: LoginFormValues) => {
    login({ email: data.email, password: data.password });
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      suppressHydrationWarning
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            Đăng nhập vào tài khoản của bạn
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Nhập email của bạn bên dưới để đăng nhập vào tài khoản
          </p>
        </div>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            aria-invalid={!!errors.email}
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          <PasswordInput
            id="password"
            aria-invalid={!!errors.password}
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : null}
            Đăng nhập
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
