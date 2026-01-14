import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://device-frames.fly.dev";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/list_devices`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch device list from API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching device list:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
