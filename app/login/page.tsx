"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import {loginSchema,registerSchema,type LoginFormValues,type RegisterFormValues} from "@/lib/validations/auth";
import { registerUser } from "@/services/auth.service";
import { getMyStudentProfile } from "@/services/student.service";


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
  const { login, googleLogin } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Registration form
  const {
    register: registerFields,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
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

  // Normal login
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);

      const user = await login(values.email, values.password);

      toast.success("Login successful");
      redirectByRole(user.role);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Student registration
  const onRegister = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);

      await registerUser({
        email: values.email,
        password: values.password,
      });

      toast.success("Student account created! Please sign in.");

      resetRegister();
      setIsRegistering(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to register"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login
  const handleDemoLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const user = await login(email, password);

      toast.success("Demo login successful");
      redirectByRole(user.role);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google login
  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("Google did not provide an ID token.");
        return;
      }

      setIsLoading(true);

      const user = await googleLogin(credentialResponse.credential);

      toast.success("Google login successful");

      if (user.role === "STUDENT") {
        const { accessToken } = useAuthStore.getState();

        try {
          await getMyStudentProfile(accessToken!);
          router.push("/dashboard");
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "Student profile not found"
          ) {
            router.push("/student-profile-setup");
          } else {
            throw error;
          }
        }
      } else {
        redirectByRole(user.role);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google login failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>University Management System</CardTitle>

          <CardDescription>
            {isRegistering
              ? "Create your student account."
              : "Sign in to access your university dashboard."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isRegistering ? (
            // Registration form
            <form
              onSubmit={handleRegisterSubmit(onRegister)}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>

                <Input
                  id="register-email"
                  type="email"
                  placeholder="student@example.com"
                  {...registerFields("email")}
                />

                {registerErrors.email && (
                  <p className="text-sm text-destructive">
                    {registerErrors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>

                <Input
                  id="register-password"
                  type="password"
                  {...registerFields("password")}
                />

                {registerErrors.password && (
                  <p className="text-sm text-destructive">
                    {registerErrors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password
                </Label>

                <Input
                  id="confirmPassword"
                  type="password"
                  {...registerFields("confirmPassword")}
                />

                {registerErrors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {registerErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline"
                  onClick={() => setIsRegistering(false)}
                >
                  Sign in
                </button>
              </p>
            </form>
          ) : (
            // Login form
            <>
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

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-primary underline"
                    onClick={() => setIsRegistering(true)}
                  >
                    Register as Student
                  </button>
                </p>

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

                <div className="mt-4 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed")}
                  />
                </div>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
