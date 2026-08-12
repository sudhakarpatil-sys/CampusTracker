import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Clock, MapPin, User } from "lucide-react-native";
import { colors } from "../../theme/colors";
import { TimetableSlot } from "../../types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

const TIMETABLE_DATA: Record<string, TimetableSlot[]> = {
  Mon: [
    { id: "1", subject: "Data Structures & Algorithms", code: "CS301", time: "09:00 AM - 10:00 AM", room: "Room 402", faculty: "Prof. Sudhakar Patil", day: "Mon", status: "completed" },
    { id: "2", subject: "Database Systems", code: "CS302", time: "11:00 AM - 12:00 PM", room: "Room 305", faculty: "Dr. Ananya Sharma", day: "Mon", status: "ongoing" },
    { id: "3", subject: "Operating Systems", code: "CS303", time: "02:00 PM - 03:30 PM", room: "Lab 2", faculty: "Prof. Rajesh Kumar", day: "Mon", status: "upcoming" },
  ],
  Tue: [
    { id: "4", subject: "Computer Networks", code: "CS304", time: "09:00 AM - 10:30 AM", room: "Room 402", faculty: "Prof. Priya Verma", day: "Tue", status: "upcoming" },
    { id: "5", subject: "Software Engineering", code: "CS305", time: "11:30 AM - 01:00 PM", room: "Room 301", faculty: "Dr. Ramesh Nair", day: "Tue", status: "upcoming" },
  ],
  Wed: [
    { id: "6", subject: "Data Structures Lab", code: "CS301L", time: "09:00 AM - 12:00 PM", room: "Lab 1", faculty: "Prof. Sudhakar Patil", day: "Wed", status: "upcoming" },
  ],
  Thu: [
    { id: "7", subject: "Database Systems Lab", code: "CS302L", time: "02:00 PM - 05:00 PM", room: "Lab 3", faculty: "Dr. Ananya Sharma", day: "Thu", status: "upcoming" },
  ],
  Fri: [
    { id: "8", subject: "Operating Systems", code: "CS303", time: "10:00 AM - 11:30 AM", room: "Room 402", faculty: "Prof. Rajesh Kumar", day: "Fri", status: "upcoming" },
  ],
};

export const TimetableScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>("Mon");

  const currentSlots = TIMETABLE_DATA[selectedDay] || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
        <Text style={styles.headerTitle}>Class Timetable</Text>
        <Text style={styles.headerSubtitle}>5th Semester • Computer Science & Engineering</Text>
      </View>

      {/* Mon-Fri Day Switcher */}
      <View style={styles.daySelectorContainer}>
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[styles.dayButton, isSelected && styles.selectedDayButton]}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {currentSlots.map((slot) => {
          const isOngoing = slot.status === "ongoing";
          const isCompleted = slot.status === "completed";

          return (
            <View key={slot.id} style={styles.slotCard}>
              <View style={styles.slotHeader}>
                <View style={styles.timeRow}>
                  <Clock size={14} color={colors.primaryLight} />
                  <Text style={styles.timeText}>{slot.time}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    isOngoing && styles.badgeOngoing,
                    isCompleted && styles.badgeCompleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isOngoing && styles.statusTextOngoing,
                      isCompleted && styles.statusTextCompleted,
                    ]}
                  >
                    {slot.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.subjectTitle} numberOfLines={1} ellipsizeMode="tail">
                {slot.subject}
              </Text>
              <Text style={styles.codeText}>{slot.code}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <MapPin size={12} color={colors.textMuted} />
                  <Text style={styles.metaText}>{slot.room}</Text>
                </View>
                <View style={styles.metaItem}>
                  <User size={12} color={colors.textMuted} />
                  <Text style={styles.metaText} numberOfLines={1} ellipsizeMode="tail">
                    {slot.faculty}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
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
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.surface,
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
  daySelectorContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.inputBg,
  },
  selectedDayButton: {
    backgroundColor: colors.primary,
  },
  dayText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  selectedDayText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
  slotCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: "bold",
  },
  statusBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeOngoing: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
  },
  badgeCompleted: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  statusText: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: "bold",
  },
  statusTextOngoing: {
    color: colors.primaryLight,
  },
  statusTextCompleted: {
    color: colors.success,
  },
  subjectTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  codeText: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
});
