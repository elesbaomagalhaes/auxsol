import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projeto = await prisma.projeto.findUnique({
      where: {
        id: id
      },
      include: {
        cliente: true
      }
    })

    if (!projeto) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    // Transformar os dados para o formato esperado pelo frontend
    const endereco = `${projeto.cliente.rua}, ${projeto.cliente.numero}${projeto.cliente.complemento ? `, ${projeto.cliente.complemento}` : ''}`
    
    const response = {
      id: projeto.id,
      numProjeto: projeto.numProjeto,
      createdAt: projeto.createdAt.toISOString(),
      urlMapa: (projeto as any).urlMapa || null,
      cliente: {
        nome: projeto.cliente.nome,
        endereco: endereco,
        cidade: projeto.cliente.cidade,
        uf: projeto.cliente.uf,
        cep: projeto.cliente.cep
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Erro ao buscar projeto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}