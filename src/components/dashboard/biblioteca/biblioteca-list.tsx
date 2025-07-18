'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  ImageIcon,
  FileText,
  Plus
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

interface BibliotecaListProps {
  bibliotecas: BibliotecaItem[]
  onEdit: (biblioteca: BibliotecaItem) => void
  onDelete: (id: string) => Promise<void>
  onView: (biblioteca: BibliotecaItem) => void
  onCreate: () => void
  isLoading?: boolean
  className?: string
}

const TIPOS_BIBLIOTECA = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'legenda', label: 'Legenda' },
  { value: 'figuras', label: 'Figuras' },
  { value: 'personalizado', label: 'Personalizado' }
]

const TIPO_COLORS = {
  legenda: 'bg-blue-100 text-blue-800',
  figuras: 'bg-green-100 text-green-800',
  personalizado: 'bg-purple-100 text-purple-800'
}

export function BibliotecaList({ 
  bibliotecas, 
  onEdit, 
  onDelete, 
  onView, 
  onCreate, 
  isLoading = false, 
  className 
}: BibliotecaListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('todos')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filtrar bibliotecas
  const filteredBibliotecas = bibliotecas.filter(biblioteca => {
    const matchesSearch = biblioteca.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = filterTipo === 'todos' || biblioteca.tipo === filterTipo
    return matchesSearch && matchesTipo
  })

  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    try {
      await onDelete(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error('Erro ao excluir biblioteca:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const getTipoLabel = (tipo: string) => {
    const tipoObj = TIPOS_BIBLIOTECA.find(t => t.value === tipo)
    return tipoObj?.label || tipo
  }

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header com filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Busca */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro por tipo */}
          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_BIBLIOTECA.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão Novo */}
        <Button onClick={onCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nova Biblioteca
        </Button>
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-muted-foreground">
        {filteredBibliotecas.length} {filteredBibliotecas.length === 1 ? 'item encontrado' : 'itens encontrados'}
      </div>

      {/* Lista de bibliotecas */}
      {isLoading ? (
        <div className="grid grid-cols-12 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBibliotecas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterTipo !== 'todos' ? 'Nenhum resultado encontrado' : 'Nenhuma biblioteca cadastrada'}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm || filterTipo !== 'todos' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece criando sua primeira biblioteca de elementos'
              }
            </p>
            {(!searchTerm && filterTipo === 'todos') && (
              <Button onClick={onCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Biblioteca
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {filteredBibliotecas.map((biblioteca) => (
            <Card key={biblioteca.id} className="hover:shadow-md transition-shadow col-span-3">
              <CardHeader className="pb-1">
                 <div className="flex items-start justify-between">
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mt-1.5">
                       <Badge 
                         variant="secondary" 
                         className={cn('text-xs', TIPO_COLORS[biblioteca.tipo as keyof typeof TIPO_COLORS])}
                       >
                         {getTipoLabel(biblioteca.tipo)}
                       </Badge>
                     </div>
                   </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(biblioteca)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadFile(biblioteca.url, biblioteca.descricao)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(biblioteca)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteId(biblioteca.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="flex flex-col items-center">
                {/* Preview da imagem */}
                {biblioteca.url && (
                  <div className="aspect-square h-12 w-12 bg-white rounded-lg overflow-hidden mb-1 flex-shrink-0">
                    {biblioteca.url.includes('.pdf') ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-500">PDF</span>
                      </div>
                    ) : (
                      <img
                        src={biblioteca.url}
                        alt={biblioteca.descricao}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => onView(biblioteca)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    )}
                  </div>
                )}
                
                {/* Descrição */}
                <p className="text-xs text-muted-foreground text-center truncate">
                  {biblioteca.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item da biblioteca? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}