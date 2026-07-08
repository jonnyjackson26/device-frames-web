import { NextResponse } from 'next/server';
import { findTemplate, listDevices } from 'device-frames';
import type { FrameTemplate } from '@/lib/types';

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

export async function GET() {
  try {
    const devices = await listDevices();

    const settled = await Promise.all(
      devices.map(async (entry): Promise<DeviceFrame | null> => {
        try {
          const template = await findTemplate(entry.device, entry.variation, {
            category: entry.category,
          });

          if (!template.frame) {
            console.warn(
              `Missing frame URL for ${entry.category}/${entry.device}/${entry.variation}`
            );
            return null;
          }

          const frameTemplate: FrameTemplate = {
            frame: template.frame,
            mask: template.mask,
            screen: template.screen,
            frameSize: template.frameSize,
            hexColor: template.hexColor ?? '',
          };

          return {
            category: entry.category.replace(/-/g, ' '),
            device: entry.device,
            variant: entry.variation,
            framePath: frameTemplate.frame,
            maskPath: frameTemplate.mask,
            thumbnail: frameTemplate.frame,
            template: frameTemplate,
          };
        } catch (err) {
          console.warn(
            `findTemplate threw for ${entry.category}/${entry.device}/${entry.variation}:`,
            err
          );
          return null;
        }
      })
    );

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
