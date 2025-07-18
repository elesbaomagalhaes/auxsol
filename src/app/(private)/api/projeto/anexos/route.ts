import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { projetoId, anexos } = body

    if (!projetoId || !anexos || !Array.isArray(anexos)) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    // Verificar se o projeto existe
    const projeto = await prisma.projeto.findUnique({
      where: { id: projetoId }
    })

    if (!projeto) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    // Salvar anexos no banco de dados
    const anexosSalvos = await Promise.all(
      anexos.map(async (anexo: any) => {
        return await prisma.anexo.create({
          data: {
            projetoId,
            fileName: anexo.fileName,
            fileSize: anexo.fileSize,
            fileType: anexo.fileType,
            cloudinaryUrl: anexo.url,
            cloudinaryPublicId: anexo.publicId,
          }
        })
      })
    )

    return NextResponse.json({
      success: true,
      anexos: anexosSalvos,
    })
  } catch (error) {
    console.error('Erro ao salvar anexos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projetoId = searchParams.get('projetoId')

    if (!projetoId) {
      return NextResponse.json(
        { error: 'ID do projeto é obrigatório' },
        { status: 400 }
      )
    }

    const anexos = await prisma.anexo.findMany({
      where: { projetoId },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Encontrados ${anexos.length} anexos para o projeto ${projetoId}`)
    anexos.forEach(anexo => {
      console.log(`Anexo: ${anexo.fileName}, URL: ${anexo.cloudinaryUrl}, Tipo: ${anexo.fileType}`)
    })

    return NextResponse.json({
      success: true,
      anexos,
    })
  } catch (error) {
    console.error('Erro ao buscar anexos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const anexoId = searchParams.get('anexoId')

    if (!anexoId) {
      return NextResponse.json(
        { error: 'ID do anexo é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar anexo para obter o publicId do Cloudinary
    const anexo = await prisma.anexo.findUnique({
      where: { id: anexoId }
    })

    if (!anexo) {
      return NextResponse.json(
        { error: 'Anexo não encontrado' },
        { status: 404 }
      )
    }

    // Deletar do banco de dados
    await prisma.anexo.delete({
      where: { id: anexoId }
    })

    // Deletar do Cloudinary
    try {
      await fetch(`/api/projeto/upload?publicId=${anexo.cloudinaryPublicId}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Erro ao deletar arquivo do Cloudinary:', error)
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Erro ao deletar anexo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}