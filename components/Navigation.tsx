'use client'

import Link from 'next/link'
import { BookOpen, LogIn, LogOut, Upload } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { isAdminAuthenticated, logoutAdmin } from '@/lib/api'
import { useState, useEffect } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated())
  }, [pathname])

  const handleLogout = () => {
    logoutAdmin()
    setIsAdmin(false)
    router.push('/')
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  // Don't show navigation on admin login page
  if (pathname === '/admin/login') return null

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
            {isAdmin ? (
              <>
                <Link
                  href="/admin/upload"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/admin/upload')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">Add Book</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}