'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BibliotecaUpload } from '@/components/ui/biblioteca-upload'
import { BibliotecaUploadedFile } from '@/hooks/use-biblioteca-upload'
import { AlertCircle, CheckCircle, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BibliotecaFormData {
  descricao: string
  tipo: string
  url: string
}

interface BibliotecaFormProps {
  initialData?: Partial<BibliotecaFormData>
  onSubmit: (data: BibliotecaFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

const TIPOS_BIBLIOTECA = [
  { value: 'legenda', label: 'Legenda' },
  { value: 'figuras', label: 'Figuras' },
  { value: 'personalizado', label: 'Personalizado' }
]

export function BibliotecaForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  className 
}: BibliotecaFormProps) {
  const [formData, setFormData] = useState<BibliotecaFormData>({
    descricao: initialData?.descricao || '',
    tipo: initialData?.tipo || '',
    url: initialData?.url || ''
  })
  
  const [uploadedFile, setUploadedFile] = useState<BibliotecaUploadedFile | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof BibliotecaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleFileUploaded = (file: BibliotecaUploadedFile) => {
    setUploadedFile(file)
    setFormData(prev => ({ ...prev, url: file.url }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validações
    if (!formData.descricao.trim()) {
      setError('Descrição é obrigatória')
      return
    }

    if (!formData.tipo) {
      setError('Tipo é obrigatório')
      return
    }

    if (!formData.url.trim()) {
      setError('É necessário fazer upload de um arquivo')
      return
    }

    try {
      await onSubmit(formData)
      
      // Limpar formulário após sucesso
      if (!initialData) {
        setFormData({ descricao: '', tipo: '', url: '' })
        setUploadedFile(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar biblioteca')
    }
  }

  const handleCancel = () => {
    setFormData({
      descricao: initialData?.descricao || '',
      tipo: initialData?.tipo || '',
      url: initialData?.url || ''
    })
    setUploadedFile(null)
    setError(null)
    onCancel?.()
  }

  return (
    <Card className={cn('w-full max-w-2xl', className)}>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Biblioteca' : 'Nova Biblioteca'}
        </CardTitle>
        <CardDescription>
          {initialData 
            ? 'Atualize as informações da biblioteca'
            : 'Adicione um novo item à sua biblioteca de elementos'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Descrição e Tipo na mesma linha */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                placeholder="Nome do elemento..."
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="col-span-4 space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => handleInputChange('tipo', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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
          </div>

          {/* Upload de Arquivo - Mais compacto */}
          <div className="space-y-1">
            <Label className="text-sm">Arquivo *</Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3">
              <BibliotecaUpload
                onFileUploaded={handleFileUploaded}
                maxFiles={1}
                disabled={isLoading}
                className="min-h-[80px]"
              />
            </div>
            {formData.url && (
              <div className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Arquivo carregado com sucesso
              </div>
            )}
          </div>

          {/* URL (somente leitura) */}
          {formData.url && (
            <div className="space-y-2">
              <Label htmlFor="url">URL do Arquivo</Label>
              <Input
                id="url"
                value={formData.url}
                readOnly
                className="bg-gray-50 text-gray-600"
              />
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-black hover:bg-gray-800 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}