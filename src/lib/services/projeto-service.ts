import prisma from '@/lib/prisma';
import { FormData } from '@/lib/schema/projeto';

/**
 * Serviço para gerenciar operações relacionadas a projetos
 * Encapsula a lógica de negócios e interação com o banco de dados
 */
export class ProjetoService {
  /**
   * Cria um novo projeto no banco de dados
   * @param data Dados do formulário validados
   * @returns Objeto contendo os dados do cliente, acesso, equipamentos e técnico criados
   */
  static async criarProjeto(data: FormData) {
    // Usar transação para garantir integridade dos dados
    return await prisma.$transaction(async (tx) => {
      // 1. Criar o cliente
      const cliente = await tx.cliente.create({
        data: {
          nome: data.nome,
          rgCnh: data.rgCnh,
          rgCnhDataEmissao: new Date(data.rgCnhDataEmissao),
          cpf: data.cpf,
          fone: data.fone,
          email: data.email,
          rua: data.rua,
          numero: data.numero,
          complemento: data.complemento || null,
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf,
          cep: data.cep,
          numProjeto: data.numProjetoC,
          updatedAt: new Date(),
        },
      });
      
      // 2. Criar o acesso relacionado ao cliente
      const acesso = await tx.acesso.create({
        data: {
          numProjeto: data.numProjetoC,
          nomeConcessionaria: data.concessionaria,
          contractNumber: data.contractNumber,
          tensaoRede: data.tensaoRede,
          grupoConexao: data.grupoConexao,
          tipoConexao: data.tipoConexao,
          tipoSolicitacao: data.tipoSolicitacao,
          tipoRamal: data.tipoRamal,
          ramoAtividade: data.ramoAtividade,
          enquadramentoGeracao: data.enquadramentoGeracao,
          tipoGeracao: data.tipoGeracao,
          poste: data.poste || null,
          longitudeUTM: data.longitudeUTM,
          latitudeUTM: data.latitudeUTM,
          updatedAt: new Date(),
        },
      });
      
      // 3. Criar o módulo (equipamento)
      const modulo = await tx.modulo.create({
        data: {
          modelo: data.fabricanteMod, // Usando o campo fabricanteMod como modelo
          marca: data.fabricanteMod,
          potenciaNominal: data.potenciaMod,
          tensaoCircAberto: "0", // Valores padrão para campos obrigatórios
          correnteCurtCirc: "0",
          tensaoMaxOper: "0",
          correnteMaxOper: "0",
          eficiencia: "0",
          datasheet: "pendente",
          seloInmetro: null,
          comprimento: 0, // Valores padrão para campos decimais
          largura: 0,
          area: 0,
          peso: 0,
          updatedAt: new Date(),
        },
      });
      
      // 4. Criar o inversor
      const inversor = await tx.inversor.create({
        data: {
          fabricante: data.fabricanteInv,
          modelo: data.fabricanteInv, // Usando o campo fabricanteInv como modelo
          potenciaNominalEnt: parseFloat(data.potenciaInv) || 0,
          potenciaMaxEnt: parseFloat(data.potenciaInv) || 0,
          tensaoMaxEnt: parseFloat(data.tensaoMaxEnt) || 0,
          tensaoInicializacao: parseFloat(data.tensaoInicializacao) || 0,
          tensaoNominalEnt: parseFloat(data.tensaoNominalEnt) || 0,
          numeroEntMPPT: parseInt(data.numeroEntMPPT) || 1,
          potenciaMaxMPPT: parseFloat(data.potenciaMaxMPPT) || 0,
          correnteMaxEnt: parseFloat(data.correnteMaxEnt) || 0,
          correnteMaxCurtCirc: parseFloat(data.correnteMaxCurtCirc) || 0,
          potenciaNominalSai: parseFloat(data.potenciaInv) || 0, // Mantendo a lógica original para potenciaNominalSai e potenciaMaxSai
          potenciaMaxSai: parseFloat(data.potenciaInv) || 0,   // se os novos campos não substituírem estes diretamente.
          correnteNominalSai: parseFloat(data.correnteNominalSai) || 0,
          correnteMaxSai: parseFloat(data.correnteMaxSai) || 0,
          tensaoNominalSai: parseFloat(data.tensaoNominalSai) || 0,
          THD: parseFloat(data.THD) || 0,
          frequenciaNominal: parseFloat(data.frequenciaNominal) || 0,
          fatorPotencia: parseFloat(data.fatorPotencia) || 0,
          tensaoMaxsSai: parseFloat(data.tensaoMaxsSai) || 0,
          tensaoMinSai: parseFloat(data.tensaoMinSai) || 0,
          eficiencia: parseFloat(data.eficiencia) || 0,
        },
      });
      
      // 5. Criar um registro para os dados do técnico
      // Como não existe um modelo específico para técnico no schema atual,
      // vamos armazenar os dados em um objeto para retornar
      const tecnico = {
        nome: data.nomeT,
        registro: data.registro,
        rgCnh: data.rgCnhT,
        cpf: data.cpfT,
        fone: data.foneT,
        tipoProfissional: data.tipoProfissional,
        email: data.emailT,
        endereco: {
          logradouro: data.logradouroT,
          numero: data.numeroT,
          complemento: data.complementoT,
          bairro: data.bairroT,
          cidade: data.cidadeT,
          uf: data.ufT,
          cep: data.cepT,
        },
      };
      
      // Retornar todos os dados criados
      return { cliente, acesso, modulo, inversor, tecnico };
    });
  }
  
  /**
   * Busca um projeto pelo número
   * @param numProjeto Número do projeto
   * @returns Dados do projeto ou null se não encontrado
   */
  static async buscarProjetoPorNumero(numProjeto: string) {
    return await prisma.cliente.findUnique({
      where: { numProjeto },
      include: { acesso: true },
    });
  }
}