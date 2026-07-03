'use client'

import Link from 'next/link'
import { Book } from '@/lib/types'
import { formatDate } from '@/lib/api'
import { Calendar, ExternalLink } from 'lucide-react'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 animate-scale-in">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-book.svg'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        {/* Book Info */}
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