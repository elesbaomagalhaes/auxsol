import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { tecnicoSchema } from "@/lib/schema/tecnicoSchema";

/**
 * API route para atualizar uma Inversor existente
 * Esta rota recebe os dados do formulário de edição e atualiza o registro no banco de dados
 * usando o Prisma ORM
 */


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 }
      );
    }

    // Obter ID da Inversor a ser atualizada
    const { id } = await params;
    
    // Verificar se o ID é válido
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se a Inversor existe
    const existingTecnico = await prisma.tecnico.findUnique({
      where: { id },
    });

    if (!existingTecnico) {
      return NextResponse.json(
        { success: false, message: "Técnico não encontrada" },
        { status: 404 }
      );
    }

    // Obter dados JSON do corpo da requisição
    const data = await request.json();
    
    // Validar dados usando o schema Zod
    const validatedData = tecnicoSchema.parse(data);
    
    // Log dos dados antes de atualizar
    console.log("Dados da técnico a serem atualizados:", validatedData);
    

    // Verificar quais campos existem no modelo Prisma e incluir apenas esses na atualização
    const updatedInversor = await prisma.tecnico.update({
      where: { id },
      data: {
        ...validatedData,
         updatedAt: new Date(),
      },
         
    });

    // Retornar resposta de sucesso com os dados atualizados
    return NextResponse.json({ 
      success: true, 
      message: "Técnico atualizada com sucesso",
      data: updatedInversor 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Erro ao atualizar Técnico:", error);
    
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

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 }
      );
    }

    // Obter ID da Inversor a ser excluída
    const { id } = await params;
    const userId = session.user.id;

    // Verificar se o ID é válido
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se a Inversor existe e pertence ao usuário
    const tecnicoToDelete = await prisma.tecnico.findFirst({
      where: { 
        id: id,
        userId: userId 
      },
    });

    if (!tecnicoToDelete) {
      return NextResponse.json(
        { success: false, message: "Técnico não encontrado ou não pertence ao usuário" },
        { status: 404 }
      );
    }

    // Excluir a Inversor
    await prisma.tecnico.delete({
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
      message: "Técnico excluído com sucesso"
    }, { status: 200 });
    
  } catch (error) {
    console.error("Erro ao excluir Técnico:", error);
    
    // Erro genérico
    return NextResponse.json({ 
      success: false, 
      message: "Erro ao processar a solicitação" 
    }, { status: 500 });
  }
}