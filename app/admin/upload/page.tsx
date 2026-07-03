'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { addBook, isAdminAuthenticated } from '@/lib/api'
import type { BookFormData } from '@/lib/types'
import { ArrowLeft, Upload, Image, Link as LinkIcon, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'

export default function AdminUploadPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    downloadLink: '',
  })

  // Check admin authentication
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
    }
  }, [router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG, WEBP, or SVG)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required')
      }
      if (!imageFile) {
        throw new Error('Cover image is required')
      }
      if (!formData.downloadLink.trim()) {
        throw new Error('Download link is required')
      }

      // Validate download link URL
      try {
        new URL(formData.downloadLink)
      } catch {
        throw new Error('Please enter a valid download link URL')
      }

      // Create book data with image file
      const bookData: BookFormData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        coverImage: imageFile,
        downloadLink: formData.downloadLink.trim(),
      }

      // Add book with image upload to Vercel Blob
      await addBook(bookData)

      setSuccess(true)
      setFormData({
        title: '',
        description: '',
        downloadLink: '',
      })
      removeImage()

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add book')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Add New Book</h1>
            <p className="text-muted-foreground">Add a new book to your library with a cover image</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Book Title *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter the book title"
                required
                aria-label="Book title"
                className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter a description for the book"
              required
              rows={4}
              aria-label="Book description"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Image *
            </label>
            <div className="flex items-start gap-6">
              {/* Upload Area */}
              <div className="flex-1">
                <div 
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    imagePreview ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="coverImage"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                    aria-label="Upload cover image"
                  />
                  <Image className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {imagePreview ? 'Click to change image' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPEG, PNG, WEBP, SVG • Max 5MB
                  </p>
                  {imageFile && (
                    <p className="text-xs text-green-600 mt-2">
                      Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)}KB)
                    </p>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="w-32 flex-shrink-0">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-32 h-48 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-48 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/20">
                    <span className="text-xs text-muted-foreground text-center px-2">
                      No image selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Download Link */}
          <div>
            <label htmlFor="downloadLink" className="block text-sm font-medium text-foreground mb-2">
              Download Link *
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="downloadLink"
                name="downloadLink"
                type="url"
                value={formData.downloadLink}
                onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
                placeholder="https://example.com/book-download"
                required
                aria-label="Download link URL"
                className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Enter the URL where users can download the book
            </p>
          </div>

          {/* Preview Section */}
          {formData.title && formData.description && imagePreview && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-medium text-foreground mb-4">Preview</h3>
              <div className="flex items-start gap-6">
                <div className="w-32 h-48 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{formData.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {formData.description || 'No description provided'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 truncate">
                    Download: {formData.downloadLink || 'Not set'}
                  </p>
                  {imageFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Image: {imageFile.name} ({Math.round(imageFile.size / 1024)}KB)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-start gap-3 rounded-lg border border-green-600/50 bg-green-50 p-4 dark:bg-green-900/20">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Book added successfully!
                </p>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Redirecting to library...
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || success}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isLoading ? 'Adding Book...' : 'Add Book'}
          </button>
        </form>
      </div>
    </main>
  )
}