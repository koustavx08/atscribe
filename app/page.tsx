import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"
import { FileText, Zap, Target, Download, Brain, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ATScribe</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Create ATS-Optimized Resumes with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                AI Power
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Transform your career with intelligent resume generation. Upload job descriptions, get AI-powered
              suggestions, and create resumes that pass ATS filters and impress recruiters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/dashboard">Get Started Free</Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Powerful AI Features</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">Everything you need to create the perfect resume</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>AI Content Generation</CardTitle>
                <CardDescription>
                  Generate compelling bullet points and summaries tailored to your target role
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>ATS Optimization</CardTitle>
                <CardDescription>
                  Ensure your resume passes Applicant Tracking Systems with keyword optimization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Job Matching</CardTitle>
                <CardDescription>Upload job descriptions and get personalized resume suggestions</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Download className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>PDF Export</CardTitle>
                <CardDescription>Download professional PDFs ready for job applications</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Real-time Chat</CardTitle>
                <CardDescription>Chat with AI to refine and improve your resume sections</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Multiple Templates</CardTitle>
                <CardDescription>Choose from professional templates designed for different industries</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Land Your Dream Job?</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of professionals who have transformed their careers with ATScribe
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/dashboard">Start Building Your Resume</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">ATScribe</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            © 2025 ATScribe. All rights reserved. Built with AI for the future of work.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ by{" "}
            <a 
              href="https://koustavx08.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Koustav Singh
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
