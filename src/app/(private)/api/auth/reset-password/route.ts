/**
 * @fileoverview API Route para redefinição de senha.
 * Recebe uma nova senha e um token de redefinição, valida o token,
 * atualiza a senha do usuário e invalida o token.
 */
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/loginSchema";

/**
 * Manipulador da requisição POST para redefinir a senha.
 * @param {Request} req - O objeto da requisição, contendo a nova senha e o token no corpo.
 * @returns {Promise<NextResponse>} Uma resposta JSON indicando sucesso ou falha.
 */
export async function POST(req: Request) {
  try {
    // Parseia o corpo da requisição
    const body = await req.json();

    try {
      // Valida os dados de entrada usando o schema Zod
      const { password, token } = resetPasswordSchema.parse(body);

      // Busca o código de redefinição no banco de dados
      // Verifica se o token existe, não expirou e está associado a um usuário
      const resetCode = await prisma.passwordResetCode.findFirst({
        where: {
          code: token,
          expiry: { gt: new Date() }, // Garante que o token não expirou
        },
        include: {
          user: true, // Inclui os dados do usuário associado
        },
      });

      // Se o token não for encontrado ou for inválido/expirado
      if (!resetCode) {
        return NextResponse.json(
          { message: "Token inválido ou expirado" },
          { status: 400 }
        );
      }

      // Gera o hash da nova senha
      const hashedPassword = await hash(password, 12);

      // Atualiza a senha do usuário no banco de dados
      await prisma.user.update({
        where: { id: resetCode.userId },
        data: {
          password: hashedPassword,
          updatedAt: new Date(), // Atualiza a data de modificação do usuário
        },
      });

      // Marca o código de redefinição como expirado (invalida o token)
      // Definindo a data de expiração para o momento atual
      await prisma.passwordResetCode.update({
        where: { id: resetCode.id },
        data: { expiry: new Date() },
      });

      // Retorna uma resposta de sucesso
      return NextResponse.json({ 
        message: "Senha redefinida com sucesso" 
      });

    } catch (validationError) {
      // Captura erros de validação do Zod
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { message: "Dados inválidos para redefinição de senha" },
        { status: 400 }
      );
    }
  } catch (error) {
    // Captura erros gerais durante o processo
    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json(
      { message: "Erro ao redefinir senha" },
      { status: 500 }
    );
  }
}