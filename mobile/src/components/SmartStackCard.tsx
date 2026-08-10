import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Sparkles, ArrowRight, Bell, Calendar, BookOpen, AlertCircle } from "lucide-react-native";
import { colors } from "../theme/colors";
import { SmartStackItem } from "../types";

interface SmartStackCardProps {
  item: SmartStackItem;
  onPress?: () => void;
}

export const SmartStackCard: React.FC<SmartStackCardProps> = ({ item, onPress }) => {
  const getIcon = () => {
    switch (item.type) {
      case "class":
        return <Calendar size={18} color="#C084FC" />;
      case "announcement":
        return <Bell size={18} color="#60A5FA" />;
      case "assignment":
        return <BookOpen size={18} color="#FBBF24" />;
      default:
        return <AlertCircle size={18} color="#F87171" />;
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <Sparkles size={12} color={colors.primaryLight} />
          <Text style={styles.badgeText}>SMART STACK™</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.iconWrapper}>{getIcon()}</View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.subtitle} numberOfLines={2}>{item.subtitle}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.actionText}>{item.actionText || "View Details"}</Text>
        <ArrowRight size={14} color={colors.primaryLight} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginVertical: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(147, 51, 234, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
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
  body: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: "rgba(30, 37, 54, 0.8)",
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.08)",
  },
  actionText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: "600",
  },
});
