'use client'

import type { Book } from './types'

// Storage key for localStorage
const STORAGE_KEY = 'books'

// Default demo books
const DEFAULT_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    filename: 'great-gatsby.pdf',
    fileSize: 2500000,
    uploadDate: new Date('2024-01-15').toISOString(),
    blobUrl: '',
    description: 'A classic novel by F. Scott Fitzgerald',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    filename: 'mockingbird.pdf',
    fileSize: 1800000,
    uploadDate: new Date('2024-01-20').toISOString(),
    blobUrl: '',
    description: 'A gripping tale of racial injustice and childhood innocence',
  },
  {
    id: '3',
    title: '1984',
    filename: '1984.pdf',
    fileSize: 3200000,
    uploadDate: new Date('2024-02-01').toISOString(),
    blobUrl: '',
    description: 'A dystopian novel about totalitarianism',
  },
]

// Get all books - SSR safe
export function getBooks(): Book[] {
  // Always return default books on the server
  if (typeof window === 'undefined') {
    return DEFAULT_BOOKS
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // If localStorage is empty, use defaults
      if (parsed && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // If parsing fails, return default books
  }
  
  // If no stored books, initialize with defaults
  saveBooks(DEFAULT_BOOKS)
  return DEFAULT_BOOKS
}

// Save books to localStorage
function saveBooks(books: Book[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  } catch (error) {
    console.error('Failed to save books:', error)
  }
}

// Get a single book by ID
export function getBookById(id: string): Book | undefined {
  const books = getBooks()
  return books.find((book) => book.id === id)
}

// Add a book
export function addBook(book: Book): void {
  const books = getBooks()
  books.push(book)
  saveBooks(books)
}

// Delete a book
export function deleteBook(id: string): void {
  const books = getBooks()
  const filtered = books.filter((book) => book.id !== id)
  saveBooks(filtered)
}

// Update a book
export function updateBook(id: string, updates: Partial<Book>): void {
  const books = getBooks()
  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    books[index] = { ...books[index], ...updates }
    saveBooks(books)
  }
}

// Search books
export function searchBooks(query: string): Book[] {
  const books = getBooks()
  const lowerQuery = query.toLowerCase()
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      (book.description && book.description.toLowerCase().includes(lowerQuery)) ||
      book.filename.toLowerCase().includes(lowerQuery)
  )
}

// Upload a book file to Vercel Blob
export async function uploadBookFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Upload failed')
  }

  const { url } = await response.json()
  return url
}

// Get a signed download URL for a book
export async function getDownloadUrl(bookId: string): Promise<string> {
  const response = await fetch(`/api/download/${bookId}`)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to generate download link')
  }

  const { downloadUrl } = await response.json()
  return downloadUrl
}

// Create a new book with uploaded file
export async function createBookWithFile(
  file: File,
  title?: string,
  description?: string
): Promise<Book> {
  // Upload file to Vercel Blob
  const blobUrl = await uploadBookFile(file)
  
  // Create book object
  const newBook: Book = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
    title: title || file.name.replace(/\.[^/.]+$/, ''),
    filename: file.name,
    fileSize: file.size,
    uploadDate: new Date().toISOString(),
    blobUrl: blobUrl,
    description: description || `Uploaded on ${new Date().toLocaleDateString()}`,
  }
  
  // Save to localStorage
  addBook(newBook)
  
  return newBook
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Get total book count
export function getBookCount(): number {
  return getBooks().length
}

// Get total storage used (sum of all file sizes)
export function getTotalStorageUsed(): number {
  const books = getBooks()
  return books.reduce((total, book) => total + book.fileSize, 0)
}

// Force re-sync defaults (useful for resetting)
export function resetToDefaultBooks(): void {
  saveBooks(DEFAULT_BOOKS)
}