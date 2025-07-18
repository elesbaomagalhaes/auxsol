'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Equipamento {
  id?: string
  descricao: string
  tipo: string
  potencia: number
  fatorPotencia: number
  tensao: number
}

interface EquipamentoFormProps {
  equipamento?: Equipamento
}

const tiposEquipamento = [
  { value: 'iluminacao', label: 'Iluminação' },
  { value: 'refrigeracao', label: 'Refrigeração' },
  { value: 'aquecimento', label: 'Aquecimento' },
  { value: 'ventilacao', label: 'Ventilação' },
  { value: 'eletrodomestico', label: 'Eletrodoméstico' },
  { value: 'equipamento_industrial', label: 'Equipamento Industrial' },
  { value: 'motor', label: 'Motor' },
  { value: 'outros', label: 'Outros' },
]

export function EquipamentoForm({ equipamento }: EquipamentoFormProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    descricao: equipamento?.descricao || '',
    tipo: equipamento?.tipo || '',
    potencia: equipamento?.potencia || 1,
    fatorPotencia: equipamento?.fatorPotencia || 0.8,
    tensao: equipamento?.tensao || 220,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validação básica no frontend
      if (!formData.descricao.trim()) {
        throw new Error('Descrição é obrigatória')
      }
      if (!formData.tipo) {
        throw new Error('Tipo é obrigatório')
      }
      if (formData.potencia <= 0) {
        throw new Error('Potência deve ser maior que zero')
      }
      if (formData.fatorPotencia <= 0 || formData.fatorPotencia > 1) {
        throw new Error('Fator de potência deve estar entre 0 e 1')
      }
      if (formData.tensao <= 0) {
        throw new Error('Tensão deve ser maior que zero')
      }

      const url = equipamento?.id 
        ? `/api/equipamentos/gerais/${equipamento.id}`
        : '/api/equipamentos/gerais'
      
      const method = equipamento?.id ? 'PUT' : 'POST'
      
      // Garantir que os números sejam enviados corretamente
      const dataToSend = {
        ...formData,
        potencia: Number(formData.potencia),
        fatorPotencia: Number(formData.fatorPotencia),
        tensao: Number(formData.tensao),
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Erro da API:', error)
        throw new Error(error.error || 'Erro ao salvar equipamento')
      }

      toast.success(equipamento?.id 
        ? 'Equipamento atualizado com sucesso'
        : 'Equipamento cadastrado com sucesso')

      router.push('/dashboard/equipamentos/gerais')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar equipamento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição *</Label>
          <Input
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            placeholder="Ex: Lâmpada LED 20W"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo *</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => handleInputChange('tipo', value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposEquipamento.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="potencia">Potência (W) *</Label>
          <Input
            id="potencia"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.potencia}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              handleInputChange('potencia', isNaN(value) ? 1 : Math.max(0.01, value))
            }}
            placeholder="Ex: 20"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatorPotencia">Fator de Potência *</Label>
          <Input
            id="fatorPotencia"
            type="number"
            step="0.01"
            min="0.01"
            max="1"
            value={formData.fatorPotencia}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              handleInputChange('fatorPotencia', isNaN(value) ? 0.8 : Math.min(1, Math.max(0.01, value)))
            }}
            placeholder="Ex: 0.8"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tensao">Tensão (V) *</Label>
          <Input
            id="tensao"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.tensao}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              handleInputChange('tensao', isNaN(value) ? 220 : Math.max(0.01, value))
            }}
            placeholder="Ex: 220"
            required
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {equipamento?.id ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  )
}