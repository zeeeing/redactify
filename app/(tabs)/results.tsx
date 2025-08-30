import { Pressable, StyleSheet, View, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { useState } from "react";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import MediaCarousel from "@/components/MediaCarousel";
import { useRedaction } from "@/contexts/RedactionContext";

export default function Results() {
  const { redactedMedia: finalMedia, clear } = useRedaction();
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const ensurePerm = async () => {
    console.log("Current permission:", permission);
    if (permission?.granted) return true;
    const res = await requestPermission();
    return res.granted;
  };

  const saveToLibrary = async (uri: string) => {
    const ok = await ensurePerm();
    if (!ok) throw new Error("Permission denied");

    let localUri = uri;
    if (/^https?:/.test(uri)) {
      const filename =
        uri.split("?")[0].split("#")[0].split("/").pop() ||
        `media_${Date.now()}`;
      const target = FileSystem.cacheDirectory + filename;
      const { uri: dlUri } = await FileSystem.downloadAsync(uri, target);
      localUri = dlUri;
    }
    await MediaLibrary.saveToLibraryAsync(localUri);
  };

  const downloadItem = async (idx: number) => {
    try {
      setDownloadingIndex(idx);
      await saveToLibrary(finalMedia[idx].uri);
      Alert.alert("Download complete", "Item saved to your photo library.");
    } catch (e) {
      Alert.alert("Download failed", "Unable to save this item.");
    } finally {
      setDownloadingIndex(null);
    }
  };

  const downloadAll = async () => {
    try {
      setDownloadingAll(true);
      for (let i = 0; i < finalMedia.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await saveToLibrary(finalMedia[i].uri);
      }
      Alert.alert(
        "Downloads complete",
        "All items saved to your photo library."
      );
    } catch (e) {
      Alert.alert(
        "Download failed",
        "Unable to save some items. Please try again."
      );
    } finally {
      setDownloadingAll(false);
    }
  };

  const handleClear = () => {
    if (finalMedia.length === 0) {
      clear();
      return;
    }
    Alert.alert(
      "Clear results?",
      "This will remove all processed items from this screen.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => clear() },
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView
        style={[
          styles.titleContainer,
          { alignItems: "center", justifyContent: "space-between" },
        ]}
      >
        <ThemedText type="title">Redaction Results</ThemedText>
        <Pressable
          onPress={handleClear}
          style={styles.actionButton}
        >
          <ThemedText type="link">Clear</ThemedText>
        </Pressable>
      </ThemedView>
      <ThemedView>
        <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
          Output
        </ThemedText>
        {finalMedia.length > 0 && <MediaCarousel items={finalMedia} />}
      </ThemedView>
      {finalMedia.length > 0 && (
        <ThemedView>
          <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
            Download
          </ThemedText>
          <View style={{ gap: 8 }}>
            <Pressable
              onPress={downloadAll}
              disabled={downloadingAll}
              style={[
                styles.actionButton,
                { alignSelf: "flex-start", opacity: downloadingAll ? 0.6 : 1 },
              ]}
            >
              <ThemedText type="link">
                {downloadingAll ? "Downloading..." : "Download All"}
              </ThemedText>
            </Pressable>
            {finalMedia.map((m, idx) => (
              <Pressable
                key={m.uri + idx}
                onPress={() => downloadItem(idx)}
                disabled={downloadingIndex === idx}
                style={[
                  styles.actionButton,
                  {
                    alignSelf: "flex-start",
                    opacity: downloadingIndex === idx ? 0.6 : 1,
                  },
                ]}
              >
                <ThemedText type="link">
                  {downloadingIndex === idx
                    ? "Downloading..."
                    : `Download item ${idx + 1}`}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </ThemedView>
      )}
      {finalMedia.length === 0 && (
        <ThemedText>
          Once your media has been processed, it will appear here. Depending on
          the size and number of files, this may take a few minutes.
        </ThemedText>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8884",
  },
});
