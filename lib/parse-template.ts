import type { FrameTemplate } from "./types";

export function parseTemplatePath(value: unknown): FrameTemplate | null {
  if (!value) return null;
  if (typeof value === "object") return value as FrameTemplate;
  if (typeof value !== "string") return null;

  try {
    const normalized = value.replace(/'/g, '"');
    return JSON.parse(normalized) as FrameTemplate;
  } catch {
    return null;
  }
}
