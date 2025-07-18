import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { clienteSchema } from "@/lib/schema/clienteSchema";
import { z } from "zod";

// GET - Buscar todos os clientes do usuário
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const clientes = await prisma.cliente.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        nome: true,
        rgCnh: true,
        rgCnhDataEmissao: true,
        cpf: true,
        fone: true,
        email: true,
        rua: true,
        numero: true,
        complemento: true,
        numProjeto: true,
        bairro: true,
        cidade: true,
        uf: true,
        cep: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar novo cliente
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validar dados com o schema
    const validatedData = clienteSchema.parse(body);

    // Verificar se já existe cliente com mesmo CPF
    const existingCliente = await prisma.cliente.findUnique({
      where: { cpf: validatedData.cpf }
    });

    if (existingCliente) {
      return NextResponse.json(
        { error: "Já existe um cliente cadastrado com este CPF" },
        { status: 400 }
      );
    }

    // Criar cliente
    const cliente = await prisma.cliente.create({
      data: {
        ...validatedData,
        rgCnhDataEmissao: new Date(validatedData.rgCnhDataEmissao),
        userId: session.user.id,
        numProjeto: validatedData.numProjeto || "",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}