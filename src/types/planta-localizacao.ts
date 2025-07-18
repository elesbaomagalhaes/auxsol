export interface SiteData {
  id: string
  projetoId: string
  address: string
  area: number
  usage: string
  zoning: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface DrawingElement {
  id: string
  type: 'line' | 'point' | 'text' | 'image'
  coordinates?: { x: number; y: number }[]
  data?: {
    imageUrl?: string
    x?: number
    y?: number
    width?: number
    height?: number
  }
  properties?: {
    label?: string
    color?: string
    strokeWidth?: number
    fillColor?: string
    fillOpacity?: number
    category?: 'terrain' | 'construction' | 'access' | 'vegetation' | 'other'
  }
  measurements?: {
    area?: number // em m²
    perimeter?: number // em metros
    distance?: number // em metros
  }
}

export interface PlantaState {
  isLoading: boolean
  mapData: SiteData | null
  drawingData: DrawingElement[]
  aiDescription: string
  exportSettings: ExportSettings
}

export interface ExportSettings {
  format: 'pdf' | 'png' | 'jpg'
  quality: 'low' | 'medium' | 'high'
  includeDescription: boolean
  includeScale: boolean
  includeNorth: boolean
  includeLegend: boolean
  paperSize: 'A4' | 'A3' | 'A2' | 'A1'
  orientation: 'portrait' | 'landscape'
}

export interface AIDescriptionRequest {
  area: number
  usage: string
  address: string
  elements: string[]
  zoning?: string
  orientation?: string
}

export interface AIDescriptionResponse {
  description: string
  specifications: string[]
  recommendations: string[]
  compliance: {
    abnt: boolean
    municipal: boolean
    environmental: boolean
  }
}

export interface MeasurementResult {
  area: number // m²
  perimeter: number // metros
  coordinates: { x: number; y: number }[]
}

export interface PlantaTemplate {
  id: string
  name: string
  description: string
  category: 'residential' | 'commercial' | 'industrial' | 'rural'
  elements: DrawingElement[]
  settings: {
    defaultZoom: number
    showGrid: boolean
    snapToGrid: boolean
    gridSize: number
  }
}

export interface ExportResult {
  success: boolean
  url?: string
  filename?: string
  error?: string
  metadata?: {
    fileSize: number
    dimensions: { width: number; height: number }
    format: string
  }
}