import { NextRequest, NextResponse } from "next/server";
import {
  findTemplate,
  DeviceFramesError,
  TemplateAmbiguousError,
  TemplateNotFoundError,
} from "device-frames";

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
    const template = await findTemplate(device, variation, {
      category: category ?? undefined,
    });

    return NextResponse.json(
      {
        template_path: {
          frame: template.frame,
          mask: template.mask,
          screen: template.screen,
          frameSize: template.frameSize,
          hexColor: template.hexColor ?? "",
        },
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${FIND_TEMPLATE_REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    );
  } catch (error) {
    if (error instanceof TemplateNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof TemplateAmbiguousError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof DeviceFramesError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Error finding template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
