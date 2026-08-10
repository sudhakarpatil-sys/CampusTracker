import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../theme/colors";

interface ProgressRingProps {
  radius?: number;
  strokeWidth?: number;
  percentage: number;
  attended: number;
  total: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  radius = 65,
  strokeWidth = 10,
  percentage,
  attended,
  total,
}) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isSafe = percentage >= 75;
  const strokeColor = isSafe ? colors.success : colors.danger;

  return (
    <View style={styles.container}>
      <Svg height={radius * 2} width={radius * 2}>
        <Circle
          stroke={colors.surfaceLight}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <Circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        <Text style={styles.subText}>{attended}/{total} Classes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  svg: {
    transform: [{ rotate: "0deg" }],
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  subText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
