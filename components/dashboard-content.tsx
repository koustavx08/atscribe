"use client"

import { useUser, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthButton } from "@/components/auth-button"
import { Plus, FileText, Edit, Download, Trash2, LogIn } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Resume {
  _id: string
  title: string
  createdAt: string
  updatedAt: string
}

export function DashboardContent() {
  const { user, isLoaded } = useUser()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)

  useEffect(() => {
    if (user) {
      loadResumes()
    }
  }, [user])

  const loadResumes = async () => {
    try {
      const response = await fetch("/api/resumes")
      if (response.ok) {
        const data = await response.json()
        setResumes(data.resumes)
      }
    } catch (error) {
      console.error("Error loading resumes:", error)
    } finally {
      setLoadingResumes(false)
    }
  }

  const deleteResume = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setResumes(resumes.filter((resume) => resume._id !== resumeId))
      }
    } catch (error) {
      console.error("Error deleting resume:", error)
    }
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome to ATScribe</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <SignInButton mode="modal">
              <Button size="lg">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In to Continue
              </Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ATScribe</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Resumes</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Create and manage your AI-optimized resumes</p>
          </div>
          <Button asChild size="lg">
            <Link href="/resume/create">
              <Plus className="h-5 w-5 mr-2" />
              Create New Resume
            </Link>
          </Button>
        </div>

        {loadingResumes ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Create your first AI-optimized resume to get started
              </p>
              <Button asChild>
                <Link href="/resume/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{resume.title}</span>
                    <FileText className="h-5 w-5 text-blue-600" />
                  </CardTitle>
                  <CardDescription>Updated {new Date(resume.updatedAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/resume/edit/${resume._id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteResume(resume._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
