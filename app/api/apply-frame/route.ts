import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import {
  applyFrame,
  DeviceFramesError,
  TemplateAmbiguousError,
  TemplateNotFoundError,
} from "device-frames";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let workDir: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const device = formData.get("device");
    const variation = formData.get("variation");
    const category = formData.get("category");

    if (!(file instanceof File) || typeof device !== "string" || typeof variation !== "string") {
      return NextResponse.json(
        { error: "Missing file, device, or variation" },
        { status: 400 }
      );
    }

    workDir = await mkdtemp(join(tmpdir(), "device-frames-"));
    const inputPath = join(workDir, "input");
    const outputPath = join(workDir, "output.png");

    await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));

    await applyFrame(inputPath, device, variation, outputPath, {
      category: typeof category === "string" ? category : undefined,
    });

    const output = await readFile(outputPath);

    return new NextResponse(new Uint8Array(output), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
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
    console.error("Error applying frame:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  } finally {
    if (workDir) {
      await rm(workDir, { recursive: true, force: true });
    }
  }
}
