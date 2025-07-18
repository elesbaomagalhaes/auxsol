"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, Edit, MoreHorizontal, User, Zap, Settings, UserCheck, FileBadge, MapPinned, Upload, ChevronDown, Loader2, ImageIcon, CheckCircle2, HousePlug } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { ProjetoData } from "@/types/projeto"
import { toast } from "sonner"
import Link from "next/link"

interface ProjetoTableProps {
  data: ProjetoData[]
}

export function ProjetoTable({ data }: ProjetoTableProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedProjetoId, setSelectedProjetoId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleEnviarDesenho = (projetoId: string) => {
    setSelectedProjetoId(projetoId)
    setIsUploadDialogOpen(true)
    setUploadError(null)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedProjetoId) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/projeto/${selectedProjetoId}/upload-mapa`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao fazer upload')
      }

      const result = await response.json()
      console.log('Upload realizado com sucesso:', result)
      
      // Mostrar toast de sucesso
      toast.success(
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              Desenho enviado com sucesso!
            </div>
            <div className="text-sm text-gray-600">
              A planta de localização foi salva no projeto.
            </div>
          </div>
        </div>,
        {
          duration: 4000,
        }
      )
      
      // Fechar o dialog e resetar estados
      setIsUploadDialogOpen(false)
      setSelectedProjetoId(null)
      
      // Recarregar a página para atualizar os dados
      window.location.reload()
    } catch (error) {
      console.error('Erro no upload:', error)
      setUploadError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="rounded-md border overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm">Projeto</TableHead>
              <TableHead className="min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm">Cliente</TableHead>
              <TableHead className="min-w-[120px] hidden sm:table-cell text-xs sm:text-sm">Localização</TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell text-xs sm:text-sm">P. Gerador</TableHead>
              <TableHead className="text-right min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm">Ações</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                Nenhum projeto encontrado
              </TableCell>
            </TableRow>
          ) : (
            data.map((projeto) => (
              <TableRow key={projeto.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium py-2 sm:py-4">
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {projeto.numProjeto || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 sm:py-4">
                  <div className="space-y-1">
                    <div className="font-medium text-xs sm:text-sm leading-tight">{projeto.cliente.nome}</div>
                    <div className="text-xs text-muted-foreground sm:hidden leading-tight">
                      {projeto.cliente.cidade}, {projeto.cliente.uf}
                    </div>
                    {projeto.tecnico && (
                      <div className="text-xs text-muted-foreground leading-tight">
                        CPF: {projeto.cliente.cpf}
                      </div>
                    )}
                    <div className="flex gap-1 md:hidden flex-wrap mt-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5">
                        G: {projeto.potenciaGeradorTotal}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell py-2 sm:py-4">
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm leading-tight">
                      {projeto.cliente.cidade}, {projeto.cliente.uf}
                    </div>
                    {projeto.tecnico && (
                      <div className="text-xs text-muted-foreground leading-tight">
                        Técnico: {projeto.tecnico.nome}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell py-2 sm:py-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 py-1">
                    {projeto.potenciaGeradorTotal} kWp
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-2 sm:py-4">
                  <div className="flex items-center justify-end gap-1 sm:gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-9 sm:w-9 hover:bg-muted transition-colors"
                      title="Visualizar projeto"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-9 sm:w-9 hover:bg-muted transition-colors"
                      title="Carga da UC"
                    >
                      <Link href={`/dashboard/carga?projeto=${projeto.id}`}>
                        <HousePlug className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 sm:h-9 sm:w-9 hover:bg-muted transition-colors"
                      title="Gerar documentação para homologação"
                    >
                      <Link href={`/dashboard/projeto/documentacao/${projeto.id}`}>
                        <FileBadge className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-9 sm:w-9 hover:bg-muted transition-colors"
                          title="Planta de localização"
                        >
                          <MapPinned className="h-3 w-3 sm:h-4 sm:w-4" />
                          <ChevronDown className="h-2 w-2 ml-0.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/projeto/planta-localizacao/${projeto.id}`} className="flex items-center gap-2 text-sm">
                            <MapPinned className="h-3 w-3 sm:h-4 sm:w-4" />
                            Desenhar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleEnviarDesenho(projeto.id)}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                          Enviar Desenho
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-9 sm:w-9 hover:bg-muted transition-colors"
                          title="Ações de edição"
                        >
                          <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/projeto/editar/${projeto.id}/cliente`} className="flex items-center gap-2 text-sm">
                            <User className="h-3 w-3 sm:h-4 sm:w-4" />
                            Cliente
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/projeto/editar/${projeto.id}/acesso`} className="flex items-center gap-2 text-sm">
                            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                            Acesso
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/projeto/editar/${projeto.id}/equipamentos`} className="flex items-center gap-2 text-sm">
                            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                            Equipamentos
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/projeto/editar/${projeto.id}/engenheiro`} className="flex items-center gap-2 text-sm">
                            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                            Engenheiro
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        </Table>
      </div>

      {/* Dialog de Upload de Desenho */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-blue-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Enviar Desenho da Planta
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Faça upload de uma imagem da planta de localização do projeto.
              Formatos aceitos: PNG, JPG, JPEG
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
                Selecionar Arquivo
              </Label>
              <div className="relative">
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/png,image/jpg,image/jpeg"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500">
                Tamanho máximo: 10MB • Formatos: PNG, JPG, JPEG
              </p>
            </div>
            
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Erro no upload</h4>
                    <p className="text-sm text-red-700 mt-1">{uploadError}</p>
                  </div>
                </div>
              </div>
            )}
            
            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Enviando arquivo...</p>
                    <p className="text-xs text-blue-700">Por favor, aguarde enquanto processamos sua imagem.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
              disabled={isUploading}
              className="px-4 py-2"
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}