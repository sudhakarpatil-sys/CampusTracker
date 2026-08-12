import { create } from "zustand";
import { UserProfile, UserRole } from "../types";

interface UserState {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  setUser: (user: UserProfile | null) => void;
  setRole: (role: UserRole) => void;
  setLoading: (loading: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  role: "student",
  isLoading: true,
  hasCompletedOnboarding: false,
  setUser: (user) => set({ user, role: user?.role || "student" }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnboardingCompleted: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),
  signOut: () => set({ user: null }),
}));
