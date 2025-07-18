"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pencil, 
  Square, 
  Circle, 
  Minus, 
  Spline,
  Type, 
  Eraser, 
  Download, 
  Move,
  MousePointer,
  ImageOff,
  PaintBucket,
  Library,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react"
import { DrawingElement } from "@/types/planta-localizacao"

interface DrawingToolsProps {
  onElementsChange?: (elements: DrawingElement[]) => void
  onMeasurement?: (measurement: { area: number; perimeter: number }) => void
  backgroundImage?: string
  mapSettings?: { center: { lat: number; lng: number }; zoom: number }
  elements?: DrawingElement[]
}

type DrawingMode = 'select' | 'pan' | 'rectangle' | 'circle' | 'line' | 'polygon' | 'text' | 'measure' | 'fill'



const COLORS = {
  black: '#000000',
  gray: '#6b7280',
  blue: '#3b82f6'
}

export function DrawingTools({ onElementsChange, onMeasurement, backgroundImage, mapSettings, elements: externalElements }: DrawingToolsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<any>(null)
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('select')
  const [selectedColor, setSelectedColor] = useState(COLORS.black)
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [fillColor, setFillColor] = useState('transparent')
  const [elements, setElements] = useState<DrawingElement[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<any[]>([])
  const [fabricLoaded, setFabricLoaded] = useState(false)
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false)
  const [selectedObject, setSelectedObject] = useState<any>(null)
  const [deleteButtonPosition, setDeleteButtonPosition] = useState<{x: number, y: number} | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showImageLibrary, setShowImageLibrary] = useState(false)
  const [bibliotecaImages, setBibliotecaImages] = useState<any[]>([])
  const [loadingImages, setLoadingImages] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Carregar imagens da biblioteca
  const loadBibliotecaImages = async () => {
    try {
      setLoadingImages(true)
      const response = await fetch('/api/biblioteca')
      if (response.ok) {
        const data = await response.json()
        setBibliotecaImages(data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar biblioteca:', error)
    } finally {
      setLoadingImages(false)
    }
  }

  // Adicionar imagem da biblioteca ao canvas
  const addImageFromBiblioteca = async (bibliotecaItem: any) => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    try {
      const { FabricImage } = await import('fabric')
      
      const img = await FabricImage.fromURL(bibliotecaItem.url, {
        crossOrigin: 'anonymous'
      })
      
      if (img) {
        // Redimensionar a imagem para um tamanho adequado (80% menor)
        const maxSize = 30 // Tamanho máximo em pixels
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        
        img.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          scaleX: scale,
          scaleY: scale,
          originX: 'center',
          originY: 'center',
          selectable: true,
          moveable: true
        })
        
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
        updateElements()
      }
    } catch (error) {
      console.error('Erro ao adicionar imagem:', error)
      alert('Erro ao carregar imagem. Verifique se a URL é válida.')
    }
  }

  // Carregar imagens quando o componente montar
  useEffect(() => {
    if (showImageLibrary) {
      loadBibliotecaImages()
    }
  }, [showImageLibrary])

  // Funções de controle de zoom
  const zoomIn = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    let zoom = canvas.getZoom()
    zoom = zoom * 1.2
    if (zoom > 5) zoom = 5
    
    const center = canvas.getCenter()
    canvas.zoomToPoint(center, zoom)
    canvas.renderAll()
    setZoomLevel(zoom)
  }

  const zoomOut = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    let zoom = canvas.getZoom()
    zoom = zoom / 1.2
    if (zoom < 0.1) zoom = 0.1
    
    const center = canvas.getCenter()
    canvas.zoomToPoint(center, zoom)
    canvas.renderAll()
    setZoomLevel(zoom)
  }

  const resetZoom = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    canvas.setZoom(1)
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    canvas.renderAll()
    setZoomLevel(1)
  }

  // Funções de handler
  const handleMouseDown = (e: any) => {
    console.log('Mouse down event:', { drawingMode, hasCanvas: !!fabricCanvasRef.current, hasEvent: !!e.e })
    
    if (!fabricCanvasRef.current || !e.e) return

    const canvas = fabricCanvasRef.current
    const pointer = canvas.getPointer(e.e)
    
    console.log('Pointer:', pointer, 'Drawing mode:', drawingMode)

    // Para o modo texto, verificar se clicou em um texto existente
    if (drawingMode === 'text') {
      const clickedObject = canvas.findTarget(e.e, false)
      
      // Se clicou em um texto existente, permitir movê-lo (não criar novo)
      if (clickedObject && clickedObject.type === 'i-text') {
        canvas.setActiveObject(clickedObject)
        canvas.renderAll()
        return // Não criar novo texto
      }
      
      // Se não clicou em texto existente, criar novo
      createText(pointer)
      return
    }

    setIsDrawing(true)

    switch (drawingMode) {
      case 'rectangle':
        console.log('Creating rectangle at:', pointer)
        createRectangle(pointer)
        break
      case 'circle':
        console.log('Creating circle at:', pointer)
        createCircle(pointer)
        break
      case 'line':
        console.log('Creating line at:', pointer)
        createLine(pointer)
        break
      case 'polygon':
        console.log('Adding polygon point at:', pointer)
        handlePolygonPoint(pointer)
        break
      case 'fill':
        fillPolygon(pointer)
        break
    }
  }

  const handleMouseMove = (e: any) => {
    if (!fabricCanvasRef.current || !isDrawing || !e.e) return

    const canvas = fabricCanvasRef.current
    const pointer = canvas.getPointer(e.e)

    // Atualizar objetos sendo desenhados
    const activeObject = canvas.getActiveObject()
    if (activeObject && (drawingMode === 'rectangle' || drawingMode === 'circle' || drawingMode === 'line')) {
      updateShapeSize(activeObject, pointer)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleObjectAdded = () => {
    updateElements()
  }

  const handleObjectRemoved = () => {
    updateElements()
  }

  const handleObjectModified = () => {
    updateElements()
    // Atualizar posição do botão de delete se há objeto selecionado
    if (selectedObject) {
      updateDeleteButtonPosition(selectedObject)
    }
  }

  // Inicializar Fabric.js Canvas
  useEffect(() => {
    let cleanup: (() => void) | undefined
    let timeoutId: NodeJS.Timeout

    const loadFabric = async () => {
      // Aguardar múltiplos ticks para garantir que o canvas esteja no DOM
      await new Promise(resolve => {
        timeoutId = setTimeout(resolve, 100)
      })
      
      if (!canvasRef.current) {
        console.warn('Canvas element not found, retrying...')
        // Tentar novamente após um delay
        timeoutId = setTimeout(loadFabric, 200)
        return
      }
      
      try {
        const { Canvas } = await import('fabric')
        
        // Verificar se o canvas já foi inicializado
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose()
        }
        
        // Definir dimensões do canvas com largura fixa de 1000px
        const canvasWidth = 1000
        const canvasHeight = 400 // Mesma altura do mapa
        
        const canvas = new Canvas(canvasRef.current, {
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: '#ffffff',
          selection: true,
          renderOnAddRemove: true,
          preserveObjectStacking: true,
          interactive: true,
          allowTouchScrolling: false,
          enableRetinaScaling: false,
          stopContextMenu: true,
          fireRightClick: false,
          fireMiddleClick: false
        })

        fabricCanvasRef.current = canvas
        
        // Configurar zoom com scroll do mouse
        const canvasElement = canvas.getElement()
        if (canvasElement) {
          const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            
            const delta = e.deltaY
            let zoom = canvas.getZoom()
            zoom *= 0.999 ** delta
            
            // Limitar zoom entre 0.1x e 5x
            if (zoom > 5) zoom = 5
            if (zoom < 0.1) zoom = 0.1
            
            const pointer = canvas.getPointer(e)
             canvas.zoomToPoint(pointer, zoom)
             setZoomLevel(zoom)
          }
          
          canvasElement.addEventListener('wheel', handleWheel, { passive: false })
          
          // Armazenar referência para cleanup
          cleanup = () => {
            if (fabricCanvasRef.current) {
              fabricCanvasRef.current.dispose()
              fabricCanvasRef.current = null
            }
            if (timeoutId) {
              clearTimeout(timeoutId)
            }
            if (canvasElement) {
              canvasElement.removeEventListener('wheel', handleWheel)
            }
          }
        }
        
        setFabricLoaded(true)
        
        // Forçar renderização inicial
        canvas.renderAll()
      } catch (error) {
        console.error('Erro ao carregar Fabric.js:', error)
        setFabricLoaded(false)
      }
    }

    loadFabric()

    return () => {
      if (cleanup) {
        cleanup()
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  // Redimensionar canvas quando a janela for redimensionada
  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricLoaded) return

    const handleResize = () => {
      const canvas = fabricCanvasRef.current
      
      if (canvas) {
        const canvasWidth = 1000
        const canvasHeight = 400
        
        // Definir dimensões do canvas
        canvas.setDimensions({
          width: canvasWidth,
          height: canvasHeight
        })
        
        // Também definir as dimensões do elemento HTML do canvas
        const canvasElement = canvas.getElement()
        if (canvasElement) {
          canvasElement.style.width = '1000px'
          canvasElement.style.height = '400px'
        }
        
        canvas.renderAll()
      }
    }

    window.addEventListener('resize', handleResize)
    
    // Executar múltiplas vezes para garantir o redimensionamento correto
    setTimeout(handleResize, 50)
    setTimeout(handleResize, 200)
    setTimeout(handleResize, 500)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [fabricLoaded])

  // Função para deletar objetos selecionados
  const deleteSelectedObjects = () => {
    if (!fabricCanvasRef.current) return
    
    const canvas = fabricCanvasRef.current
    const activeObjects = canvas.getActiveObjects()
    
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj: any) => {
        // Não permitir deletar imagens de fundo (background e mapa)
        if (!obj.isBackground && !obj.isMapBackground) {
          canvas.remove(obj)
        }
      })
      canvas.discardActiveObject()
      canvas.renderAll()
      updateElements()
    }
  }

  // Função para deletar objeto específico
  const deleteSpecificObject = (obj: any) => {
    if (!fabricCanvasRef.current || !obj || obj.isBackground || obj.isMapBackground) return
    
    const canvas = fabricCanvasRef.current
    canvas.remove(obj)
    canvas.discardActiveObject()
    canvas.renderAll()
    setSelectedObject(null)
    setDeleteButtonPosition(null)
    updateElements()
  }

  // Função para posicionar o botão de delete
  const updateDeleteButtonPosition = (obj: any) => {
    if (!obj || !fabricCanvasRef.current) {
      setDeleteButtonPosition(null)
      return
    }

    const canvas = fabricCanvasRef.current
    const canvasElement = canvas.getElement()
    const canvasRect = canvasElement.getBoundingClientRect()
    
    // Obter as coordenadas do objeto no canvas
    const objBounds = obj.getBoundingRect()
    
    // Posicionar o botão no lado esquerdo ou acima do objeto para evitar sobreposição
    // Priorizar posição à esquerda, mas se não houver espaço, colocar acima
    let x, y
    
    // Verificar se há espaço à esquerda (pelo menos 50px)
    if (canvasRect.left + objBounds.left - 50 > 0) {
      // Posicionar à esquerda do objeto
      x = canvasRect.left + objBounds.left - 40
      y = canvasRect.top + objBounds.top
    } else {
      // Posicionar acima do objeto
      x = canvasRect.left + objBounds.left + (objBounds.width / 2) - 16 // Centralizar horizontalmente
      y = canvasRect.top + objBounds.top - 40
    }
    
    setDeleteButtonPosition({ x, y })
  }

  // Event listeners para seleção de objetos
  const handleObjectSelection = (e: any) => {
    const selectedObj = e.selected?.[0]
    if (selectedObj && !selectedObj.isBackground && !selectedObj.isMapBackground) {
      setSelectedObject(selectedObj)
      updateDeleteButtonPosition(selectedObj)
    } else {
      setSelectedObject(null)
      setDeleteButtonPosition(null)
    }
  }

  const handleObjectDeselection = () => {
    setSelectedObject(null)
    setDeleteButtonPosition(null)
  }

  // Event listener para teclas
  const handleKeyDown = (e: KeyboardEvent) => {
    // Verificar se não estamos editando texto
    const activeObject = fabricCanvasRef.current?.getActiveObject()
    const isEditingText = activeObject && activeObject.type === 'i-text' && (activeObject as any).isEditing
    
    if (!isEditingText && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault()
      deleteSelectedObjects()
    }
  }

  // Configurar event listeners após o canvas estar carregado
  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricLoaded) return

    const canvas = fabricCanvasRef.current
    
    // Event listeners do canvas
    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
    canvas.on('object:added', handleObjectAdded)
    canvas.on('object:removed', handleObjectRemoved)
    canvas.on('object:modified', handleObjectModified)

    // Event listener para teclas
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      if (canvas) {
        canvas.off('mouse:down', handleMouseDown)
        canvas.off('mouse:move', handleMouseMove)
        canvas.off('mouse:up', handleMouseUp)
        canvas.off('object:added', handleObjectAdded)
        canvas.off('object:removed', handleObjectRemoved)
        canvas.off('object:modified', handleObjectModified)
      }
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [fabricLoaded, drawingMode, isDrawing, selectedColor, strokeWidth, fillColor, currentPath])

  // Event listeners para seleção de objetos (separado para evitar problemas de dependência)
  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricLoaded) return

    const canvas = fabricCanvasRef.current
    
    canvas.on('selection:created', handleObjectSelection)
    canvas.on('selection:updated', handleObjectSelection)
    canvas.on('selection:cleared', handleObjectDeselection)

    return () => {
      if (canvas) {
        canvas.off('selection:created', handleObjectSelection)
        canvas.off('selection:updated', handleObjectSelection)
        canvas.off('selection:cleared', handleObjectDeselection)
      }
    }
  }, [fabricLoaded])

  // Carregar imagem de fundo
  useEffect(() => {
    if (!fabricCanvasRef.current || !backgroundImage || !fabricLoaded) return

    const loadBackgroundImage = async () => {
      try {
        const { FabricImage } = await import('fabric')
        
        // Remover imagem de fundo anterior se existir
        const canvas = fabricCanvasRef.current
        const existingBackground = canvas.getObjects().find((obj: any) => obj.isBackground)
        if (existingBackground) {
          canvas.remove(existingBackground)
        }

        // Criar nova imagem de fundo
        const imgElement = new Image()
        imgElement.crossOrigin = 'anonymous'
        imgElement.onload = () => {
          const fabricImg = new FabricImage(imgElement, {
            left: 0,
            top: 0,
            selectable: false,
            evented: false,
            isBackground: true
          })

          // Ajustar tamanho da imagem para caber no canvas
          const canvasWidth = canvas.getWidth()
          const canvasHeight = canvas.getHeight()
          const imgWidth = imgElement.width
          const imgHeight = imgElement.height

          const scaleX = canvasWidth / imgWidth
          const scaleY = canvasHeight / imgHeight
          const scale = Math.min(scaleX, scaleY)

          fabricImg.scale(scale)
          
          // Centralizar a imagem
          fabricImg.set({
            left: (canvasWidth - imgWidth * scale) / 2,
            top: (canvasHeight - imgHeight * scale) / 2
          })

          canvas.add(fabricImg)
          canvas.sendObjectToBack(fabricImg)
          canvas.renderAll()
          setBackgroundImageLoaded(true)
        }
        imgElement.src = backgroundImage
      } catch (error) {
        console.error('Erro ao carregar imagem de fundo:', error)
      }
    }

    loadBackgroundImage()
  }, [backgroundImage, fabricLoaded])

  // Processar elementos externos
  useEffect(() => {
    if (!fabricCanvasRef.current || !externalElements || !fabricLoaded) return

    const loadExternalElements = async () => {
      try {
        const canvas = fabricCanvasRef.current
        const { FabricImage } = await import('fabric')
        
        // Remover apenas elementos externos anteriores (preservar objetos do usuário)
        const existingExternalElements = canvas.getObjects().filter((obj: any) => obj.isExternalElement)
        existingExternalElements.forEach((obj: any) => canvas.remove(obj))
        
        // Adicionar novos elementos externos
        for (const element of externalElements) {
          if (element.type === 'image' && element.data?.imageUrl) {
            const imgElement = new Image()
            imgElement.crossOrigin = 'anonymous'
            imgElement.onload = () => {
              // Redimensionar a imagem para ocupar toda a área de desenho
              const canvasWidth = canvas.getWidth()
              const canvasHeight = canvas.getHeight()
              
              const fabricImg = new FabricImage(imgElement, {
                left: 0,
                top: 0,
                selectable: false,
                evented: false,
                isExternalElement: true,
                isMapBackground: true // Marcador para identificar como fundo do mapa
              })

              // Redimensionar a imagem para ocupar toda a área do canvas
              fabricImg.scaleToWidth(canvasWidth)
              fabricImg.scaleToHeight(canvasHeight)

              canvas.add(fabricImg)
              // Enviar imagem para trás de todos os outros objetos
              canvas.sendObjectToBack(fabricImg)
              canvas.renderAll()
            }
            imgElement.src = element.data.imageUrl
          }
        }
      } catch (error) {
        console.error('Erro ao carregar elementos externos:', error)
      }
    }

    loadExternalElements()
  }, [externalElements, fabricLoaded])

  // Atualizar modo de desenho
  useEffect(() => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    canvas.isDrawingMode = false
    canvas.selection = drawingMode === 'select'
    
    // Garantir que o canvas seja interativo para todos os modos
    canvas.interactive = true
    canvas.evented = true
    
    // Configurar cursor baseado no modo
    if (drawingMode === 'pan') {
      canvas.defaultCursor = 'grab'
      canvas.hoverCursor = 'grab'
      canvas.moveCursor = 'grabbing'
    } else {
      canvas.defaultCursor = drawingMode === 'select' ? 'default' : 'crosshair'
      canvas.hoverCursor = 'move'
      canvas.moveCursor = 'move'
    }
    
    canvas.renderAll()
  }, [drawingMode])

  const createRectangle = async (pointer: any) => {
    if (!fabricCanvasRef.current) return

    const { Rect } = await import('fabric')
    const rect = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: fillColor,
      stroke: selectedColor,
      strokeWidth: strokeWidth,
      selectable: true,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      perPixelTargetFind: true
    })

    fabricCanvasRef.current.add(rect)
    fabricCanvasRef.current.setActiveObject(rect)
  }

  const createCircle = async (pointer: any) => {
    if (!fabricCanvasRef.current) return

    const { Circle } = await import('fabric')
    const circle = new Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 0,
      fill: fillColor,
      stroke: selectedColor,
      strokeWidth: strokeWidth,
      selectable: true
    })

    fabricCanvasRef.current.add(circle)
    fabricCanvasRef.current.setActiveObject(circle)
  }

  const createLine = async (pointer: any) => {
    if (!fabricCanvasRef.current) return

    const { Line } = await import('fabric')
    const line = new Line([
      pointer.x,
      pointer.y,
      pointer.x + 1,
      pointer.y + 1
    ], {
      stroke: selectedColor,
      strokeWidth: strokeWidth,
      selectable: true
    })

    fabricCanvasRef.current.add(line)
    fabricCanvasRef.current.setActiveObject(line)
  }

  const createText = async (pointer: any) => {
    if (!fabricCanvasRef.current) return

    const { IText } = await import('fabric')
    const text = new IText('Texto', {
      left: pointer.x,
      top: pointer.y,
      fontFamily: 'Arial',
      fontSize: 16,
      fill: selectedColor,
      selectable: true,
      editable: true
    })

    fabricCanvasRef.current.add(text)
    fabricCanvasRef.current.setActiveObject(text)
    
    // Entrar automaticamente em modo de edição
    setTimeout(() => {
      text.enterEditing()
      text.selectAll()
    }, 100)
  }

  const handlePolygonPoint = async (pointer: any) => {
    const newPath = [...currentPath, pointer]
    
    // Verificar se o polígono deve ser fechado automaticamente
    if (newPath.length >= 3) {
      const firstPoint = newPath[0]
      const distance = Math.sqrt(
        Math.pow(pointer.x - firstPoint.x, 2) + 
        Math.pow(pointer.y - firstPoint.y, 2)
      )
      
      // Se o último ponto está próximo do primeiro (dentro de 10 pixels), fechar o polígono
       if (distance <= 10) {
         const finalPath = newPath.slice(0, -1) // Remove o último ponto duplicado
         await finishPolygonWithPath(finalPath)
         return
       }
    }
    
    setCurrentPath(newPath)
    
    if (newPath.length >= 2) {
      // Criar linha temporária conectando o ponto anterior ao atual
      const { Line } = await import('fabric')
      const line = new Line([
        newPath[newPath.length - 2].x,
        newPath[newPath.length - 2].y,
        pointer.x,
        pointer.y
      ], {
        stroke: selectedColor,
        strokeWidth: strokeWidth,
        selectable: false,
        isPolygonLine: true // Marcador para identificar linhas do polígono
      })
      
      fabricCanvasRef.current?.add(line)
    }
    
    // Adicionar um pequeno círculo para marcar o ponto
    const { Circle } = await import('fabric')
    const pointMarker = new Circle({
      left: pointer.x - 3,
      top: pointer.y - 3,
      radius: 3,
      fill: selectedColor,
      selectable: false,
      isPolygonPoint: true // Marcador para identificar pontos do polígono
    })
    
    fabricCanvasRef.current?.add(pointMarker)
    
    // Destacar o primeiro ponto quando há pelo menos 3 pontos
    if (newPath.length >= 3) {
      const firstPointMarker = new Circle({
        left: newPath[0].x - 5,
        top: newPath[0].y - 5,
        radius: 5,
        fill: 'transparent',
        stroke: selectedColor,
        strokeWidth: 2,
        selectable: false,
        isPolygonPoint: true
      })
      
      fabricCanvasRef.current?.add(firstPointMarker)
    }
  }

  const finishPolygon = async () => {
    if (currentPath.length < 3) {
      alert('Um polígono precisa de pelo menos 3 pontos!')
      return
    }

    await finishPolygonWithPath(currentPath)
  }

  const finishPolygonWithPath = async (path: any[]) => {
    if (path.length < 3 || !fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    
    // Remover linhas temporárias e pontos marcadores do polígono
    const objectsToRemove = canvas.getObjects().filter((obj: any) => 
      (obj as any).isPolygonLine || (obj as any).isPolygonPoint
    )
    objectsToRemove.forEach((obj: any) => canvas.remove(obj))

    const { Polygon } = await import('fabric')
    const points = path.map(p => ({ x: p.x, y: p.y }))
    const polygon = new Polygon(points, {
      fill: fillColor,
      stroke: selectedColor,
      strokeWidth: strokeWidth,
      selectable: true,
      strokeLineCap: 'round',
      strokeLineJoin: 'round',
      perPixelTargetFind: true
    })
    
    canvas.add(polygon)
    canvas.renderAll()
    setCurrentPath([])
    setDrawingMode('select')
  }

  const fillPolygon = (pointer: any) => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    const objects = canvas.getObjects()
    
    // Encontrar a forma que contém o ponto clicado
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i]
      // Verificar se é uma forma preenchível (polígono, retângulo, círculo)
      if ((obj.type === 'polygon' || obj.type === 'rect' || obj.type === 'circle') && 
          obj.containsPoint && obj.containsPoint(pointer)) {
        // Preencher a forma com a cor selecionada
        obj.set('fill', fillColor === 'transparent' ? selectedColor : fillColor)
        canvas.renderAll()
        break
      }
    }
  }

  const cancelPolygon = () => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    
    // Remover linhas temporárias e pontos marcadores do polígono
    const objectsToRemove = canvas.getObjects().filter((obj: any) => 
      (obj as any).isPolygonLine || (obj as any).isPolygonPoint
    )
    objectsToRemove.forEach((obj: any) => canvas.remove(obj))
    
    canvas.renderAll()
    setCurrentPath([])
    setDrawingMode('select')
  }

  const updateShapeSize = (obj: any, pointer: any) => {
    if (obj.type === 'rect') {
      const rect = obj
      rect.set({
        width: Math.abs(pointer.x - rect.left!),
        height: Math.abs(pointer.y - rect.top!)
      })
    } else if (obj.type === 'circle') {
      const circle = obj
      const radius = Math.sqrt(
        Math.pow(pointer.x - circle.left!, 2) + 
        Math.pow(pointer.y - circle.top!, 2)
      )
      circle.set({ radius })
    } else if (obj.type === 'line') {
      const line = obj
      line.set({
        x2: pointer.x,
        y2: pointer.y
      })
    }
    
    fabricCanvasRef.current?.renderAll()
  }

  const updateElements = () => {
    if (!fabricCanvasRef.current) return

    const objects = fabricCanvasRef.current.getObjects()
    const newElements: DrawingElement[] = objects.map((obj: any, index: number) => ({
      id: `element-${index}`,
      type: getElementType(obj),
      coordinates: getObjectCoordinates(obj),
      properties: {
        color: obj.stroke as string || selectedColor,
        strokeWidth: obj.strokeWidth || strokeWidth,
        fillColor: obj.fill as string,
        category: 'other'
      }
    }))

    setElements(newElements)
    onElementsChange?.(newElements)
  }

  const getElementType = (obj: any): DrawingElement['type'] => {
    if (obj.type === 'i-text') return 'text'
    if (obj.type === 'line') return 'line'
    if (obj.type === 'image') return 'image'
    return 'point'
  }

  const getObjectCoordinates = (obj: any): { lat: number; lng: number }[] => {
    // Converter coordenadas do canvas para coordenadas geográficas
    // Esta é uma implementação simplificada
    return [{ lat: obj.top || 0, lng: obj.left || 0 }]
  }

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    
    const canvas = fabricCanvasRef.current
    
    // Preservar imagens de fundo (background e mapa)
    const backgroundObjects = canvas.getObjects().filter((obj: any) => 
      obj.isBackground || obj.isMapBackground
    )
    
    // Limpar canvas
    canvas.clear()
    
    // Readicionar imagens de fundo
    backgroundObjects.forEach((obj: any) => {
      canvas.add(obj)
      canvas.sendObjectToBack(obj)
    })
    
    canvas.renderAll()
    setElements([])
    onElementsChange?.([])
  }

  const handleClearCanvas = () => {
    clearCanvas()
    setShowClearDialog(false)
  }

  const clearMapCapture = () => {
    if (!fabricCanvasRef.current) return
    
    const canvas = fabricCanvasRef.current
    
    // Remover imagens de fundo (backgroundImage)
    setBackgroundImageLoaded(false)
    
    // Remover objetos do canvas que são de fundo
    const mapCaptureObjects = canvas.getObjects().filter((obj: any) => obj.isMapBackground || obj.isBackground)
    
    mapCaptureObjects.forEach((obj: any) => {
      canvas.remove(obj)
    })
    
    // Também remover elementos de imagem que são de fundo
    const updatedElements = elements.filter(el => 
      !(el.type === 'image' && el.properties?.label === 'Mapa de Fundo')
    )
    
    setElements(updatedElements)
    
    if (onElementsChange) {
      onElementsChange(updatedElements)
    }
    
    canvas.renderAll()
  }

  const exportCanvas = () => {
    if (!fabricCanvasRef.current) return

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1
    })

    const link = document.createElement('a')
    link.download = 'planta-localizacao.png'
    link.href = dataURL
    link.click()
  }









  const tools = [
    { mode: 'select' as DrawingMode, icon: MousePointer, label: 'Selecionar' },
    { mode: 'pan' as DrawingMode, icon: Move, label: 'Mover' },
    { mode: 'rectangle' as DrawingMode, icon: Square, label: 'Retângulo' },
    { mode: 'circle' as DrawingMode, icon: Circle, label: 'Círculo' },
    { mode: 'line' as DrawingMode, icon: Minus, label: 'Linha' },
    { mode: 'polygon' as DrawingMode, icon: Spline, label: 'Polígono' },
    { mode: 'fill' as DrawingMode, icon: PaintBucket, label: 'Pintar' },
    { mode: 'text' as DrawingMode, icon: Type, label: 'Texto' }
  ]



  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pencil className="h-5 w-5" />
          Ferramentas de Desenho
        </CardTitle>
        <CardDescription>
          Desenhe e anote elementos na planta de localização
          {backgroundImageLoaded && mapSettings && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <ImageOff className="h-4 w-4" />
                <span>Imagem do mapa carregada</span>
              </div>
              <div className="text-xs text-green-600 mt-1">
                Coordenadas: {mapSettings.center.lat.toFixed(6)}, {mapSettings.center.lng.toFixed(6)} | Zoom: {mapSettings.zoom}
              </div>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-full space-y-4">
        {/* Barra de Ferramentas */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Ferramentas de Desenho */}
          <div className="flex flex-wrap gap-2">
            {tools.map(({ mode, icon: Icon, label }) => (
              <Tooltip key={mode}>
                <TooltipTrigger asChild>
                  <Button
                    variant={drawingMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDrawingMode(mode)}
                    className={`flex items-center justify-center w-10 h-10 p-0 ${
                      drawingMode === mode 
                        ? 'bg-black hover:bg-gray-800 text-white border-black' 
                        : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-black">
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          
          {/* Separador Vertical */}
          <div className="h-10 w-px bg-gray-300 mx-2"></div>
          
          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-2">
            <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                      <Eraser className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-black">
                  <p>Limpar Tudo</p>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Limpeza</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja limpar todo o desenho? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearCanvas} className="bg-red-600 hover:bg-red-700">
                    Limpar Tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={clearMapCapture} variant="outline" size="sm" className="w-10 h-10 p-0">
                  <ImageOff className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white border-black">
                <p>Limpar Captura</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={exportCanvas} variant="outline" size="sm" className="w-10 h-10 p-0">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white border-black">
                <p>Exportar</p>
              </TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-8" />
            
            {/* Controles de Zoom */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={zoomIn} variant="outline" size="sm" className="w-10 h-10 p-0">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white border-black">
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={zoomOut} variant="outline" size="sm" className="w-10 h-10 p-0">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white border-black">
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={resetZoom} variant="outline" size="sm" className="w-10 h-10 p-0">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white border-black">
                <p>Reset Zoom</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="flex items-center px-2 py-1 bg-gray-100 rounded text-xs font-mono">
              {Math.round(zoomLevel * 100)}%
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => setShowImageLibrary(!showImageLibrary)}
                  variant={showImageLibrary ? "default" : "outline"} 
                  size="sm" 
                  className="w-10 h-10 p-0"
                >
                  <Library className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white border-black">
                <p>Biblioteca de Imagens</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <Separator />

        {/* Biblioteca de Imagens */}
        {showImageLibrary && (
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Library className="h-5 w-5" />
                  Biblioteca de Imagens
                </div>
                <Button 
                  onClick={loadBibliotecaImages}
                  variant="outline"
                  size="sm"
                  disabled={loadingImages}
                >
                  Atualizar
                </Button>
              </CardTitle>
              <CardDescription>
                Selecione imagens cadastradas para inserir no desenho
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingImages ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-gray-500">Carregando imagens...</div>
                </div>
              ) : bibliotecaImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Library className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma imagem cadastrada</p>
                  <p className="text-xs">Cadastre imagens na seção Biblioteca</p>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-3 max-h-[300px] overflow-y-auto">
                  {bibliotecaImages.map((item) => (
                    <div key={item.id} className="group relative col-span-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="rounded-lg pb-3 hover:bg-gray-100 cursor-pointer transition-colors bg-white text-center flex items-center justify-center py-[5px]"
                            onClick={() => addImageFromBiblioteca(item)}
                          >
                            <div className="w-[25px] h-[25px] flex items-center justify-center overflow-hidden">
                              <img 
                                src={item.url} 
                                alt={item.descricao}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNCA0IDI4IDIwIDI4IDIwQzI4IDI0IDI0IDI4IDIwIDI4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                                }}
                              />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white border-black">
                          <div className="text-center">
                            <p className="font-medium">{item.descricao}</p>
                            <p className="text-xs text-gray-300">{item.tipo}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              )}

            </CardContent>
          </Card>
        )}



        {/* Configurações */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Cor da Linha</Label>
            <div className="flex gap-2">
              {Object.entries(COLORS).map(([name, color]) => (
                <button
                  key={name}
                  className={`w-8 h-8 rounded border-2 ${
                    selectedColor === color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor de Preenchimento</Label>
            <div className="flex gap-2">
              <button
                className={`w-8 h-8 rounded border-2 ${
                  fillColor === 'transparent' ? 'border-gray-900' : 'border-gray-300'
                } bg-white relative`}
                onClick={() => setFillColor('transparent')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-500 to-transparent opacity-50"></div>
              </button>
              {Object.entries(COLORS).map(([name, color]) => (
                <button
                  key={name}
                  className={`w-8 h-8 rounded border-2 ${
                    fillColor === color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFillColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strokeWidth">Espessura</Label>
            <Input
              id="strokeWidth"
              type="number"
              min="1"
              max="10"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Elementos</Label>
            <Badge variant="secondary">
              {elements.length} elemento(s)
            </Badge>
          </div>
        </div>

        {/* Canvas */}
        <div className="border rounded-lg overflow-hidden bg-white" style={{ height: '400px', width: '1000px' }}>
          {!fabricLoaded && (
            <div className="flex items-center justify-center bg-gray-50 h-full w-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Carregando ferramentas de desenho...</p>
              </div>
            </div>
          )}
          <div className={`${!fabricLoaded ? 'hidden' : 'block'} h-full w-full`}>
            <canvas 
              ref={canvasRef} 
              className="block"
              style={{ 
                width: '100%',
                height: '100%',
                cursor: drawingMode === 'select' ? 'default' : drawingMode === 'fill' ? 'pointer' : 'crosshair'
              }}
            />
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-2">
          {drawingMode === 'polygon' && currentPath.length > 0 && (
            <div className="flex gap-2">
              {currentPath.length >= 3 && (
                <Button onClick={finishPolygon} size="sm" className="bg-green-600 hover:bg-green-700">
                  Finalizar Polígono ({currentPath.length} pontos)
                </Button>
              )}
              <Button onClick={cancelPolygon} variant="outline" size="sm">
                Cancelar Polígono
              </Button>
            </div>
          )}
          
          {drawingMode === 'polygon' && currentPath.length === 0 && (
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded px-3 py-2">
              💡 Clique para adicionar pontos ao polígono. Mínimo 3 pontos necessários. O polígono será fechado automaticamente quando você clicar próximo ao primeiro ponto.
            </div>
          )}
          
          {drawingMode === 'fill' && (
            <div className="text-sm text-gray-600 bg-orange-50 border border-orange-200 rounded px-3 py-2">
              🎨 Clique em uma forma (polígono, retângulo ou círculo) para preenchê-la com a cor selecionada.
            </div>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={deleteSelectedObjects} variant="outline" size="sm" className="w-10 h-10 p-0">
                <Eraser className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white border-black">
              <p>Deletar Selecionado</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
      
      {/* Botão flutuante de delete */}
      {deleteButtonPosition && selectedObject && (
        <button
          onClick={() => deleteSpecificObject(selectedObject)}
          className="fixed z-50 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
          style={{
            left: `${deleteButtonPosition.x}px`,
            top: `${deleteButtonPosition.y}px`,
          }}
          title="Deletar elemento"
        >
          <Eraser size={16} />
        </button>
      )}
    </Card>
  )
}