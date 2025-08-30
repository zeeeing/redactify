import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type Props = {
  mode: "picture" | "video";
  isRecording: boolean;
  onToggleMode: () => void | Promise<void>;
  onCapture: () => void | Promise<void>;
  onFlip: () => void | Promise<void>;
  allowVideo?: boolean;
};

export default function CameraControls({
  mode,
  isRecording,
  onToggleMode,
  onCapture,
  onFlip,
  allowVideo = true,
}: Props) {
  const nextModeIcon = mode === "picture" ? "videocam" : "camera";

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onToggleMode}
        disabled={isRecording || !allowVideo}
        style={[styles.smallBtn, isRecording && styles.disabled]}
      >
        <Ionicons name={nextModeIcon as any} size={22} color="#fff" />
      </Pressable>

      <Pressable
        onPress={onCapture}
        style={[styles.shutterBtn, mode === "video" && styles.shutterBtnVideo]}
      >
        {mode === "picture" ? (
          <View style={styles.shutterInner} />
        ) : isRecording ? (
          <View style={styles.recordSquare} />
        ) : (
          <View style={styles.recordInner} />
        )}
      </Pressable>

      <Pressable
        onPress={onFlip}
        disabled={isRecording}
        style={[styles.smallBtn, isRecording && styles.disabled]}
      >
        <MaterialIcons name="flip-camera-ios" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
  },
  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#0006",
  },
  disabled: {
    opacity: 0.5,
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 6,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff1",
  },
  shutterBtnVideo: {
    borderColor: "#f44",
  },
  shutterInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
  },
  recordInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#f44",
  },
  recordSquare: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f44",
  },
});
