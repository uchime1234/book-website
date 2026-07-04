export interface Book {
  id: string
  title: string
  description: string
  coverImage: string
  coverImageName?: string
  coverImageSize?: number
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

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface BookWithDownload extends Book {
  isDownloading?: boolean
}