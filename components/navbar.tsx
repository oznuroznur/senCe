"use client"

import Link from "next/link"
import { Search, HelpCircle } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { navCategories } from "@/lib/mock-data"
import { useState } from "react"

export function Navbar() {
  const [activeCategory, setActiveCategory] = useState("Trending")
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
          </svg>
          <span>Sence?</span>
        </Link>

        {/* Search */}
        <div className="order-3 mt-1 w-full sm:order-2 sm:mt-0 sm:flex-1 sm:max-w-md">
          <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Sence?..."
            className="w-full pl-9 pr-8 bg-secondary border-0"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-muted-foreground">
            /
          </kbd>
          </div>
        </div>

        {/* How it works */}
        <Button variant="ghost" size="sm" className="hidden gap-2 text-muted-foreground hover:text-foreground lg:inline-flex">
          <HelpCircle className="h-4 w-4" />
          How it works
        </Button>

        {/* Auth buttons */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Log In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="bg-[#0066FF] text-white hover:bg-[#0052CC]">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="flex items-center gap-1 overflow-x-auto px-3 py-2 sm:px-4 scrollbar-hide">
        {navCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {category === "Trending" && (
              <span className="mr-1.5 text-base">~</span>
            )}
            {category}
          </button>
        ))}
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          More
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </nav>
    </header>
  )
}
