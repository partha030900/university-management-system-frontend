"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuthStore } from "@/store/auth-store";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";

const demoUsers = {
  student: {
    email: "student@example.com",
    password: "password123",
  },
  instructor: {
    email: "instructor@example.com",
    password: "password123",
  },
  admin: {
    email: "admin@example.com",
    password: "password123",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const redirectByRole = (role: string) => {
    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "INSTRUCTOR") {
      router.push("/instructor");
    } else {
      router.push("/dashboard");
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);

      const user = await login(values.email, values.password);

      toast.success("Login successful");

      redirectByRole(user.role);
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to login";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);

      const user = await login(email, password);

      toast.success("Demo login successful");

      redirectByRole(user.role);
    } catch (error) {
      console.error("Demo login error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to login";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>University Management System</CardTitle>

          <CardDescription>
            Sign in to access your university dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() =>
                  handleDemoLogin(
                    demoUsers.student.email,
                    demoUsers.student.password
                  )
                }
              >
                Student Demo
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() =>
                  handleDemoLogin(
                    demoUsers.instructor.email,
                    demoUsers.instructor.password
                  )
                }
              >
                Instructor Demo
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() =>
                  handleDemoLogin(
                    demoUsers.admin.email,
                    demoUsers.admin.password
                  )
                }
              >
                Admin Demo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}