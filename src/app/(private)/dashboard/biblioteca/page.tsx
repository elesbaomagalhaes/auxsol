'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BibliotecaForm } from '@/components/dashboard/biblioteca/biblioteca-form'
import { BibliotecaList } from '@/components/dashboard/biblioteca/biblioteca-list'
import { BibliotecaViewer } from '@/components/dashboard/biblioteca/biblioteca-viewer'
import { AlertCircle, Library, Plus, RefreshCw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'

interface BibliotecaItem {
  id: string
  descricao: string
  tipo: string
  url: string
  status: string
  createdAt: string
  updatedAt: string
}

interface BibliotecaFormData {
  descricao: string
  tipo: string
  url: string
}

export default function BibliotecaPage() {
  const { data: session, status } = useSession()
  const [bibliotecas, setBibliotecas] = useState<BibliotecaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('list')
  const [editingBiblioteca, setEditingBiblioteca] = useState<BibliotecaItem | null>(null)
  const [viewingBiblioteca, setViewingBiblioteca] = useState<BibliotecaItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect se não autenticado
  if (status === 'unauthenticated') {
    redirect('/login')
  }

  // Carregar bibliotecas
  const loadBibliotecas = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/biblioteca')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar bibliotecas')
      }
      
      setBibliotecas(data)
    } catch (err) {
      console.error('Erro ao carregar bibliotecas:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar bibliotecas')
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar dados na inicialização
  useEffect(() => {
    if (status === 'authenticated') {
      loadBibliotecas()
    }
  }, [status])

  // Criar nova biblioteca
  const handleCreate = async (data: BibliotecaFormData) => {
    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/biblioteca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar biblioteca')
      }
      
      // Recarregar lista
      await loadBibliotecas()
      
      // Toast de sucesso
      toast.success('Biblioteca criada com sucesso!', {
        description: `${data.descricao} foi adicionada à biblioteca.`
      })
      
      // Voltar para a lista
      setActiveTab('list')
    } catch (err) {
      // Toast de erro
      toast.error('Erro ao criar biblioteca', {
        description: err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
      })
      throw err // Propagar erro para o formulário
    } finally {
      setIsSubmitting(false)
    }
  }

  // Editar biblioteca
  const handleEdit = async (data: BibliotecaFormData) => {
    if (!editingBiblioteca) return
    
    try {
      setIsSubmitting(true)
      
      const response = await fetch(`/api/biblioteca/${editingBiblioteca.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao atualizar biblioteca')
      }
      
      // Recarregar lista
      await loadBibliotecas()
      
      // Toast de sucesso
      toast.success('Biblioteca atualizada com sucesso!', {
        description: `${data.descricao} foi atualizada.`
      })
      
      // Limpar edição e voltar para lista
      setEditingBiblioteca(null)
      setActiveTab('list')
    } catch (err) {
      // Toast de erro
      toast.error('Erro ao atualizar biblioteca', {
        description: err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
      })
      throw err // Propagar erro para o formulário
    } finally {
      setIsSubmitting(false)
    }
  }

  // Excluir biblioteca
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/biblioteca/${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao excluir biblioteca')
      }
      
      // Recarregar lista
      await loadBibliotecas()
    } catch (err) {
      console.error('Erro ao excluir biblioteca:', err)
      // Toast de erro
      toast.error('Erro ao excluir biblioteca', {
        description: err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
      })
      setError(err instanceof Error ? err.message : 'Erro ao excluir biblioteca')
    }
  }

  // Iniciar edição
  const startEdit = (biblioteca: BibliotecaItem) => {
    setEditingBiblioteca(biblioteca)
    setActiveTab('form')
  }

  // Cancelar edição
  const cancelEdit = () => {
    setEditingBiblioteca(null)
    setActiveTab('list')
  }

  // Visualizar biblioteca
  const viewBiblioteca = (biblioteca: BibliotecaItem) => {
    setViewingBiblioteca(biblioteca)
  }

  // Criar nova biblioteca
  const createNew = () => {
    setEditingBiblioteca(null)
    setActiveTab('form')
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Library className="h-8 w-8" />
            Biblioteca
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie sua biblioteca de elementos para desenhos e projetos
          </p>
        </div>
      </div>

      {/* Erro global */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadBibliotecas}
                className="ml-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conteúdo principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Lista de Bibliotecas</TabsTrigger>
          <TabsTrigger value="form">
            {editingBiblioteca ? 'Editar Biblioteca' : 'Nova Biblioteca'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <BibliotecaList
            bibliotecas={bibliotecas}
            onEdit={startEdit}
            onDelete={handleDelete}
            onView={viewBiblioteca}
            onCreate={createNew}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          <div className="flex justify-center">
            <BibliotecaForm
              initialData={editingBiblioteca || undefined}
              onSubmit={editingBiblioteca ? handleEdit : handleCreate}
              onCancel={cancelEdit}
              isLoading={isSubmitting}
              className="w-full max-w-2xl"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Visualizador */}
      <BibliotecaViewer
        biblioteca={viewingBiblioteca}
        isOpen={!!viewingBiblioteca}
        onClose={() => setViewingBiblioteca(null)}
        onEdit={startEdit}
      />
    </div>
  )
}