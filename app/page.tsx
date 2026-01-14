"use client";

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { applyDeviceFrame } from "@/lib/api";
import { DEVICE_OPTIONS } from "@/lib/types";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deviceType, setDeviceType] = useState("");
  const [deviceVariation, setDeviceVariation] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [framedImageUrl, setFramedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedDevice = DEVICE_OPTIONS.find((d) => d.name === deviceType);
  const variations = selectedDevice?.variations || [];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFramedImageUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !deviceType || !deviceVariation) {
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
    setDeviceType("");
    setDeviceVariation("");
    setBackgroundColor("");
    setFramedImageUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black font-sans py-12 px-4">
      <main className="max-w-2xl mx-auto">
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
              <FileUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="device-type"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Device Type *
                  </label>
                  <select
                    id="device-type"
                    value={deviceType}
                    onChange={(e) => {
                      setDeviceType(e.target.value);
                      setDeviceVariation("");
                    }}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100"
                    required
                  >
                    <option value="">Select device</option>
                    {DEVICE_OPTIONS.map((device) => (
                      <option key={device.name} value={device.name}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="device-variation"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Device Color *
                  </label>
                  <select
                    id="device-variation"
                    value={deviceVariation}
                    onChange={(e) => setDeviceVariation(e.target.value)}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
                    required
                    disabled={!deviceType}
                  >
                    <option value="">Select color</option>
                    {variations.map((variation) => (
                      <option key={variation} value={variation}>
                        {variation}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
              disabled={!selectedFile || !deviceType || !deviceVariation || isProcessing}
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
