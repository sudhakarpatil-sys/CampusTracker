import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { Home, Calendar, GraduationCap, User } from "lucide-react-native";
import { colors } from "../theme/colors";
import { useUserStore } from "../store/use-user-store";
import { AuthScreen } from "../screens/auth/AuthScreen";
import { StudentHomeScreen } from "../screens/student/StudentHomeScreen";
import { AttendanceScreen } from "../screens/student/AttendanceScreen";
import { TimetableScreen } from "../screens/student/TimetableScreen";
import { FacultyHomeScreen } from "../screens/faculty/FacultyHomeScreen";
import { AdminOverviewScreen } from "../screens/admin/AdminOverviewScreen";

export const AppNavigator: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const role = useUserStore((state) => state.role);
  const [activeTab, setActiveTab] = useState<"home" | "attendance" | "schedule">("home");

  if (!user) {
    return <AuthScreen />;
  }

  if (role === "faculty") {
    return <FacultyHomeScreen />;
  }

  if (role === "admin") {
    return <AdminOverviewScreen />;
  }

  // Student Flow with Native Bottom Navigation
  return (
    <View style={styles.container}>
      <View style={styles.screenArea}>
        {activeTab === "home" && <StudentHomeScreen />}
        {activeTab === "attendance" && <AttendanceScreen />}
        {activeTab === "schedule" && <TimetableScreen />}
      </View>

      {/* Glassmorphic Native Bottom Navigation Bar */}
      <SafeAreaView style={styles.bottomNavContainer}>
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
      </SafeAreaView>
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
    backgroundColor: colors.background,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderTopWidth: 1,
    paddingVertical: 10,
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
