import prisma from '@/lib/prisma'

export class EquipamentoService {
  static async buscarModulos(userId?: string) {
    try {
      const whereClause = userId ? { userId } : {}
      const modulos = await prisma.modulo.findMany({
        where: whereClause,
        orderBy: {
          fabricante: 'asc'
        }
      })
      
      return modulos.map(modulo => ({
        id: modulo.id,
        nome: `${modulo.fabricante} ${modulo.modelo}`,
        modelo: modulo.modelo,
        fabricante: modulo.fabricante,
        potencia: Number(modulo.potenciaNominal),
        tipo: 'modulo'
      }))
    } catch (error) {
      console.error('Erro ao buscar módulos:', error)
      throw new Error('Erro ao buscar módulos')
    }
  }

  static async buscarInversores(userId?: string) {
    try {
      const whereClause = userId ? { userId } : {}
      const inversores = await prisma.inversor.findMany({
        where: whereClause,
        orderBy: {
          fabricante: 'asc'
        }
      })
      
      return inversores.map(inversor => ({
        id: inversor.id,
        nome: `${inversor.fabricante} ${inversor.modelo}`,
        modelo: inversor.modelo,
        fabricante: inversor.fabricante,
        potencia: Number(inversor.potenciaNomSai),
        mppt: inversor.numeroEntMPPT,
        tipo: 'inversor'
      }))
    } catch (error) {
      console.error('Erro ao buscar inversores:', error)
      throw new Error('Erro ao buscar inversores')
    }
  }

  static async buscarProtecaoCA(userId?: string) {
    try {
      const whereClause = userId ? { userId } : {}
      const protecoes = await prisma.protecaoCA.findMany({
        where: whereClause,
        orderBy: {
          modelo: 'asc'
        }
      })
      
      return protecoes.map(protecao => ({
        id: protecao.id,
        nome: protecao.modelo || 'Proteção CA',
        modelo: protecao.modelo,
        fabricante: null,
        tipo: 'protecaoCA'
      }))
    } catch (error) {
      console.error('Erro ao buscar proteções CA:', error)
      throw new Error('Erro ao buscar proteções CA')
    }
  }

  static async buscarStringBoxCC(userId?: string) {
    try {
      const whereClause = userId ? { userId } : {}
      const stringBoxes = await prisma.stringBoxCC.findMany({
        where: whereClause,
        orderBy: {
          fabricante: 'asc'
        }
      })
      
      return stringBoxes.map(stringBox => ({
        id: stringBox.id,
        nome: `${stringBox.fabricante} ${stringBox.modelo}`,
        modelo: stringBox.modelo,
        fabricante: stringBox.fabricante,
        tipo: 'protecaoCC'
      }))
    } catch (error) {
      console.error('Erro ao buscar string boxes CC:', error)
      throw new Error('Erro ao buscar string boxes CC')
    }
  }

  static async buscarPorTipo(tipo: string, userId?: string) {
    switch (tipo) {
      case 'modulo':
        return await this.buscarModulos(userId)
      case 'inversor':
        return await this.buscarInversores(userId)
      case 'protecaoCA':
        return await this.buscarProtecaoCA(userId)
      case 'protecaoCC':
        return await this.buscarStringBoxCC(userId)
      default:
        throw new Error(`Tipo de equipamento não suportado: ${tipo}`)
    }
  }

  static async buscarPorTipoECliente(tipo: string, clienteCpf: string) {
    try {
      // Buscar o cliente pelo CPF para obter o userId
      const cliente = await prisma.cliente.findUnique({
        where: { cpf: clienteCpf },
        select: { userId: true }
      })

      if (!cliente || !cliente.userId) {
        // Se não encontrar cliente ou userId, retornar array vazio
        return []
      }

      // Buscar equipamentos do usuário do cliente
      return await this.buscarPorTipo(tipo, cliente.userId)
    } catch (error) {
      console.error('Erro ao buscar equipamentos por cliente:', error)
      throw new Error('Erro ao buscar equipamentos do cliente')
    }
  }
}