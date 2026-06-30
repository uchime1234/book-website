'use client'

import { Book } from '@/lib/types'
import { BookCard } from './BookCard'

interface BookGridProps {
  books: Book[]
  isEmpty?: boolean
}

export function BookGrid({ books, isEmpty }: BookGridProps) {
  if (isEmpty && books.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-lg border border-dashed border-border bg-card/50">
        <div className="text-center">
          <p className="text-lg font-medium text-card-foreground">No books found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or upload a new book</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
