import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { moduloFormSchema } from "@/lib/schema/moduloSchema";

// GET - Buscar módulo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const modulo = await prisma.modulo.findUnique({
      where: {
        id: id,
      },
    });

    if (!modulo) {
      return NextResponse.json(
        { error: "Módulo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(modulo);
  } catch (error) {
    console.error("Erro ao buscar módulo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar módulo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validar dados com Zod
    const validatedData = moduloFormSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { 
          error: "Dados inválidos",
          details: validatedData.error.errors
        },
        { status: 400 }
      );
    }

    // Verificar se o módulo existe
    const moduloExistente = await prisma.modulo.findUnique({
      where: {
        id: id,
      },
    });

    if (!moduloExistente) {
      return NextResponse.json(
        { error: "Módulo não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar módulo no banco de dados
    const moduloAtualizado = await prisma.modulo.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData.data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Módulo atualizado com sucesso",
      modulo: moduloAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Remover módulo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Verificar se o módulo existe
    const moduloExistente = await prisma.modulo.findUnique({
      where: {
        id: id,
      },
    });

    if (!moduloExistente) {
      return NextResponse.json(
        { error: "Módulo não encontrado" },
        { status: 404 }
      );
    }

    // Remover módulo do banco de dados
    await prisma.modulo.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Módulo removido com sucesso",
    });
  } catch (error) {
    console.error("Erro ao remover módulo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}