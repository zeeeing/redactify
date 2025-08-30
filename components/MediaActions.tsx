import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import MediaPicker from "@/components/MediaPicker";
import { MediaItem } from "@/types/media";

type Props = {
  onPicked: (items: MediaItem[]) => void;
  onOpenCamera: () => void;
  selectionLimit?: number;
};

export default function MediaActions({ onPicked, onOpenCamera, selectionLimit }: Props) {
  return (
    <View style={styles.row}>
      {Platform.OS !== "web" && (
        <Pressable
          onPress={onOpenCamera}
          style={[styles.actionButton]}
        >
          <ThemedText type="link">Open Camera</ThemedText>
        </Pressable>
      )}
      <MediaPicker
        onPicked={onPicked}
        buttonStyle={styles.actionButton}
        selectionLimit={selectionLimit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginTop: 6 },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8884",
  },
});
