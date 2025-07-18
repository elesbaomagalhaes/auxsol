import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET - Listar todas as bibliotecas do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status') || 'a'

    const where: any = {
      userId: session.user.id,
      status
    }

    if (tipo && tipo !== 'todos') {
      where.tipo = tipo
    }

    const bibliotecas = await prisma.biblioteca.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bibliotecas)

  } catch (error) {
    console.error('Erro ao buscar bibliotecas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova biblioteca
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { descricao, tipo, url } = body

    // Validações
    if (!descricao || !tipo || !url) {
      return NextResponse.json(
        { error: 'Descrição, tipo e URL são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar tipos permitidos
    const tiposPermitidos = ['legenda', 'figuras', 'personalizado']
    if (!tiposPermitidos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo deve ser: legenda, figuras ou personalizado' },
        { status: 400 }
      )
    }

    const biblioteca = await prisma.biblioteca.create({
      data: {
        descricao,
        tipo,
        url,
        userId: session.user.id
      }
    })

    return NextResponse.json(biblioteca, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar biblioteca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}