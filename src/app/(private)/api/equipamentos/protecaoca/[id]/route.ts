import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { protecaoCASchema } from "@/lib/schema/protecao-ca";

/**
 * API route para atualizar uma Proteção CA existente
 * Esta rota recebe os dados do formulário de edição e atualiza o registro no banco de dados
 * usando o Prisma ORM
 */


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 }
      );
    }

    // Obter ID da Proteção CA a ser atualizada
    const id = params.id;
    
    // Verificar se o ID é válido
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se a Proteção CA existe
    const existingProtrecaoCA = await prisma.protecaoCA.findUnique({
      where: { id },
    });

    if (!existingProtrecaoCA) {
      return NextResponse.json(
        { success: false, message: "Protecao CA não encontrada" },
        { status: 404 }
      );
    }

    // Obter dados JSON do corpo da requisição
    const data = await request.json();
    
    // Validar dados usando o schema Zod
    const validatedData = protecaoCASchema.parse(data);
    
    // Log dos dados antes de atualizar
    console.log("Dados da Proteção CA a serem atualizados:", validatedData);
    

    // Verificar quais campos existem no modelo Prisma e incluir apenas esses na atualização
    const updatedProtecaoCA = await prisma.protecaoCA.update({
      where: { id },
      data: {
        ...validatedData,
         updatedAt: new Date(),
      },
         
    });

    // Retornar resposta de sucesso com os dados atualizados
    return NextResponse.json({ 
      success: true, 
      message: "Proteção Ca atualizada com sucesso",
      data: updatedProtecaoCA 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Erro ao atualizar Proteção CA:", error);
    
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 }
      );
    }

    // Obter ID da Proteção CA a ser excluída
    const id = params.id;
    const userId = session.user.id;

    // Verificar se o ID é válido
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se a Proteção CA existe e pertence ao usuário
    const protecaoCAToDelete = await prisma.protecaoCA.findFirst({
      where: { 
        id: id,
        userId: userId 
      },
    });

    if (!protecaoCAToDelete) {
      return NextResponse.json(
        { success: false, message: "Protecao CA não encontrada ou não pertence ao usuário" },
        { status: 404 }
      );
    }

    // Excluir a Proteção CA
    await prisma.protecaoCA.delete({
      where: { 
        id: id,
        // Adicionar userId aqui se a chave primária/única for composta por id e userId
        // Caso contrário, a verificação acima já garante que o item pertence ao usuário.
        // Se id é único globalmente, a cláusula where: {id: id} é suficiente aqui,
        // mas para maior segurança e consistência com a verificação, pode-se usar:
        // id_userId: { id: id, userId: userId } se tal índice existir, ou manter como está.
      },
    });

    // Retornar resposta de sucesso
    return NextResponse.json({ 
      success: true, 
      message: "Proteção CA excluída com sucesso"
    }, { status: 200 });
    
  } catch (error) {
    console.error("Erro ao excluir Proteção CA:", error);
    
    // Erro genérico
    return NextResponse.json({ 
      success: false, 
      message: "Erro ao processar a solicitação" 
    }, { status: 500 });
  }
}