"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { DeviceSelector } from "@/components/DeviceSelector";
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

  // Fetch device list on mount
  useEffect(() => {
    listDevices()
      .then(setDeviceList)
      .catch((err) => {
        console.error("Failed to load device list:", err);
        setError("Failed to load device list. Please refresh the page.");
      });
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

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFramedImageUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !category || !deviceType || !deviceVariation) {
      setError("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const blob = await applyDeviceFrame({
        file: selectedFile,
        device_type: deviceType,
        device_variation: deviceVariation,
        background_color: backgroundColor || undefined,
        category,
      });

      const url = URL.createObjectURL(blob);
      setFramedImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
    } finally {
      setIsProcessing(false);
    }
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
    setSelectedFile(null);
    setCategory("");
    setDeviceType("");
    setDeviceVariation("");
    setBackgroundColor("");
    setFramedImageUrl(null);
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

  const renderUploadArea = () => {
    if (frameImageUrl && frameSize && screen) {
      const width = frameSize.width;
      const height = frameSize.height;

      return (
        <div className="relative w-full max-w-3xl mx-auto">
          <div
            className="relative w-full"
            style={{ aspectRatio: `${width}/${height}` }}
          >
            <img
              src={frameImageUrl}
              alt={`${deviceType} ${deviceVariation} frame`}
              className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
            />

            <div className="absolute inset-0">
              <div
                className="absolute overflow-hidden"
                style={{
                  top: `${(screen.y / height) * 100}%`,
                  left: `${(screen.x / width) * 100}%`,
                  width: `${(screen.width / width) * 100}%`,
                  height: `${(screen.height / height) * 100}%`,
                }}
              >
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Uploaded screenshot"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    frameMode
                    className="h-full w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <FileUpload
        onFileSelect={handleFileSelect}
        selectedFile={selectedFile}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black font-sans py-12 px-4">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            Device Frame Studio
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Add beautiful device frames to your screenshots
          </p>
        </div>

        {!framedImageUrl ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 space-y-6">
              {renderUploadArea()}

              <DeviceSelector
                deviceList={deviceList}
                selectedCategory={category}
                selectedDevice={deviceType}
                selectedVariation={deviceVariation}
                onCategoryChange={setCategory}
                onDeviceChange={setDeviceType}
                onVariationChange={setDeviceVariation}
              />

              <div>
                <label
                  htmlFor="background-color"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Background Color (optional)
                </label>
                <input
                  id="background-color"
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  placeholder="#FFFFFF or transparent"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedFile || !category || !deviceType || !deviceVariation || isProcessing}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Apply Frame"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Your Framed Image
              </h2>
              <div className="flex justify-center bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                <img
                  src={framedImageUrl}
                  alt="Framed screenshot"
                  className="max-w-full h-auto rounded"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleDownload}
                className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Download Image
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 px-6 bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
