import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET - Buscar biblioteca específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    const biblioteca = await prisma.biblioteca.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!biblioteca) {
      return NextResponse.json(
        { error: 'Biblioteca não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(biblioteca)

  } catch (error) {
    console.error('Erro ao buscar biblioteca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar biblioteca
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { descricao, tipo, url, status } = body

    // Verificar se a biblioteca existe e pertence ao usuário
    const bibliotecaExistente = await prisma.biblioteca.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!bibliotecaExistente) {
      return NextResponse.json(
        { error: 'Biblioteca não encontrada' },
        { status: 404 }
      )
    }

    // Validar tipos permitidos se fornecido
    if (tipo) {
      const tiposPermitidos = ['legenda', 'figuras', 'personalizado']
      if (!tiposPermitidos.includes(tipo)) {
        return NextResponse.json(
          { error: 'Tipo deve ser: legenda, figuras ou personalizado' },
          { status: 400 }
        )
      }
    }

    // Preparar dados para atualização
    const dadosAtualizacao: any = {
      updatedAt: new Date()
    }

    if (descricao !== undefined) dadosAtualizacao.descricao = descricao
    if (tipo !== undefined) dadosAtualizacao.tipo = tipo
    if (url !== undefined) dadosAtualizacao.url = url
    if (status !== undefined) dadosAtualizacao.status = status

    const biblioteca = await prisma.biblioteca.update({
      where: { id },
      data: dadosAtualizacao
    })

    return NextResponse.json(biblioteca)

  } catch (error) {
    console.error('Erro ao atualizar biblioteca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir biblioteca (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // Verificar se a biblioteca existe e pertence ao usuário
    const bibliotecaExistente = await prisma.biblioteca.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!bibliotecaExistente) {
      return NextResponse.json(
        { error: 'Biblioteca não encontrada' },
        { status: 404 }
      )
    }

    // Soft delete - apenas muda o status para 'i' (inativo)
    await prisma.biblioteca.update({
      where: { id },
      data: {
        status: 'i',
        updatedAt: new Date()
      }
    })

    return NextResponse.json(
      { message: 'Biblioteca excluída com sucesso' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erro ao excluir biblioteca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}