'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, CloudUpload, ImageIcon, FileText, X, AlertCircle } from 'lucide-react'
import { useFileUpload, UploadedFile } from '@/hooks/use-file-upload'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFilesChange?: (files: UploadedFile[]) => void
  maxFiles?: number
  className?: string
  projetoId?: string
  onSaveSuccess?: () => void
  disabled?: boolean
}

export function FileUpload({ onFilesChange, maxFiles = 10, className, projetoId, onSaveSuccess, disabled = false }: FileUploadProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
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
  } = useFileUpload()

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
      await uploadFile(file)
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

  const handleSaveAttachments = async () => {
    if (!projetoId || files.length === 0) return

    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/projeto/anexos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projetoId,
          anexos: files.map(file => ({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            url: file.url,
            publicId: file.publicId,
          }))
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar anexos')
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      
      // Notificar o componente pai sobre o sucesso do salvamento
      onSaveSuccess?.()
      
      // Limpar os arquivos após salvar com sucesso
      clearAllFiles()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Erro ao salvar anexos')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Área de Upload */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center transition-colors',
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
          accept="image/*,.pdf"
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center gap-1">
          <ImageIcon className={`h-6 w-6 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          <p className={`text-sm ${disabled ? 'text-gray-400' : 'font-medium'}`}>
            {disabled 
              ? 'Upload desabilitado' 
              : dragActive 
                ? 'Solte os arquivos aqui' 
                : 'Clique para selecionar arquivos'
            }
          </p>
          {!disabled && (
            <p className="text-xs text-muted-foreground">
              JPG, PNG, PDF (máx. 10MB)
            </p>
          )}
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

      {/* Erro de Salvamento */}
      {saveError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{saveError}</span>
        </div>
      )}

      {/* Sucesso */}
      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <span className="text-sm">Anexos salvos com sucesso!</span>
        </div>
      )}

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
eti            <h4 className="text-sm font-medium">Arquivos Anexados ({files.length})</h4>
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
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
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
            ))}
          </div>

          {/* Botão de Salvar */}
          {projetoId && files.length > 0 && (
            <div className="pt-2 border-t">
              <Button
                onClick={handleSaveAttachments}
                disabled={isSaving || disabled}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <CloudUpload className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Anexos'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}