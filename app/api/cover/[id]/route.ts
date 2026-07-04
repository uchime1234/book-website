import { head } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = new URL(request.url)
    const coverUrl = url.searchParams.get('url')
    
    if (!coverUrl) {
      return NextResponse.json(
        { error: 'No cover URL provided' },
        { status: 400 }
      )
    }

    // If it's a placeholder or data URL, return it directly
    if (coverUrl.startsWith('/') || coverUrl.startsWith('data:')) {
      return NextResponse.json({ 
        url: coverUrl,
      }, { status: 200 })
    }

    // Generate a signed URL for the private cover image
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