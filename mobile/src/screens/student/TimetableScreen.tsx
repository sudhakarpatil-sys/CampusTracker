import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Calendar, Clock, MapPin, User } from "lucide-react-native";
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
  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>("Mon");

  const currentSlots = TIMETABLE_DATA[selectedDay] || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
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

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {currentSlots.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={36} color={colors.textMuted} />
            <Text style={styles.emptyText}>No classes scheduled for {selectedDay}</Text>
          </View>
        ) : (
          currentSlots.map((slot) => (
            <View key={slot.id} style={styles.slotCard}>
              <View style={styles.slotHeader}>
                <View style={styles.timeRow}>
                  <Clock size={14} color={colors.primaryLight} />
                  <Text style={styles.slotTime}>{slot.time}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    slot.status === "ongoing"
                      ? styles.ongoingBadge
                      : slot.status === "completed"
                      ? styles.completedBadge
                      : styles.upcomingBadge,
                  ]}
                >
                  <Text style={styles.statusText}>{slot.status.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.subjectTitle}>{slot.subject}</Text>
              <Text style={styles.subjectCode}>{slot.code}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <MapPin size={13} color={colors.textMuted} />
                  <Text style={styles.metaText}>{slot.room}</Text>
                </View>
                <View style={styles.metaItem}>
                  <User size={13} color={colors.textMuted} />
                  <Text style={styles.metaText}>{slot.faculty}</Text>
                </View>
              </View>
            </View>
          ))
        )}
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
  daySelectorContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: colors.surface,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: colors.inputBg,
  },
  selectedDayButton: {
    backgroundColor: colors.primary,
  },
  dayText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  selectedDayText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
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
  slotTime: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ongoingBadge: {
    backgroundColor: "rgba(147, 51, 234, 0.2)",
  },
  completedBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  upcomingBadge: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
  },
  statusText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  subjectTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  subjectCode: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
