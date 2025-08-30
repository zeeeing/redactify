import type { MediaItem } from "@/types/types";

export type UploadRedactionParams = {
  classes: number[];
  media: MediaItem[];
  endpoint?: string;
};

function guessFileName(uri: string, isImage: boolean, index: number) {
  const ext = uri.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  const safeExt = ext && ext.length <= 5 ? ext : isImage ? "jpg" : "mp4";
  return `file_${index}.${safeExt}`;
}

function guessMime(uri: string, isImage: boolean) {
  const ext = uri.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
  if (isImage) {
    if (ext === "png") return "image/png";
    if (ext === "webp") return "image/webp";
    return "image/jpeg";
  }
  if (ext === "mov") return "video/quicktime";
  if (ext === "mkv") return "video/x-matroska";
  return "video/mp4";
}

export async function uploadRedaction({
  classes,
  media,
  endpoint,
}: UploadRedactionParams) {
  // Mock: simulate latency and return the same payload
  await new Promise((r) => setTimeout(r, 500));
  return { status: "ok", mocked: true, classes, media };
  // const url = endpoint ?? "https://example.com/api/redact";
  // const form = new FormData();
  // form.append("classes", JSON.stringify(classes));

  // media.forEach((item, idx) => {
  //   const isImage = item.type === "image";
  //   const name = guessFileName(item.uri, isImage, idx);
  //   const type = guessMime(item.uri, isImage);
  //   form.append("files", { uri: item.uri, name, type } as any);
  // });

  // const res = await fetch(url, {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     // Let fetch set the multipart boundary header
  //   },
  //   body: form,
  // });

  // if (!res.ok) {
  //   const text = await res.text().catch(() => "");
  //   throw new Error(`Upload failed (${res.status}): ${text || res.statusText}`);
  // }

  // // Try json, fall back to text
  // try {
  //   return await res.json();
  // } catch {
  //   return await res.text();
  // }
}
