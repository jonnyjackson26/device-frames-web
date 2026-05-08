export interface FrameOptions {
  file: File;
  device: string;
  variation: string;
  category?: string;
}

export interface DeviceScreen {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DeviceSize {
  width: number;
  height: number;
}

export interface Device {
  category: string;
  device: string;
  variation: string;
  frame_size: DeviceSize;
  screen: DeviceScreen;
  hex_color: string;
}

export interface DeviceListResponse {
  count: number;
  devices: Device[];
}

export interface FrameTemplate {
  frame: string;
  mask: string;
  screen: DeviceScreen;
  frameSize: DeviceSize;
  hexColor: string;
}

export interface FindTemplateResponse {
  template_path: FrameTemplate;
}

export const CATEGORY_LABELS: Record<string, string> = {
  "android-phone": "Android Phones",
  "android-tablet": "Android Tablets",
  "apple-iphone": "iPhones",
  "apple-ipad": "iPads",
};
