'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Copy, Check, Save, PencilRuler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toastNotifications } from '@/components/ui/toast-notifications';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GoogleMapsProps {
  apiKey: string;
  lat?: number;
  lng?: number;
  onPinClick?: (coordinates: { lat: number; lng: number }) => void;
  projetoId?: string;
  onMapCapture?: () => void;
}

const GoogleMaps: React.FC<GoogleMapsProps> = ({ apiKey, lat = -15.7942, lng = -47.8822, onPinClick, projetoId, onMapCapture }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [pinCoordinates, setPinCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [hasExistingMap, setHasExistingMap] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
    });

    loader.load().then(() => {
      // Se há um projetoId, carregar localização do projeto
      if (projetoId) {
        loadProjectLocation();
      } else {
        // Caso contrário, inicializar com coordenadas padrão
        initializeMap();
      }
    }).catch((error) => {
      console.error('Erro ao carregar Google Maps:', error);
    });
  }, [apiKey, projetoId]);

  const copyCoordinates = async () => {
    if (pinCoordinates) {
      const coordText = `${pinCoordinates.lat.toFixed(6)}, ${pinCoordinates.lng.toFixed(6)}`;
      try {
        await navigator.clipboard.writeText(coordText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar coordenadas:', err);
      }
    }
  };

  const saveCoordinates = async () => {
    if (!pinCoordinates || !projetoId) {
      toastNotifications.warning({
        title: 'Aviso',
        description: 'Coordenadas ou ID do projeto não disponíveis'
      });
      return;
    }

    setIsSaving(true);
    const toastId = toastNotifications.loading({
      title: 'Salvando coordenadas...',
      description: 'Atualizando dados de acesso do projeto'
    });

    try {
      // Primeiro, buscar o projeto para obter o número do projeto
      const projetoResponse = await fetch(`/api/projeto/${projetoId}`);
      if (!projetoResponse.ok) {
        throw new Error('Erro ao buscar dados do projeto');
      }
      const projetoData = await projetoResponse.json();
      const numProjeto = projetoData.numProjeto;

      if (!numProjeto) {
        throw new Error('Número do projeto não encontrado');
      }

      // Atualizar as coordenadas no acesso através do número do projeto
      const response = await fetch(`/api/acesso/by-projeto/${numProjeto}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longitudeUTM: pinCoordinates.lng.toFixed(6),
          latitudeUTM: pinCoordinates.lat.toFixed(6)
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar coordenadas');
      }

      // Fechar toast de loading
       if (typeof toastId === 'string') {
         toast.dismiss(toastId);
       }

      toastNotifications.success({
        title: 'Coordenadas salvas!',
        description: `Lat: ${pinCoordinates.lat.toFixed(6)}, Lng: ${pinCoordinates.lng.toFixed(6)}`
      });
    } catch (error) {
      // Fechar toast de loading
       if (typeof toastId === 'string') {
         toast.dismiss(toastId);
       }
      
      toastNotifications.error({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as coordenadas. Tente novamente.'
      });
      console.error('Erro ao salvar coordenadas:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Função para buscar localização baseada em coordenadas salvas ou endereço
  const loadProjectLocation = async () => {
    if (!projetoId) return;

    setIsLoadingLocation(true);

    try {
      // Buscar dados do projeto
      const projetoResponse = await fetch(`/api/projeto/${projetoId}`);
      if (!projetoResponse.ok) {
        throw new Error('Erro ao buscar dados do projeto');
      }
      const projetoData = await projetoResponse.json();
      const numProjeto = projetoData.numProjeto;

      // Verificar se já existe um mapa salvo
      setHasExistingMap(!!projetoData.urlMapa);

      if (!numProjeto) {
        throw new Error('Número do projeto não encontrado');
      }

      // Buscar dados de acesso para verificar se há coordenadas salvas
      const acessoResponse = await fetch(`/api/acesso/by-projeto/${numProjeto}`);
      
      if (acessoResponse.ok) {
        const acessoData = await acessoResponse.json();
        
        // Se há coordenadas salvas, usar elas
        if (acessoData.longitudeUTM && acessoData.latitudeUTM) {
          const savedLat = parseFloat(acessoData.latitudeUTM);
          const savedLng = parseFloat(acessoData.longitudeUTM);
          
          if (!isNaN(savedLat) && !isNaN(savedLng)) {
             setIsLoadingLocation(false);
             
             // Usar coordenadas salvas
             initializeMap(savedLat, savedLng);
             setPinCoordinates({ lat: savedLat, lng: savedLng });
             
             toastNotifications.success({
               title: 'Localização carregada',
               description: 'Usando coordenadas salvas do projeto'
             });
             return;
          }
        }
      }

      // Se não há coordenadas salvas, usar endereço do cliente
      const cliente = projetoData.cliente;
      if (cliente) {
        const endereco = `${cliente.rua}, ${cliente.numero}, ${cliente.bairro}, ${cliente.cidade}, ${cliente.uf}, ${cliente.cep}`;
        
        // Geocodificar endereço
         const geocoder = new google.maps.Geocoder();
         geocoder.geocode({ address: endereco }, (results, status) => {
           setIsLoadingLocation(false);
           
           if (status === 'OK' && results && results[0]) {
             const location = results[0].geometry.location;
             const lat = location.lat();
             const lng = location.lng();
             
             initializeMap(lat, lng);
             setPinCoordinates({ lat, lng });
             
             toastNotifications.success({
               title: 'Localização carregada',
               description: 'Usando endereço do cliente'
             });
           } else {
             toastNotifications.warning({
               title: 'Localização não encontrada',
               description: 'Usando localização padrão'
             });
             initializeMap();
           }
         });
      } else {
         setIsLoadingLocation(false);
         
         toastNotifications.warning({
           title: 'Dados não encontrados',
           description: 'Usando localização padrão'
         });
         initializeMap();
      }
    } catch (error) {

      
      toastNotifications.error({
        title: 'Erro ao carregar localização',
        description: 'Usando localização padrão'
      });
      console.error('Erro ao carregar localização:', error);
      initializeMap();
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Função para inicializar o mapa
   const initializeMap = (mapLat?: number, mapLng?: number) => {
     const finalLat = mapLat || lat;
     const finalLng = mapLng || lng;
     
     if (mapRef.current && window.google) {
       const mapInstance = new google.maps.Map(mapRef.current, {
         center: { lat: finalLat, lng: finalLng },
         zoom: 18,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         mapTypeControl: true,
         streetViewControl: false,
         fullscreenControl: true,
         zoomControl: true,
       });

       setMap(mapInstance);

       // Criar marcador inicial
       const marker = new google.maps.Marker({
         position: { lat: finalLat, lng: finalLng },
         map: mapInstance,
         title: `Coordenadas: ${finalLat.toFixed(6)}, ${finalLng.toFixed(6)}`,
         draggable: true,
         icon: {
           url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
             <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
               <defs>
                 <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                   <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
                 </filter>
               </defs>
               <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" fill="#dc2626" filter="url(#shadow)"/>
               <circle cx="16" cy="16" r="6" fill="white"/>
               <circle cx="16" cy="16" r="3" fill="#dc2626"/>
             </svg>
           `),
           scaledSize: new google.maps.Size(32, 40),
           anchor: new google.maps.Point(16, 40)
         },
         animation: google.maps.Animation.DROP
       });

       setMarker(marker);
       setPinCoordinates({ lat: finalLat, lng: finalLng });

       // Listener para arrastar o marcador
       marker.addListener('dragend', (dragEvent: google.maps.MapMouseEvent) => {
         const newLat = dragEvent.latLng?.lat();
         const newLng = dragEvent.latLng?.lng();
         
         if (newLat !== undefined && newLng !== undefined) {
           const newCoordinates = { lat: newLat, lng: newLng };
           setPinCoordinates(newCoordinates);
           marker.setTitle(`Coordenadas: ${newLat.toFixed(6)}, ${newLng.toFixed(6)}`);
           
           if (onPinClick) {
             onPinClick(newCoordinates);
           }
         }
       });

       // Listener para cliques no mapa
       mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
         const clickedLat = event.latLng?.lat();
         const clickedLng = event.latLng?.lng();
         
         if (clickedLat !== undefined && clickedLng !== undefined) {
           const coordinates = { lat: clickedLat, lng: clickedLng };
           setPinCoordinates(coordinates);
           
           marker.setPosition(coordinates);
           marker.setTitle(`Coordenadas: ${clickedLat.toFixed(6)}, ${clickedLng.toFixed(6)}`);
           
           if (onPinClick) {
             onPinClick(coordinates);
           }
         }
       });

       // Chamar callback inicial se fornecido
       if (onPinClick) {
         onPinClick({ lat: finalLat, lng: finalLng });
       }
     }
   };

  return (
    <div className="space-y-3">
      {/* Card com coordenadas do pin */}
      {pinCoordinates && (
        <Card className="pt-2 pb-2 border-green-200 bg-green-50">
          <CardContent className="pb-0 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-green-700">
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs font-medium">Coordenadas:</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Lat:</span>
                    <span className="font-semibold">{pinCoordinates.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Lng:</span>
                    <span className="font-semibold">{pinCoordinates.lng.toFixed(6)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyCoordinates}
                        className="h-7 px-2"
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copiar coordenadas</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {projetoId && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={saveCoordinates}
                          disabled={isSaving}
                          className="h-7 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Salvar coordenadas</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {projetoId && onMapCapture && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onMapCapture}
                          disabled={hasExistingMap}
                          className={`h-7 px-2 ${
                            hasExistingMap 
                              ? 'bg-gray-50 hover:bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                              : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                          }`}
                        >
                          <PencilRuler className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{hasExistingMap ? 'Mapa já salvo' : 'Salvar mapa'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="relative">
        <div 
          id="google-maps-container"
          ref={mapRef} 
          style={{ height: '450px', width: '100%' }} 
          className="rounded-lg border"
        />
        
        {/* Instruções de uso */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-[6px] shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>Arraste o pin ou clique no mapa para reposicionar</span>
          </div>
        </div>
      </div>
     </div>
   );
};

export default GoogleMaps;