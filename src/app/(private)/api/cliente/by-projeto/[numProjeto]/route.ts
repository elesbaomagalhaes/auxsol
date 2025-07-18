import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Buscar cliente por número de projeto
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ numProjeto: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { numProjeto } = await params;

    if (!numProjeto) {
      return NextResponse.json(
        { error: "Número do projeto é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar cliente pelo número do projeto
    const cliente = await prisma.cliente.findFirst({
      where: {
        numProjeto: numProjeto,
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
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado para este projeto" },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente por projeto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}