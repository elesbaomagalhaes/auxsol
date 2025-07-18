"use client"

import { toast } from "sonner"
import { CheckCircle, Sparkles, Zap, Settings, FolderCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessToastProps {
  title: string
  description?: string
  duration?: number
  icon?: 'check' | 'sparkles' | 'zap'
  animated?: boolean
}

export const showSuccessToast = ({
  title,
  description,
  duration = 4000,
  icon = 'check',
  animated = true
}: SuccessToastProps) => {
  const iconMap = {
    check: CheckCircle,
    sparkles: Sparkles,
    zap: Zap
  }
  
  const IconComponent = iconMap[icon]
  
  return toast.success(title, {
    description,
    duration,
    icon: (
      <div className={cn(
        "flex items-center justify-center w-5 h-5 rounded-full",
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        animated && "animate-bounce"
      )}>
        <IconComponent className={cn(
          "w-3 h-3",
          animated && "animate-pulse"
        )} />
      </div>
    ),
    className: cn(
      "group",
      animated && [
        "animate-in slide-in-from-right-full",
        "data-[swipe=move]:transition-none",
        "data-[swipe=cancel]:translate-x-0",
        "data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full",
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full data-[state=open]:duration-300",
        "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full data-[state=closed]:duration-200"
      ]
    ),
    style: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      border: '1px solid #10b981',
      color: 'white'
    }
  })
}

// Toasts específicos para cada tipo de cadastro
export const showClienteSuccessToast = (nomeCliente?: string) => {
  return showSuccessToast({
    title: "Cliente cadastrado com sucesso!",
    description: nomeCliente ? `${nomeCliente} foi adicionado ao sistema.` : "Dados do cliente salvos no banco de dados.",
    icon: 'check',
    duration: 4000
  })
}

export const showTecnicoSuccessToast = (nomeTecnico?: string) => {
  return showSuccessToast({
    title: "Técnico cadastrado com sucesso!",
    description: nomeTecnico ? `${nomeTecnico} foi adicionado ao sistema.` : "Dados do técnico salvos no banco de dados.",
    icon: 'zap',
    duration: 4000
  })
}

export const showEquipamentoSuccessToast = (tipo: string, nome: string) => {
  toast.success(
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        <Settings className="h-5 w-5 text-orange-600 animate-spin" style={{
          animation: 'spin 2s linear infinite'
        }} />
      </div>
      <div>
        <div className="font-semibold text-gray-900">
          {tipo} cadastrado com sucesso!
        </div>
        <div className="text-sm text-gray-600">
          {nome} foi adicionado ao catálogo
        </div>
      </div>
    </div>,
    {
      duration: 4000,
      style: {
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        color: '#9a3412'
      }
    }
  )
}

export const showProjetoSuccessToast = (numProjeto: string) => {
  toast.success(
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        <FolderCheck className="h-5 w-5 text-blue-600 animate-bounce" />
      </div>
      <div>
        <div className="font-semibold text-gray-900">
          Projeto {numProjeto} foi criado e salvo no sistema!
        </div>
        <div className="text-sm text-gray-600">
          Todos os dados foram processados com sucesso
        </div>
      </div>
    </div>,
    {
      duration: 4000,
      style: {
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#1e40af'
      }
    }
  )
}

export const showCelebrationToast = (numProjeto: string) => {
  // Toast especial com efeito de celebração
  toast.success(
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
      </div>
      <div>
        <div className="font-bold text-gray-900 text-lg">
          🎉 Projeto Concluído!
        </div>
        <div className="text-sm text-gray-600">
          Projeto {numProjeto} foi cadastrado com sucesso!
        </div>
        <div className="text-xs text-gray-500 mt-1">
          ✨ Parabéns! Todos os dados foram salvos.
        </div>
      </div>
    </div>,
    {
      duration: 6000,
      style: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '2px solid #f59e0b',
        color: '#92400e',
        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
      }
    }
  )
}