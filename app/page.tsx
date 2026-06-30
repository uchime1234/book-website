'use client'

import { useState, useMemo, useEffect } from 'react'
import { getBooks, searchBooks } from '@/lib/api'
import { SearchBar } from '@/components/SearchBar'
import { BookGrid } from '@/components/BookGrid'

export default function Page() {
  const [books, setBooks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  // Load books only on the client
  useEffect(() => {
    setBooks(getBooks())
    setIsMounted(true)
  }, [])

  const filteredBooks = useMemo(() => {
    if (!isMounted) return []
    if (!searchQuery.trim()) {
      return books
    }
    return searchBooks(searchQuery)
  }, [searchQuery, books, isMounted])

  // Show loading or empty state during hydration
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 animate-fade-in">
            <div className="mb-6 animate-slide-up">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">My Library</h1>
              <p className="text-muted-foreground">Explore your collection of books</p>
            </div>
            <div className="relative">
              <div className="w-full rounded-lg border border-border bg-background px-10 py-3 h-12 animate-pulse bg-muted/20" />
            </div>
          </div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Loading books...</p>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="aspect-[3/4] w-full animate-pulse bg-muted/20" />
                <div className="p-4 space-y-3">
                  <div className="h-6 w-3/4 animate-pulse bg-muted/20 rounded" />
                  <div className="h-4 w-1/2 animate-pulse bg-muted/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in">
          <div className="mb-6 animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">My Library</h1>
            <p className="text-muted-foreground">Explore your collection of books</p>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
          </p>
        </div>

        <BookGrid books={filteredBooks} isEmpty={books.length === 0} />
      </div>
    </main>
  )
}