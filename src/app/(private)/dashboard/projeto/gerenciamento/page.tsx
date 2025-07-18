import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { ProjetoTable } from "@/components/dashboard/projeto/projeto-table"
import { ProjetoStats } from "@/components/dashboard/projeto/projeto-stats"
// Remove duplicate import since it's already imported at the top of the file

export default async function GerenciamentoProjetos() {
  const session = await auth()
  if (!session) {
    redirect("/sign-in")
  }

  // Buscar todos os projetos com informações do cliente
  const projetos = await prisma.projeto.findMany({
    include: {
      cliente: {
        select: {
          id: true,
          nome: true,
          cidade: true,
          uf: true,
          cpf: true,
          rua: true,
          numero: true,
          complemento: true,
          bairro: true,
          cep: true,
          fone: true,
          email: true,
          rgCnh: true,
          rgCnhDataEmissao: true,
        }
      },
      acesso: {
        select: {
          id: true,
          nomeConcessionaria: true,
          contractNumber: true,
          tensaoRede: true,
          grupoConexao: true,
          tipoConexao: true,
          tipoSolicitacao: true,
          tipoRamal: true,
          ramoAtividade: true,
          enquadramentoGeracao: true,
          tipoGeracao: true,
          potenciaInstalada: true,
          poste: true,
          longitudeUTM: true,
          latitudeUTM: true,
        }
      },
      tecnico: {
        select: {
          id: true,
          nome: true,
          registro: true,
          rgCnh: true,
          cpf: true,
          fone: true,
          email: true,
          tipoProfissional: true,
          logradouro: true,
          numero: true,
          complemento: true,
          bairro: true,
          cidade: true,
          uf: true,
          cep: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Buscar kits para cada projeto baseado no numProjeto com dados detalhados dos equipamentos
  const projetosComKits = await Promise.all(
    projetos.map(async (projeto) => {
      const kits = await prisma.kit.findMany({
        where: {
          numProjeto: projeto.numProjeto
        },
        select: {
          id: true,
          tipo: true,
          itemId: true,
          qtd: true,
          potenciaGerador: true,
          potenciaInversor: true,
          string: true,
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

          return {
            ...kit,
            equipamento: equipamentoDetalhes
          }
        })
      )

      // Convert Decimal objects to numbers for client components
      const kitsSerializados = kitsComDetalhes.map(kit => {
        const kitSerializado = {
          ...kit,
          qtd: Number(kit.qtd),
          potenciaGerador: kit.potenciaGerador ? Number(kit.potenciaGerador) : null,
          potenciaInversor: kit.potenciaInversor ? Number(kit.potenciaInversor) : null,
          string: kit.string ? Number(kit.string) : null,
        }

        // Converter campos Decimal dos equipamentos detalhados
        if (kitSerializado.equipamento) {
          const equipamento = kitSerializado.equipamento as any
          if ('potenciaNominal' in equipamento) {
            kitSerializado.equipamento = {
              ...kitSerializado.equipamento,
              potenciaNominal: Number(equipamento.potenciaNominal)
            } as any
          }
          if ('potenciaNomEnt' in equipamento) {
            kitSerializado.equipamento = {
              ...kitSerializado.equipamento,
              potenciaNomEnt: Number(equipamento.potenciaNomEnt)
            } as any
          }
        }

        return kitSerializado
      })

      return {
        ...projeto,
        kits: kitsSerializados
      }
    })
  )

  // Calcular potências totais para cada projeto e converter Decimals para números
  const projetosComPotencias = projetosComKits.map(projeto => {
    // Usar potências diretamente da tabela projeto ao invés de calcular dos kits
    const potenciaGeradorTotal = Number(projeto.potenciaGerador)
    const potenciaInversorTotal = Number(projeto.potenciaInversor)

    return {
      id: projeto.id,
      numProjeto: projeto.numProjeto,
      potenciaGerador: Number(projeto.potenciaGerador),
      potenciaInversor: Number(projeto.potenciaInversor),
      createdAt: projeto.createdAt,
      cliente: {
        ...projeto.cliente,
        // Convert any Decimal fields in cliente if needed
      },
      acesso: projeto.acesso ? {
        ...projeto.acesso,
        potenciaInstalada: projeto.acesso.potenciaInstalada ? Number(projeto.acesso.potenciaInstalada) : null,
      } : null,
      tecnico: projeto.tecnico ? {
        ...projeto.tecnico,
        // Convert any Decimal fields in tecnico if needed
      } : null,
      kits: projeto.kits,
      potenciaGeradorTotal,
      potenciaInversorTotal
    }
  })

  // Calcular estatísticas gerais
  const totalProjetos = projetos.length
  const potenciaGeradorGeral = projetosComPotencias.reduce((total, projeto) => 
    total + projeto.potenciaGeradorTotal, 0
  )
  const potenciaInversorGeral = projetosComPotencias.reduce((total, projeto) => 
    total + projeto.potenciaInversorTotal, 0
  )
  const cidadesUnicas = new Set(projetos.map(projeto => 
    `${projeto.cliente.cidade}-${projeto.cliente.uf}`
  )).size

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gerenciamento de Projetos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Visualize e gerencie todos os projetos cadastrados no sistema
          </p>
        </div>
      </div>

      <ProjetoStats 
        totalProjetos={totalProjetos}
        potenciaGeradorTotal={potenciaGeradorGeral}
        potenciaInversorTotal={potenciaInversorGeral}
        cidadesAtendidas={cidadesUnicas}
      />

      <Card>
        <CardHeader>
          <CardTitle>Projetos Cadastrados</CardTitle>
          <CardDescription>
            Lista completa de projetos com informações do cliente e especificações técnicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjetoTable data={projetosComPotencias} />
        </CardContent>
      </Card>
    </div>
  )
}