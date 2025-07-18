"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Download, 
  FileImage, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Printer
} from "lucide-react"
import { ExportSettings, ExportResult } from "@/types/planta-localizacao"

interface ExportToolsProps {
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
  description?: string
  onExport?: (result: ExportResult) => void
}

const FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF', icon: FileText },
  { value: 'png', label: 'PNG', icon: FileImage },
  { value: 'jpg', label: 'JPG', icon: FileImage }
]

const QUALITY_OPTIONS = [
  { value: 'low', label: 'Baixa (Rápido)' },
  { value: 'medium', label: 'Média (Balanceado)' },
  { value: 'high', label: 'Alta (Melhor qualidade)' }
]

const PAPER_SIZES = [
  { value: 'A4', label: 'A4 (210 × 297 mm)' },
  { value: 'A3', label: 'A3 (297 × 420 mm)' },
  { value: 'A2', label: 'A2 (420 × 594 mm)' },
  { value: 'A1', label: 'A1 (594 × 841 mm)' }
]

export function ExportTools({ projeto, description, onExport }: ExportToolsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<ExportResult | null>(null)
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'pdf',
    quality: 'medium',
    includeDescription: true,
    includeScale: true,
    includeNorth: true,
    includeLegend: true,
    paperSize: 'A4',
    orientation: 'landscape'
  })

  const updateSetting = <K extends keyof ExportSettings>(
    key: K,
    value: ExportSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportResult(null)
    
    try {
      const response = await fetch('/api/export/planta-localizacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projetoId: projeto.id,
          settings,
          description,
          projectInfo: {
            numProjeto: projeto.numProjeto,
            cliente: projeto.cliente
          }
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao exportar planta')
      }

      const result: ExportResult = await response.json()
      setExportResult(result)
      onExport?.(result)

      // Se a exportação foi bem-sucedida e há uma URL, fazer download
      if (result.success && result.url) {
        const link = document.createElement('a')
        link.href = result.url
        link.download = result.filename || `planta-${projeto.numProjeto || projeto.id}.${settings.format}`
        link.click()
      }
      
    } catch (error) {
      const errorResult: ExportResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
      setExportResult(errorResult)
    } finally {
      setIsExporting(false)
    }
  }

  const getEstimatedFileSize = () => {
    const baseSize = settings.paperSize === 'A1' ? 5 : settings.paperSize === 'A2' ? 3 : settings.paperSize === 'A3' ? 2 : 1
    const qualityMultiplier = settings.quality === 'high' ? 3 : settings.quality === 'medium' ? 2 : 1
    const formatMultiplier = settings.format === 'pdf' ? 0.5 : 1
    
    return Math.round(baseSize * qualityMultiplier * formatMultiplier * 100) / 100
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Planta
        </CardTitle>
        <CardDescription>
          Configure as opções de exportação e gere arquivos para impressão ou compartilhamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações do Projeto */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Projeto a ser exportado</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><strong>Número:</strong> {projeto.numProjeto || 'N/A'}</div>
            <div><strong>Cliente:</strong> {projeto.cliente.nome}</div>
            <div className="sm:col-span-2">
              <strong>Local:</strong> {projeto.cliente.cidade}, {projeto.cliente.uf}
            </div>
          </div>
        </div>

        {/* Configurações de Formato */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Formato de Arquivo</Label>
            <Select value={settings.format} onValueChange={(value: any) => updateSetting('format', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map(option => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Qualidade</Label>
            <Select value={settings.quality} onValueChange={(value: any) => updateSetting('quality', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QUALITY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Configurações de Papel (apenas para PDF) */}
        {settings.format === 'pdf' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tamanho do Papel</Label>
              <Select value={settings.paperSize} onValueChange={(value: any) => updateSetting('paperSize', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAPER_SIZES.map(size => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Orientação</Label>
              <Select value={settings.orientation} onValueChange={(value: any) => updateSetting('orientation', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Paisagem</SelectItem>
                  <SelectItem value="portrait">Retrato</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Elementos a Incluir */}
        <div className="space-y-3">
          <Label>Elementos a Incluir</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeDescription"
                checked={settings.includeDescription}
                onCheckedChange={(checked) => updateSetting('includeDescription', Boolean(checked))}
              />
              <Label htmlFor="includeDescription" className="text-sm font-normal">
                Descrição técnica
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeScale"
                checked={settings.includeScale}
                onCheckedChange={(checked) => updateSetting('includeScale', Boolean(checked))}
              />
              <Label htmlFor="includeScale" className="text-sm font-normal">
                Escala gráfica
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeNorth"
                checked={settings.includeNorth}
                onCheckedChange={(checked) => updateSetting('includeNorth', Boolean(checked))}
              />
              <Label htmlFor="includeNorth" className="text-sm font-normal">
                Indicação do Norte
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeLegend"
                checked={settings.includeLegend}
                onCheckedChange={(checked) => updateSetting('includeLegend', Boolean(checked))}
              />
              <Label htmlFor="includeLegend" className="text-sm font-normal">
                Legenda
              </Label>
            </div>
          </div>
        </div>

        {/* Informações de Estimativa */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            Tamanho estimado: ~{getEstimatedFileSize()} MB
          </Badge>
          <Badge variant="secondary">
            {settings.format.toUpperCase()}
          </Badge>
          {settings.format === 'pdf' && (
            <Badge variant="secondary">
              {settings.paperSize} - {settings.orientation === 'landscape' ? 'Paisagem' : 'Retrato'}
            </Badge>
          )}
        </div>

        {/* Botão de Exportação */}
        <div className="flex gap-2">
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Exportando...' : 'Exportar Planta'}
          </Button>

          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Resultado da Exportação */}
        {exportResult && (
          <Alert variant={exportResult.success ? "default" : "destructive"}>
            {exportResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {exportResult.success ? (
                <div>
                  <p>Planta exportada com sucesso!</p>
                  {exportResult.metadata && (
                    <p className="text-xs mt-1">
                      Arquivo: {exportResult.filename} ({(exportResult.metadata.fileSize / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              ) : (
                <p>Erro na exportação: {exportResult.error}</p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}