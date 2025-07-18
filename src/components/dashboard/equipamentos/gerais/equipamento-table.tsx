'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Edit, Trash2, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Equipamento {
  id: string
  descricao: string
  tipo: string
  potencia: number
  fatorPotencia: number
  tensao: number
  createdAt: string
}

const tiposEquipamento: Record<string, string> = {
  iluminacao: 'Iluminação',
  refrigeracao: 'Refrigeração',
  aquecimento: 'Aquecimento',
  ventilacao: 'Ventilação',
  eletrodomestico: 'Eletrodoméstico',
  equipamento_industrial: 'Equipamento Industrial',
  motor: 'Motor',
  outros: 'Outros',
}

export function EquipamentoTable() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchEquipamentos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/equipamentos/gerais')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar equipamentos')
      }
      
      const data = await response.json()
      setEquipamentos(data)
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error)
      toast.error('Erro ao carregar equipamentos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, descricao: string) => {
    if (!confirm(`Tem certeza que deseja remover o equipamento "${descricao}"?`)) {
      return
    }

    try {
      setDeletingId(id)
      const response = await fetch(`/api/equipamentos/gerais?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover equipamento')
      }

      toast.success('Equipamento removido com sucesso')
      await fetchEquipamentos()
    } catch (error) {
      console.error('Erro ao remover equipamento:', error)
      toast.error('Erro ao remover equipamento')
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    fetchEquipamentos()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando equipamentos...</span>
      </div>
    )
  }

  if (equipamentos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          Nenhum equipamento cadastrado
        </div>
        <Button asChild>
          <Link href="/dashboard/equipamentos/gerais/novo">
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Primeiro Equipamento
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Potência (W)</TableHead>
            <TableHead>Fator de Potência</TableHead>
            <TableHead>Tensão (V)</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipamentos.map((equipamento) => (
            <TableRow key={equipamento.id}>
              <TableCell className="font-medium">
                {equipamento.descricao}
              </TableCell>
              <TableCell>
                {tiposEquipamento[equipamento.tipo] || equipamento.tipo}
              </TableCell>
              <TableCell>
                {Number(equipamento.potencia).toFixed(2)}
              </TableCell>
              <TableCell>
                {Number(equipamento.fatorPotencia).toFixed(2)}
              </TableCell>
              <TableCell>
                {Number(equipamento.tensao).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/dashboard/equipamentos/gerais/${equipamento.id}/editar`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(equipamento.id, equipamento.descricao)}
                          disabled={deletingId === equipamento.id}
                          className="hover:bg-transparent"
                        >
                          {deletingId === equipamento.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="text-black">
                        Deletar
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}