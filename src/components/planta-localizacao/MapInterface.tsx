"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPinHouse, Search, Satellite, Map as MapIcon, Loader2, Camera, Send } from "lucide-react"
import { CompassRose } from "./CompassRose"

// Importação dinâmica do Leaflet para evitar problemas de SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface MapInterfaceProps {
  projeto: {
    id: string
    numProjeto: string | null
    cliente: {
      nome: string
      endereco: string
      cidade: string
      uf: string
      cep: string
    }
  }
  onMapCapture?: (imageData: string, mapSettings: { center: { lat: number; lng: number }; zoom: number }) => void
}

interface MapSettings {
  center: { lat: number; lng: number }
  zoom: number
  mapType: 'satellite' | 'roadmap'
}

const MAP_CONFIG = {
  defaultCenter: { lat: -2.5307, lng: -44.3068 }, // São Luís, MA
  defaultZoom: 18, // Zoom 18 para melhor carregamento
  maxZoom: 19,
  satelliteTileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  roadmapTileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors',
  subdomains: ['a', 'b', 'c']
}

export function MapInterface({ projeto, onMapCapture }: MapInterfaceProps) {
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    center: MAP_CONFIG.defaultCenter,
    zoom: MAP_CONFIG.defaultZoom,
    mapType: 'satellite'
  })
  const [searchAddress, setSearchAddress] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  // Inicializar com endereço do projeto
  useEffect(() => {
    if (projeto?.cliente?.endereco) {
      const fullAddress = `${projeto.cliente.endereco}, ${projeto.cliente.cidade}, ${projeto.cliente.uf}`
      setSearchAddress(fullAddress)
      // Aguarda um pouco para garantir que o mapa esteja carregado
      const timer = setTimeout(() => {
        handleAddressSearch(fullAddress)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [projeto])

  // Função para buscar coordenadas do endereço
  const handleAddressSearch = async (address: string) => {
    if (!address.trim()) return
    
    setIsSearching(true)
    setSearchError(null)
    
    try {
      // Primeira tentativa: Nominatim com endereço completo
      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=br`
      )
      let data = await response.json()
      
      // Se não encontrou, tenta apenas com cidade e estado
      if (!data || data.length === 0) {
        const cityState = `${projeto.cliente.cidade}, ${projeto.cliente.uf}, Brasil`
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityState)}&limit=1&countrycodes=br`
        )
        data = await response.json()
      }
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        setMapSettings(prev => ({
          ...prev,
          center: { lat: parseFloat(lat), lng: parseFloat(lon) },
          zoom: data[0].importance > 0.5 ? 16 : 13 // Ajusta zoom baseado na precisão
        }))
        setSearchError(null)
      } else {
        setSearchError('Endereço não encontrado. Verifique os dados e tente novamente.')
        // Fallback para coordenadas padrão da cidade/estado
        const fallbackSearch = `${projeto.cliente.cidade}, ${projeto.cliente.uf}`
        const fallbackResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackSearch)}&limit=1&countrycodes=br`
        )
        const fallbackData = await fallbackResponse.json()
        if (fallbackData && fallbackData.length > 0) {
          const { lat, lon } = fallbackData[0]
          setMapSettings(prev => ({
            ...prev,
            center: { lat: parseFloat(lat), lng: parseFloat(lon) },
            zoom: 12
          }))
        }
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error)
      setSearchError('Erro na conexão. Verifique sua internet e tente novamente.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = () => {
    handleAddressSearch(searchAddress)
  }

  const toggleMapType = () => {
    setMapSettings(prev => ({
      ...prev,
      mapType: prev.mapType === 'satellite' ? 'roadmap' : 'satellite'
    }))
  }

  const captureMapImage = async () => {
    if (!onMapCapture) return
    
    setIsCapturing(true)
    try {
      // Aguardar um momento para garantir que o mapa esteja totalmente renderizado
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mapContainer = document.querySelector('.leaflet-container') as HTMLElement
      if (!mapContainer) {
        throw new Error('Container do mapa não encontrado')
      }
      
      // Usar html2canvas para capturar a imagem do mapa
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(mapContainer, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        background: '#ffffff',
        width: window.innerWidth,
        height: window.innerHeight
      })
      
      const imageData = canvas.toDataURL('image/png')
      onMapCapture(imageData, {
        center: mapSettings.center,
        zoom: mapSettings.zoom
      })
      
    } catch (error) {
      console.error('Erro ao capturar imagem do mapa:', error)
    } finally {
      setIsCapturing(false)
    }
  }

  useEffect(() => {
    setIsMapLoaded(true)
  }, [])

  if (!isMapLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinHouse className="h-5 w-5" />
            Mapa Interativo
          </CardTitle>
          <CardDescription>
            Carregando interface do mapa...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Carregando mapa...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPinHouse className="h-5 w-5" />
          Mapa Interativo
        </CardTitle>
        <CardDescription>
          Visualize e marque a localização do projeto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controles do Mapa */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                 placeholder="Digite o endereço para buscar..."
                 value={searchAddress}
                 onChange={(e) => setSearchAddress(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch(searchAddress)}
               />
               <Button 
                 onClick={() => handleAddressSearch(searchAddress)} 
                disabled={isSearching}
                size="icon"
                variant="outline"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex gap-2">
               <Button
                 variant="outline"
                 size="sm"
                 className="flex items-center gap-2"
                 disabled
               >
                 <MapIcon className="h-4 w-4" />
                 Mapa Rodoviário
               </Button>
               {onMapCapture && (
                 <Button
                   variant="default"
                   size="sm"
                   className="flex items-center gap-2"
                   onClick={captureMapImage}
                   disabled={isCapturing}
                 >
                   {isCapturing ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                   ) : (
                     <>
                       <Camera className="h-4 w-4" />
                       <Send className="h-4 w-4" />
                     </>
                   )}
                   {isCapturing ? 'Capturando...' : 'Enviar para Desenho'}
                 </Button>
               )}
             </div>
          </div>
          {searchError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {searchError}
            </div>
          )}
        </div>

        {/* Informações do Projeto */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            Projeto: {projeto.numProjeto || 'N/A'}
          </Badge>
          <Badge variant="secondary">
            {projeto.cliente.cidade}, {projeto.cliente.uf}
          </Badge>
        </div>

        {/* Container do Mapa */}
        <div className="relative h-[300px] w-full rounded-lg overflow-hidden border">
          {/* Bússola */}
          <CompassRose />
          
          <MapContainer
            center={[mapSettings.center.lat, mapSettings.center.lng]}
            zoom={mapSettings.zoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
            key={`${mapSettings.center.lat}-${mapSettings.center.lng}-${mapSettings.zoom}`}
            preferCanvas={false}
            zoomControl={true}
            doubleClickZoom={true}
            closePopupOnClick={true}
            dragging={true}
            zoomSnap={1}
            zoomDelta={1}
            trackResize={true}
            touchZoom={true}
            scrollWheelZoom={true}
            whenReady={() => {
              // Mapa totalmente carregado
              console.log('Mapa carregado completamente')
            }}
          >
            <TileLayer
              url={MAP_CONFIG.roadmapTileLayer}
              attribution={MAP_CONFIG.attribution}
              maxZoom={MAP_CONFIG.maxZoom}
              subdomains={MAP_CONFIG.subdomains}
              tileSize={256}
              zoomOffset={0}
              detectRetina={true}
              keepBuffer={2}
              updateWhenIdle={false}
              updateWhenZooming={true}
            />
            <Marker position={[mapSettings.center.lat, mapSettings.center.lng]}>
              <Popup>
                <div className="text-sm">
                  <strong>{projeto.cliente.nome}</strong><br />
                  {projeto.cliente.endereco}<br />
                  {projeto.cliente.cidade}, {projeto.cliente.uf}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Coordenadas */}
        <div className="text-xs text-muted-foreground">
          Coordenadas: {mapSettings.center.lat.toFixed(6)}, {mapSettings.center.lng.toFixed(6)}
        </div>
      </CardContent>
    </Card>
  )
}