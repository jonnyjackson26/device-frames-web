"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "@/components/Phone";
import { SettingsPanel } from "@/components/SettingsPanel";
import { applyDeviceFrame, listDevices } from "@/lib/api";
import { DeviceListResponse } from "@/lib/types";

const FALLBACK_CATEGORY = "iOS";
const FALLBACK_DEVICE = "iPhone 17 Pro";
const FALLBACK_VARIATION = "Cosmic Orange";

const DEFAULT_CATEGORY = process.env.NEXT_PUBLIC_DEFAULT_CATEGORY?.trim() || FALLBACK_CATEGORY;
const DEFAULT_DEVICE = process.env.NEXT_PUBLIC_DEFAULT_DEVICE?.trim() || FALLBACK_DEVICE;
const DEFAULT_VARIATION = process.env.NEXT_PUBLIC_DEFAULT_VARIATION?.trim() || FALLBACK_VARIATION;

export default function Home() {
  const [deviceList, setDeviceList] = useState<DeviceListResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [deviceType, setDeviceType] = useState(DEFAULT_DEVICE);
  const [deviceVariation, setDeviceVariation] = useState(DEFAULT_VARIATION);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [framedImageUrl, setFramedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const defaultsAppliedRef = useRef(false);

  // Fetch device list on mount
  useEffect(() => {
    let isMounted = true;

    listDevices()
      .then((data) => {
        if (!isMounted) return;
        setDeviceList(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load device list:", err);
        setError("Failed to load device list. Please refresh the page.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Ensure a selection is always present once the device list is loaded
  useEffect(() => {
    if (!deviceList) return;

    const categories = Object.keys(deviceList);
    if (!categories.length) return;

    const shouldUseDefaults = !defaultsAppliedRef.current;
    const preferredCategory =
      shouldUseDefaults && DEFAULT_CATEGORY && categories.includes(DEFAULT_CATEGORY)
        ? DEFAULT_CATEGORY
        : category;
    const nextCategory =
      preferredCategory && categories.includes(preferredCategory)
        ? preferredCategory
        : categories[0];
    const devices = Object.keys(deviceList[nextCategory] || {});
    const preferredDevice =
      shouldUseDefaults && DEFAULT_DEVICE && devices.includes(DEFAULT_DEVICE) &&
      (!DEFAULT_CATEGORY || nextCategory === DEFAULT_CATEGORY)
        ? DEFAULT_DEVICE
        : deviceType;
    const nextDevice =
      preferredDevice && devices.includes(preferredDevice)
        ? preferredDevice
        : devices[0] || "";
    const variations = nextDevice
      ? Object.keys(deviceList[nextCategory]?.[nextDevice] || {})
      : [];
    const preferredVariation =
      shouldUseDefaults && DEFAULT_VARIATION && variations.includes(DEFAULT_VARIATION) &&
      (!DEFAULT_DEVICE || nextDevice === DEFAULT_DEVICE)
        ? DEFAULT_VARIATION
        : deviceVariation;
    const nextVariation =
      preferredVariation && variations.includes(preferredVariation)
        ? preferredVariation
        : variations[0] || "";

    if (nextCategory !== category) setCategory(nextCategory);
    if (nextDevice !== deviceType) setDeviceType(nextDevice);
    if (nextVariation !== deviceVariation) setDeviceVariation(nextVariation);

    defaultsAppliedRef.current = true;
  }, [deviceList, category, deviceType, deviceVariation]);

  // Auto-apply frame when a file is selected
  useEffect(() => {
    if (!selectedFile || !category || !deviceType || !deviceVariation) {
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsProcessing(true);
    setError(null);
    setFramedImageUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });

    const applyFrame = async () => {
      try {
        const blob = await applyDeviceFrame({
          file: selectedFile,
          device_type: deviceType,
          device_variation: deviceVariation,
          background_color: backgroundColor || undefined,
          category,
        });

        const url = URL.createObjectURL(blob);

        if (requestId !== requestIdRef.current) {
          URL.revokeObjectURL(url);
          return;
        }

        setFramedImageUrl(url);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError(err instanceof Error ? err.message : "Failed to process image");
      } finally {
        if (requestId === requestIdRef.current) {
          setIsProcessing(false);
        }
      }
    };

    applyFrame();
  }, [selectedFile, category, deviceType, deviceVariation, backgroundColor]);

  useEffect(() => () => {
    if (framedImageUrl) URL.revokeObjectURL(framedImageUrl);
  }, [framedImageUrl]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFramedImageUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setError(null);
  };

  const handleDownload = () => {
    if (framedImageUrl) {
      const a = document.createElement("a");
      a.href = framedImageUrl;
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${deviceType}-${deviceVariation}-${timestamp}.png`;
      a.download = filename;
      a.click();
    }
  };

  const handleReset = () => {
    requestIdRef.current += 1;
    setIsProcessing(false);
    setSelectedFile(null);
    setFramedImageUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setBackgroundColor("");
    setError(null);
  };

  const selectedFrame =
    category && deviceType && deviceVariation && deviceList
      ? deviceList[category]?.[deviceType]?.[deviceVariation]
      : undefined;

  const frameImageUrl = selectedFrame?.frame_png
    ? `https://device-frames.fly.dev${selectedFrame.frame_png}`
    : "/placeholder_frame.png";

  const frameSize = selectedFrame?.frame_size;
  const screen = selectedFrame?.template.screen;

  return (
    <div className="h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black font-sans overflow-auto md:overflow-hidden p-4">
      <main className="flex flex-col md:flex-row md:h-full gap-8">
        {/* Phone Panel */}
        <div className="h-screen md:h-full md:flex-1 min-w-0 bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center md:overflow-auto">
          <div
            className="relative w-full h-full max-w-full flex items-center justify-center"
            style={{
              aspectRatio: frameSize ? `${frameSize.width}/${frameSize.height}` : "9/16",
            }}
          >
            <Phone
              framedImageUrl={framedImageUrl}
              isLoading={isProcessing}
              onFileSelect={handleFileSelect}
              emptyFrameUrl={frameImageUrl}
            />
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-full md:w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 md:overflow-auto">
          <SettingsPanel
            deviceList={deviceList}
            selectedCategory={category}
            selectedDevice={deviceType}
            selectedVariation={deviceVariation}
            onCategoryChange={setCategory}
            onDeviceChange={setDeviceType}
            onVariationChange={setDeviceVariation}
            backgroundColor={backgroundColor}
            onBackgroundColorChange={setBackgroundColor}
            onDownload={handleDownload}
            onNewImage={handleReset}
            isProcessing={isProcessing}
            error={error}
            hasFramedImage={framedImageUrl !== null}
            hasFile={selectedFile !== null}
          />
        </div>
      </main>
    </div>
  );
}
