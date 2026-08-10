import { create } from "zustand";
import { UserProfile, UserRole } from "../types";

interface UserState {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setRole: (role: UserRole) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  role: "student",
  isLoading: true,
  setUser: (user) => set({ user, role: user?.role || "student" }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: () => set({ user: null, role: "student" }),
}));
