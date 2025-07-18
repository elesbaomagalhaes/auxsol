/**
 * Teste para validação de unicidade do número do projeto
 * Este teste verifica se a API está corretamente validando a unicidade do numProjeto
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dados de teste para criação de projeto
const dadosProjetoTeste = {
  numProjetoC: "TESTE-001",
  nome: "Cliente Teste Unicidade",
  rgCnh: "123456789",
  rgCnhDataEmissao: "2023-01-01",
  cpf: "12345678901",
  fone: "11999999999",
  email: "teste@exemplo.com",
  rua: "Rua Teste",
  numero: "123",
  bairro: "Bairro Teste",
  cidade: "Cidade Teste",
  uf: "SP",
  cep: "12345-678",
  concessionaria: "Concessionária Teste",
  contractNumber: "12345",
  tensaoRede: "220V",
  subgrupoConexao: "B1",
  tipoConexao: "Monofásico",
  tipoSolicitacao: "Nova",
  tipoRamal: "Aéreo",
  ramoAtividade: "Residencial",
  enquadramentoGeracao: "Micro",
  tipoGeracao: "Solar",
  latitudeUTM: "-23.5505",
  longitudeUTM: "-46.6333",
  nomeT: "Técnico Teste",
  registro: "12345",
  rgCnhT: "987654321",
  cpfT: "98765432100",
  foneT: "11888888888",
  tipoProfissional: "Engenheiro",
  emailT: "tecnico@exemplo.com",
  logradouroT: "Rua Técnico",
  numeroT: "456",
  bairroT: "Bairro Técnico",
  cidadeT: "Cidade Técnico",
  ufT: "SP",
  cepT: "87654321",
  equipamentosKit: [
    {
      tipo: "modulo",
      itemId: "1",
      quantidade: 10,
      potenciaGerador: 400
    }
  ]
};

async function testarUnicidadeNumProjeto() {
  console.log('🧪 Iniciando teste de unicidade do número do projeto...');
  
  try {
    // Limpar dados de teste anteriores
    await prisma.projeto.deleteMany({
      where: {
        numProjeto: dadosProjetoTeste.numProjetoC
      }
    });
    
    await prisma.cliente.deleteMany({
      where: {
        cpf: dadosProjetoTeste.cpf
      }
    });
    
    await prisma.tecnico.deleteMany({
      where: {
        cpf: dadosProjetoTeste.cpfT
      }
    });
    
    console.log('✅ Dados de teste anteriores limpos');
    
    // Teste 1: Criar primeiro projeto com sucesso
    console.log('\n📝 Teste 1: Criando primeiro projeto...');
    
    const response1 = await fetch('http://localhost:3000/api/projeto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosProjetoTeste)
    });
    
    if (response1.ok) {
      console.log('✅ Primeiro projeto criado com sucesso');
    } else {
      console.log('❌ Falha ao criar primeiro projeto:', await response1.text());
      return;
    }
    
    // Teste 2: Tentar criar segundo projeto com mesmo número
    console.log('\n📝 Teste 2: Tentando criar projeto com número duplicado...');
    
    const dadosProjetoDuplicado = {
      ...dadosProjetoTeste,
      cpf: "11111111111", // CPF diferente
      cpfT: "22222222222", // CPF técnico diferente
      email: "outro@exemplo.com",
      emailT: "outrotecnico@exemplo.com"
    };
    
    const response2 = await fetch('http://localhost:3000/api/projeto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosProjetoDuplicado)
    });
    
    if (response2.status === 409) {
      const errorData = await response2.json();
      console.log('✅ Validação de unicidade funcionando corretamente');
      console.log('📋 Mensagem de erro:', errorData.message);
    } else {
      console.log('❌ Validação de unicidade falhou - projeto duplicado foi aceito');
      console.log('📋 Status:', response2.status);
      console.log('📋 Resposta:', await response2.text());
    }
    
    // Teste 3: Criar projeto com número diferente
    console.log('\n📝 Teste 3: Criando projeto com número diferente...');
    
    const dadosProjetoNovo = {
      ...dadosProjetoDuplicado,
      numProjetoC: "TESTE-002"
    };
    
    const response3 = await fetch('http://localhost:3000/api/projeto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosProjetoNovo)
    });
    
    if (response3.ok) {
      console.log('✅ Projeto com número diferente criado com sucesso');
    } else {
      console.log('❌ Falha ao criar projeto com número diferente:', await response3.text());
    }
    
    console.log('\n🎉 Teste de unicidade concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    // Limpar dados de teste
    await prisma.projeto.deleteMany({
      where: {
        numProjeto: {
          in: [dadosProjetoTeste.numProjetoC, "TESTE-002"]
        }
      }
    });
    
    await prisma.cliente.deleteMany({
      where: {
        cpf: {
          in: [dadosProjetoTeste.cpf, "11111111111"]
        }
      }
    });
    
    await prisma.tecnico.deleteMany({
      where: {
        cpf: {
          in: [dadosProjetoTeste.cpfT, "22222222222"]
        }
      }
    });
    
    await prisma.$disconnect();
    console.log('🧹 Dados de teste limpos');
  }
}

// Executar o teste se o arquivo for chamado diretamente
if (require.main === module) {
  testarUnicidadeNumProjeto();
}

module.exports = { testarUnicidadeNumProjeto };