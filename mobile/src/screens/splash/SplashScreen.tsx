import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, StatusBar, ActivityIndicator } from "react-native";
import { GraduationCap, ShieldCheck } from "lucide-react-native";
import { colors } from "../../theme/colors";

export const SplashScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoBadge}>
          <GraduationCap size={44} color={colors.primaryLight} />
        </View>

        <Text style={styles.appName}>CampusTracker</Text>
        <Text style={styles.appTagline}>Institutional Operating System</Text>

        <View style={styles.verifiedBadge}>
          <ShieldCheck size={14} color={colors.success} />
          <Text style={styles.verifiedText}>Official ERP Connected</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primaryLight} />
        <Text style={styles.initializingText}>Initializing Secure Session...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: "rgba(147, 51, 234, 0.15)",
    borderColor: "rgba(147, 51, 234, 0.3)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.25)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
  },
  verifiedText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 48,
    alignItems: "center",
    gap: 10,
  },
  initializingText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
