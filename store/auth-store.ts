"use client";

import { create } from "zustand";
import { decodeAccessToken } from "@/lib/auth";
import { loginUser, refreshAccessToken, logoutUser, } from "@/services/auth.service";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<AuthUser>;
  refresh: () => Promise<void>;
  clearAuth: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const response = await loginUser({
      email,
      password,
    });

    const { accessToken } = response.data;

    const user = decodeAccessToken(accessToken);

    

    set({
      user,
      accessToken,
      isAuthenticated: true,
    });

    return user;

  },

  refresh: async () => {
    const response = await refreshAccessToken();

    const { accessToken } = response.data;

    const user = decodeAccessToken(accessToken);

    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    try {
      await logoutUser();
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),


}));