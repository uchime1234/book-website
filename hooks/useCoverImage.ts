'use client'

import { useState, useEffect } from 'react'

export function useCoverImage(bookId: string, initialUrl: string) {
  const [imageUrl, setImageUrl] = useState<string>(initialUrl)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If it's a local placeholder or already a data URL, use it directly
    if (initialUrl.startsWith('/') || initialUrl.startsWith('data:')) {
      setImageUrl(initialUrl)
      setIsLoading(false)
      return
    }

    // If it's a Vercel Blob URL, fetch a signed URL
    if (initialUrl.includes('blob.vercel-storage.com')) {
      const fetchSignedUrl = async () => {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/cover/${bookId}`)
          
          if (!response.ok) {
            throw new Error('Failed to fetch cover image')
          }
          
          const data = await response.json()
          setImageUrl(data.url)
        } catch (err) {
          console.error('Error loading cover image:', err)
          setError(err instanceof Error ? err.message : 'Failed to load image')
          // Fallback to placeholder
          setImageUrl('/placeholder-book.svg')
        } finally {
          setIsLoading(false)
        }
      }

      fetchSignedUrl()
    } else {
      setIsLoading(false)
    }
  }, [bookId, initialUrl])

  return { imageUrl, isLoading, error }
}