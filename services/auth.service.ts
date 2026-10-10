import { apiFetch } from "@/services/api";
import type { LoginResponse } from "@/types/auth";

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function refreshAccessToken(): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/refresh-token", {
    method: "POST",
  });
}

export async function logoutUser(): Promise<void> {
  await apiFetch("/auth/logout", {
    method: "POST",
  });
}