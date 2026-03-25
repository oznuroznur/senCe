"use client"

import Link from "next/link"
import { Search, HelpCircle, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { navCategories } from "@/lib/mock-data"
import { useState } from "react"

export function Navbar() {
  const [activeCategory, setActiveCategory] = useState("Trending")

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="flex h-14 items-center justify-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
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
        <div className="relative flex-1 max-w-md">
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

        {/* How it works */}
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-4 w-4" />
          How it works
        </Button>

        {/* Auth buttons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Log In
          </Button>
          <Button size="sm" className="bg-[#0066FF] hover:bg-[#0052CC] text-white">
            Sign Up
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Wallet className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="flex items-center justify-center gap-1 overflow-x-auto px-4 py-2 scrollbar-hide">
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
