import React from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { ShieldCheck, AlertTriangle, CheckCircle, Clock } from "lucide-react-native";
import { colors } from "../../theme/colors";

interface SubjectAttendance {
  id: string;
  name: string;
  code: string;
  attended: number;
  total: number;
  percentage: number;
}

const SUBJECT_ATTENDANCE: SubjectAttendance[] = [
  { id: "sub-1", name: "Data Structures & Algorithms", code: "CS301", attended: 26, total: 30, percentage: 86.6 },
  { id: "sub-2", name: "Database Systems", code: "CS302", attended: 22, total: 28, percentage: 78.5 },
  { id: "sub-3", name: "Operating Systems", code: "CS303", attended: 24, total: 26, percentage: 92.3 },
  { id: "sub-4", name: "Computer Networks", code: "CS304", attended: 18, total: 25, percentage: 72.0 },
];

export const AttendanceScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Official Attendance</Text>
        <Text style={styles.headerSubtitle}>Synchronized from College ERP System</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Overall Standing Banner */}
        <View style={styles.summaryBanner}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.summaryLabel}>Overall Attendance</Text>
              <Text style={styles.summaryPercentage}>84.2%</Text>
            </View>
            <View style={styles.safeBadge}>
              <ShieldCheck size={16} color={colors.success} />
              <Text style={styles.safeBadgeText}>PASSING STANDING</Text>
            </View>
          </View>

          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: "84.2%" }]} />
          </View>

          <Text style={styles.summaryFooterText}>
            Required: <Text style={{ color: "#FFF", fontWeight: "bold" }}>75.0%</Text> • Total Conducted: <Text style={{ color: "#FFF" }}>109 Classes</Text>
          </Text>
        </View>

        {/* Subject-Wise Breakdown List */}
        <Text style={styles.sectionTitle}>Subject Breakdown</Text>

        {SUBJECT_ATTENDANCE.map((sub) => {
          const isPassing = sub.percentage >= 75;
          return (
            <View key={sub.id} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <View>
                  <Text style={styles.subjectName}>{sub.name}</Text>
                  <Text style={styles.subjectCode}>{sub.code}</Text>
                </View>
                <Text style={[styles.subjectPercentage, { color: isPassing ? colors.success : colors.danger }]}>
                  {sub.percentage}%
                </Text>
              </View>

              <View style={styles.subjectStatsRow}>
                <Text style={styles.statsText}>
                  Attended: <Text style={styles.boldText}>{sub.attended}</Text> / {sub.total} Classes
                </Text>
                <View style={styles.statusIndicator}>
                  {isPassing ? (
                    <CheckCircle size={14} color={colors.success} />
                  ) : (
                    <AlertTriangle size={14} color={colors.danger} />
                  )}
                  <Text style={[styles.statusLabel, { color: isPassing ? colors.success : colors.danger }]}>
                    {isPassing ? "Safe" : "Low Attendance"}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 14,
  },
  summaryBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  summaryPercentage: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 2,
  },
  safeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  safeBadgeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "bold",
  },
  barBackground: {
    height: 8,
    backgroundColor: colors.inputBg,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  summaryFooterText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
  },
  subjectCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  subjectName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  subjectCode: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  subjectPercentage: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subjectStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statsText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  boldText: {
    color: colors.text,
    fontWeight: "bold",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});
