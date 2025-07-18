import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { protecaoCASchema } from "@/lib/schema/protecao-ca";

// GET - Listar todas as proteções CA
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const protecoes = await prisma.protecaoCA.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(protecoes);
  } catch (error) {
    console.error("Erro ao buscar proteções CA:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar nova proteção CA
export async function POST(request: NextRequest) {
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

    // Criar proteção CA no banco de dados
    const protecao = await prisma.protecaoCA.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(protecao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar proteção CA:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao salvar dados" },
      { status: 500 }
    );
  }
}