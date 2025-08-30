import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { REDACTION_ITEMS } from "@/constants/constants";
import type { RedactionClass } from "@/types/types";

type Props = {
  value?: RedactionClass[];
  onChange?: (next: RedactionClass[]) => void;
  disabled?: boolean;
};

export default function RedactionOptions({ value, onChange, disabled }: Props) {
  const [internal, setInternal] = useState<RedactionClass[]>(value ?? []);
  const selected = value ?? internal;

  const toggle = (id: RedactionClass) => {
    const next = selected.includes(id)
      ? (selected.filter((x) => x !== id) as RedactionClass[])
      : ([...selected, id] as RedactionClass[]);
    if (onChange) onChange(next);
    else setInternal(next);
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {REDACTION_ITEMS.map((item) => {
          const isChecked = selected.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => !disabled && toggle(item.id)}
              style={styles.row}
            >
              <View
                style={[
                  styles.checkbox,
                  isChecked && styles.checkboxChecked,
                  disabled && styles.checkboxDisabled,
                ]}
              >
                {isChecked && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <ThemedText>{item.label}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#8884",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0000",
  },
  checkboxChecked: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
});
