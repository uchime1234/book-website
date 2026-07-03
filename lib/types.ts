export interface Book {
  id: string
  title: string
  description: string
  coverImage: string // Blob URL for the cover image
  coverImageName?: string // Original filename
  coverImageSize?: number // File size in bytes
  downloadLink: string
  createdAt: string
  updatedAt?: string
}

export interface BookFormData {
  title: string
  description: string
  coverImage: File
  downloadLink: string
}

export interface UploadResponse {
  url: string
  metadata: {
    filename: string
    size: number
    contentType: string
  }
}

// For API responses
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// For the book detail page
export interface BookWithDownload extends Book {
  isDownloading?: boolean
}