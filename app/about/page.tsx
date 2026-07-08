import { BackButton } from "@/components/ui/BackButton";

const linkClass = "text-blue-600 dark:text-blue-400 hover:underline";

export default function About() {
  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 py-12">
      <BackButton />

      <h1 className="text-2xl font-bold mb-6">About Device Frames</h1>

      <div className="space-y-4 leading-relaxed">
        <p>
          Device Frames is a free tool for putting screenshots and images into realistic
          device mockups — iPhones, iPads, Android phones, and tablets. It was built by{" "}
          <a href="https://jonny-jackson.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
            Jonny Jackson
          </a>.
        </p>

        <p>
          This site applies frames using the{" "}
          <a href="https://www.npmjs.com/package/device-frames" target="_blank" rel="noopener noreferrer" className={linkClass}>
            device-frames
          </a>{" "}
          npm package. The same frame library is also available as a hosted API (Python, on
          fly.io) if you want to apply frames from a script or your own app — see the{" "}
          <a href="https://device-frames-api.fly.dev/docs" target="_blank" rel="noopener noreferrer" className={linkClass}>
            API docs
          </a>. You can read about how the project was built in{" "}
          <a href="https://jonny-jackson.com/posts/device-frames/" target="_blank" rel="noopener noreferrer" className={linkClass}>
            this blog post
          </a>.
        </p>

        <p>
          Want the raw frame PNGs and masks instead? Browse and download them on the{" "}
          <a href="/frame-media" className={linkClass}>
            frame media
          </a>{" "}
          page.
        </p>

        <p>
          Need more device frames or have a feature request? Email{" "}
          <a href="mailto:jrsjackson26@gmail.com" className={linkClass}>
            jrsjackson26@gmail.com
          </a>.
        </p>
      </div>
    </main>
  );
}
