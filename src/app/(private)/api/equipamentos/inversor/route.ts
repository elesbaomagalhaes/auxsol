import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { inversorSchema } from '@/lib/schema/inversorSchema'

/**
 * API route para salvar um novo inversor
 * Esta rota recebe os dados do formulário e os salva no banco de dados
 * usando o Prisma ORM
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Obter dados JSON do corpo da requisição
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

    // Criar o inversor no banco de dados
    const novoInversor = await prisma.inversor.create({
      data: {
        ...validatedData.data,
        userId: session.user.id
      }
    })

    return NextResponse.json(
      { 
        message: 'Inversor salvo com sucesso!',
        inversor: novoInversor
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao salvar inversor:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * API route para buscar inversores
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar inversores do usuário
    const inversores = await prisma.inversor.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        fabricante: 'asc'
      }
    })

    return NextResponse.json(inversores)
  } catch (error) {
    console.error('Erro ao buscar inversores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}