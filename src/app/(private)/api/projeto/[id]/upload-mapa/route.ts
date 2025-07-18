import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Verificar se o projeto existe
    const projeto = await prisma.projeto.findUnique({
      where: { id },
      select: { id: true, numProjeto: true }
    })

    if (!projeto) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 }
      )
    }

    // Verificar tipo de arquivo (apenas imagens)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado. Use apenas JPEG ou PNG.' },
        { status: 400 }
      )
    }

    // Converter arquivo para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload para Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'mapas-projeto',
          public_id: `mapa-projeto-${projeto.numProjeto || id}-${Date.now()}`,
          format: 'png',
          quality: 'auto:good'
        },
        (error, result) => {
          if (error) {
            console.error('Erro no upload para Cloudinary:', error)
            reject(error)
          } else {
            resolve(result)
          }
        }
      ).end(buffer)
    })

    const cloudinaryResult = uploadResult as any

    // Atualizar o projeto com a URL do mapa
    const projetoAtualizado = await prisma.projeto.update({
      where: { id },
      data: {
        urlMapa: cloudinaryResult.secure_url
      },
      select: {
        id: true,
        urlMapa: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Mapa enviado e salvo com sucesso',
      urlMapa: projetoAtualizado.urlMapa,
      cloudinaryPublicId: cloudinaryResult.public_id
    })

  } catch (error) {
    console.error('Erro ao fazer upload do mapa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}