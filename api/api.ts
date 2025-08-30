import type { MediaItem, ProcessRedactionParams } from "@/types/types";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";

const baseUrl =
  (process.env.EXPO_PUBLIC_API_URL as string | undefined) ??
  "http://localhost:3000/blur";

function simpleMime(kind: "image" | "video") {
  return kind === "image" ? "image/jpeg" : "video/mp4";
}

function fallbackExtFromContentType(ct: string, kind: "image" | "video") {
  if (ct.startsWith("image/")) return (ct.split("/")[1] || "jpg").split(";")[0];
  if (ct.startsWith("video/")) return (ct.split("/")[1] || "mp4").split(";")[0];
  return kind === "image" ? "jpg" : "mp4";
}

const b64chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function toBase64(bytes: Uint8Array) {
  let out = "";
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    out +=
      b64chars[(n >> 18) & 63] +
      b64chars[(n >> 12) & 63] +
      b64chars[(n >> 6) & 63] +
      b64chars[n & 63];
  }
  if (i < bytes.length) {
    const rem = bytes.length - i;
    const n = (bytes[i] << 16) | (rem === 2 ? bytes[i + 1] << 8 : 0);
    out += b64chars[(n >> 18) & 63];
    out += b64chars[(n >> 12) & 63];
    out += rem === 2 ? b64chars[(n >> 6) & 63] : "=";
    out += "=";
  }
  return out;
}

export async function processRedaction({
  classes,
  media,
}: ProcessRedactionParams): Promise<MediaItem | null> {
  const formData = new FormData();
  const name = media.type === "image" ? "upload.jpg" : "upload.mp4";
  const mime = simpleMime(media.type);

  // Backend expects a single 'file' field
  formData.append("file", { uri: media.uri, name, type: mime } as any);
  formData.append("filters", (classes ?? []).join(","));

  try {
    const started = Date.now();
    console.log("[processRedaction] POST", baseUrl, {
      mediaType: media.type,
      mediaUri: media.uri,
      filters: (classes ?? []).join(","),
      platform: Platform.OS,
    });

    const response = await fetch(baseUrl, {
      method: "POST",
      body: formData,
      // Let fetch set Content-Type boundary automatically
    });

    const duration = Date.now() - started;
    const ct = response.headers.get("content-type") || "";
    console.log("[processRedaction] Response", {
      status: response.status,
      ok: response.ok,
      durationMs: duration,
      contentType: ct,
    });

    if (!response.ok) {
      try {
        const data = await response.json();
        console.error("[processRedaction] Error body (json)", data);
      } catch {
        try {
          const text = await response.text();
          console.error("[processRedaction] Error body (text)", text?.slice(0, 500));
        } catch {}
      }
      return null;
    }

    const kind: "image" | "video" = ct.startsWith("video/")
      ? "video"
      : ct.startsWith("image/")
      ? "image"
      : media.type;

    if (Platform.OS === "web") {
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      console.log("[processRedaction] Created object URL", objectUrl);
      return { uri: objectUrl, type: kind };
    }

    // Native: save binary to a temp file as base64
    const ab = await response.arrayBuffer();
    const base64 = toBase64(new Uint8Array(ab));
    const fileExt = fallbackExtFromContentType(ct, kind);
    const dest = `${
      FileSystem.cacheDirectory
    }redacted-${Date.now()}.${fileExt}`;
    await FileSystem.writeAsStringAsync(dest, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log("[processRedaction] Saved file", { dest, kind, fileExt });
    return { uri: dest, type: kind };
  } catch (error) {
    console.error("[processRedaction] Unexpected failure", {
      error,
      endpoint: baseUrl,
      mediaType: media.type,
      platform: Platform.OS,
    });
    return null;
  }
}
