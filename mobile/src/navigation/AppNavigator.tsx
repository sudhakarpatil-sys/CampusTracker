import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Calendar, GraduationCap } from "lucide-react-native";
import { colors } from "../theme/colors";
import { useUserStore } from "../store/use-user-store";
import { ExpoSecureStoreAdapter } from "../services/storage";
import { supabase } from "../services/supabase";
import { SplashScreen } from "../screens/splash/SplashScreen";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";
import { AuthScreen } from "../screens/auth/AuthScreen";
import { StudentHomeScreen } from "../screens/student/StudentHomeScreen";
import { AttendanceScreen } from "../screens/student/AttendanceScreen";
import { TimetableScreen } from "../screens/student/TimetableScreen";
import { FacultyHomeScreen } from "../screens/faculty/FacultyHomeScreen";
import { AdminOverviewScreen } from "../screens/admin/AdminOverviewScreen";

export const AppNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const role = useUserStore((state) => state.role);
  const setUser = useUserStore((state) => state.setUser);
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const setOnboardingCompleted = useUserStore((state) => state.setOnboardingCompleted);

  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "attendance" | "schedule">("home");

  useEffect(() => {
    let isMounted = true;

    async function initializeApp() {
      try {
        // 1. Check onboarding completion state
        const onboardingDone = await ExpoSecureStoreAdapter.hasCompletedOnboarding();
        if (isMounted) {
          setOnboardingCompleted(onboardingDone);
        }

        // 2. Check active auth session
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user && isMounted) {
          const sessionUser = data.session.user;
          const userEmailVal: string = sessionUser.email || "user@college.edu.in";
          const userNameVal: string = sessionUser.user_metadata?.full_name || userEmailVal.split("@")[0] || "User";
          const userRoleVal = sessionUser.user_metadata?.role || "student";

          setUser({
            id: sessionUser.id,
            email: userEmailVal,
            full_name: userNameVal,
            role: userRoleVal,
            onboarding_completed: true,
          });
        }
      } catch (err) {
        // Initialization fallback
      } finally {
        if (isMounted) {
          // Brief minimum display duration for smooth branding transition
          setTimeout(() => {
            if (isMounted) setIsInitializing(false);
          }, 600);
        }
      }
    }

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [setOnboardingCompleted, setUser]);

  // STATE: Initializing Startup Splash Screen
  if (isInitializing) {
    return <SplashScreen />;
  }

  // STATE A: First-time user onboarding flow
  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={() => setOnboardingCompleted(true)} />;
  }

  // STATE B / F: Unauthenticated / Session Expired
  if (!user) {
    return <AuthScreen />;
  }

  // STATE D: Faculty Console
  if (role === "faculty") {
    return <FacultyHomeScreen />;
  }

  // STATE E: Admin Overview
  if (role === "admin") {
    return <AdminOverviewScreen />;
  }

  // STATE C: Student Flow with Native Responsive Bottom Navigation
  return (
    <View style={styles.container}>
      <View style={styles.screenArea}>
        {activeTab === "home" && <StudentHomeScreen />}
        {activeTab === "attendance" && <AttendanceScreen />}
        {activeTab === "schedule" && <TimetableScreen />}
      </View>

      {/* Glassmorphic Safe Area Bottom Navigation Bar */}
      <View style={[styles.bottomNavContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navButton, activeTab === "home" && styles.activeNavButton]}
            onPress={() => setActiveTab("home")}
          >
            <Home size={20} color={activeTab === "home" ? colors.primaryLight : colors.textMuted} />
            <Text style={[styles.navText, activeTab === "home" && styles.activeNavText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, activeTab === "attendance" && styles.activeNavButton]}
            onPress={() => setActiveTab("attendance")}
          >
            <GraduationCap size={20} color={activeTab === "attendance" ? colors.primaryLight : colors.textMuted} />
            <Text style={[styles.navText, activeTab === "attendance" && styles.activeNavText]}>Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, activeTab === "schedule" && styles.activeNavButton]}
            onPress={() => setActiveTab("schedule")}
          >
            <Calendar size={20} color={activeTab === "schedule" ? colors.primaryLight : colors.textMuted} />
            <Text style={[styles.navText, activeTab === "schedule" && styles.activeNavText]}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenArea: {
    flex: 1,
  },
  bottomNavContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderTopWidth: 1,
  },
  bottomNav: {
    flexDirection: "row",
    paddingTop: 8,
    paddingHorizontal: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  navButton: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeNavButton: {
    backgroundColor: "rgba(147, 51, 234, 0.15)",
  },
  navText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "500",
  },
  activeNavText: {
    color: colors.primaryLight,
    fontWeight: "bold",
  },
});
