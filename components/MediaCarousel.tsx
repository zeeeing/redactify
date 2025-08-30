import React, { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import PickedVideo from "@/components/PickedVideo";
import { MediaItem } from "@/types/types";

type Props = {
  items: MediaItem[];
  height?: number;
  showIndicators?: boolean;
};

export default function MediaCarousel({
  items,
  height = 220,
  showIndicators = true,
}: Props) {
  const [width, setWidth] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  const viewabilityConfig = useMemo(
    () => ({ viewAreaCoveragePercentThreshold: 60 }),
    []
  );
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (
        viewableItems &&
        viewableItems.length > 0 &&
        typeof viewableItems[0].index === "number"
      ) {
        setIndex(viewableItems[0].index);
      }
    }
  ).current;

  return (
    <View onLayout={onLayout}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.uri}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            {item.type === "image" ? (
              <Image
                source={{ uri: item.uri }}
                style={[styles.media, { height }]}
                contentFit="contain"
                transition={200}
              />
            ) : (
              <View style={{ height }}>
                <PickedVideo uri={item.uri} />
              </View>
            )}
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        getItemLayout={(_, idx) => ({
          length: width,
          offset: width * idx,
          index: idx,
        })}
      />
      {showIndicators && items.length > 1 && (
        <View style={styles.dotsRow}>
          {items.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  media: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#0001",
  },
  dotsRow: {
    marginTop: 8,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9995",
  },
  dotActive: {
    backgroundColor: "#0a7ea4",
  },
});
