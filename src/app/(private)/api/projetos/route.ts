import { NextRequest, NextResponse } from 'next/server';
import { formSchema } from '@/lib/schema/projeto';
import { z } from 'zod';
import { ProjetoService } from '@/lib/services/projeto-service';

/**
 * API route para salvar um novo projeto
 * Esta rota recebe os dados do formulário multi-etapas e os salva no banco de dados
 * usando o Prisma ORM
 */
export async function POST(request: NextRequest) {
  try {
    // Obter dados do corpo da requisição
    const body = await request.json();
    
    // Validar dados usando o schema Zod
    const validatedData = formSchema.parse(body);
    
    // Utilizar o serviço ProjetoService para criar o projeto
    // Isso encapsula toda a lógica de negócios e interação com o banco de dados
    const result = await ProjetoService.criarProjeto(validatedData);
    
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