import { NextRequest, NextResponse } from 'next/server';
import { formSchema } from '@/lib/schema/projetoSchema';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

/**
 * API route para salvar um novo projeto
 * Esta rota recebe os dados do formulário multi-etapas e os salva no banco de dados
 * usando o Prisma ORM
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Obter dados do corpo da requisição
    const body = await request.json();
    
    // Validar dados usando o schema Zod
    const validatedData = formSchema.parse(body);
    
    // Validação adicional: verificar se pelo menos um kit foi informado com todos os campos obrigatórios
    if (!validatedData.equipamentosKit || validatedData.equipamentosKit.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'É obrigatório informar pelo menos um equipamento no kit',
        errors: [{ path: 'equipamentosKit', message: 'Pelo menos um equipamento deve ser adicionado ao kit' }]
      }, { status: 400 });
    }
    
    // Verificar se todos os equipamentos têm os campos obrigatórios
    const equipamentosInvalidos = [];
    for (let i = 0; i < validatedData.equipamentosKit.length; i++) {
      const equipamento = validatedData.equipamentosKit[i];
      const erros = [];
      
      if (!equipamento.tipo || equipamento.tipo.trim() === '') {
        erros.push('Tipo é obrigatório');
      }
      
      if (!equipamento.itemId || equipamento.itemId.trim() === '') {
        erros.push('Item ID é obrigatório');
      }
      
      // Verificar se quantidade foi informada (aceita tanto 'quantidade' quanto 'qtd')
      const quantidade = Number(equipamento.quantidade || equipamento.qtd || 0);
      if (!quantidade || quantidade <= 0) {
        erros.push('Quantidade deve ser maior que zero');
      }
      
      if (erros.length > 0) {
        equipamentosInvalidos.push({
          index: i,
          tipo: equipamento.tipo || 'Não informado',
          erros: erros
        });
      }
    }
    
    if (equipamentosInvalidos.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Alguns equipamentos do kit possuem campos obrigatórios não preenchidos',
        errors: equipamentosInvalidos.map(eq => ({
          path: `equipamentosKit[${eq.index}]`,
          message: `${eq.tipo}: ${eq.erros.join(', ')}`
        }))
      }, { status: 400 });
    }
    
    // Verificar se o número do projeto já existe
    const projetoExistente = await prisma.projeto.findFirst({
      where: {
        numProjeto: validatedData.numProjetoC
      }
    });

    if (projetoExistente) {
      return NextResponse.json({
        success: false,
        message: 'Número do projeto já está em uso',
        errors: [{ path: 'numProjetoC', message: 'Este número de projeto já existe no sistema' }]
      }, { status: 409 });
    }

    // Usar transação para garantir integridade dos dados
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verificar se o cliente já existe (por CPF)
      let cliente = await tx.cliente.findFirst({
        where: {
          cpf: validatedData.cpf
        }
      });
      
      // Se o cliente não existir, criar um novo
      if (!cliente) {
        cliente = await tx.cliente.create({
          data: {
            nome: validatedData.nome,
            rgCnh: validatedData.rgCnh,
            rgCnhDataEmissao: new Date(validatedData.rgCnhDataEmissao),
            cpf: validatedData.cpf,
            fone: validatedData.fone,
            email: validatedData.email,
            rua: validatedData.rua,
            numero: validatedData.numero,
            complemento: validatedData.complemento || null,
            bairro: validatedData.bairro,
            cidade: validatedData.cidade,
            uf: validatedData.uf,
            cep: validatedData.cep,
            numProjeto: validatedData.numProjetoC, // Adicionar o numProjeto
            updatedAt: new Date(),
          },
        });
      } else {
        // Se o cliente já existe, sempre atualizar o numProjeto para o projeto atual
        // Isso permite que um cliente tenha múltiplos projetos
        cliente = await tx.cliente.update({
          where: { cpf: validatedData.cpf },
          data: { numProjeto: validatedData.numProjetoC }
        });
      }
      
      // 2. Criar ou atualizar o acesso relacionado ao cliente
      const acesso = await tx.acesso.upsert({
        where: {
          clienteCpf: validatedData.cpf
        },
        update: {
          numProjeto: validatedData.numProjetoC,
          nomeConcessionaria: validatedData.concessionaria,
          contractNumber: validatedData.contractNumber,
          tensaoRede: validatedData.tensaoRede,
          grupoConexao: validatedData.subgrupoConexao,
          tipoConexao: validatedData.tipoConexao,
          tipoSolicitacao: validatedData.tipoSolicitacao,
          tipoRamal: validatedData.tipoRamal,
          ramoAtividade: validatedData.ramoAtividade,
          enquadramentoGeracao: validatedData.enquadramentoGeracao,
          tipoGeracao: validatedData.tipoGeracao,
          alocacaoCredito: validatedData.alocacaoCredito,
          potenciaInstalada: null, // Campo opcional
          fotoMedidor: null, // Campo opcional
          poste: validatedData.poste || "***",
          longitudeUTM: validatedData.longitudeUTM,
          latitudeUTM: validatedData.latitudeUTM,
          userId: session.user.id,
          updatedAt: new Date(),
        },
        create: {
          numProjeto: validatedData.numProjetoC,
          nomeConcessionaria: validatedData.concessionaria,
          contractNumber: validatedData.contractNumber,
          tensaoRede: validatedData.tensaoRede,
          grupoConexao: validatedData.subgrupoConexao,
          tipoConexao: validatedData.tipoConexao,
          tipoSolicitacao: validatedData.tipoSolicitacao,
          tipoRamal: validatedData.tipoRamal,
          ramoAtividade: validatedData.ramoAtividade,
          enquadramentoGeracao: validatedData.enquadramentoGeracao,
          tipoGeracao: validatedData.tipoGeracao,
          alocacaoCredito: validatedData.alocacaoCredito,
          potenciaInstalada: null, // Campo opcional
          fotoMedidor: null, // Campo opcional
          poste: validatedData.poste || "***",
          longitudeUTM: validatedData.longitudeUTM,
          latitudeUTM: validatedData.latitudeUTM,
          clienteCpf: validatedData.cpf, // Campo obrigatório para relação
          userId: session.user.id,
          updatedAt: new Date(),
        },
      });
      
      // 3. Criar equipamentos do kit na tabela kit
      const equipamentosKit = [];
      if (validatedData.equipamentosKit && validatedData.equipamentosKit.length > 0) {
        for (const equipamento of validatedData.equipamentosKit) {
          // Extrair número da string se existir (ex: "String 1" -> 1)
          let stringNumber = null;
          if (equipamento.stringSelecionada) {
            const match = equipamento.stringSelecionada.match(/\d+/);
            if (match) {
              stringNumber = parseInt(match[0], 10); // Usar parseInt para números inteiros
            }
          }
          const kitItem = await tx.kit.create({
            data: {
              numProjeto: validatedData.numProjetoC,
              tipo: equipamento.tipo.toLowerCase(), // "modulo", "inversor", "protecaoCA", etc.
              itemId: equipamento.itemId, // ID do equipamento buscado
              qtd: Number(equipamento.quantidade || equipamento.qtd || 1), // Garantir que não seja 0 e seja número
              string: stringNumber,
              potenciaGerador: equipamento.tipo.toLowerCase() === 'modulo' ? 
                Number(equipamento.quantidade || equipamento.qtd || 1) * Number(equipamento.potenciaGerador || 0) : null,
              potenciaInversor: equipamento.tipo.toLowerCase() === 'inversor' ? 
                Number(equipamento.quantidade || equipamento.qtd || 1) * Number(equipamento.potenciaInversor || 0) : null,
              userId: session.user.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          equipamentosKit.push(kitItem);
        }
      }
      
      // 4. Verificar se o técnico já existe ou criar um novo
      let tecnico = await tx.tecnico.findFirst({
        where: {
          cpf: validatedData.cpfT
        }
      });
      
      if (!tecnico) {
        tecnico = await tx.tecnico.create({
          data: {
            nome: validatedData.nomeT,
            registro: validatedData.registro,
            rgCnh: validatedData.rgCnhT,
            cpf: validatedData.cpfT,
            fone: validatedData.foneT,
            tipoProfissional: validatedData.tipoProfissional,
            email: validatedData.emailT,
            logradouro: validatedData.logradouroT,
            numero: validatedData.numeroT,
            complemento: validatedData.complementoT || null,
            bairro: validatedData.bairroT,
            cidade: validatedData.cidadeT,
            uf: validatedData.ufT,
            cep: validatedData.cepT,
            userId: session.user.id,
          },
        });
      }
       
       // 5. Criar o registro do projeto
        const potenciaGerador = equipamentosKit
          .filter(kit => kit.tipo.toLowerCase() === 'modulo')
          .reduce((total, kit) => total + Number(kit.potenciaGerador || 0), 0);
        
        const potenciaInversor = equipamentosKit
          .filter(kit => kit.tipo.toLowerCase() === 'inversor')
          .reduce((total, kit) => total + Number(kit.potenciaInversor || 0), 0);
        
        const projeto = await tx.projeto.create({
          data: {
            numProjeto: validatedData.numProjetoC,
            potenciaGerador: potenciaGerador,
            potenciaInversor: potenciaInversor,
            clienteCpf: validatedData.cpf,
            tecnicoCpf: validatedData.cpfT,
            acessoCpf: validatedData.cpf, // Mesmo CPF do cliente para o acesso
            userId: session.user.id,
          },
        });
       
       // Retornar todos os dados criados
       return { cliente, acesso, equipamentosKit, tecnico, projeto };
    });
    
    // Retornar resposta de sucesso com os dados criados
    return NextResponse.json({ 
      success: true, 
      message: 'Projeto cadastrado com sucesso',
      data: result 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erro ao salvar projeto:', error);
    
    // Verificar se é um erro de validação do Zod
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json({ 
        success: false, 
        message: 'Erro de validação', 
        errors: errorMessages 
      }, { status: 400 });
    }
    
    // Verificar se é um erro de chave única (por exemplo, CPF ou numProjeto duplicado)
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        message: `O campo ${(error as any).meta?.target?.[0] || 'desconhecido'} já está em uso`,
      }, { status: 409 });
    }
    
    // Erro genérico
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao processar a requisição' 
    }, { status: 500 });
  }
}