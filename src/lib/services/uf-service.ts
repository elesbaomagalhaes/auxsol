import prisma from '@/lib/prisma';

/**
 * Serviço para gerenciar operações relacionadas aos estados (UF)
 */
export class UfService {
  /**
   * Busca todos os estados ativos do banco de dados
   * @returns Array com as siglas dos estados
   */
  static async buscarEstados(): Promise<string[]> {
    try {
      const estados = await prisma.uf.findMany({
        where: {
          status: 'a' // apenas estados ativos
        },
        select: {
          sigla: true
        },
        orderBy: {
          sigla: 'asc'
        }
      });
      
      return estados.map(estado => estado.sigla);
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      // Fallback para os estados estáticos em caso de erro
      return [
       "MA", "PI"
      ];
    }
  }

  /**
   * Busca todos os estados com informações completas
   * @returns Array com objetos contendo id, nome e sigla dos estados
   */
  static async buscarEstadosCompletos() {
    try {
      return await prisma.uf.findMany({
        where: {
          status: 'a'
        },
        select: {
          id: true,
          nome: true,
          sigla: true
        },
        orderBy: {
          sigla: 'asc'
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estados completos:', error);
      return [];
    }
  }
}