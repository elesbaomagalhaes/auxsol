'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FileText, Image, Download, Trash2, Eye, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Anexo {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  cloudinaryUrl: string
  cloudinaryPublicId: string
  createdAt: string
}

interface AnexosGalleryProps {
  projetoId: string
  refreshTrigger?: number
  onAnexoDeleted?: () => void
}

export function AnexosGallery({ projetoId, refreshTrigger, onAnexoDeleted }: AnexosGalleryProps) {
  const [anexos, setAnexos] = useState<Anexo[]>([])  
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [newItemAnimation, setNewItemAnimation] = useState<string | null>(null)
  const [deletingAnimation, setDeletingAnimation] = useState<string | null>(null)

  const fetchAnexos = async (showAnimation = false) => {
    try {
      const previousCount = anexos.length
      const response = await fetch(`/api/projeto/anexos?projetoId=${projetoId}`)
      const data = await response.json()
      
      if (data.success) {
        const newAnexos = data.anexos
        setAnexos(newAnexos)
        
        // Se há novos anexos e foi solicitada animação
        if (showAnimation && newAnexos.length > previousCount) {
          const newestAnexo = newAnexos[newAnexos.length - 1]
          setNewItemAnimation(newestAnexo.id)
          
          // Remover a animação após 2 segundos
          setTimeout(() => {
            setNewItemAnimation(null)
          }, 2000)
          
          toast.success('Nova imagem adicionada com sucesso!')
        }
      } else {
        toast.error('Erro ao carregar anexos')
      }
    } catch (error) {
      console.error('Erro ao buscar anexos:', error)
      toast.error('Erro ao carregar anexos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (anexoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este anexo?')) {
      return
    }

    // Iniciar animação de exclusão
    setDeleting(anexoId)
    setDeletingAnimation(anexoId)
    
    // Aguardar um pouco para a animação de fade começar
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      const response = await fetch(`/api/projeto/anexos?anexoId=${anexoId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Aguardar a animação de fade-out completar antes de remover do estado
        await new Promise(resolve => setTimeout(resolve, 300))
        
        setAnexos(prev => prev.filter(anexo => anexo.id !== anexoId))
        toast.success('Anexo excluído com sucesso')
        
        // Chamar callback se fornecido
        if (onAnexoDeleted) {
          onAnexoDeleted()
        }
      } else {
        toast.error('Erro ao excluir anexo')
        setDeletingAnimation(null)
      }
    } catch (error) {
      console.error('Erro ao excluir anexo:', error)
      toast.error('Erro ao excluir anexo')
      setDeletingAnimation(null)
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImage = (fileType: string) => {
    return fileType.startsWith('image/')
  }

  useEffect(() => {
    fetchAnexos()
  }, [projetoId])
  
  // Recarregar quando refreshTrigger mudar
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchAnexos(true)
    }
  }, [refreshTrigger])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Medidor de energia
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Medidor de energia
          <Badge variant="secondary">{anexos.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {anexos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma imagem do medidor cadastrada ainda</p>
            <p className="text-sm">Use a seção de upload acima para adicionar imagens</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anexos.map((anexo) => (
              <div
                key={anexo.id}
                className={`border rounded-lg p-4 space-y-3 hover:shadow-md transition-all duration-500 ${
                  newItemAnimation === anexo.id 
                    ? 'bg-green-50 border-green-200 shadow-lg' 
                    : ''
                } ${
                  deletingAnimation === anexo.id
                    ? 'opacity-0 scale-95 transform -translate-y-2 pointer-events-none'
                    : 'opacity-100 scale-100 transform translate-y-0'
                }`}
              >
                {/* Thumbnail */}
                <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg overflow-hidden">
                  {isImage(anexo.fileType) ? (
                    <>
                      <img
                        src={anexo.cloudinaryUrl}
                        alt={anexo.fileName}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          console.error('Erro ao carregar imagem:', anexo.cloudinaryUrl)
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const fallback = target.parentElement?.querySelector('.image-fallback') as HTMLElement
                          if (fallback) {
                            fallback.style.display = 'flex'
                          }
                        }}
                        onLoad={() => {
                          console.log('Imagem carregada com sucesso:', anexo.cloudinaryUrl)
                        }}
                      />
                      <div className="image-fallback flex items-center justify-center" style={{ display: 'none' }}>
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Erro ao carregar imagem</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Informações do arquivo */}
                <div className="space-y-2">
                  <div>
                    <p className="font-medium text-sm truncate" title={anexo.fileName}>
                      {anexo.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {anexo.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                      </Badge>
                      <span>{formatFileSize(anexo.fileSize)}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(anexo.cloudinaryUrl, '_blank')}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Baixar
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(anexo.id)}
                            disabled={deleting === anexo.id}
                            className="hover:bg-transparent"
                          >
                            {deleting === anexo.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
                            ) : (
                              <Trash2 className="h-3 w-3 text-red-500" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-black">
                          Deletar
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}