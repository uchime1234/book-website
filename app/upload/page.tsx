'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadArea } from '@/components/UploadArea'
import { createBookWithFile } from '@/lib/api'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function UploadPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [bookTitle, setBookTitle] = useState('')
  const [bookDescription, setBookDescription] = useState('')

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      for (const file of files) {
        // Create book with file upload
        await createBookWithFile(
          file,
          bookTitle || undefined,
          bookDescription || undefined
        )
        setUploadedCount((prev) => prev + 1)
      }

      setSuccess(true)
      setBookTitle('')
      setBookDescription('')

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Upload Books</h1>
          <p className="text-muted-foreground">Add new books to your library</p>
        </div>

        <div className="space-y-8">
          {/* Instructions */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">How to upload:</h2>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-semibold text-primary">1.</span>
                <span>Select PDF or EPUB files from your computer</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-semibold text-primary">2.</span>
                <span>Optionally enter a custom title and description</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-semibold text-primary">3.</span>
                <span>The file will be securely stored and accessible from your library</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 font-semibold text-primary">4.</span>
                <span>You can download your books anytime with a secure link</span>
              </li>
            </ol>
          </div>

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Book Title (Optional)
            </label>
            <input
              id="title"
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="Enter a custom title for the book"
              disabled={isLoading}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50"
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              placeholder="Add a description for the book"
              disabled={isLoading}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50 resize-none"
            />
          </div>

          {/* Upload Area */}
          <UploadArea onFilesSelected={handleFilesSelected} isLoading={isLoading} />

          {/* Success Message */}
          {success && (
            <div className="flex items-start gap-3 rounded-lg border border-green-600/50 bg-green-50 p-4 dark:bg-green-900/20">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Success! {uploadedCount} book(s) uploaded successfully.
                </p>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Redirecting to library...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Upload failed</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}