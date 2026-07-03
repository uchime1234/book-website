import { head } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { getBookById } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id
    
    // Get book from your storage
    const book = getBookById(bookId)
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    // Generate a signed URL for the private cover image
    const { url } = await head(book.coverImage)
    
    return NextResponse.json({ 
      coverUrl: url,
    }, { status: 200 })

  } catch (error) {
    console.error('Cover image error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get cover image' },
      { status: 500 }
    )
  }
}