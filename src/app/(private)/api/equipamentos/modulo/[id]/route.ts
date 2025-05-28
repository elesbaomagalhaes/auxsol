import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { moduloFormSchema } from "@/lib/schema/moduloSchema";

/**
 * API route para atualizar uma Inversor existente
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

    // Obter ID da Inversor a ser atualizada
    const id = params.id;
    
    // Verificar se o ID é válido
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se a Inversor existe
    const existingModulo = await prisma.modulo.findUnique({
      where: { id },
    });

    if (!existingModulo) {
      return NextResponse.json(
        { success: false, message: "Módulo não encontrada" },
        { status: 404 }
      );
    }

    // Obter dados JSON do corpo da requisição
    const data = await request.json();
    
    // Validar dados usando o schema Zod
    const validatedData = moduloFormSchema.parse(data);
    
    // Log dos dados antes de atualizar
    console.log("Dados da Inversor a serem atualizados:", validatedData);
    

    // Verificar quais campos existem no modelo Prisma e incluir apenas esses na atualização
    const updatedmodulo = await prisma.modulo.update({
      where: { id },
      data: {
        ...validatedData,
         updatedAt: new Date()
      },
         
    });

    // Retornar resposta de sucesso com os dados atualizados
    return NextResponse.json({ 
      success: true, 
      message: "Inversor atualizada com sucesso",
      data: updatedmodulo 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Erro ao atualizar Inversor:", error);
    
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

    // Obter ID da Inversor a ser excluída
    const id = params.id;
    const userId = session.user.id;

    // Verificar se o ID é válido
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se a Inversor existe e pertence ao usuário
    const inversorToDelete = await prisma.modulo.findFirst({
      where: { 
        id: id,
        userId: userId 
      },
    });

    if (!inversorToDelete) {
      return NextResponse.json(
        { success: false, message: "Módulo não encontrada ou não pertence ao usuário" },
        { status: 404 }
      );
    }

    // Excluir a Inversor
    await prisma.modulo.delete({
      where: { 
        id: id
      },
    });

    // Retornar resposta de sucesso
    return NextResponse.json({ 
      success: true, 
      message: "Módulo excluída com sucesso"
    }, { status: 200 });
    
  } catch (error) {
    console.error("Erro ao excluir Inversor:", error);
    
    // Erro genérico
    return NextResponse.json({ 
      success: false, 
      message: "Erro ao processar a solicitação" 
    }, { status: 500 });
  }
}