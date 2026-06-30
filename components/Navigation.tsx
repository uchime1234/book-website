'use client'

import Link from 'next/link'
import { BookOpen, Upload } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">BookLib</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') && pathname !== '/upload'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Library</span>
            </Link>

            <Link
              href="/upload"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/upload')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">Upload</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
