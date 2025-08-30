import React from "react";
import { Platform, StyleSheet } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

export default function PickedVideo({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri);
  return (
    <VideoView
      player={player}
      style={styles.media}
      nativeControls
      contentFit="contain"
      playsInline={Platform.OS === "web"}
      allowsFullscreen
    />
  );
}

const styles = StyleSheet.create({
  media: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "#0001",
  },
});
