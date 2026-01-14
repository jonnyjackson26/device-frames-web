export interface FrameOptions {
  file: File;
  device_type: string;
  device_variation: string;
  background_color?: string;
}

export interface DeviceOption {
  name: string;
  variations: string[];
}

export const DEVICE_OPTIONS: DeviceOption[] = [
  {
    name: "16 Pro Max",
    variations: ["Blue Titanium", "Natural Titanium", "White Titanium", "Black Titanium"],
  },
  {
    name: "16 Pro",
    variations: ["Blue Titanium", "Natural Titanium", "White Titanium", "Black Titanium"],
  },
  {
    name: "16 Plus",
    variations: ["Black", "White", "Pink", "Teal", "Ultramarine"],
  },
  {
    name: "16",
    variations: ["Black", "White", "Pink", "Teal", "Ultramarine"],
  },
];
