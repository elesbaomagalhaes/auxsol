
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { protecaoCASchema } from "@/lib/schema/protecao-ca";

/**
 * API route para salvar uma nova Proteção CA
 * Esta rota recebe os dados do formulário e os salva no banco de dados
 * usando o Prisma ORM
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Obter dados JSON do corpo da requisição
    const body = await request.json();
    
    // Validar dados usando o schema Zod
    const validatedData = protecaoCASchema.safeParse(body);
    
    if (!validatedData.success) {
       // Log dos dados antes de salvar
     console.log("Dados da Proteção CA a serem salvos:", validatedData.error.flatten());
      return NextResponse.json({
        success: false,
        message: "Erro de validação",
        errors: validatedData.error.flatten()
      }, { status: 400 });
    }
    // Log dos dados antes de salvar
    console.log("Dados da Proteção CA a serem salvos:", validatedData);
    
    // Criar o registro no banco de dados
    // O schema Zod (protecaoCASchema) já deve garantir que validatedData
    // tem os campos e tipos corretos para o modelo Prisma ProtecaoCA.
    // O campo 'id', se presente em validatedData e não desejado na criação,
    // deve ser omitido pelo schema Zod ou não incluído no spread.
    // Assumindo que protecaoCASchema não inclui 'id' ou o Prisma o ignora na criação.
    const criaprotecaoCA = await prisma.protecaoCA.create({
      data: {
        ...validatedData.data,
         userId: session.user.id,
         correnteMaxDisjuntor: validatedData.data.correnteNomDisjuntor,
         tensaoMaxDPS: validatedData.data.tensaoNomDPS
      },
    });

    console.log("Nova proteção CA criada:", criaprotecaoCA);
    // Redirecionar para a página de listagem após sucesso
    return NextResponse.redirect(
      new URL("/dashboard/equipamentos/protecaoca", request.url)
    );
  } catch (error) {
    console.error("Erro ao criar Proteção CA:", error);
    
    // Verificar se é um erro de validação do Zod
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json({ 
        success: false, 
        message: "Erro de validação", 
        errors: errorMessages 
      }, { status: 400 });
    }
    
    // Verificar se é um erro de chave única
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        message: `O campo ${(error as any).meta?.target?.[0] || 'desconhecido'} já está em uso`,
      }, { status: 409 });
    }
    
    // Erro genérico
    return NextResponse.json({ 
      success: false, 
      message: "Erro ao processar a solicitação" 
    }, { status: 500 });
  }

  }
