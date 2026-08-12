import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from "react-native";
import {
  GraduationCap,
  Calendar,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  LucideIcon,
} from "lucide-react-native";
import { colors } from "../../theme/colors";
import { ExpoSecureStoreAdapter } from "../../services/storage";
import { useUserStore } from "../../store/use-user-store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  icon: LucideIcon;
  badge: string;
  title: string;
  subtitle: string;
  accentColor: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: "slide-1",
    icon: GraduationCap,
    badge: "WELCOME",
    title: "Next-Gen Campus\nOperating System",
    subtitle: "Consolidating schedule, official attendance, and academic broadcasts in one dark-mode hub.",
    accentColor: colors.primaryLight,
  },
  {
    id: "slide-2",
    icon: Calendar,
    badge: "TIMETABLE",
    title: "Real-Time Schedule\n& Class Countdowns",
    subtitle: "Track lecture venues, faculty assignments, and live room numbers with daily timeline cards.",
    accentColor: colors.secondary,
  },
  {
    id: "slide-3",
    icon: ShieldCheck,
    badge: "OFFICIAL SYNC",
    title: "Official College Data\n& Safe Thresholds",
    subtitle: "Zero self-marking guesswork. Your attendance is synced directly from official institutional ERP data.",
    accentColor: colors.success,
  },
  {
    id: "slide-4",
    icon: Sparkles,
    badge: "AI POWERED",
    title: "Smart Insights &\nExam Extraction",
    subtitle: "Automated AI schedule parsing and intelligent course syllabus tracking.",
    accentColor: "#F59E0B",
  },
  {
    id: "slide-5",
    icon: CheckCircle2,
    badge: "READY",
    title: "All Set for Your\nAcademic Journey",
    subtitle: "Sign in with your institutional student or faculty account to access your personalized console.",
    accentColor: colors.primaryLight,
  },
];

interface OnboardingScreenProps {
  onComplete?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const setOnboardingCompleted = useUserStore((state) => state.setOnboardingCompleted);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slideIndex !== activeIndex && slideIndex >= 0 && slideIndex < SLIDES.length) {
      setActiveIndex(slideIndex);
    }
  };

  const handleFinish = async () => {
    await ExpoSecureStoreAdapter.setOnboardingCompleted(true);
    setOnboardingCompleted(true);
    if (onComplete) onComplete();
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({
        x: (activeIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent />

      {/* Header Skip Button */}
      <View style={styles.topHeader}>
        <View style={styles.brandRow}>
          <GraduationCap size={20} color={colors.primaryLight} />
          <Text style={styles.brandText}>CampusTracker</Text>
        </View>

        {activeIndex < SLIDES.length - 1 && (
          <TouchableOpacity onPress={handleFinish} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Slide Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {SLIDES.map((slide) => {
          const IconComp = slide.icon;
          return (
            <View key={slide.id} style={styles.slideContainer}>
              <View style={[styles.iconBox, { borderColor: slide.accentColor + "40" }]}>
                <IconComp size={48} color={slide.accentColor} />
              </View>

              <View style={[styles.badge, { backgroundColor: slide.accentColor + "15" }]}>
                <Text style={[styles.badgeText, { color: slide.accentColor }]}>{slide.badge}</Text>
              </View>

              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer Controls */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.paginationDots}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity activeOpacity={0.85} style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {activeIndex === SLIDES.length - 1 ? "Get Started" : "Continue"}
          </Text>
          <ChevronRight size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  carousel: {
    flex: 1,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconBox: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.surface,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primaryLight,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: colors.borderLight,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
