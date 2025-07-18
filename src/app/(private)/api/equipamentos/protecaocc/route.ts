import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stringBoxCCSchema } from "@/lib/schema/stringbox-cc";

// GET - Listar todas as proteções CC (stringBoxCC)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const protecoes = await prisma.stringBoxCC.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(protecoes);
  } catch (error) {
    console.error("Erro ao buscar proteções CC:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar nova proteção CC (stringBoxCC)
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
    const validatedData = stringBoxCCSchema.parse(body);

    // Criar proteção CC no banco de dados
    const protecao = await prisma.stringBoxCC.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(protecao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar proteção CC:", error);
    
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