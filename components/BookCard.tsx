'use client'

import Link from 'next/link'
import { Book } from '@/lib/types'
import { formatDate } from '@/lib/api'
import { Calendar, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('/placeholder-book.svg')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadImage() {
      try {
        const coverImage = book.coverImage
        
        if (!coverImage || coverImage.startsWith('/') || coverImage.startsWith('data:')) {
          setImageUrl(coverImage || '/placeholder-book.svg')
          setIsLoading(false)
          return
        }

        if (coverImage.includes('blob.vercel-storage.com')) {
          const response = await fetch(`/api/cover/${book.id}?url=${encodeURIComponent(coverImage)}`)
          if (response.ok) {
            const data = await response.json()
            setImageUrl(data.url)
          } else {
            setImageUrl('/placeholder-book.svg')
          }
        } else {
          setImageUrl(coverImage)
        }
      } catch (error) {
        console.error('Failed to load image:', error)
        setImageUrl('/placeholder-book.svg')
      } finally {
        setIsLoading(false)
      }
    }

    loadImage()
  }, [book.id, book.coverImage])

  return (
    <Link href={`/book/${book.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 animate-scale-in">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted/20 animate-pulse">
              <div className="text-muted-foreground text-sm">Loading...</div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-book.svg'
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight text-card-foreground group-hover:text-primary transition-colors">
            {book.title}
          </h3>

          <p className="line-clamp-2 text-sm text-muted-foreground">{book.description}</p>

          <div className="space-y-2 border-t border-border/50 pt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <span>Download Available</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(book.createdAt)}</span>
            </div>
          </div>

          <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground">
              View & Download
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}