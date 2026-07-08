import { NextRequest, NextResponse } from "next/server";
import { listDevices } from "device-frames";

const LIST_DEVICES_REVALIDATE_SECONDS = 60 * 60 * 6;

export async function GET(_request: NextRequest) {
  try {
    const devices = await listDevices();

    return NextResponse.json(
      {
        count: devices.length,
        devices: devices.map((d) => ({
          category: d.category,
          device: d.device,
          variation: d.variation,
          frame_size: d.frameSize,
          screen: d.screen,
          hex_color: d.hexColor ?? "",
        })),
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${LIST_DEVICES_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching device list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
