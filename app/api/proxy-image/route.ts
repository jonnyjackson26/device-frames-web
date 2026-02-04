import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'https://device-frames.fly.dev';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    // Fetch the image from the external API
    const imageUrl = `${API_BASE_URL}${path}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: response.status }
      );
    }

    // Get the image blob
    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || 'image/png';

    // Return the image with proper headers
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}
