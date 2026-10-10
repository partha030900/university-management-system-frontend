"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/types/auth";

type UserRole = AuthUser["role"];

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function AuthGuard({
  children,
  allowedRoles,
}: AuthGuardProps) {
  const router = useRouter();

  const { user, isAuthenticated, refresh } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated && user) {
        setCheckingAuth(false);
        return;
      }

      try {
        await refresh();
      } catch {
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    void checkAuth();
  }, [isAuthenticated, user, refresh, router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    router.replace("/dashboard");
    return null;
  }

  return children;
}
