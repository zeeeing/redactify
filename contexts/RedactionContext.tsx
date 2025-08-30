import type { MediaItem } from "@/types/types";
import React, { createContext, useContext, useMemo, useState } from "react";

type RedactionState = {
  redactedMedia: MediaItem[];
  classes: number[];
  setRedacted: (payload: { media: MediaItem[]; classes: number[] }) => void;
  clear: () => void;
};

const RedactionContext = createContext<RedactionState | undefined>(undefined);

export function RedactionProvider({ children }: { children: React.ReactNode }) {
  const [redactedMedia, setMedia] = useState<MediaItem[]>([]);
  const [classes, setClasses] = useState<number[]>([]);

  const value = useMemo<RedactionState>(
    () => ({
      redactedMedia,
      classes,
      setRedacted: ({ media, classes }) => {
        setMedia(media);
        setClasses(classes);
      },
      clear: () => {
        setMedia([]);
        setClasses([]);
      },
    }),
    [redactedMedia, classes]
  );

  return (
    <RedactionContext.Provider value={value}>
      {children}
    </RedactionContext.Provider>
  );
}

export function useRedaction() {
  const ctx = useContext(RedactionContext);
  if (!ctx)
    throw new Error("useRedaction must be used within RedactionProvider");
  return ctx;
}
