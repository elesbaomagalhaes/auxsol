"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  RefreshCw,
  FileText,
  Zap
} from "lucide-react"
import { AIDescriptionRequest, AIDescriptionResponse } from "@/types/planta-localizacao"

interface AIGeneratorProps {
  projeto: {
    id: string
    numProjeto: string | null
    cliente: {
      nome: string
      endereco: string
      cidade: string
      uf: string
    }
  }
  onDescriptionGenerated?: (description: string) => void
}

const USAGE_TYPES = [
  { value: 'residential', label: 'Residencial' },
  { value: 'commercial', label: 'Comercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'mixed', label: 'Uso Misto' },
  { value: 'institutional', label: 'Institucional' },
  { value: 'recreational', label: 'Recreativo' }
]

const ZONING_TYPES = [
  { value: 'urban', label: 'Zona Urbana' },
  { value: 'suburban', label: 'Zona Suburbana' },
  { value: 'rural', label: 'Zona Rural' },
  { value: 'industrial', label: 'Zona Industrial' },
  { value: 'commercial', label: 'Zona Comercial' },
  { value: 'mixed', label: 'Zona Mista' }
]

export function AIGenerator({ projeto, onDescriptionGenerated }: AIGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [aiResponse, setAiResponse] = useState<AIDescriptionResponse | null>(null)
  const [error, setError] = useState('')
  
  // Formulário de entrada
  const [formData, setFormData] = useState({
    area: '',
    usage: '',
    zoning: '',
    customPrompt: '',
    includeCompliance: true,
    includeRecommendations: true
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateDescription = async () => {
    if (!formData.area || !formData.usage) {
      setError('Por favor, preencha pelo menos a área e o tipo de uso.')
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      const request: AIDescriptionRequest = {
        area: parseFloat(formData.area),
        usage: formData.usage,
        address: `${projeto.cliente.endereco}, ${projeto.cliente.cidade}, ${projeto.cliente.uf}`,
        elements: [], // Seria preenchido com elementos do desenho
        zoning: formData.zoning,
        orientation: 'Norte' // Seria detectado automaticamente
      }

      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...request,
          customPrompt: formData.customPrompt,
          includeCompliance: formData.includeCompliance,
          includeRecommendations: formData.includeRecommendations,
          projetoId: projeto.id
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar descrição')
      }

      const aiResult: AIDescriptionResponse = await response.json()
      setAiResponse(aiResult)
      setGeneratedDescription(aiResult.description)
      onDescriptionGenerated?.(aiResult.description)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const regenerateDescription = () => {
    setGeneratedDescription('')
    setAiResponse(null)
    generateDescription()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Gerador IA de Descrições
        </CardTitle>
        <CardDescription>
          Use inteligência artificial para gerar descrições técnicas e especificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações do Projeto */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Informações do Projeto</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><strong>Projeto:</strong> {projeto.numProjeto || 'N/A'}</div>
            <div><strong>Cliente:</strong> {projeto.cliente.nome}</div>
            <div className="sm:col-span-2">
              <strong>Endereço:</strong> {projeto.cliente.endereco}, {projeto.cliente.cidade}, {projeto.cliente.uf}
            </div>
          </div>
        </div>

        {/* Formulário de Entrada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area">Área do Terreno (m²)</Label>
            <Input
              id="area"
              type="number"
              placeholder="Ex: 500"
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage">Tipo de Uso</Label>
            <Select value={formData.usage} onValueChange={(value) => handleInputChange('usage', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de uso" />
              </SelectTrigger>
              <SelectContent>
                {USAGE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zoning">Zoneamento</Label>
            <Select value={formData.zoning} onValueChange={(value) => handleInputChange('zoning', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o zoneamento" />
              </SelectTrigger>
              <SelectContent>
                {ZONING_TYPES.map(zone => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Opções</Label>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={formData.includeCompliance ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleInputChange('includeCompliance', !formData.includeCompliance)}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Conformidade
              </Badge>
              <Badge 
                variant={formData.includeRecommendations ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleInputChange('includeRecommendations', !formData.includeRecommendations)}
              >
                <FileText className="h-3 w-3 mr-1" />
                Recomendações
              </Badge>
            </div>
          </div>
        </div>

        {/* Prompt Personalizado */}
        <div className="space-y-2">
          <Label htmlFor="customPrompt">Prompt Personalizado (Opcional)</Label>
          <Textarea
            id="customPrompt"
            placeholder="Adicione instruções específicas para a IA..."
            value={formData.customPrompt}
            onChange={(e) => handleInputChange('customPrompt', e.target.value)}
            rows={3}
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button 
            onClick={generateDescription} 
            disabled={isGenerating || !formData.area || !formData.usage}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {isGenerating ? 'Gerando...' : 'Gerar Descrição'}
          </Button>

          {generatedDescription && (
            <Button 
              onClick={regenerateDescription} 
              variant="outline"
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerar
            </Button>
          )}
        </div>

        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Resultado da IA */}
        {aiResponse && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className="font-medium">Descrição Gerada</h4>
            </div>

            {/* Descrição Principal */}
            <div className="relative">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium">Descrição Técnica</h5>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(aiResponse.description)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm whitespace-pre-wrap">{aiResponse.description}</p>
              </div>
            </div>

            {/* Especificações */}
            {aiResponse.specifications.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Especificações Técnicas</h5>
                <ul className="space-y-1">
                  {aiResponse.specifications.map((spec, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recomendações */}
            {aiResponse.recommendations.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Recomendações</h5>
                <ul className="space-y-1">
                  {aiResponse.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Status de Conformidade */}
            <div>
              <h5 className="font-medium mb-2">Status de Conformidade</h5>
              <div className="flex flex-wrap gap-2">
                <Badge variant={aiResponse.compliance.abnt ? 'default' : 'destructive'}>
                  ABNT: {aiResponse.compliance.abnt ? 'Conforme' : 'Não Conforme'}
                </Badge>
                <Badge variant={aiResponse.compliance.municipal ? 'default' : 'destructive'}>
                  Municipal: {aiResponse.compliance.municipal ? 'Conforme' : 'Não Conforme'}
                </Badge>
                <Badge variant={aiResponse.compliance.environmental ? 'default' : 'destructive'}>
                  Ambiental: {aiResponse.compliance.environmental ? 'Conforme' : 'Não Conforme'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}