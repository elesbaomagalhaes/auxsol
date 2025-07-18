import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { moduloFormSchema } from "@/lib/schema/moduloSchema";

// GET - Buscar módulos
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("clienteId");

    const whereClause = clienteId 
      ? { userId: clienteId }
      : { userId: session.user.id };

    const modulos = await prisma.modulo.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(modulos);
  } catch (error) {
    console.error("Erro ao buscar módulos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar novo módulo
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

    // Criar módulo no banco de dados
    const novoModulo = await prisma.modulo.create({
      data: {
        ...validatedData.data,
        userId: session.user.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { 
        message: "Módulo criado com sucesso",
        modulo: novoModulo
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}