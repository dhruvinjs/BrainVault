import { Brain, Twitter, Youtube, FileText, Search, Layers, Zap } from "lucide-react"
import { Button } from "../Components"
import { Link, useNavigate } from "react-router-dom"

export function Landing() {
  const nav = useNavigate()

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="w-full max-w-7xl px-4">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-gray-700 bg-gray-900 backdrop-blur">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">BrainVault</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {["Features", "How It Works"].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium hover:text-white/80"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <Button
                variant="dark"
                size="sm"
                text="Log in"
                onClick={() => nav("/login")}
                className="hidden md:flex"
              />
              <Button
                variant="dark"
                size="sm"
                text="Get Started"
                onClick={() => nav("/register")}
                className="transition-colors duration-200 ease-in-out hover:bg-amber-950 transform hover:scale-105"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-20 py-20">
          {/* Hero Section */}
          <section className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            {/* Left column */}
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
                Your Second Brain for All Knowledge
              </h1>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-300 text-lg">
                Capture, organize, and retrieve everything from Twitter threads to YouTube videos
                and personal notes in one unified knowledge hub.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="dark"
                  size="md"
                  text="Get Started"
                  onClick={() => nav("/register")}
                  className="px-4 py-2 rounded transition hover:bg-amber-950 hover:scale-105"
                />
                <Button
                  variant="dark"
                  size="md"
                  text="See How It Works"
                  onClick={scrollToHowItWorks}
                  className="px-4 py-2 rounded transition hover:bg-amber-950 hover:scale-105"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-full md:h-[420px] lg:h-[450px]">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative h-[300px] w-[300px] md:h-[380px] md:w-[380px] rounded-2xl border border-gray-700 p-1 bg-black/50 backdrop-blur">
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-black/80 p-6">
                      <Brain className="h-16 w-16 text-white mb-4" />
                      <h3 className="text-xl font-bold text-white">Your Knowledge Hub</h3>
                      <p className="text-sm text-gray-400">Everything connected in one place</p>
                      <div className="mt-6 flex gap-4">
                        {[Twitter, Youtube, FileText].map((Icon, i) => (
                          <div
                            key={i}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800"
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                All Your Knowledge in One Place
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-gray-600 dark:text-gray-300 text-lg">
                Seamlessly integrate content from multiple sources and access it whenever you need it.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Twitter,
                  title: "Twitter Integration",
                  desc: "Save and organize valuable Twitter threads and tweets.",
                },
                {
                  icon: Youtube,
                  title: "YouTube Knowledge",
                  desc: "Store video content with timestamps, transcripts, and notes.",
                },
                {
                  icon: FileText,
                  title: "Personal Notes",
                  desc: "Capture your thoughts in a structured format.",
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-4 rounded-lg border border-gray-700 bg-black p-6"
                >
                  <Icon className="h-8 w-8 text-white" />
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="text-center text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
                How BrainVault Works
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-gray-600 dark:text-gray-300 text-lg">
                Three simple steps to organize your digital knowledge
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  icon: Zap,
                  title: "Capture",
                  desc: "Save content from Twitter, YouTube, or create notes easily.",
                },
                {
                  step: "2",
                  icon: Layers,
                  title: "Organize",
                  desc: "Auto-tag your content or use custom systems.",
                },
                {
                  step: "3",
                  icon: Search,
                  title: "Retrieve",
                  desc: "Use search to find what you need.",
                },
              ].map(({ step, icon: Icon, title, desc }, i) => (
                <div
                  key={i}
                  className="relative flex flex-col items-center space-y-4 p-6 rounded-lg border border-gray-700 bg-black"
                >
                  <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white">
                    <span className="font-bold">{step}</span>
                  </div>
                  <Icon className="h-8 w-8 text-white" />
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="text-center text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
              Ready to Build Your Second Brain?
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-gray-600 dark:text-gray-300 text-lg">
              Start organizing your digital knowledge today and never lose valuable information again.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                variant="dark"
                size="lg"
                text="Get Started"
                onClick={() => nav("/register")}
                className="px-4 py-2 rounded transition hover:bg-amber-950 hover:scale-105"
              />
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-700 py-6 text-center">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-white" />
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} BrainVault. All rights reserved.
              </p>
            </div>
            <div className="flex gap-4">
              {["Privacy", "Terms", "Contact"].map((item) => (
                <Link
                  key={item}
                  to="#"
                  className="text-sm text-gray-400 hover:text-white"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
