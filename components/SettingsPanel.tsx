"use client";

import { DeviceSelector } from "./DeviceSelector";
import { DeviceListResponse } from "@/lib/types";

interface SettingsPanelProps {
  deviceList: DeviceListResponse | null;
  selectedCategory: string;
  selectedDevice: string;
  selectedVariation: string;
  onCategoryChange: (category: string) => void;
  onDeviceChange: (device: string) => void;
  onVariationChange: (variation: string) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  onDownload: () => void;
  onNewImage: () => void;
  isProcessing: boolean;
  error: string | null;
  hasFramedImage: boolean;
  hasFile: boolean;
}

export function SettingsPanel({
  deviceList,
  selectedCategory,
  selectedDevice,
  selectedVariation,
  onCategoryChange,
  onDeviceChange,
  onVariationChange,
  backgroundColor,
  onBackgroundColorChange,
  onDownload,
  onNewImage,
  isProcessing,
  error,
  hasFramedImage,
  hasFile,
}: SettingsPanelProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Settings
      </h2>

      <DeviceSelector
        deviceList={deviceList}
        selectedCategory={selectedCategory}
        selectedDevice={selectedDevice}
        selectedVariation={selectedVariation}
        onCategoryChange={onCategoryChange}
        onDeviceChange={onDeviceChange}
        onVariationChange={onVariationChange}
        idPrefix="settings"
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
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          placeholder="#FFFFFF or transparent"
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        {hasFramedImage ? (
          <>
            <button
              onClick={onDownload}
              className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Download
            </button>
            <button
              onClick={onNewImage}
              className="flex-1 py-3 px-4 bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              New Image
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={!hasFile || !selectedCategory || !selectedDevice || !selectedVariation || isProcessing}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Generate Frame"}
          </button>
        )}
      </div>
    </div>
  );
}
