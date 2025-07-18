'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Download, 
  Edit, 
  X, 
  ImageIcon, 
  FileText, 
  ExternalLink,
  Calendar,
  Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BibliotecaItem {
  id: string
  descricao: string
  tipo: string
  url: string
  status: string
  createdAt: string
  updatedAt: string
}

interface BibliotecaViewerProps {
  biblioteca: BibliotecaItem | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (biblioteca: BibliotecaItem) => void
  className?: string
}

const TIPO_COLORS = {
  legenda: 'bg-blue-100 text-blue-800',
  figuras: 'bg-green-100 text-green-800',
  personalizado: 'bg-purple-100 text-purple-800'
}

const TIPO_LABELS = {
  legenda: 'Legenda',
  figuras: 'Figuras',
  personalizado: 'Personalizado'
}

export function BibliotecaViewer({ 
  biblioteca, 
  isOpen, 
  onClose, 
  onEdit, 
  className 
}: BibliotecaViewerProps) {
  if (!biblioteca) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadFile = () => {
    const link = document.createElement('a')
    link.href = biblioteca.url
    link.download = biblioteca.descricao
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openInNewTab = () => {
    window.open(biblioteca.url, '_blank')
  }

  const isPdf = biblioteca.url.toLowerCase().includes('.pdf')
  const isImage = !isPdf && /\.(jpg|jpeg|png|gif|webp)$/i.test(biblioteca.url)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('max-w-4xl max-h-[90vh] overflow-hidden', className)}>
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold pr-8">
                {biblioteca.descricao}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-3 mt-2">
                <Badge 
                  variant="secondary" 
                  className={cn('text-xs', TIPO_COLORS[biblioteca.tipo as keyof typeof TIPO_COLORS])}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {TIPO_LABELS[biblioteca.tipo as keyof typeof TIPO_LABELS] || biblioteca.tipo}
                </Badge>
                <span className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(biblioteca.createdAt)}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-hidden">
          {/* Preview do arquivo */}
          <div className="mb-6">
            {isPdf ? (
              <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Documento PDF</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Clique em "Abrir em Nova Aba" para visualizar o documento
                </p>
                <div className="flex gap-2">
                  <Button onClick={openInNewTab} variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir em Nova Aba
                  </Button>
                  <Button onClick={downloadFile} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : isImage ? (
              <div className="relative group">
                <img
                  src={biblioteca.url}
                  alt={biblioteca.descricao}
                  className="w-full max-h-96 object-contain rounded-lg border bg-white"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg border">
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Erro ao carregar imagem</p>
                  </div>
                </div>
                
                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button onClick={openInNewTab} variant="secondary" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir
                    </Button>
                    <Button onClick={downloadFile} variant="secondary" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                <FileText className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Arquivo</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Clique em "Download" para baixar o arquivo
                </p>
                <Button onClick={downloadFile} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Informações</h4>
              <div className="space-y-1 text-gray-600">
                <p><span className="font-medium">Tipo:</span> {TIPO_LABELS[biblioteca.tipo as keyof typeof TIPO_LABELS] || biblioteca.tipo}</p>
                <p><span className="font-medium">Status:</span> {biblioteca.status === 'a' ? 'Ativo' : 'Inativo'}</p>
                <p><span className="font-medium">Criado em:</span> {formatDate(biblioteca.createdAt)}</p>
                {biblioteca.updatedAt !== biblioteca.createdAt && (
                  <p><span className="font-medium">Atualizado em:</span> {formatDate(biblioteca.updatedAt)}</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Arquivo</h4>
              <div className="space-y-1 text-gray-600">
                <p><span className="font-medium">URL:</span> 
                  <a 
                    href={biblioteca.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 ml-1 break-all"
                  >
                    {biblioteca.url.length > 50 ? `${biblioteca.url.substring(0, 50)}...` : biblioteca.url}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações do rodapé */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-2">
            <Button onClick={downloadFile} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={openInNewTab} variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir em Nova Aba
            </Button>
          </div>
          
          <div className="flex gap-2">
            {onEdit && (
              <Button onClick={() => onEdit(biblioteca)} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            <Button onClick={onClose} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}