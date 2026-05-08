import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/api-config';
import { parseTemplatePath } from '@/lib/parse-template';
import type { FrameTemplate } from '@/lib/types';

interface DeviceListEntry {
  category: string;
  device: string;
  variation: string;
  frame_size: { width: number; height: number };
  screen: { x: number; y: number; width: number; height: number };
  hex_color: string;
}

interface ListDevicesResponse {
  count: number;
  devices: DeviceListEntry[];
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

const REVALIDATE_SECONDS = 60 * 60 * 24;

async function fetchTemplate(
  entry: DeviceListEntry
): Promise<DeviceFrame | null> {
  try {
    const params = new URLSearchParams({
      device: entry.device,
      variation: entry.variation,
      category: entry.category,
    });
    const response = await fetch(
      `${API_BASE_URL}/find_template?${params.toString()}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    );
    if (!response.ok) {
      console.warn(
        `find_template ${response.status} for ${entry.category}/${entry.device}/${entry.variation}`
      );
      return null;
    }
    const raw = await response.json();
    const templatePath = parseTemplatePath(raw?.template_path);
    if (!templatePath?.frame) {
      console.warn(
        `Missing frame URL for ${entry.category}/${entry.device}/${entry.variation}`
      );
      return null;
    }
    return {
      category: entry.category.replace(/-/g, ' '),
      device: entry.device,
      variant: entry.variation,
      framePath: templatePath.frame,
      maskPath: templatePath.mask,
      thumbnail: templatePath.frame,
      template: templatePath,
    };
  } catch (err) {
    console.warn(
      `find_template threw for ${entry.category}/${entry.device}/${entry.variation}:`,
      err
    );
    return null;
  }
}

export async function GET() {
  try {
    const listResponse = await fetch(`${API_BASE_URL}/list_devices`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!listResponse.ok) {
      throw new Error('Failed to fetch device list');
    }

    const list: ListDevicesResponse = await listResponse.json();
    const settled = await Promise.all(list.devices.map(fetchTemplate));
    const frames = settled.filter((f): f is DeviceFrame => f !== null);

    return NextResponse.json(
      { frames },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    );
  } catch (error) {
    console.error('Error fetching frames:', error);
    return NextResponse.json(
      { error: 'Failed to fetch frames' },
      { status: 500 }
    );
  }
}
