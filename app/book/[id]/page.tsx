'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getBookById, formatDate, formatFileSize } from '@/lib/api'
import { BookOpen, Download, ArrowLeft, Calendar, ExternalLink, Share2, CheckCircle, Image } from 'lucide-react'

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string
  const [book, setBook] = useState<any>(null)
  const [copied, setCopied] = useState(false)
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

  const handleDownload = () => {
    if (book.downloadLink) {
      window.open(book.downloadLink, '_blank')
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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <div className="grid gap-8 md:grid-cols-[320px,1fr] lg:gap-12">
          {/* Cover Image */}
          <div className="flex flex-col gap-4">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-book.svg'
                }}
              />
            </div>

            {/* Image Metadata (if available) */}
            {(book.coverImageName || book.coverImageSize) && (
              <div className="rounded-lg border border-border bg-card/50 p-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-1">Image Details</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {book.coverImageName && (
                    <p>File: {book.coverImageName}</p>
                  )}
                  {book.coverImageSize && (
                    <p>Size: {formatFileSize(book.coverImageSize)}</p>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                <Download className="h-5 w-5" />
                Download Book
                <ExternalLink className="h-4 w-4 ml-1" />
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3.5 font-medium text-foreground hover:bg-card/80 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-5 w-5" />
                    Share Book
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{book.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  Added On
                </div>
                <p className="text-lg font-semibold text-foreground">{formatDate(book.createdAt)}</p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <ExternalLink className="h-4 w-4" />
                  Download Link
                </div>
                <a
                  href={book.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-primary hover:underline truncate block"
                >
                  {book.downloadLink}
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/50 p-6">
              <h3 className="font-semibold text-foreground mb-3">About this book</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>This book is available for free download</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Click the download button to access the file</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Share the link with others to give them access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}