import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { clienteSchema } from "@/lib/schema/clienteSchema";
import { z } from "zod";

// GET - Buscar cliente específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const cliente = await prisma.cliente.findFirst({
      where: {
        id,
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
        numProjeto: true,
        rua: true,
        numero: true,
        complemento: true,
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
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validar dados com o schema
    const validatedData = clienteSchema.parse(body);

    // Verificar se o cliente existe e pertence ao usuário
    const existingCliente = await prisma.cliente.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingCliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se CPF já existe em outro cliente
    if (validatedData.cpf !== existingCliente.cpf) {
      const cpfExists = await prisma.cliente.findFirst({
        where: {
          cpf: validatedData.cpf,
          id: { not: id }
        }
      });

      if (cpfExists) {
        return NextResponse.json(
          { error: "Já existe um cliente cadastrado com este CPF" },
          { status: 400 }
        );
      }
    }

    // Verificar se número de projeto já existe em outro cliente
    if (validatedData.numProjeto !== existingCliente.numProjeto) {
      const projetoExists = await prisma.cliente.findFirst({
        where: {
          numProjeto: validatedData.numProjeto,
          id: { not: id }
        }
      });

      if (projetoExists) {
        return NextResponse.json(
          { error: "Já existe um cliente cadastrado com este número de projeto" },
          { status: 400 }
        );
      }
    }

    // Atualizar cliente
    const updatedCliente = await prisma.cliente.update({
      where: { id },
      data: {
        ...validatedData,
        rgCnhDataEmissao: new Date(validatedData.rgCnhDataEmissao),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCliente);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se o cliente existe e pertence ao usuário
    const existingCliente = await prisma.cliente.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingCliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se há projetos associados ao cliente
    const projetos = await prisma.projeto.findMany({
      where: { 
        cliente: {
          id: id
        }
      }
    });

    if (projetos.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir cliente com projetos associados" },
        { status: 400 }
      );
    }

    // Deletar cliente
    await prisma.cliente.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Cliente deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}