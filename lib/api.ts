import { FrameOptions, DeviceListResponse } from "./types";

export async function listDevices(): Promise<DeviceListResponse> {
  // Use local API route to avoid CORS issues
  const response = await fetch("/api/list-devices");
  
  if (!response.ok) {
    throw new Error("Failed to fetch device list");
  }
  
  return await response.json();
}

export async function applyDeviceFrame(
  options: FrameOptions
): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", options.file);
  formData.append("device_type", options.device_type);
  formData.append("device_variation", options.device_variation);
  
  if (options.background_color) {
    formData.append("background_color", options.background_color);
  }

  // Use local API route to avoid CORS issues
  const response = await fetch("/api/apply-frame", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const error = await response.json();
      throw new Error(error.error || "Failed to apply device frame");
    }
    throw new Error("Failed to apply device frame");
  }

  return await response.blob();
}
