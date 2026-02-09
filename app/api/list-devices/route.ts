import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://device-frames.fly.dev";

const LIST_DEVICES_REVALIDATE_SECONDS = 60 * 60 * 6;

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/list_devices`, {
      method: "GET",
      next: { revalidate: LIST_DEVICES_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch device list from API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${LIST_DEVICES_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
      },
    });
  } catch (error) {
    console.error("Error fetching device list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
