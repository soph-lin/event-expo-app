import { useTheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ParallaxScrollView
        headerBackgroundColor={{
          light: colors.background,
          dark: colors.background,
        }}
        headerImage={
          <IconSymbol
            size={310}
            color={colors.text}
            name="calendar.badge.clock"
            style={styles.headerIcon}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome!</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">About the Event</ThemedText>
          <ThemedText>
            Join us for an exciting day of innovation, learning, and networking
            at Event Expo 2024. Connect with industry leaders, discover new
            technologies, and be part of an inspiring community.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">What to Expect</ThemedText>
          <ThemedText>
            • Keynote speeches from industry experts{"\n"}• Interactive
            workshops and panel discussions{"\n"}• Networking opportunities with
            professionals{"\n"}• Latest technology demonstrations{"\n"}•
            Exclusive insights into future trends
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Get Started</ThemedText>
          <ThemedText>
            Browse through the schedule to plan your day, explore our lineup of
            speakers, and save your favorite sessions to your personalized
            schedule.
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  headerIcon: {
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
