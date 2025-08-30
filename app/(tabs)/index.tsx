import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CameraModal from "@/components/CameraModal";
import MediaActions from "@/components/MediaActions";
import MediaCarousel from "@/components/MediaCarousel";
import RedactionOptions from "@/components/RedactionOptions";
import { MediaItem } from "@/types/media";

export default function HomeScreen() {
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome to Redactify</ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">
            Step 1: Upload images to redact
          </ThemedText>
          <MediaActions
            onOpenCamera={() => setCameraOpen(true)}
            onPicked={setSelectedItems}
          />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 2: Preview</ThemedText>
          <ThemedText>
            Ensure that you have selected the correct media.
          </ThemedText>
          {selectedItems.length > 0 ? (
            <View style={{ marginTop: 12 }}>
              <MediaCarousel items={selectedItems} />
            </View>
          ) : (
            <View style={[styles.picker, { marginTop: 6 }]}>
              <ThemedText>No media selected. Use the buttons above.</ThemedText>
            </View>
          )}
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">
            Step 3: Select properties to redact
          </ThemedText>
          <ThemedText>
            Tick the checkboxes of the properties you want to redact from your
            media.
          </ThemedText>
          <RedactionOptions />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 4: Begin redaction</ThemedText>
          <ThemedText>
            Tap on upload to upload your media to a server to get it redacted.
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
      <CameraModal
        visible={cameraOpen}
        onRequestClose={() => setCameraOpen(false)}
        onCaptured={(items) => setSelectedItems(items)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  picker: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8884",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "#0001",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8884",
  },
  changeButton: {
    paddingTop: 8,
    alignSelf: "flex-start",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
