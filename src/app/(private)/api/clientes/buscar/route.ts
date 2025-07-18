import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nome = searchParams.get("nome");

    if (!nome || nome.length < 2) {
      return NextResponse.json({ error: "Nome deve ter pelo menos 2 caracteres" }, { status: 400 });
    }

    // Buscar clientes que contenham o nome fornecido
    const clientes = await prisma.cliente.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive", // Case insensitive search
        },
      },
      select: {
        id: true,
        nome: true,
        cpf: true,
        fone: true,
        email: true,
        cep: true,
        rua: true,
        numero: true,
        complemento: true,
        bairro: true,
        cidade: true,
        uf: true,
        rgCnh: true,
        rgCnhDataEmissao: true,
      },
      take: 10, // Limitar a 10 resultados
      orderBy: {
        nome: "asc",
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