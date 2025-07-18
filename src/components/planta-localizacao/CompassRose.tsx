'use client'

import React from 'react'
import { Navigation } from 'lucide-react'

interface CompassRoseProps {
  className?: string
}

export function CompassRose({ className = '' }: CompassRoseProps) {
  return (
    <div className={`absolute top-4 right-4 z-10 ${className}`}>
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
        <div className="relative w-16 h-16">
          {/* Círculo principal */}
          <div className="absolute inset-0 border-2 border-gray-300 rounded-full"></div>
          
          {/* Ícone de navegação central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Navigation className="h-6 w-6 text-blue-600 transform rotate-0" />
          </div>
          
          {/* Direções cardeais */}
          <div className="absolute inset-0">
            {/* Norte */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
              <span className="text-xs font-bold text-red-600 bg-white px-1 rounded">N</span>
            </div>
            
            {/* Sul */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
              <span className="text-xs font-bold text-gray-700 bg-white px-1 rounded">S</span>
            </div>
            
            {/* Leste */}
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
              <span className="text-xs font-bold text-gray-700 bg-white px-1 rounded">L</span>
            </div>
            
            {/* Oeste */}
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2">
              <span className="text-xs font-bold text-gray-700 bg-white px-1 rounded">O</span>
            </div>
          </div>
          
          {/* Linhas de direção */}
          <div className="absolute inset-0">
            {/* Linha Norte-Sul */}
            <div className="absolute top-2 bottom-2 left-1/2 w-px bg-gray-400 transform -translate-x-1/2"></div>
            
            {/* Linha Leste-Oeste */}
            <div className="absolute left-2 right-2 top-1/2 h-px bg-gray-400 transform -translate-y-1/2"></div>
          </div>
        </div>
        
        {/* Legenda */}
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-600 font-medium">Bússola</span>
        </div>
      </div>
    </div>
  )
}

export default CompassRose