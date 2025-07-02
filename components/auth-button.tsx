"use client"

import { Button } from "@/components/ui/button"
import { SignInButton, useUser, UserButton } from "@clerk/nextjs"
import { LogIn } from "lucide-react"

export function AuthButton() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button size="sm">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </SignInButton>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">{user.emailAddresses[0]?.emailAddress}</span>
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
