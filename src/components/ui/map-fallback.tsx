'use client';

import React from 'react';
import { AlertCircle, MapPin, RotateCcw } from 'lucide-react';
import { Button } from './button';

interface MapFallbackProps {
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

export const MapFallback: React.FC<MapFallbackProps> = ({
  isLoading = false,
  error = null,
  onRetry,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div 
        className={`flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
        role="status"
        aria-label="Carregando mapa"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <MapPin className="h-8 w-8 text-gray-400 mb-2" aria-hidden="true" />
        <p className="text-gray-600 text-center font-medium">Carregando mapa...</p>
        <p className="text-gray-500 text-sm text-center mt-1">Aguarde enquanto inicializamos o mapa</p>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex flex-col items-center justify-center h-full min-h-[400px] bg-red-50 border-2 border-dashed border-red-300 rounded-lg ${className}`}
        role="alert"
        aria-label="Erro no carregamento do mapa"
      >
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
        <h3 className="text-red-800 text-lg font-semibold mb-2">Erro ao carregar o mapa</h3>
        <p className="text-red-700 text-center mb-4 max-w-md">{error}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
            aria-label="Tentar carregar o mapa novamente"
          >
            <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
            Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
      role="status"
      aria-label="Mapa não disponível"
    >
      <MapPin className="h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
      <p className="text-gray-600 text-center font-medium">Mapa não disponível</p>
      <p className="text-gray-500 text-sm text-center mt-1">O mapa não pôde ser carregado no momento</p>
    </div>
  );
};