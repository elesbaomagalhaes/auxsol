import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { protecaoCASchema } from "@/lib/schema/protecao-ca";

// GET - Buscar proteção CA por ID
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

    const protecao = await prisma.protecaoCA.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!protecao) {
      return NextResponse.json(
        { error: "Proteção CA não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(protecao);
  } catch (error) {
    console.error("Erro ao buscar proteção CA:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar proteção CA
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
    const validatedData = protecaoCASchema.parse(body);

    // Verificar se a proteção CA existe e pertence ao usuário
    const existingProtecao = await prisma.protecaoCA.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingProtecao) {
      return NextResponse.json(
        { error: "Proteção CA não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar proteção CA
    const protecao = await prisma.protecaoCA.update({
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
    console.error("Erro ao atualizar proteção CA:", error);
    
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

// DELETE - Remover proteção CA
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

    // Verificar se a proteção CA existe e pertence ao usuário
    const existingProtecao = await prisma.protecaoCA.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingProtecao) {
      return NextResponse.json(
        { error: "Proteção CA não encontrada" },
        { status: 404 }
      );
    }

    // Remover proteção CA
    await prisma.protecaoCA.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      { message: "Proteção CA removida com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao remover proteção CA:", error);
    return NextResponse.json(
      { error: "Erro ao remover dados" },
      { status: 500 }
    );
  }
}