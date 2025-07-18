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

// GET - Buscar todos os equipamentos
export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const equipamentos = await prisma.equipamento.findMany({
      where: {
        status: 'a'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(equipamentos)
  } catch (error) {
    console.error('Erro ao buscar equipamentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo equipamento
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = equipamentoSchema.parse(body)

    const equipamento = await prisma.equipamento.create({
      data: {
        ...validatedData,
        status: 'a'
      }
    })

    return NextResponse.json(equipamento, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao criar equipamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Remover equipamento (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do equipamento é obrigatório' },
        { status: 400 }
      )
    }

    const equipamento = await prisma.equipamento.findUnique({
      where: { id }
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