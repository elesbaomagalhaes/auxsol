import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stringBoxCCSchema } from "@/lib/schema/stringbox-cc";

/**
 * API route para salvar uma nova StringBox CC
 * Esta rota recebe os dados do formulário e os salva no banco de dados
 * usando o Prisma ORM
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Obter dados JSON do corpo da requisição
    const data = await request.json();
    
    // Validar dados usando o schema Zod
    const validatedData = stringBoxCCSchema.parse(data);
    
    // Log dos dados antes de salvar
    console.log("Dados da StringBox CC a serem salvos:", validatedData);
    
    // Criar o registro no banco de dados
    const stringBoxCC = await prisma.stringBoxCC.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        createdAt: new Date(),
      },
    });

    // Redirecionar para a página de listagem após sucesso
    return NextResponse.redirect(
      new URL("/dashboard/equipamentos/protecao/cc", request.url)
    );
  } catch (error) {
    console.error("Erro ao criar StringBox CC:", error);
    
    // Verificar se é um erro de validação do Zod
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json({ 
        success: false, 
        message: "Erro de validação", 
        errors: errorMessages 
      }, { status: 400 });
    }
    
    // Verificar se é um erro de chave única
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        message: `O campo ${(error as any).meta?.target?.[0] || 'desconhecido'} já está em uso`,
      }, { status: 409 });
    }
    
    // Erro genérico
    return NextResponse.json({ 
      success: false, 
      message: "Erro ao processar a solicitação" 
    }, { status: 500 });
  }
}