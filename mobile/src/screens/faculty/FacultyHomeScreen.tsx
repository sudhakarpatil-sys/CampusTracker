import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { LogOut, BookOpen, FileText, Megaphone, Plus, Check, Clock, Users } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { useUserStore } from "../../store/use-user-store";
import { useAnnouncementsStore } from "../../store/use-announcements-store";

export const FacultyHomeScreen: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);
  const addAnnouncement = useAnnouncementsStore((state) => state.addAnnouncement);

  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishBroadcast = () => {
    if (!broadcastTitle || !broadcastContent) {
      Alert.alert("Error", "Please fill in both title and announcement message.");
      return;
    }

    addAnnouncement({
      id: `ann-${Date.now()}`,
      title: broadcastTitle,
      author: user?.full_name || "Prof. Sudhakar Patil",
      targetClass: "CSE-A • 5th Semester",
      time: "Just Now",
      content: broadcastContent,
      isUrgent: true,
      publishedAt: new Date().toISOString(),
    });

    Alert.alert("Success", "Announcement broadcasted live to Student feeds!");
    setBroadcastTitle("");
    setBroadcastContent("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SP</Text>
          </View>
          <View>
            <Text style={styles.facultyTag}>FACULTY CONSOLE</Text>
            <Text style={styles.userName}>{user?.full_name || "Prof. Sudhakar Patil"}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
          <LogOut size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>ACTIVE CLASSES</Text>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statSub}>Classes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>NOTES SHARED</Text>
            <Text style={[styles.statValue, { color: colors.secondary }]}>12</Text>
            <Text style={styles.statSub}>Files</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TASKS ACTIVE</Text>
            <Text style={[styles.statValue, { color: colors.warning }]}>3</Text>
            <Text style={styles.statSub}>Active</Text>
          </View>
        </View>

        {/* Live Broadcast Publisher Form */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconTitleRow}>
              <Megaphone size={18} color={colors.primaryLight} />
              <Text style={styles.cardTitle}>Broadcast Class Announcement</Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Announcement Title (e.g. Exam Schedule Revision)"
            placeholderTextColor={colors.textMuted}
            value={broadcastTitle}
            onChangeText={setBroadcastTitle}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write announcement details for students..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            value={broadcastContent}
            onChangeText={setBroadcastContent}
          />

          <TouchableOpacity style={styles.broadcastButton} onPress={handlePublishBroadcast}>
            <Megaphone size={16} color="#FFF" />
            <Text style={styles.broadcastButtonText}>Broadcast Live Notice</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Teaching Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Teaching Schedule</Text>

          <View style={styles.scheduleItem}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>09:00 AM</Text>
              <Text style={styles.timeSub}>10:00 AM</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.subjectName}>Data Structures (CS301)</Text>
              <Text style={styles.metaText}>Room 402 • CSE-A (64 Students)</Text>
            </View>
            <View style={styles.completedBadge}>
              <Text style={styles.badgeText}>Completed</Text>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>11:00 AM</Text>
              <Text style={styles.timeSub}>12:00 PM</Text>
            </View>
            <View style={styles.scheduleDetails}>
              <Text style={styles.subjectName}>Database Systems (CS302)</Text>
              <Text style={styles.metaText}>Room 305 • CSE-B (58 Students)</Text>
            </View>
            <View style={styles.ongoingBadge}>
              <Text style={styles.badgeText}>Ongoing</Text>
            </View>
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
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  facultyTag: {
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
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: "bold",
  },
  statValue: {
    color: colors.primaryLight,
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statSub: {
    color: colors.textSecondary,
    fontSize: 11,
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
    marginBottom: 12,
  },
  iconTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 13,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  broadcastButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  broadcastButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
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
  timeBox: {
    alignItems: "center",
  },
  timeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "bold",
  },
  timeSub: {
    color: colors.textMuted,
    fontSize: 9,
  },
  scheduleDetails: {
    flex: 1,
  },
  subjectName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "bold",
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  completedBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ongoingBadge: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
