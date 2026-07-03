'use client'

import type { Book, BookFormData } from './types'

// Storage key for localStorage
const STORAGE_KEY = 'books'
const ADMIN_SESSION_KEY = 'admin_session'

// Default demo books with placeholder images
const DEFAULT_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    description: 'A classic novel by F. Scott Fitzgerald about the American dream, love, and tragedy in the Jazz Age.',
    coverImage: '/placeholder-book.svg',
    downloadLink: 'https://www.gutenberg.org/ebooks/64317',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    description: 'A gripping tale of racial injustice and childhood innocence set in the American South.',
    coverImage: '/placeholder-book.svg',
    downloadLink: 'https://www.gutenberg.org/ebooks/12345',
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '3',
    title: '1984',
    description: 'A dystopian novel about totalitarianism, surveillance, and the power of truth.',
    coverImage: '/placeholder-book.svg',
    downloadLink: 'https://www.gutenberg.org/ebooks/67890',
    createdAt: new Date('2024-02-01').toISOString(),
  },
]

// Admin credentials from environment variables
const ADMIN_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123',
}

// ============ Book CRUD Operations ============

// Get all books - SSR safe
export function getBooks(): Book[] {
  if (typeof window === 'undefined') {
    return DEFAULT_BOOKS
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
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

// Upload cover image to Vercel Blob
async function uploadCoverImage(file: File): Promise<{ url: string; filename: string; size: number }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Image upload failed')
  }

  return await response.json()
}

// Add a new book with cover image upload
export async function addBook(bookData: BookFormData): Promise<Book> {
  const books = getBooks()
  
  // Upload cover image to Vercel Blob
  const { url, filename, size } = await uploadCoverImage(bookData.coverImage)
  
  const newBook: Book = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
    title: bookData.title.trim(),
    description: bookData.description.trim(),
    coverImage: url,
    coverImageName: filename,
    coverImageSize: size,
    downloadLink: bookData.downloadLink.trim(),
    createdAt: new Date().toISOString(),
  }
  
  books.push(newBook)
  saveBooks(books)
  return newBook
}

// Update a book
export async function updateBook(id: string, updates: Partial<BookFormData>): Promise<Book | null> {
  const books = getBooks()
  const index = books.findIndex((book) => book.id === id)
  if (index === -1) return null
  
  let updatedData: Partial<Book> = {}
  
  // Handle text fields
  if (updates.title) updatedData.title = updates.title.trim()
  if (updates.description) updatedData.description = updates.description.trim()
  if (updates.downloadLink) updatedData.downloadLink = updates.downloadLink.trim()
  
  // If there's a new cover image, upload it to Vercel Blob
  if (updates.coverImage && updates.coverImage instanceof File) {
    const { url, filename, size } = await uploadCoverImage(updates.coverImage)
    updatedData.coverImage = url
    updatedData.coverImageName = filename
    updatedData.coverImageSize = size
  }
  
  updatedData.updatedAt = new Date().toISOString()
  
  const updatedBook = {
    ...books[index],
    ...updatedData,
  }
  
  books[index] = updatedBook
  saveBooks(books)
  return updatedBook
}

// Delete a book
export function deleteBook(id: string): void {
  const books = getBooks()
  const filtered = books.filter((book) => book.id !== id)
  saveBooks(filtered)
}

// Search books
export function searchBooks(query: string): Book[] {
  const books = getBooks()
  const lowerQuery = query.toLowerCase()
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.description.toLowerCase().includes(lowerQuery)
  )
}

// ============ Admin Authentication ============

export function loginAdmin(username: string, password: string): boolean {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true')
    }
    return true
  }
  return false
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
}

// Get current admin username (for display purposes)
export function getAdminUsername(): string {
  return ADMIN_CREDENTIALS.username
}

// ============ Utility Functions ============

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Get book count
export function getBookCount(): number {
  return getBooks().length
}

// Validate URL
export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

// Reset to default books (useful for testing)
export function resetToDefaultBooks(): void {
  saveBooks(DEFAULT_BOOKS)
}

// Clear all books
export function clearAllBooks(): void {
  saveBooks([])
}