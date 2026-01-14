import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black font-sans p-4">
      <main className="max-w-2xl mx-auto py-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            About Device Frames
          </h1>
          
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
            <p>
              Device Frames is 100% free to use and was created by <a href="https://jonny-jackson.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">jonny-jackson.com</a>.
            </p>

            <p>
              The application uses a custom Python backend hosted on <a href="https://fly.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">fly.io</a> to handle the heavy lifting of processing images and applying precise device frames.
            </p>

            <p>
              You can find more information about the project, how it was built, and the technical details in <a href="https://jonny-jackson.com/posts/device-frames/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">this blog post</a>.
            </p>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                Need more frames or features?
              </p>
              <p>
                Email me at <a href="mailto:jrsjackson26@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">jrsjackson26@gmail.com</a> to request specific device models or suggest new features.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
