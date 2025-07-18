"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, Zap, Battery, MapPin } from "lucide-react"

interface ProjetoStatsProps {
  totalProjetos: number
  potenciaGeradorTotal: number
  potenciaInversorTotal: number
  cidadesAtendidas: number
}

export function ProjetoStats({ 
  totalProjetos, 
  potenciaGeradorTotal, 
  potenciaInversorTotal, 
  cidadesAtendidas 
}: ProjetoStatsProps) {


  const stats = [
    {
      title: "Total de Projetos",
      value: totalProjetos.toString(),
      description: "Projetos cadastrados",
      icon: FolderKanban,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Potência Total Gerador",
      value: potenciaGeradorTotal.toString(),
      description: "Capacidade de geração",
      icon: Zap,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Potência Total Inversor",
      value: potenciaInversorTotal.toString(),
      description: "Capacidade de conversão",
      icon: Battery,
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Cidades Atendidas",
      value: cidadesAtendidas.toString(),
      description: "Localidades diferentes",
      icon: MapPin,
      color: "bg-purple-100 text-purple-700",
    },
  ]

  return (
    <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight text-left">
              {stat.title}
            </CardTitle>
            <div className={`rounded-full p-1.5 sm:p-2 ${stat.color} flex-shrink-0`}>
              <stat.icon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{stat.value}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-tight">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}