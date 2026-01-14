"use client";

import { DeviceListResponse, CATEGORY_LABELS } from "@/lib/types";
import { useState } from "react";

interface DeviceSelectorProps {
  deviceList: DeviceListResponse | null;
  selectedCategory: string;
  selectedDevice: string;
  selectedVariation: string;
  onCategoryChange: (category: string) => void;
  onDeviceChange: (device: string) => void;
  onVariationChange: (variation: string) => void;
}

export function DeviceSelector({
  deviceList,
  selectedCategory,
  selectedDevice,
  selectedVariation,
  onCategoryChange,
  onDeviceChange,
  onVariationChange,
}: DeviceSelectorProps) {
  const [showFramePreview, setShowFramePreview] = useState(true);

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

  const framePreviewUrl = selectedCategory && selectedDevice && selectedVariation
    ? `https://device-frames.fly.dev${deviceList[selectedCategory]?.[selectedDevice]?.[selectedVariation]?.frame_png || ""}`
    : null;

  const frameSize = selectedCategory && selectedDevice && selectedVariation
    ? deviceList[selectedCategory]?.[selectedDevice]?.[selectedVariation]?.frame_size
    : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="device-category"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Device Category *
          </label>
          <select
            id="device-category"
            value={selectedCategory}
            onChange={(e) => {
              onCategoryChange(e.target.value);
              onDeviceChange("");
              onVariationChange("");
            }}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100"
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category] || category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="device-type"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Device Model *
          </label>
          <select
            id="device-type"
            value={selectedDevice}
            onChange={(e) => {
              onDeviceChange(e.target.value);
              onVariationChange("");
            }}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
            required
            disabled={!selectedCategory}
          >
            <option value="">Select device</option>
            {devices.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="device-variation"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Color/Variant *
          </label>
          <select
            id="device-variation"
            value={selectedVariation}
            onChange={(e) => onVariationChange(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
            required
            disabled={!selectedDevice}
          >
            <option value="">Select variant</option>
            {variations.map((variation) => (
              <option key={variation} value={variation}>
                {variation}
              </option>
            ))}
          </select>
        </div>
      </div>

      {framePreviewUrl && showFramePreview && (
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Device Frame Preview
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {selectedDevice} - {selectedVariation}
                {frameSize && (
                  <span className="ml-2">
                    ({frameSize.width} × {frameSize.height}px)
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFramePreview(false)}
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              Hide preview
            </button>
          </div>
          <div className="flex justify-center bg-white dark:bg-zinc-900 rounded-lg p-4">
            <img
              src={framePreviewUrl}
              alt={`${selectedDevice} ${selectedVariation} frame`}
              className="max-h-64 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      {!showFramePreview && framePreviewUrl && (
        <button
          type="button"
          onClick={() => setShowFramePreview(true)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Show frame preview
        </button>
      )}
    </div>
  );
}
