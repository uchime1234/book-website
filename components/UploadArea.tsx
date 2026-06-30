'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, FileCheck, AlertCircle } from 'lucide-react'

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void
  isLoading?: boolean
  disabled?: boolean
}

export function UploadArea({ onFilesSelected, isLoading = false, disabled = false }: UploadAreaProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_TYPES = ['application/pdf', 'application/epub+zip']
  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

  const validateFiles = (files: File[]): boolean => {
    setError(null)

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only PDF and EPUB files are allowed.`)
        return false
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          `File too large: ${file.name}. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
        )
        return false
      }
    }

    return true
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!disabled && !isLoading) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragActive(true)
      } else if (e.type === 'dragleave') {
        setIsDragActive(false)
      }
    }
  }, [disabled, isLoading])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      if (!disabled && !isLoading) {
        const files = Array.from(e.dataTransfer.files)
        if (validateFiles(files)) {
          setSelectedFiles(files)
          onFilesSelected(files)
        }
      }
    },
    [disabled, isLoading, onFilesSelected]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files ? Array.from(e.currentTarget.files) : []
      if (validateFiles(files)) {
        setSelectedFiles(files)
        onFilesSelected(files)
      }
    },
    [onFilesSelected]
  )

  const handleClick = () => {
    if (!disabled && !isLoading) {
      inputRef.current?.click()
    }
  }

  return (
    <div className="w-full space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-12 transition-all duration-200 cursor-pointer ${
          isLoading || disabled
            ? 'border-border bg-background/50 opacity-50 cursor-not-allowed'
            : isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card'
        }`}
      >
        <div className={`rounded-lg p-4 ${isDragActive ? 'bg-primary/10' : 'bg-primary/5'}`}>
          <Upload className={`h-8 w-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Drag and drop your books here</p>
          <p className="text-sm text-muted-foreground">or click to browse files</p>
        </div>

        <div className="text-xs text-muted-foreground">
          Supported formats: PDF, EPUB • Max size: 100MB
        </div>

        {isLoading && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Uploading...</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.epub"
          onChange={handleChange}
          disabled={isLoading || disabled}
          className="hidden"
          aria-label="Upload books"
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-destructive">{error}</p>
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && !error && (
        <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-green-600" />
            <p className="font-medium text-foreground">{selectedFiles.length} file(s) selected</p>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {selectedFiles.map((file) => (
              <li key={file.name} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
