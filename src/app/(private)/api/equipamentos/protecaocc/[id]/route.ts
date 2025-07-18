import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stringBoxCCSchema } from "@/lib/schema/stringbox-cc";

// GET - Buscar proteção CC por ID
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

    const protecao = await prisma.stringBoxCC.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!protecao) {
      return NextResponse.json(
        { error: "Proteção CC não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(protecao);
  } catch (error) {
    console.error("Erro ao buscar proteção CC:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar proteção CC
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
    const validatedData = stringBoxCCSchema.parse(body);

    // Verificar se a proteção CC existe e pertence ao usuário
    const existingProtecao = await prisma.stringBoxCC.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingProtecao) {
      return NextResponse.json(
        { error: "Proteção CC não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar proteção CC
    const protecao = await prisma.stringBoxCC.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(protecao);
  } catch (error) {
    console.error("Erro ao atualizar proteção CC:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar dados" },
      { status: 500 }
    );
  }
}

// DELETE - Remover proteção CC
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

    // Verificar se a proteção CC existe e pertence ao usuário
    const existingProtecao = await prisma.stringBoxCC.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingProtecao) {
      return NextResponse.json(
        { error: "Proteção CC não encontrada" },
        { status: 404 }
      );
    }

    // Remover proteção CC
    await prisma.stringBoxCC.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Proteção CC removida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao remover proteção CC:", error);
    return NextResponse.json(
      { error: "Erro ao remover dados" },
      { status: 500 }
    );
  }
}