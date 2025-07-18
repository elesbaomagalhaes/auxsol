import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"



export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    // Buscar projeto com todos os dados relacionados
    const projeto = await prisma.projeto.findUnique({
      where: {
        id: id
      },
      include: {
        cliente: {
          include: {
            acesso: true
          }
        },
        tecnico: true
      }
    })

    if (!projeto) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 })
    }

    // Buscar kits relacionados ao projeto pelo numProjeto com dados detalhados dos equipamentos
    const kits = await prisma.kit.findMany({
      where: {
        numProjeto: projeto.numProjeto
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Buscar dados detalhados dos equipamentos para cada kit
    const kitsComDetalhes = await Promise.all(
      kits.map(async (kit) => {
        let equipamentoDetalhes = null
        
        try {
          switch (kit.tipo) {
            case 'inversor':
              equipamentoDetalhes = await prisma.inversor.findUnique({
                where: { id: kit.itemId },
                select: {
                  id: true,
                  modelo: true,
                  fabricante: true,
                  potenciaNomEnt: true,
                  numeroEntMPPT: true
                }
              })
              break
            case 'modulo':
              equipamentoDetalhes = await prisma.modulo.findUnique({
                where: { id: kit.itemId },
                select: {
                  id: true,
                  modelo: true,
                  fabricante: true,
                  potenciaNominal: true
                }
              })
              break
            case 'protecaoCA':
              equipamentoDetalhes = await prisma.protecaoCA.findUnique({
                where: { id: kit.itemId },
                select: {
                  id: true,
                  modelo: true,
                  numeroPoloDisjuntor: true,
                  tensaoNomDisjuntor: true,
                  correnteNomDisjuntor: true
                }
              })
              break
            case 'stringBoxCC':
            case 'protecaoCC':
              equipamentoDetalhes = await prisma.stringBoxCC.findUnique({
                where: { id: kit.itemId },
                select: {
                  id: true,
                  modelo: true,
                  fabricante: true,
                  numeroEntradas: true,
                  numeroSaidas: true
                }
              })
              break
          }
        } catch (error) {
          console.error(`Erro ao buscar detalhes do equipamento ${kit.itemId}:`, error)
        }

        // Converter campos Decimal para number se necessário
        if (equipamentoDetalhes) {
          if ('potenciaNominal' in equipamentoDetalhes) {
            equipamentoDetalhes = {
              ...equipamentoDetalhes,
              potenciaNominal: Number(equipamentoDetalhes.potenciaNominal)
            }
          }
          if ('potenciaNomEnt' in equipamentoDetalhes) {
            equipamentoDetalhes = {
              ...equipamentoDetalhes,
              potenciaNomEnt: Number(equipamentoDetalhes.potenciaNomEnt)
            }
          }
        }

        return {
          ...kit,
          equipamento: equipamentoDetalhes
        }
      })
    )

    // Adicionar os kits com detalhes ao objeto do projeto
    const projetoComKits = {
      ...projeto,
      kits: kitsComDetalhes
    }

    return NextResponse.json(projetoComKits)
  } catch (error) {
    console.error("Erro ao buscar projeto:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Verificar se o número do projeto já existe em outro projeto
    if (body.numProjeto) {
      const projetoExistente = await prisma.projeto.findFirst({
        where: {
          numProjeto: body.numProjeto,
          NOT: {
            id: id // Excluir o projeto atual da verificação
          }
        }
      });

      if (projetoExistente) {
        return NextResponse.json({
          error: 'Número do projeto já está em uso por outro projeto'
        }, { status: 409 });
      }
    }

    // Atualizar projeto
    const projetoAtualizado = await prisma.projeto.update({
      where: {
        id: id
      },
      data: {
        numProjeto: body.numProjeto,
        potenciaGerador: body.potenciaGerador,
        potenciaInversor: body.potenciaInversor,
        urlMapa: body.urlMapa,
        // Campos de geração mensal
        jan: body.jan,
        fev: body.fev,
        mar: body.mar,
        abr: body.abr,
        mai: body.mai,
        jun: body.jun,
        jul: body.jul,
        ago: body.ago,
        set: body.set,
        out: body.out,
        nov: body.nov,
        dez: body.dez,
        // Atualizar dados do cliente se fornecidos
        ...(body.cliente && {
          cliente: {
            update: body.cliente
          }
        }),
        // Atualizar dados de acesso se fornecidos
        ...(body.acesso && {
          acesso: {
            upsert: {
              create: body.acesso,
              update: body.acesso
            }
          }
        }),
        // Atualizar dados do técnico se fornecidos
        ...(body.tecnico && {
          tecnico: {
            upsert: {
              create: body.tecnico,
              update: body.tecnico
            }
          }
        }),
        // Atualizar dados de parametrização se fornecidos
        ...(body.disjuntorPadrao !== undefined && { disjuntorPadrao: body.disjuntorPadrao }),
        ...(body.sessaoCondutor !== undefined && { sessaoCondutor: body.sessaoCondutor }),
        ...(body.numFases !== undefined && { numFases: body.numFases }),
        ...(body.numPoloDisjuntor !== undefined && { numeroPoloDisjuntor: body.numPoloDisjuntor })
      },
      include: {
        cliente: {
          include: {
            acesso: true
          }
        },
        tecnico: true
      }
    })

    return NextResponse.json(projetoAtualizado)
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    // Deletar projeto (cascade irá deletar registros relacionados)
    await prisma.projeto.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({ message: "Projeto deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar projeto:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}