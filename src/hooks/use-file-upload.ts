'use client'

import { useState, useCallback } from 'react'

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  publicId: string
}

export interface UseFileUploadReturn {
  files: UploadedFile[]
  isUploading: boolean
  uploadProgress: number
  uploadFile: (file: File) => Promise<void>
  removeFile: (id: string) => Promise<void>
  clearAllFiles: () => void
  error: string | null
}

export function useFileUpload(): UseFileUploadReturn {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (file: File) => {
    console.log('Iniciando upload do arquivo:', file.name, 'Tipo:', file.type, 'Tamanho:', file.size)
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/projeto/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      console.log('Resposta do upload:', result)

      if (!response.ok) {
        console.error('Erro no upload:', result.error)
        throw new Error(result.error || 'Erro no upload')
      }

      const newFile: UploadedFile = {
        id: result.publicId,
        name: result.fileName,
        size: result.fileSize,
        type: result.fileType,
        url: result.url,
        publicId: result.publicId,
      }

      console.log('Arquivo uploadado com sucesso:', newFile)
      setFiles(prev => [...prev, newFile])
      setUploadProgress(100)
    } catch (err) {
      console.error('Erro durante o upload:', err)
      setError(err instanceof Error ? err.message : 'Erro no upload')
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [])

  const removeFile = useCallback(async (id: string) => {
    try {
      const fileToRemove = files.find(f => f.id === id)
      if (!fileToRemove) return

      const response = await fetch(`/api/projeto/upload?publicId=${fileToRemove.publicId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover arquivo')
      }

      setFiles(prev => prev.filter(f => f.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover arquivo')
    }
  }, [files])

  const clearAllFiles = useCallback(() => {
    // Remove todos os arquivos do Cloudinary
    files.forEach(file => {
      fetch(`/api/projeto/upload?publicId=${file.publicId}`, {
        method: 'DELETE',
      }).catch(console.error)
    })
    
    setFiles([])
    setError(null)
  }, [files])

  return {
    files,
    isUploading,
    uploadProgress,
    uploadFile,
    removeFile,
    clearAllFiles,
    error,
  }
}