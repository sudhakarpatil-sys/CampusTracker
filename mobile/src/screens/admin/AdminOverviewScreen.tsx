import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { LogOut, Database, Activity, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { useUserStore } from "../../store/use-user-store";

export const AdminOverviewScreen: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <ShieldCheck size={20} color="#FFF" />
          </View>
          <View>
            <Text style={styles.adminTag}>ADMIN CONSOLE</Text>
            <Text style={styles.userName}>{user?.full_name || "Administrator"}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <LogOut size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* System Health Status */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>System & Connector Health</Text>
            <View style={styles.healthyBadge}>
              <CheckCircle2 size={12} color={colors.success} />
              <Text style={styles.healthyText}>ALL SYSTEMS HEALTHY</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>3</Text>
              <Text style={styles.metricLabel}>ACTIVE CONNECTORS</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={[styles.metricValue, { color: colors.success }]}>100%</Text>
              <Text style={styles.metricLabel}>SYNC SUCCESS RATE</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={[styles.metricValue, { color: colors.warning }]}>0</Text>
              <Text style={styles.metricLabel}>QUARANTINE ROWS</Text>
            </View>
          </View>
        </View>

        {/* Sync Connectors List */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.titleIconRow}>
              <Database size={16} color={colors.primaryLight} />
              <Text style={styles.cardTitle}>Active ERP Connectors</Text>
            </View>
          </View>

          <View style={styles.connectorItem}>
            <View style={styles.connectorDetails}>
              <Text style={styles.connectorName}>Google Sheets ERP Sync</Text>
              <Text style={styles.connectorSub}>Auto Sync: Hourly • Last: 08:30 AM</Text>
            </View>
            <View style={styles.statusBadgeGreen}>
              <Text style={styles.statusTextGreen}>Active</Text>
            </View>
          </View>

          <View style={styles.connectorItem}>
            <View style={styles.connectorDetails}>
              <Text style={styles.connectorName}>College ERP API Pipeline</Text>
              <Text style={styles.connectorSub}>Auto Sync: Daily • Last: 06:00 AM</Text>
            </View>
            <View style={styles.statusBadgeGreen}>
              <Text style={styles.statusTextGreen}>Active</Text>
            </View>
          </View>
        </View>

        {/* Security & Audit Logs */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.titleIconRow}>
              <Activity size={16} color={colors.secondary} />
              <Text style={styles.cardTitle}>Recent Security Audit Logs</Text>
            </View>
          </View>

          <View style={styles.logItem}>
            <Text style={styles.logAction}>ADMIN_CONNECTOR_SYNC</Text>
            <Text style={styles.logDetails}>Triggered manual sync on Google Sheets ERP connector.</Text>
            <Text style={styles.logTime}>10 mins ago • Result: SUCCESS</Text>
          </View>

          <View style={styles.logItem}>
            <Text style={styles.logAction}>AUTO_FACULTY_ROLE_ASSIGN</Text>
            <Text style={styles.logDetails}>Assigned role 'faculty' for user sudhakar@college.edu.in</Text>
            <Text style={styles.logTime}>1 hour ago • Result: SUCCESS</Text>
          </View>
        </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  adminTag: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  userName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
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
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  titleIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  healthyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  healthyText: {
    color: colors.success,
    fontSize: 9,
    fontWeight: "bold",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  metricValue: {
    color: colors.primaryLight,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  connectorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  connectorDetails: {
    flex: 1,
  },
  connectorName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "bold",
  },
  connectorSub: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadgeGreen: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTextGreen: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "bold",
  },
  logItem: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderColor: colors.borderLight,
    borderWidth: 1,
  },
  logAction: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: "bold",
  },
  logDetails: {
    color: colors.textSecondary,
    fontSize: 12,
    marginVertical: 4,
  },
  logTime: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
