import { head } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

// In-memory store (use your actual database in production)
const getBookById = (id: string) => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('books')
  if (!stored) return null
  const books = JSON.parse(stored)
  return books.find((book: any) => book.id === id) || null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id
    
    // Get book from storage
    // For server-side, we need to access localStorage differently
    // Since this is an API route, we'll use a different approach
    
    // For now, we'll assume the book exists with a cover image
    // You should replace this with your actual database query
    
    // Get the cover image URL from the request
    const url = new URL(request.url)
    const coverUrl = url.searchParams.get('url')
    
    if (!coverUrl) {
      return NextResponse.json(
        { error: 'No cover URL provided' },
        { status: 400 }
      )
    }

    // Generate a signed URL for the private cover image
    // This URL will expire in 1 hour by default
    const { url: signedUrl } = await head(coverUrl)
    
    return NextResponse.json({ 
      url: signedUrl,
    }, { status: 200 })

  } catch (error) {
    console.error('Cover image error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get cover image' },
      { status: 500 }
    )
  }
}