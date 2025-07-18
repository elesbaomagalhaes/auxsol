"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPinHouse, Loader2, AlertCircle, Download } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DrawingTools } from "@/components/planta-localizacao/DrawingTools"
import GoogleMaps from '@/components/google-maps/GoogleMaps'
import { AIGenerator } from "@/components/planta-localizacao/AIGenerator"
import { ExportTools } from "@/components/planta-localizacao/ExportTools"
import html2canvas from 'html2canvas'

import { DrawingElement } from "@/types/planta-localizacao"

interface PlantaLocalizacaoPageProps {
  params: Promise<{
    id: string
  }>
}

interface ProjetoData {
  id: string
  numProjeto: string | null
  createdAt: string
  urlMapa?: string
  cliente: {
    nome: string
    endereco: string
    cidade: string
    uf: string
    cep: string
  }
}

export default function PlantaLocalizacaoPage({ params }: PlantaLocalizacaoPageProps) {
  const [projeto, setProjeto] = useState<ProjetoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [drawingElements, setDrawingElements] = useState<DrawingElement[]>([])
  const [aiDescription, setAiDescription] = useState('')
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [addressInput, setAddressInput] = useState('')
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geocodingError, setGeocodingError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isLoadingMapImage, setIsLoadingMapImage] = useState(false)


  const [activeTab, setActiveTab] = useState('ia')

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setProjectId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!projectId) return
    
    const fetchProjeto = async () => {
      try {
        const response = await fetch(`/api/projetos/${projectId}`)
        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Erro ao carregar projeto')
        }
        const data = await response.json()
        setProjeto(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjeto()
  }, [projectId])

  const geocodeAddress = async (address: string) => {
    setIsGeocoding(true);
    setGeocodingError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1&countrycodes=br`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      } else {
        setGeocodingError("Endereço não encontrado. Por favor, tente um endereço diferente.");
        console.warn("No results found for the address:", address)
      }
    } catch (error) {
      setGeocodingError("Ocorreu um erro ao buscar o endereço. Tente novamente mais tarde.");
      console.error('Error geocoding address:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    if (projeto) {
      const fullAddress = `${projeto.cliente.endereco}, ${projeto.cliente.cidade}, ${projeto.cliente.uf}`;
      setAddressInput(fullAddress);
      geocodeAddress(fullAddress);
    }
  }, [projeto]);



  const handleSearch = () => {
    if (addressInput.trim() !== '') {
      geocodeAddress(addressInput);
    }
  };

  const handleElementsChange = (elements: DrawingElement[]) => {
    setDrawingElements(elements);
  };

  const handleDescriptionGenerated = (description: string) => {
    setAiDescription(description);
  };

  const handleUseMapAsBackground = () => {
    if (projeto?.urlMapa) {
      // Adicionar a imagem do mapa como elemento de desenho de fundo
      const backgroundElement: DrawingElement = {
        id: `background-map-${Date.now()}`,
        type: 'image',
        data: {
          imageUrl: projeto.urlMapa,
          x: 0,
          y: 0,
          width: 800,
          height: 600
        },
        properties: {
          category: 'other',
          label: 'Mapa de Fundo'
        }
      };
      
      // Limpar elementos existentes e adicionar o fundo
      setDrawingElements([backgroundElement]);
    }
  };





  const handleDownloadMapImage = async () => {
    setIsCapturing(true);
    setIsLoadingMapImage(true);

    
    try {
      // Aguardar um momento para garantir que o mapa esteja totalmente carregado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar o container do mapa de forma mais robusta
      let mapElement = document.getElementById('google-maps-container') as HTMLElement;
      
      // Se não encontrar pelo ID, tentar buscar pelo seletor de classe ou tag
      if (!mapElement) {
        mapElement = document.querySelector('[id="google-maps-container"]') as HTMLElement;
      }
      
      // Verificar se o elemento do mapa do Google está carregado
      if (!mapElement) {
        throw new Error('Container do mapa não encontrado. Certifique-se de que o mapa está carregado.');
      }
      
      // Verificar se o mapa do Google está realmente renderizado
      const googleMapDiv = mapElement.querySelector('.gm-style');
      if (!googleMapDiv) {
        throw new Error('Mapa do Google não está totalmente carregado. Aguarde um momento e tente novamente.');
      }
      
      // Configurações otimizadas para captura
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: mapElement.offsetWidth,
        height: mapElement.offsetHeight,
        background: '#ffffff'
      });
      
      // Converter canvas para blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 0.95);
      });
      
      if (blob) {
        // Criar URL da imagem para preview
        const imageUrl = URL.createObjectURL(blob);
        
        // Adicionar a imagem como elemento de desenho com animação
        const newElement: DrawingElement = {
          id: `map-upload-${Date.now()}`,
          type: 'image',
          data: {
            imageUrl,
            x: 50,
            y: 50,
            width: 300,
            height: 200
          },
          properties: {
            fillOpacity: 0.8
          }
        };
        
        // Adicionar elemento com animação
        setDrawingElements(prev => [...prev, newElement]);
        
        // Simular animação de carregamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Criar FormData para envio
        const formData = new FormData();
        const fileName = `mapa-projeto-${projeto?.numProjeto || 'sem-numero'}-${new Date().toISOString().split('T')[0]}.png`;
        formData.append('file', blob, fileName);
        
        // Fazer upload para o Cloudinary e salvar URL no projeto
        const response = await fetch(`/api/projeto/${projectId}/upload-mapa`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao fazer upload do mapa');
        }
        
        const result = await response.json();
        
        // Atualizar o estado do projeto com a nova URL do mapa
        if (projeto) {
          setProjeto({
            ...projeto,
            urlMapa: result.urlMapa
          });
        }
        
        console.log('Mapa enviado e salvo com sucesso!', result);
        
        // Opcional: Ainda fazer o download local
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Limpar URL temporária
        URL.revokeObjectURL(imageUrl);
        
      } else {
        throw new Error('Falha ao converter a captura em imagem.');
      }
      
    } catch (error) {
      console.error('Erro ao processar mapa:', error);
      setGeocodingError(`Erro ao processar mapa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsCapturing(false);
      setIsLoadingMapImage(false);

    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando projeto...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!projeto) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planta de Localização</h1>
          <p className="text-muted-foreground">
            Visualize, desenhe e gerencie a planta de localização do projeto
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <MapPinHouse className="h-4 w-4 mr-2" />
          {projeto.numProjeto || 'N/A'}
        </Badge>
      </div>

      {coordinates && !projeto.urlMapa && (
        <GoogleMaps
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
          lat={coordinates.lat}
          lng={coordinates.lng}
          projetoId={projectId || undefined}
          onMapCapture={handleDownloadMapImage}
        />
      )}
      
      {isLoadingMapImage && (
        <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4 text-blue-600">
                <Loader2 className="h-8 w-8 animate-spin" />
                <div className="text-center">
                  <p className="font-medium">Processando imagem do mapa...</p>
                  <p className="text-sm text-muted-foreground">Capturando e enviando para o Cloudinary</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {geocodingError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{geocodingError}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Input 
          type="text" 
          placeholder="Digite um endereço para pesquisar"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          className="max-w-md"
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          disabled={isGeocoding}
        />
        <Button 
          onClick={handleSearch} 
          disabled={isGeocoding}
          className="bg-black hover:bg-gray-800 text-white"
        >
          {isGeocoding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGeocoding ? 'Buscando...' : 'Buscar'}
        </Button>



      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className={projeto.urlMapa ? "col-span-9" : "col-span-12"}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Projeto</p>
                <p className="font-semibold">{projeto.numProjeto || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Cliente</p>
                <p className="font-semibold">{projeto.cliente.nome}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Cidade</p>
                <p className="font-semibold">{projeto.cliente.cidade}, {projeto.cliente.uf}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Endereço</p>
                <p className="font-semibold">{projeto.cliente.endereco}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">CEP</p>
                <p className="font-semibold">{projeto.cliente.cep}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Cadastro</p>
                <p className="font-semibold">{new Date(projeto.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {projeto.urlMapa && (
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="text-sm">Mapa Salvo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img 
                  src={projeto.urlMapa} 
                  alt="Mapa do projeto" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                  onClick={handleUseMapAsBackground}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Clique para desenhar
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ferramentas de Desenho</CardTitle>
          <CardDescription>
            Desenhe e adicione elementos à planta de localização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DrawingTools 
            onElementsChange={handleElementsChange}
            onMeasurement={(measurement) => {
              console.log('Medição:', measurement)
            }}
            elements={drawingElements}
            backgroundImage={drawingElements.find(el => el.type === 'image' && el.properties?.label === 'Mapa de Fundo')?.data?.imageUrl}
          />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ia">IA</TabsTrigger>
          <TabsTrigger value="exportar">Exportar</TabsTrigger>
        </TabsList>

        <TabsContent value="ia" className="space-y-6">
          <AIGenerator 
            projeto={projeto}
            onDescriptionGenerated={handleDescriptionGenerated}
          />
        </TabsContent>

        <TabsContent value="exportar" className="space-y-6">
          <ExportTools 
            projeto={projeto}
            description={aiDescription}
            onExport={(result) => {
              console.log('Resultado da exportação:', result)
            }}
          />
        </TabsContent>
      </Tabs>

      {drawingElements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Elementos Desenhados</CardTitle>
            <CardDescription>
              Resumo dos elementos adicionados à planta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {drawingElements.map((element, index) => (
                <Badge key={element.id} variant="secondary">
                  {element.type} {index + 1}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}