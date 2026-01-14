export interface FrameOptions {
  file: File;
  device_type: string;
  device_variation: string;
  background_color?: string;
  category?: string;
}

export interface FrameTemplate {
  frame: string;
  mask: string;
  screen: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  frameSize: {
    width: number;
    height: number;
  };
}

export interface DeviceVariation {
  frame_png: string;
  frame_png_path: string;
  template: FrameTemplate;
  frame_size: {
    width: number;
    height: number;
  };
}

export interface DeviceType {
  [variation: string]: DeviceVariation;
}

export interface DeviceCategory {
  [deviceType: string]: DeviceType;
}

export interface DeviceListResponse {
  [category: string]: DeviceCategory;
}

export interface DeviceOption {
  name: string;
  variations: string[];
}

export const CATEGORY_LABELS: Record<string, string> = {
  "android-phone": "Android Phones",
  "android-tablet": "Android Tablets",
  "iOS": "iPhones",
  "iPad": "iPads",
};
