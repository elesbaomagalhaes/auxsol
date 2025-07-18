import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para equipamento
const equipamentoSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  potencia: z.number().positive('Potência deve ser positiva'),
  fatorPotencia: z.number().min(0).max(1, 'Fator de potência deve estar entre 0 e 1'),
  tensao: z.number().positive('Tensão deve ser positiva'),
})

// GET - Buscar equipamento por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const equipamento = await prisma.equipamento.findUnique({
      where: {
        id,
        status: 'a'
      }
    })

    if (!equipamento) {
      return NextResponse.json(
        { error: 'Equipamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(equipamento)
  } catch (error) {
    console.error('Erro ao buscar equipamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar equipamento
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = equipamentoSchema.parse(body)

    const { id } = await params
    const equipamentoExistente = await prisma.equipamento.findUnique({
      where: {
        id,
        status: 'a'
      }
    })

    if (!equipamentoExistente) {
      return NextResponse.json(
        { error: 'Equipamento não encontrado' },
        { status: 404 }
      )
    }

    const equipamentoAtualizado = await prisma.equipamento.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json(equipamentoAtualizado)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar equipamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Remover equipamento (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = await params
    const equipamento = await prisma.equipamento.findUnique({
      where: {
        id,
        status: 'a'
      }
    })

    if (!equipamento) {
      return NextResponse.json(
        { error: 'Equipamento não encontrado' },
        { status: 404 }
      )
    }

    await prisma.equipamento.update({
      where: { id },
      data: { status: 'i' }
    })

    return NextResponse.json({ message: 'Equipamento removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover equipamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}