import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import MediaCarousel from "@/components/MediaCarousel";
import { useRedaction } from "@/contexts/RedactionContext";

export default function Results() {
  const { redactedMedia: finalMedia } = useRedaction();

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
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Redaction Results</ThemedText>
      </ThemedView>
      <ThemedView style={{ marginBottom: 12 }}>
        <ThemedText type="subtitle" style={{ marginBottom: 12 }}>
          Output
        </ThemedText>
        {finalMedia.length > 0 && <MediaCarousel items={finalMedia} />}
      </ThemedView>
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
});
