import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/loginSchema";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    try {
      // Validar dados de entrada
      const { password, token } = resetPasswordSchema.parse(body);
      
      // Verificar se o token existe e é válido
      const resetCode = await prisma.passwordResetCode.findFirst({
        where: {
          code: token,
          expiry: { gt: new Date() },
        },
        include: {
          user: true,
        },
      });
      
      if (!resetCode) {
        return NextResponse.json(
          { message: "Token inválido ou expirado" },
          { status: 400 }
        );
      }
      
      // Hash da nova senha
      const hashedPassword = await hash(password, 12);
      
      // Atualizar a senha do usuário
      await prisma.user.update({
        where: { id: resetCode.userId },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });
      
      // Marcar o código como expirado
      await prisma.passwordResetCode.update({
        where: { id: resetCode.id },
        data: { expiry: new Date() },
      });
      
      return NextResponse.json({ 
        message: "Senha redefinida com sucesso" 
      });
      
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { message: "Dados inválidos para redefinição de senha" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return NextResponse.json(
      { message: "Erro ao redefinir senha" },
      { status: 500 }
    );
  }
}