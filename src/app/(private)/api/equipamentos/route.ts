import { NextRequest, NextResponse } from 'next/server'
import { EquipamentoService } from '@/lib/services/equipamento-service'
import { auth } from '@/lib/auth'

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

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')
    const clienteId = searchParams.get('clienteId') // Parâmetro opcional para filtrar por cliente

    if (!tipo) {
      return NextResponse.json(
        { error: 'Parâmetro tipo é obrigatório' },
        { status: 400 }
      )
    }

    // Se clienteId for fornecido, buscar equipamentos do cliente específico
    // Caso contrário, buscar equipamentos do usuário logado
    let equipamentos
    if (clienteId) {
      equipamentos = await EquipamentoService.buscarPorTipoECliente(tipo, clienteId)
    } else {
      equipamentos = await EquipamentoService.buscarPorTipo(tipo, session.user.id)
    }
    
    return NextResponse.json(equipamentos)
  } catch (error) {
    console.error('Erro na API de equipamentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}