'use client';

import { useEffect, useState } from 'react';
import FrameGallery from '@/components/FrameGallery';

interface FrameTemplate {
  frame: string;
  mask: string;
  screen: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  frameSize: {
    width: number;
    height: number;
  };
}

interface DeviceFrame {
  category: string;
  device: string;
  variant: string;
  framePath: string;
  maskPath: string;
  thumbnail: string;
  template: FrameTemplate;
}

export default function FrameMediaPage() {
  const [frames, setFrames] = useState<DeviceFrame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const response = await fetch('/api/frames');
        if (!response.ok) throw new Error('Failed to fetch frames');
        const data = await response.json();
        setFrames(data.frames);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFrames();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Device Frame Gallery
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Browse and download device frame PNGs, masks, and templates
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Apply Frames to Screenshots
            </a>
            <a 
              href="https://github.com/jonnyjackson26/device-frames-media" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View Source Data on GitHub
            </a>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
              <p className="text-slate-600">Loading device frames...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-6 mb-8">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {!loading && frames.length > 0 && (
          <FrameGallery frames={frames} />
        )}

        {!loading && frames.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">No device frames found</p>
          </div>
        )}
      </div>
    </main>
  );
}
