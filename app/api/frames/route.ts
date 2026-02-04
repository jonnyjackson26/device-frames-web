import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'https://device-frames.fly.dev';

interface FrameTemplate {
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

interface DeviceVariation {
  frame_png: string;
  frame_png_path: string;
  template: FrameTemplate;
  frame_size: {
    width: number;
    height: number;
  };
}

interface DeviceType {
  [variation: string]: DeviceVariation;
}

interface DeviceCategory {
  [deviceType: string]: DeviceType;
}

interface DeviceListResponse {
  [category: string]: DeviceCategory;
}

interface DeviceFrame {
  category: string;
  device: string;
  variant: string;
  framePath: string;
  maskPath: string;
  thumbnail: string;
  template: FrameTemplate;
}

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/list_devices`);
    if (!response.ok) {
      throw new Error('Failed to fetch device list');
    }

    const data: DeviceListResponse = await response.json();
    const frames: DeviceFrame[] = [];

    // Transform nested structure to flat array
    Object.entries(data).forEach(([category, devices]) => {
      Object.entries(devices).forEach(([deviceName, variants]) => {
        Object.entries(variants).forEach(([variantName, variantData]) => {
          const basePath = variantData.frame_png.replace('/frame.png', '');
          
          frames.push({
            category: category.replace(/-/g, ' '),
            device: deviceName,
            variant: variantName,
            framePath: `/api/proxy-image?path=${encodeURIComponent(variantData.frame_png)}`,
            maskPath: `/api/proxy-image?path=${encodeURIComponent(basePath + '/mask.png')}`,
            thumbnail: `${API_BASE_URL}${variantData.frame_png}`,
            template: variantData.template,
          });
        });
      });
    });

    return NextResponse.json({ frames });
  } catch (error) {
    console.error('Error fetching frames:', error);
    return NextResponse.json(
      { error: 'Failed to fetch frames' },
      { status: 500 }
    );
  }
}
