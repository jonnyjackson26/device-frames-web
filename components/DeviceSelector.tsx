"use client";

import { DeviceListResponse, CATEGORY_LABELS } from "@/lib/types";

interface DeviceSelectorProps {
  deviceList: DeviceListResponse | null;
  selectedCategory: string;
  selectedDevice: string;
  selectedVariation: string;
  onCategoryChange: (category: string) => void;
  onDeviceChange: (device: string) => void;
  onVariationChange: (variation: string) => void;
  idPrefix?: string;
}

export function DeviceSelector({
  deviceList,
  selectedCategory,
  selectedDevice,
  selectedVariation,
  onCategoryChange,
  onDeviceChange,
  onVariationChange,
  idPrefix = "device",
}: DeviceSelectorProps) {
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

  const categoryId = `${idPrefix}-category`;
  const deviceId = `${idPrefix}-type`;
  const variationId = `${idPrefix}-variation`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor={categoryId}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Device Category *
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
            Device Model *
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
            required
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
            Color/Variant *
          </label>
          <select
            id={variationId}
            value={selectedVariation}
            onChange={(e) => onVariationChange(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
            required
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
  );
}
