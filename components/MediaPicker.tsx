import React, { useCallback } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { MediaItem } from "@/types/types";

type Props = {
  onPicked: (items: MediaItem[]) => void;
  buttonStyle?: StyleProp<ViewStyle>;
  selectionLimit?: number;
};

export default function MediaPicker({ onPicked, buttonStyle }: Props) {
  const [permission, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const ensurePermission = useCallback(async () => {
    if (permission?.granted) return true;
    const { granted } = await requestPermission();
    if (!granted) {
      Alert.alert(
        "Permission required",
        "We need access to your photo library."
      );
    }
    return granted;
  }, [permission?.granted, requestPermission]);

  const openPicker = useCallback(async () => {
    const ok = await ensurePermission();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: 0,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) return;

    const items: MediaItem[] = result.assets.map((a) => ({
      uri: a.uri,
      type: a.type === "video" ? "video" : "image",
    }));
    onPicked(items);
  }, [ensurePermission, onPicked]);

  return (
    <View>
      <Pressable
        onPress={openPicker}
        style={[styles.actionButton, { alignSelf: "flex-start" }, buttonStyle]}
      >
        <ThemedText type="link">Pick from Library</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8884",
  },
});
