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


interface RegisterCredentials {
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export async function registerUser(
  credentials: RegisterCredentials
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
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

export async function googleLoginUser(
  idToken: string
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}
