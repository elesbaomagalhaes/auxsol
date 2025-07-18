import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Buscar cargas por projeto
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const numProjeto = searchParams.get('numProjeto')

    if (!numProjeto) {
      return NextResponse.json({ error: 'Número do projeto é obrigatório' }, { status: 400 })
    }

    const cargas = await prisma.cargaInstalada.findMany({
      where: {
        numProjeto: numProjeto,
        status: 'a'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Buscar dados dos equipamentos separadamente
    const cargasComEquipamentos = await Promise.all(
      cargas.map(async (carga) => {
        const equipamento = await prisma.equipamento.findUnique({
          where: { id: carga.idEquipamento }
        });
        return {
          ...carga,
          equipamento
        };
      })
    );

    // Calcular potência total
    const potenciaTotal = cargasComEquipamentos.reduce((total, carga) => {
      return total + (Number(carga.qtd) * Number(carga.potenciaW))
    }, 0)

    return NextResponse.json({ 
      cargas: cargasComEquipamentos,
      potenciaTotal: potenciaTotal.toFixed(2)
    })
  } catch (error) {
    console.error('Erro ao buscar cargas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar nova carga
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { numProjeto, idEquipamento, qtd, potenciaW } = body

    // Validações
    if (!numProjeto || !idEquipamento || !qtd || !potenciaW) {
      return NextResponse.json({ 
        error: 'Todos os campos são obrigatórios' 
      }, { status: 400 })
    }

    if (qtd <= 0 || potenciaW <= 0) {
      return NextResponse.json({ 
        error: 'Quantidade e potência devem ser maiores que zero' 
      }, { status: 400 })
    }

    // Verificar se o projeto existe
    const projeto = await prisma.projeto.findUnique({
      where: { numProjeto }
    })

    if (!projeto) {
      return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 })
    }

    // Verificar se o equipamento existe
    const equipamento = await prisma.equipamento.findUnique({
      where: { id: idEquipamento }
    })

    if (!equipamento) {
      return NextResponse.json({ error: 'Equipamento não encontrado' }, { status: 404 })
    }

    // Verificar se já existe uma carga com o mesmo projeto e equipamento
    const cargaExistente = await prisma.cargaInstalada.findFirst({
      where: {
        numProjeto,
        idEquipamento,
        status: 'a'
      }
    })

    let carga;
    
    if (cargaExistente) {
      // Se existe, atualizar a quantidade somando com a existente
      carga = await prisma.cargaInstalada.update({
        where: { id: cargaExistente.id },
        data: {
          qtd: Number(cargaExistente.qtd) + Number(qtd)
        }
      })
    } else {
      // Se não existe, criar nova carga instalada
      carga = await prisma.cargaInstalada.create({
        data: {
          numProjeto,
          idEquipamento,
          qtd: Number(qtd),
          potenciaW: Number(potenciaW)
        }
      })
    }

    // Retornar carga com dados do equipamento no formato esperado
    const cargaComEquipamento = {
      ...carga,
      equipamento
    }

    return NextResponse.json({ carga: cargaComEquipamento }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar carga:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Remover carga
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID da carga é obrigatório' }, { status: 400 })
    }

    // Verificar se a carga existe
    const carga = await prisma.cargaInstalada.findUnique({
      where: { id }
    })

    if (!carga) {
      return NextResponse.json({ error: 'Carga não encontrada' }, { status: 404 })
    }

    // Hard delete - remover completamente da tabela
    await prisma.cargaInstalada.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Carga removida com sucesso' })
  } catch (error) {
    console.error('Erro ao remover carga:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}