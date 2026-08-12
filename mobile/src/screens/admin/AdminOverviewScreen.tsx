import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut, Database, Activity, ShieldCheck, CheckCircle2, RefreshCw } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { useUserStore } from "../../store/use-user-store";

export const AdminOverviewScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);

  const adminName = user?.full_name?.trim() || user?.email?.split("@")[0] || "Administrator";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <ShieldCheck size={20} color="#FFF" />
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.adminTag}>ADMIN CONSOLE</Text>
            <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
              {adminName}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={signOut} style={styles.logoutButton} accessibilityLabel="Log Out">
          <LogOut size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
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
            <View style={styles.cardTitleRow}>
              <Database size={16} color={colors.primaryLight} />
              <Text style={styles.cardTitle}>Active ERP Connectors</Text>
            </View>
          </View>

          <View style={styles.connectorItem}>
            <View style={styles.connectorInfo}>
              <Text style={styles.connectorName}>Google Sheets Master Roster Sync</Text>
              <Text style={styles.connectorMeta}>Sync Interval: Every 6 Hours • Auto Trigger Enabled</Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.connectorItem}>
            <View style={styles.connectorInfo}>
              <Text style={styles.connectorName}>Institutional ERP REST Connector</Text>
              <Text style={styles.connectorMeta}>Status: Connected • 1,240 Rows Synchronized</Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Audit Stream */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Activity size={16} color={colors.secondary} />
              <Text style={styles.cardTitle}>Security Audit Stream</Text>
            </View>
          </View>

          <View style={styles.logItem}>
            <RefreshCw size={12} color={colors.success} />
            <View style={styles.logContent}>
              <Text style={styles.logTitle}>Connector Sync Completed</Text>
              <Text style={styles.logTime}>Today at 08:30 AM • System Sync</Text>
            </View>
          </View>

          <View style={styles.logItem}>
            <ShieldCheck size={12} color={colors.primaryLight} />
            <View style={styles.logContent}>
              <Text style={styles.logTitle}>Student Session Authenticated</Text>
              <Text style={styles.logTime}>Today at 09:00 AM • Role Verified</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userTextContainer: {
    flex: 1,
  },
  adminTag: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  userName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 1,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
  },
  scrollArea: {
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
  cardTitleRow: {
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
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  connectorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  connectorInfo: {
    flex: 1,
    marginRight: 10,
  },
  connectorName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "bold",
  },
  connectorMeta: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  activeTag: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeTagText: {
    color: colors.success,
    fontSize: 9,
    fontWeight: "bold",
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  logContent: {
    flex: 1,
  },
  logTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  logTime: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
});
