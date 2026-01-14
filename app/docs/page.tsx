import Link from "next/link";

export default function Docs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black font-sans p-4">
      <main className="max-w-4xl mx-auto py-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Device Frame API
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Apply device frames to screenshots via HTTP
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
              v1.0.0 · OAS 3.1
            </div>
          </div>

          {/* Base URL */}
          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Base URL</div>
            <code className="text-sm text-blue-600 dark:text-blue-400">https://device-frames.fly.dev</code>
          </div>

          {/* Endpoints */}
          <div className="space-y-8">
            {/* POST /apply_frame */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">
                  POST
                </span>
                <code className="text-lg font-mono text-zinc-900 dark:text-zinc-100">/apply_frame</code>
              </div>
              
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Apply Frame
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Apply a device frame to an uploaded screenshot.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Request Body</h4>
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 space-y-3">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">multipart/form-data</div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-zinc-900 dark:text-zinc-100">file</code>
                          <span className="text-xs text-red-600 dark:text-red-400">required</span>
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          Screenshot image file (PNG, JPEG, or WebP)
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-zinc-900 dark:text-zinc-100">device_type</code>
                          <span className="text-xs text-red-600 dark:text-red-400">required</span>
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          Device type (e.g., <code className="text-xs bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">&apos;16 Pro Max&apos;</code>)
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-zinc-900 dark:text-zinc-100">device_variation</code>
                          <span className="text-xs text-red-600 dark:text-red-400">required</span>
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          Device variation (e.g., <code className="text-xs bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">&apos;Blue Titanium&apos;</code>)
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-zinc-900 dark:text-zinc-100">category</code>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">optional</span>
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          Device category (e.g., <code className="text-xs bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">&apos;iOS&apos;</code>)
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono text-zinc-900 dark:text-zinc-100">background_color</code>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">optional</span>
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          Background color as hex (#RRGGBB or #RRGGBBAA). Default: transparent
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Responses</h4>
                  <div className="space-y-3">
                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">
                          200
                        </span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Successful Response</span>
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Returns framed image as PNG file
                      </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded">
                          422
                        </span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Validation Error</span>
                      </div>
                      <pre className="text-xs text-zinc-600 dark:text-zinc-400 overflow-x-auto">
{`{
  "detail": [
    {
      "loc": ["string", 0],
      "msg": "string",
      "type": "string"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GET /list_devices */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">
                  GET
                </span>
                <code className="text-lg font-mono text-zinc-900 dark:text-zinc-100">/list_devices</code>
              </div>
              
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                List Devices
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                List all available device frames with their metadata.
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Response Structure</h4>
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                    <pre className="text-xs text-zinc-600 dark:text-zinc-400 overflow-x-auto">
{`{
  "category": {
    "device_type": {
      "variation": {
        "frame_png": "path/to/frame.png",
        "template": {...template.json content...},
        "frame_size": {
          "width": 1234,
          "height": 5678
        }
      }
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {['android-phone', 'android-tablet', 'iOS', 'iPad'].map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Responses</h4>
                  <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">
                        200
                      </span>
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Successful Response</span>
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Returns JSON object with device metadata
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OpenAPI Spec */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
              OpenAPI Specification
            </h3>
            <a
              href="https://device-frames.fly.dev/openapi.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              View OpenAPI JSON
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

