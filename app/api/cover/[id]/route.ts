import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url)
    const coverUrl = url.searchParams.get('url')
    
    console.log('🖼️ Cover URL requested:', coverUrl)
    
    if (!coverUrl) {
      return NextResponse.json(
        { error: 'No cover URL provided' },
        { status: 400 }
      )
    }

    // For public Vercel Blob URLs, return them directly
    // No signed URL needed since they're public
    return NextResponse.json({ 
      url: coverUrl,
    }, { status: 200 })

  } catch (error) {
    console.error('Cover image error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get cover image' },
      { status: 500 }
    )
  }
}