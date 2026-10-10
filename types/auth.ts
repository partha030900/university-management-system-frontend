export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}