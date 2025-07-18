import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * API route para buscar todos os estados (UF) ativos
 * Esta rota retorna a lista de estados do banco de dados
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Buscar estados ativos do banco de dados
    const estados = await prisma.uf.findMany({
      where: {
        status: 'a' // apenas estados ativos
      },
      select: {
        sigla: true
      },
      orderBy: {
        sigla: 'asc'
      }
    });

    // Retornar apenas as siglas dos estados
    const siglas = estados.map(estado => estado.sigla);

    return NextResponse.json(siglas);
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    
    // Fallback para estados estáticos em caso de erro
    const estadosEstaticos = [
      "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
      "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
      "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];
    
    return NextResponse.json(estadosEstaticos);
  }
}