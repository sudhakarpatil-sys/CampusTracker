import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { X, Megaphone, Clock, User, CheckCircle } from "lucide-react-native";
import { colors } from "../theme/colors";
import { AnnouncementItem } from "../types";

interface AnnouncementModalProps {
  visible: boolean;
  announcement: AnnouncementItem | null;
  onClose: () => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  visible,
  announcement,
  onClose,
}) => {
  if (!announcement) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          {/* Top Handle Bar */}
          <View style={styles.handleBar} />

          {/* Drawer Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconBox}>
                <Megaphone size={18} color={colors.primaryLight} />
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.badgeText}>OFFICIAL ANNOUNCEMENT</Text>
                <Text style={styles.timeText}>{announcement.time}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            <Text style={styles.title}>{announcement.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <User size={13} color={colors.textMuted} />
                <Text style={styles.metaText}>{announcement.author}</Text>
              </View>
              <Text style={styles.dot}>•</Text>
              <View style={styles.metaItem}>
                <Clock size={13} color={colors.textMuted} />
                <Text style={styles.metaText}>{announcement.targetClass}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.content}>{announcement.content}</Text>

            <View style={styles.verifiedBox}>
              <CheckCircle size={15} color={colors.success} />
              <Text style={styles.verifiedText}>Verified Institutional Broadcast</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  drawer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "85%",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
    borderColor: colors.border,
    borderTopWidth: 1,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(147, 51, 234, 0.15)",
  },
  titleTextContainer: {
    gap: 2,
  },
  badgeText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  timeText: {
    color: colors.textMuted,
    fontSize: 11,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
  },
  body: {
    flexGrow: 0,
  },
  bodyContent: {
    paddingBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
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
  dot: {
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 16,
  },
  content: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  verifiedBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  verifiedText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "500",
  },
});
