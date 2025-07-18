'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, ImageIcon, FileText, X, AlertCircle, CheckCircle } from 'lucide-react'
import { useBibliotecaUpload, BibliotecaUploadedFile } from '@/hooks/use-biblioteca-upload'
import { cn } from '@/lib/utils'

interface BibliotecaUploadProps {
  onFileUploaded?: (file: BibliotecaUploadedFile) => void
  onFilesChange?: (files: BibliotecaUploadedFile[]) => void
  maxFiles?: number
  className?: string
  disabled?: boolean
  acceptedTypes?: string[]
}

export function BibliotecaUpload({ 
  onFileUploaded, 
  onFilesChange, 
  maxFiles = 5, 
  className, 
  disabled = false,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
}: BibliotecaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  
  const {
    files,
    isUploading,
    uploadProgress,
    uploadFile,
    removeFile,
    clearAllFiles,
    error,
  } = useBibliotecaUpload()

  React.useEffect(() => {
    onFilesChange?.(files)
  }, [files, onFilesChange])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (fileList: FileList) => {
    const filesArray = Array.from(fileList)
    
    if (files.length + filesArray.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`)
      return
    }

    for (const file of filesArray) {
      // Validar tipo de arquivo
      if (!acceptedTypes.includes(file.type)) {
        alert(`Tipo de arquivo não permitido: ${file.type}. Use JPG, PNG, GIF, WEBP ou PDF`)
        continue
      }

      try {
        const uploadedFile = await uploadFile(file)
        onFileUploaded?.(uploadedFile)
      } catch (error) {
        console.error('Erro no upload:', error)
      }
    }
  }

  const onButtonClick = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const getAcceptString = () => {
    return acceptedTypes.join(',')
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Área de Upload */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          disabled ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' : 'cursor-pointer',
          !disabled && dragActive ? 'border-primary bg-primary/5' : !disabled && 'border-gray-300 hover:border-gray-400',
          isUploading && 'pointer-events-none opacity-50'
        )}
        onDragEnter={disabled ? undefined : handleDrag}
        onDragLeave={disabled ? undefined : handleDrag}
        onDragOver={disabled ? undefined : handleDrag}
        onDrop={disabled ? undefined : handleDrop}
        onClick={disabled ? undefined : onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={getAcceptString()}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center gap-2">
          <Upload className={`h-8 w-8 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          <div>
            <p className={`text-sm ${disabled ? 'text-gray-400' : 'font-medium'}`}>
              {disabled 
                ? 'Upload desabilitado' 
                : dragActive 
                  ? 'Solte os arquivos aqui' 
                  : 'Clique para selecionar arquivos ou arraste aqui'
              }
            </p>
            {!disabled && (
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, GIF, WEBP, PDF (máx. 10MB cada)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Enviando arquivo...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Arquivos Carregados ({files.length})</h4>
            {files.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFiles}
                className="text-red-600 hover:text-red-700"
                disabled={disabled}
              >
                Limpar Todos
              </Button>
            )}
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {file.type.startsWith('image/') ? (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      <div className="hidden absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      {file.width && file.height && (
                        <span>• {file.width}x{file.height}px</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-700 flex-shrink-0"
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}