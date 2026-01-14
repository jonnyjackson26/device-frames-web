"use client";

import { useState } from "react";
import { DeviceListResponse, CATEGORY_LABELS } from "@/lib/types";

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
  const [advancedOpen, setAdvancedOpen] = useState(false);

  if (!deviceList) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
          <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        </div>
      </div>
    );
  }

  const categories = Object.keys(deviceList);
  const devices = selectedCategory ? Object.keys(deviceList[selectedCategory] || {}) : [];
  const variations = selectedCategory && selectedDevice
    ? Object.keys(deviceList[selectedCategory]?.[selectedDevice] || {})
    : [];

  const firstDeviceForCategory = (category: string) =>
    Object.keys(deviceList[category] || {})[0] || "";

  const firstVariationForDevice = (category: string, device: string) =>
    Object.keys(deviceList[category]?.[device] || {})[0] || "";

  const categoryId = "settings-category";
  const deviceId = "settings-type";
  const variationId = "settings-variation";

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Settings
      </h2>

      {/* Device Selector */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor={categoryId}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Device Category
            </label>
            <select
              id={categoryId}
              value={selectedCategory}
              onChange={(e) => {
                const nextCategory = e.target.value;
                onCategoryChange(nextCategory);
                const nextDevice = firstDeviceForCategory(nextCategory);
                onDeviceChange(nextDevice);
                onVariationChange(firstVariationForDevice(nextCategory, nextDevice));
              }}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100"
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category] || category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={deviceId}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Device Model
            </label>
            <select
              id={deviceId}
              value={selectedDevice}
              onChange={(e) => {
                const nextDevice = e.target.value;
                onDeviceChange(nextDevice);
                onVariationChange(firstVariationForDevice(selectedCategory, nextDevice));
              }}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
              disabled={!selectedCategory}
            >
              {devices.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={variationId}
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Device Variation
            </label>
            <select
              id={variationId}
              value={selectedVariation}
              onChange={(e) => onVariationChange(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
              disabled={!selectedDevice}
            >
              {variations.map((variation) => (
                <option key={variation} value={variation}>
                  {variation}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={() => setAdvancedOpen(!advancedOpen)}
        className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer -ml-4 pl-4 py-2"
      >
        <span>Advanced Settings</span>
        <svg
          className={`w-3 h-3 transition-transform ${advancedOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {advancedOpen && (
        <div className="space-y-4 mt-2">
          <div>
            <label
              htmlFor="background-color"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Background Color
            </label>
            <input
              id="background-color"
              type="color"
              value={backgroundColor || "#FFFFFF"}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="h-10 cursor-pointer"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        {hasFramedImage && (
          <button
            onClick={onNewImage}
            className="flex-1 py-3 px-4 bg-zinc-600 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors text-sm cursor-pointer"
          >
            Clear
          </button>
        )}
        <button
          onClick={onDownload}
          disabled={!hasFramedImage}
          className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing..." : "Download"}
        </button>
      </div>
    </div>
  );
}
