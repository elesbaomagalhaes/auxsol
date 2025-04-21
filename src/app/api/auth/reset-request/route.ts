import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordRequestSchema } from "@/lib/loginSchema";
import { randomInt } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

// Função para gerar código de 6 dígitos
function generateVerificationCode(): string {
  return randomInt(100000, 999999).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    try {
      // Validar dados de entrada
      const { email } = resetPasswordRequestSchema.parse(body);
      
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      
      // Se o usuário existir, gerar e salvar código de verificação
      if (user) {
        // Gerar código de 6 dígitos
        const code = generateVerificationCode();
        
        // Definir expiração (1 hora a partir de agora)
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
        
        // Salvar código no banco de dados
        await prisma.passwordResetCode.create({
          data: {
            code,
            email: email.toLowerCase(),
            expiry,
            userId: user.id,
            updatedAt: new Date()
          },
        });
        
        // Enviar e-mail com o código de verificação
        const emailResult = await sendPasswordResetEmail(email, code);
        
        if (!emailResult.success) {
          console.error(`Falha ao enviar e-mail para ${email}:`, emailResult.error);
          // Continuamos o fluxo mesmo com falha no envio de e-mail
          // para não revelar se o e-mail existe ou não
        } else {
          console.log(`E-mail de redefinição enviado com sucesso para ${email}`);
        }
      }
      
      // Sempre retornar sucesso, mesmo se o e-mail não existir (por segurança)
      return NextResponse.json({ 
        message: "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha."
      });
      
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json(
        { message: "E-mail inválido" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar solicitação de reset de senha:", error);
    return NextResponse.json(
      { message: "Erro ao processar solicitação" },
      { status: 500 }
    );
  }
}