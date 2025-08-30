import { Image } from "expo-image";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import CameraModal from "@/components/CameraModal";
import { HelloWave } from "@/components/HelloWave";
import MediaActions from "@/components/MediaActions";
import MediaCarousel from "@/components/MediaCarousel";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import RedactionOptions from "@/components/RedactionOptions";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { processRedaction } from "@/api/api";
import { useRedaction } from "@/contexts/RedactionContext";
import type { MediaItem, RedactionClass } from "@/types/types";

export default function HomeScreen() {
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [redactionClasses, setRedactionClasses] = useState<RedactionClass[]>(
    []
  );
  const [uploading, setUploading] = useState(false);
  const { setRedacted } = useRedaction();
  const [processedCount, setProcessedCount] = useState(0);
  const [processingTotal, setProcessingTotal] = useState(0);

  const handleUpload = async () => {
    if (selectedItems.length === 0) {
      Alert.alert(
        "No media selected",
        "Please add at least one image or video."
      );
      return;
    }
    try {
      setUploading(true);
      setProcessedCount(0);
      setProcessingTotal(selectedItems.length);
      // per media processing
      const outputs: MediaItem[] = [];
      for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        const processed = await processRedaction({
          classes: redactionClasses,
          media: item,
        });
        outputs.push(processed ?? item);

        // Update results incrementally so the carousel can show items as they finish
        setRedacted({ media: [...outputs], classes: redactionClasses });
        setProcessedCount(i + 1);
      }
      setRedacted({ media: outputs, classes: redactionClasses });
      Alert.alert(
        "Processing complete",
        "All media have been submitted and processed."
      );
    } catch (e: any) {
      Alert.alert(
        "Processing interrupted",
        e?.message ?? "One or more items failed."
      );
    } finally {
      setUploading(false);
    }
  };

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
            Step 3: Select properties you want to omit from redaction
          </ThemedText>
          <ThemedText>
            Tick the checkboxes of the properties you do not want to redact from your
            media.
          </ThemedText>
          <RedactionOptions
            value={redactionClasses}
            onChange={setRedactionClasses}
          />
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">
            Step 4: Begin redaction process
          </ThemedText>
          <ThemedText>
            Tap the button below to begin the redaction process. This may take a
            few moments.
          </ThemedText>
          {uploading && (
            <ThemedText>
              Processed {processedCount}/{processingTotal}
            </ThemedText>
          )}
          <Pressable
            onPress={handleUpload}
            disabled={uploading}
            style={[
              styles.actionButton,
              { alignSelf: "flex-start", opacity: uploading ? 0.6 : 1 },
            ]}
          >
            <ThemedText type="link">
              {uploading ? "Uploading..." : "Begin Redaction"}
            </ThemedText>
          </Pressable>
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
