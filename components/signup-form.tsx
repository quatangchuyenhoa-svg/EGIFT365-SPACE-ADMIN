"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuthSignup } from "@/hooks/useAuthSignup"
import { ROUTES } from "@/lib/constants/routes"
import { Spinner } from "@/components/ui/spinner"

const signupSchema = z
  .object({
    name: z.string().min(1, "Họ và tên đầy đủ là bắt buộc"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const { signup, isLoading: isSignupLoading } = useAuthSignup()

  const isLoading = isSignupLoading || isSubmitting

  const onSubmit = async (data: SignupFormValues) => {
    signup({ name: data.name, email: data.email, password: data.password })
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit(onSubmit)} 
      suppressHydrationWarning
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Tạo tài khoản của bạn</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Hãy điền vào biểu mẫu bên dưới để tạo tài khoản của bạn.
          </p>
        </div>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Họ và tên</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Nguyễn Văn A"
            aria-invalid={!!errors.name}
            disabled={isLoading}
            {...register("name")}
          />
          {errors.name && <FieldError errors={[errors.name]} />}
        </Field>
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
          <Input
            id="password"
            type="password"
            aria-invalid={!!errors.password}
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>
        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">Xác nhận mật khẩu</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            aria-invalid={!!errors.confirmPassword}
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <FieldError errors={[errors.confirmPassword]} />}
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : null}
            Tạo tài khoản
          </Button>
        </Field>
        <FieldDescription className="px-6 text-center">
          Bạn đã có tài khoản? <a href={ROUTES.AUTH.LOGIN}>Đăng nhập</a>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
