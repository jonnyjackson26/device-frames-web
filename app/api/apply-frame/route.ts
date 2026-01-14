import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://device-frames.fly.dev";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Forward the request to the external API
    const response = await fetch(`${API_BASE_URL}/apply_frame`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || "Failed to apply device frame" },
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
