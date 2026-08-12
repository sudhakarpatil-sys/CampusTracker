import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut, BookOpen, FileText, Megaphone, Check, Clock, Users } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { useUserStore } from "../../store/use-user-store";
import { useAnnouncementsStore } from "../../store/use-announcements-store";

export const FacultyHomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);
  const addAnnouncement = useAnnouncementsStore((state) => state.addAnnouncement);

  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");

  const facultyName = user?.full_name?.trim() || user?.email?.split("@")[0] || "Faculty Professor";
  const initials = facultyName.substring(0, 2).toUpperCase();

  const handlePublishBroadcast = () => {
    if (!broadcastTitle || !broadcastContent) {
      Alert.alert("Error", "Please fill in both title and announcement message.");
      return;
    }

    addAnnouncement({
      id: `ann-${Date.now()}`,
      title: broadcastTitle,
      author: facultyName,
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.facultyTag}>FACULTY CONSOLE</Text>
            <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
              {facultyName}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={signOut} style={styles.logoutButton} accessibilityLabel="Log Out">
          <LogOut size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <BookOpen size={18} color={colors.primaryLight} />
            </View>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Active Classes</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <FileText size={18} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Shared Notes</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Users size={18} color={colors.success} />
            </View>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Assigned Students</Text>
          </View>
        </View>

        {/* Live Announcement Publisher Form */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Megaphone size={18} color={colors.primaryLight} />
              <Text style={styles.cardTitle}>Broadcast Class Notice</Text>
            </View>
          </View>

          <Text style={styles.inputLabel}>Notice Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Mid-Term Lab Exam Rescheduled"
            placeholderTextColor={colors.textMuted}
            value={broadcastTitle}
            onChangeText={setBroadcastTitle}
          />

          <Text style={styles.inputLabel}>Notice Details</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write notice details for students..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            value={broadcastContent}
            onChangeText={setBroadcastContent}
          />

          <TouchableOpacity style={styles.publishButton} onPress={handlePublishBroadcast}>
            <Check size={16} color="#FFF" />
            <Text style={styles.publishButtonText}>Broadcast Notice Live</Text>
          </TouchableOpacity>
        </View>

        {/* Teaching Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Teaching Schedule</Text>

          <View style={styles.scheduleRow}>
            <Clock size={14} color={colors.primaryLight} />
            <Text style={styles.scheduleTime}>09:00 AM - 10:00 AM</Text>
            <Text style={styles.scheduleClass} numberOfLines={1} ellipsizeMode="tail">
              Data Structures (CS301) • Room 402
            </Text>
          </View>

          <View style={styles.scheduleRow}>
            <Clock size={14} color={colors.primaryLight} />
            <Text style={styles.scheduleTime}>11:00 AM - 12:00 PM</Text>
            <Text style={styles.scheduleClass} numberOfLines={1} ellipsizeMode="tail">
              Data Structures Lab • Lab 1
            </Text>
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
  avatarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  userTextContainer: {
    flex: 1,
  },
  facultyTag: {
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
  statsGrid: {
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
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
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
    marginBottom: 10,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 13,
    marginBottom: 12,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  publishButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  publishButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scheduleTime: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: "bold",
  },
  scheduleClass: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
});
