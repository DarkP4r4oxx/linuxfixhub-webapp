import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <article className="space-y-8">
        <div>
          <h1 className="text-4xl font-mono font-bold mb-4">About LinuxFixHub</h1>
          <p className="text-lg text-muted-foreground">A community-driven knowledge base for Linux users worldwide.</p>
        </div>

        <Card className="p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-mono font-bold">What is LinuxFixHub?</h2>
          <p className="text-foreground leading-relaxed">
            LinuxFixHub is a modern, community-driven platform designed to help Linux users quickly find solutions to
            system errors, configuration issues, and command-related problems. Whether you're a beginner troubleshooting
            your first Linux installation or an experienced sysadmin looking for quick references, LinuxFixHub provides
            a centralized knowledge base of real-world solutions.
          </p>
        </Card>

        <Card className="p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-mono font-bold">Our Vision</h2>
          <p className="text-foreground leading-relaxed">
            To create a crowd-sourced knowledge base for Linux users that is accessible, searchable, and continuously
            updated by the community. We believe that by sharing solutions and best practices, we can help reduce
            frustration and accelerate problem-solving for Linux users at all levels.
          </p>
        </Card>

        <Card className="p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-mono font-bold">Key Features</h2>
          <ul className="space-y-2 text-foreground">
            <li className="flex gap-3">
              <span className="text-[#00ff9d] font-bold">→</span>
              <span>Search and filter issues by distribution, category, and tags</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#00ff9d] font-bold">→</span>
              <span>Submit your own fixes and help the community</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#00ff9d] font-bold">→</span>
              <span>Upvote helpful solutions to surface the best answers</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#00ff9d] font-bold">→</span>
              <span>Copy commands directly to your clipboard</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#00ff9d] font-bold">→</span>
              <span>Comment and discuss solutions with other users</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#00ff9d] font-bold">→</span>
              <span>Dark mode by default for comfortable terminal-like experience</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 sm:p-8 space-y-4 border-[#00ff9d]/30 bg-[#00ff9d]/5">
          <h2 className="text-2xl font-mono font-bold">Built with</h2>
          <p className="text-foreground">
            LinuxFixHub is built with modern web technologies including Next.js 14, TailwindCSS, ShadCN UI, and Framer
            Motion. The platform is designed to be fast, responsive, and easy to use across all devices.
          </p>
          <p className="text-sm text-muted-foreground">Built with ❤️ using Next.js & TailwindCSS</p>
        </Card>

        <Card className="p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-mono font-bold">Developer Credits</h2>
          <p className="text-foreground">
            LinuxFixHub was created as a community project to help Linux users solve problems faster. We welcome
            contributions from developers, system administrators, and Linux enthusiasts who want to help improve the
            platform.
          </p>
        </Card>
      </article>
    </div>
  )
}
