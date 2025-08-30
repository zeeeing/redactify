import CameraControls from "@/components/CameraControls";
import { Ionicons } from "@expo/vector-icons";
import { MediaItem } from "@/types/media";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  onCaptured: (items: MediaItem[]) => void;
};

export default function CameraModal({
  visible,
  onRequestClose,
  onCaptured,
}: Props) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const cameraRef = useRef<CameraView>(null);
  const [mode, setMode] = useState<"picture" | "video">("picture");
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [isRecording, setIsRecording] = useState(false);

  const ensurePermissions = useCallback(
    async (needsMic: boolean) => {
      if ((Platform as any).OS === "web") return true;

      // camera permission
      if (!cameraPermission?.granted) {
        const res = await requestCameraPermission();
        if (!res.granted) {
          Alert.alert(
            "Camera permission required",
            "Enable camera access to capture photos or videos."
          );
          return false;
        }
      }

      // mic permission (only when recording video)
      if (needsMic && !micPermission?.granted) {
        const res = await requestMicPermission();
        if (!res.granted) {
          Alert.alert(
            "Microphone permission required",
            "Enable microphone to record video audio."
          );
          return false;
        }
      }

      return true;
    },
    [
      cameraPermission?.granted,
      micPermission?.granted,
      requestCameraPermission,
      requestMicPermission,
    ]
  );

  useEffect(() => {
    if (!visible) return;
    // ensure at least camera permission when opening
    ensurePermissions(false);
  }, [visible, ensurePermissions]);

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (photo?.uri) {
        onCaptured([{ uri: photo.uri, type: "image" }]);
        onRequestClose();
      }
    } catch (e) {
      console.warn("takePictureAsync failed", e);
    }
  }, [onCaptured, onRequestClose]);

  const toggleRecording = useCallback(async () => {
    if (!cameraRef.current) return;
    if (isRecording) {
      cameraRef.current.stopRecording();
      return;
    }
    try {
      setIsRecording(true);
      const result = await cameraRef.current.recordAsync();
      if (result?.uri) {
        onCaptured([{ uri: result.uri, type: "video" }]);
      }
    } catch (e) {
      console.warn("recordAsync failed", e);
    } finally {
      setIsRecording(false);
      onRequestClose();
    }
  }, [isRecording, onCaptured, onRequestClose]);

  if (Platform.OS === "web") {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          mode={mode}
          onMountError={({ message }) =>
            Alert.alert("Camera error", message ?? "Failed to start camera.")
          }
        />
        <View style={styles.cameraTopBar}>
          <Pressable onPress={onRequestClose} style={styles.camTopBtn}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.cameraBottomBar}>
          <CameraControls
            mode={mode}
            isRecording={isRecording}
            onToggleMode={async () => {
              if (mode === "picture") {
                const ok = await ensurePermissions(true);
                if (!ok) return;
                setMode("video");
              } else {
                setMode("picture");
              }
            }}
            onCapture={async () => {
              if (mode === "picture") {
                const ok = await ensurePermissions(false);
                if (!ok) return;
                await takePhoto();
              } else {
                const ok = await ensurePermissions(true);
                if (!ok) return;
                await toggleRecording();
              }
            }}
            onFlip={() => setFacing((p) => (p === "back" ? "front" : "back"))}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  cameraTopBar: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  camTopBtn: { padding: 8, backgroundColor: "#0006", borderRadius: 8 },
  cameraBottomBar: {
    position: "absolute",
    bottom: 36,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
