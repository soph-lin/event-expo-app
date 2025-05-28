import { useTheme } from "@/hooks/useTheme";
import { Speaker } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface SpeakerCardProps {
  speaker: Speaker;
}

export function SpeakerCard({ speaker }: SpeakerCardProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.speakerCard}>
      <LinearGradient colors={colors.gradient} style={styles.cardGradient}>
        <View style={styles.content}>
          <Image
            source={{ uri: speaker.photo }}
            style={styles.photo}
            defaultSource={require("@/assets/images/default-avatar.jpg")}
            onError={(e) =>
              console.log("Image loading error:", e.nativeEvent.error)
            }
          />
          <View style={styles.textContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[styles.name, { color: colors.cardText }]}
            >
              {speaker.name}
            </ThemedText>
            <ThemedText
              style={[styles.bio, { color: colors.cardText }]}
              numberOfLines={2}
            >
              {speaker.bio}
            </ThemedText>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  speakerCard: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
  cardGradient: {
    padding: 15,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#fff",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    opacity: 0.9,
  },
});
