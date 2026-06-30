'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getBookById, formatFileSize, formatDate, getDownloadUrl } from '@/lib/api'
import { BookOpen, Download, ArrowLeft, Calendar, HardDrive, Copy, CheckCircle } from 'lucide-react'

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string
  const [book, setBook] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const bookData = getBookById(bookId)
    setBook(bookData)
    setIsMounted(true)
  }, [bookId])

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="h-8 w-32 animate-pulse bg-muted/20 rounded mb-8" />
          <div className="grid gap-8 md:grid-cols-[300px,1fr]">
            <div className="aspect-[3/4] w-full animate-pulse bg-muted/20 rounded-lg" />
            <div className="space-y-4">
              <div className="h-12 w-3/4 animate-pulse bg-muted/20 rounded" />
              <div className="h-6 w-1/2 animate-pulse bg-muted/20 rounded" />
              <div className="space-y-2">
                <div className="h-20 w-full animate-pulse bg-muted/20 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!book) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Link>

          <div className="flex min-h-96 items-center justify-center rounded-lg border border-dashed border-border">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">Book not found</p>
              <p className="text-sm text-muted-foreground">The book you&apos;re looking for doesn&apos;t exist.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const handleDownload = async () => {
    if (!book.id) {
      alert('Download link not available')
      return
    }

    try {
      setDownloading(true)
      
      // Get signed download URL
      const downloadUrl = await getDownloadUrl(book.id)
      
      // Trigger download using the signed URL
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = book.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (error) {
      console.error('Download error:', error)
      alert(error instanceof Error ? error.message : 'Failed to download book. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy error:', error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          {/* Cover Image */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <BookOpen className="h-16 w-16" />
                <span className="text-lg font-medium">Book Cover</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-5 w-5" />
                {downloading ? 'Preparing...' : 'Download'}
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 font-medium text-foreground hover:bg-card/80 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-8">
            {/* Title and Description */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{book.title}</h1>
              {book.description && (
                <p className="text-lg text-muted-foreground">{book.description}</p>
              )}
            </div>

            {/* Book Information */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <HardDrive className="h-4 w-4" />
                  File Size
                </div>
                <p className="text-lg font-semibold text-foreground">{formatFileSize(book.fileSize)}</p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  Upload Date
                </div>
                <p className="text-lg font-semibold text-foreground">{formatDate(book.uploadDate)}</p>
              </div>

              <div className="sm:col-span-2 rounded-lg border border-border bg-card p-4">
                <div className="text-sm text-muted-foreground mb-1">Filename</div>
                <p className="text-lg font-semibold text-foreground break-all">{book.filename}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <h3 className="font-semibold text-foreground mb-3">About this file</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>This book is stored securely in your personal library</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You can download the book anytime with the download button</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Share the link with others to give them access to this book</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-xs text-muted-foreground">Download link expires in 1 hour for security</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}