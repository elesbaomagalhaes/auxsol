import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { DocumentacaoPageClient } from "./client"
import { Decimal } from "@prisma/client/runtime/library"

// Função para serializar objetos com campos Decimal
function serializeDecimalFields(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (obj instanceof Decimal) {
    return Number(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeDecimalFields)
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeDecimalFields(value)
    }
    return serialized
  }
  
  return obj
}

interface DocumentacaoPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DocumentacaoPage({ params }: DocumentacaoPageProps) {
  const { id } = await params;
  const session = await auth()
  if (!session) {
    redirect("/sign-in")
  }

  // Buscar o projeto com todas as informações necessárias
  const projeto = await prisma.projeto.findUnique({
    where: {
      id: id
    },
    include: {
      cliente: true,
      acesso: true,
      tecnico: true
    }
  })

  if (!projeto) {
    redirect("/dashboard/projeto/gerenciamento")
  }

  // Buscar kits do projeto
  const kits = await prisma.kit.findMany({
    where: {
      numProjeto: projeto.numProjeto
    },
    select: {
      id: true,
      tipo: true,
      itemId: true,
      qtd: true,
      potenciaGerador: true,
      potenciaInversor: true,
      string: true,
    }
  })

  // Buscar dados do inversor se houver kit do tipo inversor
  const kitInversor = kits.find(kit => kit.tipo === 'inversor')
  let inversorData = null
  
  if (kitInversor) {
    inversorData = await prisma.inversor.findUnique({
      where: {
        id: kitInversor.itemId
      },
      select: {
        id: true,
        fabricante: true,
        modelo: true,
        correnteNomSai: true,
        correnteMaxSai: true,
        tensaoNomSai: true,
        potenciaNomSai: true,
        tipoLigacao: true
      }
    })
  }

  // Serializar todos os campos Decimal do projeto e remover funções
  const projetoSerializado = serializeDecimalFields(JSON.parse(JSON.stringify(projeto)))
  const inversorSerializado = inversorData ? serializeDecimalFields(JSON.parse(JSON.stringify(inversorData))) : null

  return <DocumentacaoPageClient projeto={projetoSerializado} inversor={inversorSerializado} />
}