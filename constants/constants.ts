import { RedactionClass } from "@/types/types";

export const REDACTION_ITEMS: { id: RedactionClass; label: string }[] = [
  { id: 0, label: "Faces" },
  { id: 1, label: "Barcodes" },
  { id: 2, label: "Credit Card" },
  { id: 3, label: "Textual PII" },
];
