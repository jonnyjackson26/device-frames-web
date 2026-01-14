"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "@/components/Phone";
import { SettingsPanel } from "@/components/SettingsPanel";
import { applyDeviceFrame, listDevices } from "@/lib/api";
import { DeviceListResponse } from "@/lib/types";

export default function Home() {
  const [deviceList, setDeviceList] = useState<DeviceListResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceVariation, setDeviceVariation] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [framedImageUrl, setFramedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

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

    const nextCategory = category && categories.includes(category) ? category : categories[0];
    const devices = Object.keys(deviceList[nextCategory] || {});
    const nextDevice = deviceType && devices.includes(deviceType) ? deviceType : devices[0] || "";
    const variations = nextDevice
      ? Object.keys(deviceList[nextCategory]?.[nextDevice] || {})
      : [];
    const nextVariation = deviceVariation && variations.includes(deviceVariation)
      ? deviceVariation
      : variations[0] || "";

    if (nextCategory !== category) setCategory(nextCategory);
    if (nextDevice !== deviceType) setDeviceType(nextDevice);
    if (nextVariation !== deviceVariation) setDeviceVariation(nextVariation);
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
      a.download = `framed-${selectedFile?.name || "image"}.png`;
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
    setError(null);
  };

  const selectedFrame =
    category && deviceType && deviceVariation && deviceList
      ? deviceList[category]?.[deviceType]?.[deviceVariation]
      : undefined;

  const frameImageUrl = selectedFrame?.frame_png
    ? `https://device-frames.fly.dev${selectedFrame.frame_png}`
    : null;

  const frameSize = selectedFrame?.frame_size;
  const screen = selectedFrame?.template.screen;

  return (
    <div className="h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black font-sans overflow-hidden p-4">
      <main className="h-full flex flex-col md:flex-row gap-8">
        {/* Phone Panel */}
        <div className="flex-1 min-w-0 bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center overflow-auto">
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
        <div className="w-full md:w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 overflow-auto">
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
