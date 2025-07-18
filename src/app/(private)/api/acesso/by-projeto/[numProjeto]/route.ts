import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PUT - Atualizar coordenadas do acesso por número do projeto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ numProjeto: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { numProjeto } = await params;
    const body = await request.json();

    if (!numProjeto) {
      return NextResponse.json(
        { error: "Número do projeto é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o acesso existe para este número de projeto
    const acessoExistente = await prisma.acesso.findUnique({
      where: {
        numProjeto: numProjeto
      }
    });

    if (!acessoExistente) {
      return NextResponse.json(
        { error: "Acesso não encontrado para este projeto" },
        { status: 404 }
      );
    }

    // Atualizar as coordenadas
    const acessoAtualizado = await prisma.acesso.update({
      where: {
        numProjeto: numProjeto
      },
      data: {
        longitudeUTM: body.longitudeUTM,
        latitudeUTM: body.latitudeUTM,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: "Coordenadas atualizadas com sucesso",
      acesso: acessoAtualizado
    });

  } catch (error) {
    console.error("Erro ao atualizar coordenadas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// GET - Buscar dados de acesso por número do projeto
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

    // Buscar acesso pelo número do projeto
    const acesso = await prisma.acesso.findUnique({
      where: {
        numProjeto: numProjeto
      },
      include: {
        client: true
      }
    });

    if (!acesso) {
      return NextResponse.json(
        { error: "Acesso não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(acesso);

  } catch (error) {
    console.error("Erro ao buscar acesso:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}