import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ cpf: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { cpf } = await params
    const body = await request.json()

    // Verificar se o acesso existe
    const acessoExistente = await prisma.acesso.findUnique({
      where: {
        clienteCpf: cpf
      }
    })

    if (!acessoExistente) {
      return NextResponse.json(
        { error: "Dados de acesso não encontrados para este cliente" },
        { status: 404 }
      )
    }

    // Atualizar apenas os campos fornecidos
    const acessoAtualizado = await prisma.acesso.update({
      where: {
        clienteCpf: cpf
      },
      data: {
        ...(body.longitudeUTM && { longitudeUTM: body.longitudeUTM }),
        ...(body.latitudeUTM && { latitudeUTM: body.latitudeUTM }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(acessoAtualizado)
  } catch (error) {
    console.error("Erro ao atualizar acesso:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cpf: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { cpf } = await params

    const acesso = await prisma.acesso.findUnique({
      where: {
        clienteCpf: cpf
      },
      include: {
        client: true
      }
    })

    if (!acesso) {
      return NextResponse.json(
        { error: "Dados de acesso não encontrados" },
        { status: 404 }
      )
    }

    return NextResponse.json(acesso)
  } catch (error) {
    console.error("Erro ao buscar acesso:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}