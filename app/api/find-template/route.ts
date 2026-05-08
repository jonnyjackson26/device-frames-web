import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-config";
import { parseTemplatePath } from "@/lib/parse-template";

const FIND_TEMPLATE_REVALIDATE_SECONDS = 60 * 60 * 24;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const device = searchParams.get("device");
  const variation = searchParams.get("variation");
  const category = searchParams.get("category");

  if (!device || !variation) {
    return NextResponse.json(
      { error: "Missing device or variation parameter" },
      { status: 400 }
    );
  }

  try {
    const upstream = new URL(`${API_BASE_URL}/find_template`);
    upstream.searchParams.set("device", device);
    upstream.searchParams.set("variation", variation);
    if (category) upstream.searchParams.set("category", category);

    const response = await fetch(upstream.toString(), {
      next: { revalidate: FIND_TEMPLATE_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to find template" },
        { status: response.status }
      );
    }

    const raw = await response.json();
    const templatePath = parseTemplatePath(raw?.template_path);
    if (!templatePath) {
      return NextResponse.json(
        { error: "Malformed template_path from upstream" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { template_path: templatePath },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${FIND_TEMPLATE_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    );
  } catch (error) {
    console.error("Error finding template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
