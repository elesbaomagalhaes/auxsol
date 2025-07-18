import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { inversorSchema } from '@/lib/schema/inversorSchema'

/**
 * API route para atualizar um inversor específico
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    
    // Validar dados usando o schema Zod
    const validatedData = inversorSchema.safeParse(body)
    
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos',
          details: validatedData.error.errors
        },
        { status: 400 }
      )
    }

    // Verificar se o inversor existe e pertence ao usuário
    const inversorExistente = await prisma.inversor.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!inversorExistente) {
      return NextResponse.json(
        { error: 'Inversor não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o inversor
    const inversorAtualizado = await prisma.inversor.update({
      where: { id },
      data: {
        ...validatedData.data,
      }
    })

    return NextResponse.json(
      { 
        message: 'Inversor atualizado com sucesso!',
        inversor: inversorAtualizado
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao atualizar inversor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * API route para deletar um inversor específico
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verificar se o inversor existe e pertence ao usuário
    const inversorExistente = await prisma.inversor.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!inversorExistente) {
      return NextResponse.json(
        { error: 'Inversor não encontrado' },
        { status: 404 }
      )
    }

    // Deletar o inversor
    await prisma.inversor.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Inversor deletado com sucesso!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao deletar inversor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * API route para buscar um inversor específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Buscar o inversor
    const inversor = await prisma.inversor.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!inversor) {
      return NextResponse.json(
        { error: 'Inversor não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(inversor)
  } catch (error) {
    console.error('Erro ao buscar inversor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}