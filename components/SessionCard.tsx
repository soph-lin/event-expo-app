import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Session } from "@/types";

interface SessionCardProps {
  session: Session;
  isFavorited: boolean;
  onFavoritePress: (sessionId: string) => void;
  swipeableRef?: React.RefObject<Swipeable>;
}

export function SessionCard({
  session,
  isFavorited,
  onFavoritePress,
  swipeableRef,
}: SessionCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const localSwipeableRef = useRef<Swipeable>(null);
  const currentSwipeableRef = swipeableRef || localSwipeableRef;

  const handleFavoritePress = () => {
    onFavoritePress(session.id);
    currentSwipeableRef.current?.close();
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
      >
        <Ionicons
          name={isFavorited ? "star" : "star-outline"}
          size={24}
          color="#FFD700"
        />
      </TouchableOpacity>
    );
  };

  const cardContent = (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => router.push(`/session/${session.id}`)}
    >
      <LinearGradient colors={colors.gradient} style={styles.cardGradient}>
        <Ionicons
          name="calendar"
          size={24}
          color={colors.cardText}
          style={styles.icon}
        />
        <View style={styles.cardContent}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.cardTitle, { color: colors.cardText }]}
          >
            {session.title}
          </ThemedText>
          <ThemedText style={[styles.cardDetails, { color: colors.cardText }]}>
            {session.time} - {session.speaker}
          </ThemedText>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.sessionContainer}>
      <Swipeable
        ref={currentSwipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}
        overshootRight={false}
        enableTrackpadTwoFingerGesture
        onSwipeableOpen={() => {
          setTimeout(() => {
            currentSwipeableRef.current?.close();
          }, 500);
        }}
      >
        {cardContent}
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  sessionContainer: {
    marginBottom: 15,
  },
  sessionCard: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardGradient: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 14,
  },
  favoriteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: "100%",
    backgroundColor: "transparent",
  },
});
