"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES, type Role } from "@/lib/constants/roles";
import { ROUTES } from "@/lib/constants/routes";
import { InfoCard } from "@/components/infoCard";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { createUserService, updateUserService } from "@/lib/services/users.services";

type Mode = "create" | "edit";

export type UserFormValues = {
  full_name?: string | null;
  email?: string | null;
  role?: Role | null;
  password?: string | null;
  confirmPassword?: string | null;
};

type Props = {
  mode: Mode;
  userId?: string;
  initialValues?: UserFormValues;
};

export default function CreateNewEditUser({
  mode,
  userId,
  initialValues,
}: Props) {
  const router = useRouter();
  const isCreate = mode === "create";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleEnum = z.enum(ROLES);
  const schema = z
    .object({
      full_name: z.string().optional().nullable(),
      email: z.string().email({ message: "Invalid email" }),
      role: roleEnum.default("member"),
      password: z.string().optional().nullable(),
      confirmPassword: z.string().optional().nullable(),
    })
    .superRefine((data, ctx) => {
      // Require password + confirm in create mode
      if (isCreate) {
        if (!data.password || data.password.length < 6) {
          ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: "Password must be at least 6 characters",
          });
        }
        if (!data.confirmPassword || data.confirmPassword.length < 6) {
          ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: "Confirm password is required",
          });
        }
        if (data.password !== data.confirmPassword) {
          ctx.addIssue({
            code: "custom",
            path: ["confirmPassword"],
            message: "Passwords do not match",
          });
        }
      } else {
        // In edit mode, if password provided, enforce min length and match
        if (data.password || data.confirmPassword) {
          if (!data.password || data.password.length < 6) {
            ctx.addIssue({
              code: "custom",
              path: ["password"],
              message: "Password must be at least 6 characters",
            });
          }
          if (data.password !== data.confirmPassword) {
            ctx.addIssue({
              code: "custom",
              path: ["confirmPassword"],
              message: "Passwords do not match",
            });
          }
        }
      }
    });

  type FormValues = z.input<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: initialValues?.full_name || "",
      email: initialValues?.email || "",
      role: (initialValues?.role as Role | null) || "member",
      password: "",
      confirmPassword: "",
    } as FormValues,
  });

  useEffect(() => {
    form.reset({
      full_name: initialValues?.full_name || "",
      email: initialValues?.email || "",
      role: (initialValues?.role as Role | null) || "member",
      password: "",
      confirmPassword: "",
    } as FormValues);
  }, [initialValues, isCreate, form]);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);

      try {
      if (isCreate) {
        await createUserService({
          full_name: values.full_name?.trim() || null,
          email: values.email?.trim() || "",
          role: values.role || undefined,
          password: values.password?.trim() || "",
        });
      } else {
        if (!userId) {
          throw new Error("Missing user id");
        }
        await updateUserService(userId, {
          full_name: values.full_name?.trim() || null,
          email: values.email?.trim() || "",
          role: values.role || undefined,
        });
        }

        router.push(ROUTES.MANAGER.USERS);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-muted/50 dark:bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <InfoCard
          title={mode === "create" ? "Create user" : "Edit user"}
          description="Upload avatar (optional), set role, and credentials."
          className="border-border/60 shadow-sm"
        />

        <Card className="border-border/60 shadow-sm">
          <CardContent>
            <form id="user-form" onSubmit={form.handleSubmit(handleSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="full_name">Full name</FieldLabel>
                  <Input
                    id="full_name"
                    {...form.register("full_name")}
                    placeholder="Enter full name"
                  />
                </Field>

                <Field data-invalid={!!form.formState.errors.email}>
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    aria-invalid={!!form.formState.errors.email}
                    {...form.register("email")}
                    placeholder="Enter email"
                  />
                  {form.formState.errors.email && (
                    <FieldError errors={[form.formState.errors.email]} />
                  )}
                </Field>

                {isCreate && (
                  <>
                    <Field data-invalid={!!form.formState.errors.password}>
                      <FieldLabel htmlFor="password">Password *</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        aria-invalid={!!form.formState.errors.password}
                        {...form.register("password")}
                        placeholder="Enter password"
                      />
                      {form.formState.errors.password && (
                        <FieldError errors={[form.formState.errors.password]} />
                      )}
                    </Field>

                    <Field
                      data-invalid={!!form.formState.errors.confirmPassword}
                    >
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm password *
                      </FieldLabel>
                      <Input
                        id="confirmPassword"
                        type="password"
                        aria-invalid={!!form.formState.errors.confirmPassword}
                        {...form.register("confirmPassword")}
                        placeholder="Re-enter password"
                      />
                      {form.formState.errors.confirmPassword && (
                        <FieldError
                          errors={[form.formState.errors.confirmPassword]}
                        />
                      )}
                    </Field>
                  </>
                )}

                <Controller
                  name="role"
                  control={form.control}
                  render={({ field }) => (
                    <Field data-invalid={!!form.formState.errors.role}>
                      <FieldLabel>Role</FieldLabel>
                      <Select
                        value={field.value || "member"}
                        onValueChange={(val) => field.onChange(val as Role)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Default role is member.
                      </FieldDescription>
                      {form.formState.errors.role && (
                        <FieldError errors={[form.formState.errors.role]} />
                      )}
                    </Field>
                  )}
                />

                {/* Avatar upload commented out */}
                {/* <Field>
                  <FieldLabel>Avatar</FieldLabel>
                  <p className="text-xs text-muted-foreground">Upload avatar (disabled for now).</p>
                </Field> */}
              </FieldGroup>

              {error && (
                <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(ROUTES.MANAGER.USERS)}
            >
              Back to users
            </Button>
            <Button type="submit" form="user-form" disabled={loading}>
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Save changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
