export interface Book {
  id: string
  title: string
  filename: string
  fileSize: number
  uploadDate: string
  blobUrl: string // Private blob URL from Vercel Blob
  coverImageUrl?: string
  description?: string
}

export interface BookFormData {
  title: string
  file: File
  description?: string
}

// For API responses
export interface UploadResponse {
  url: string
  downloadUrl?: string
}

export interface DownloadResponse {
  downloadUrl: string
  filename: string
}

// For the book detail page with download info
export interface BookWithDownload extends Book {
  downloadUrl?: string
  isDownloading?: boolean
}