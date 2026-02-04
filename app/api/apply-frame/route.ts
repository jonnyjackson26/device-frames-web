import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "https://device-frames.fly.dev";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  try {
    const formData = await _request.formData();
    
    // Forward the request to the external API
    const response = await fetch(`${API_BASE_URL}/apply_frame`, {
      method: "POST",
      cache: "no-store",
      body: formData,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      const error = contentType?.includes("application/json")
        ? await response.json()
        : null;
      return NextResponse.json(
        { error: error?.detail || "Failed to apply device frame" },
        { status: response.status }
      );
    }

    // Get the image blob and return it
    const blob = await response.blob();
    
    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Error applying frame:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
