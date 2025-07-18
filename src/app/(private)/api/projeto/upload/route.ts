import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log('Recebendo requisição de upload')
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('Nenhum arquivo foi enviado')
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }
    
    console.log('Arquivo recebido:', file.name, 'Tipo:', file.type, 'Tamanho:', file.size)

    // Verificar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      console.error('Tipo de arquivo não suportado:', file.type)
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado. Use JPG, PNG ou PDF.' },
        { status: 400 }
      )
    }

    // Verificar tamanho do arquivo (10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB em bytes
    if (file.size > maxSize) {
      console.error('Arquivo muito grande:', file.size, 'bytes')
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 10MB' },
        { status: 400 }
      )
    }

    // Converter arquivo para buffer
    console.log('Convertendo arquivo para buffer')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('Buffer criado, tamanho:', buffer.length)

    // Verificar configuração do Cloudinary
    console.log('Configuração Cloudinary:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Configurado' : 'Não configurado',
      api_key: process.env.CLOUDINARY_API_KEY ? 'Configurado' : 'Não configurado',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Configurado' : 'Não configurado'
    })

    // Upload para Cloudinary
    console.log('Iniciando upload para Cloudinary')
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'auxsol/documentacao',
          public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
        },
        (error, result) => {
          if (error) {
            console.error('Erro no upload do Cloudinary:', error)
            reject(error)
          } else {
            console.log('Upload do Cloudinary bem-sucedido:', result?.secure_url)
            resolve(result)
          }
        }
      ).end(buffer)
    })

    const result = uploadResponse as any

    console.log('Retornando resposta de sucesso')
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { error: 'ID público do arquivo é obrigatório' },
        { status: 400 }
      )
    }

    // Deletar arquivo do Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}