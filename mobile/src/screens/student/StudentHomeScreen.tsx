import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LogOut, Bell, Calendar, ChevronRight, CheckCircle2, Clock } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { useUserStore } from "../../store/use-user-store";
import { useAnnouncementsStore } from "../../store/use-announcements-store";
import { ProgressRing } from "../../components/ProgressRing";
import { SmartStackCard } from "../../components/SmartStackCard";
import { AnnouncementModal } from "../../components/AnnouncementModal";
import { SmartStackItem, AnnouncementItem } from "../../types";

const SMART_STACK_ITEM: SmartStackItem = {
  id: "stk-1",
  type: "class",
  title: "Next Class: Data Structures (CS301)",
  subtitle: "Starts in 25 mins • Room 402 with Prof. Sudhakar Patil",
  time: "Now • 09:00 AM",
  badge: "TIMETABLE",
  badgeColor: "#C084FC",
  iconName: "Calendar",
  actionText: "View Class Room",
};

export const StudentHomeScreen: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);

  const announcements = useAnnouncementsStore((state) => state.announcements);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* App Header Bar */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : "ST"}
            </Text>
          </View>
          <View>
            <Text style={styles.greetingText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.full_name || "Student"}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <LogOut size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Smart Stack Hero Component */}
        <SmartStackCard item={SMART_STACK_ITEM} />

        {/* Attendance Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Official Attendance Summary</Text>
            <View style={styles.safeBadge}>
              <CheckCircle2 size={12} color={colors.success} />
              <Text style={styles.safeBadgeText}>Safe Status</Text>
            </View>
          </View>

          <View style={styles.attendanceRow}>
            <ProgressRing percentage={84.2} attended={32} total={38} />
            <View style={styles.attendanceDetails}>
              <Text style={styles.detailTitle}>Academic Standing</Text>
              <Text style={styles.detailText}>
                You are <Text style={{ color: colors.success, fontWeight: "bold" }}>+3 classes</Text> above the mandatory 75% threshold.
              </Text>
              <View style={styles.syncStatusRow}>
                <Clock size={11} color={colors.textMuted} />
                <Text style={styles.syncText}>ERP Sync: Today at 08:30 AM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Today's Schedule Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Class Schedule</Text>
            <Text style={styles.cardLink}>Mon, Aug 10</Text>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTimeBox}>
              <Text style={styles.timeStart}>09:00 AM</Text>
              <Text style={styles.timeEnd}>10:00 AM</Text>
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.subjectName}>Data Structures (CS301)</Text>
              <Text style={styles.roomText}>Room 402 • Prof. Sudhakar Patil</Text>
            </View>
            <View style={styles.statusBadgeOngoing}>
              <Text style={styles.statusTextOngoing}>Ongoing</Text>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.scheduleTimeBox}>
              <Text style={styles.timeStart}>11:00 AM</Text>
              <Text style={styles.timeEnd}>12:00 PM</Text>
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.subjectName}>Database Systems (CS302)</Text>
              <Text style={styles.roomText}>Room 305 • Dr. Ananya Sharma</Text>
            </View>
            <View style={styles.statusBadgeUpcoming}>
              <Text style={styles.statusTextUpcoming}>Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Official Class Announcements Feed */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Bell size={16} color={colors.primaryLight} />
              <Text style={styles.cardTitle}>Class Broadcast Feed</Text>
            </View>
          </View>

          {announcements.map((ann) => (
            <TouchableOpacity
              key={ann.id}
              activeOpacity={0.8}
              style={styles.announcementCard}
              onPress={() => setSelectedAnnouncement(ann)}
            >
              <View style={styles.annHeader}>
                <Text style={styles.annTitle} numberOfLines={1}>
                  {ann.title}
                </Text>
                <Text style={styles.annTime}>{ann.time}</Text>
              </View>
              <Text style={styles.annSnippet} numberOfLines={2}>
                {ann.content}
              </Text>
              <View style={styles.annFooter}>
                <Text style={styles.annAuthor}>{ann.author}</Text>
                <View style={styles.readMoreRow}>
                  <Text style={styles.readMoreText}>Read Full Notice</Text>
                  <ChevronRight size={12} color={colors.primaryLight} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modal Reader Drawer for Announcements */}
      <AnnouncementModal
        visible={!!selectedAnnouncement}
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
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
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  greetingText: {
    color: colors.textMuted,
    fontSize: 11,
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
    paddingTop: 12,
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
  cardLink: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: "600",
  },
  safeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safeBadgeText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "bold",
  },
  attendanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  attendanceDetails: {
    flex: 1,
  },
  detailTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  detailText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  syncStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  syncText: {
    color: colors.textMuted,
    fontSize: 10,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  scheduleTimeBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  timeStart: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  timeEnd: {
    color: colors.textMuted,
    fontSize: 10,
  },
  scheduleContent: {
    flex: 1,
  },
  subjectName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "bold",
  },
  roomText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadgeOngoing: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTextOngoing: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: "bold",
  },
  statusBadgeUpcoming: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTextUpcoming: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: "bold",
  },
  announcementCard: {
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderColor: colors.borderLight,
    borderWidth: 1,
  },
  annHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  annTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  annTime: {
    color: colors.textMuted,
    fontSize: 10,
  },
  annSnippet: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  annFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  annAuthor: {
    color: colors.textMuted,
    fontSize: 11,
  },
  readMoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  readMoreText: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: "600",
  },
});
