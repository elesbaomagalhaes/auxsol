import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/loginSchema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    // Read the request body only once
    const body = await req.json();
    console.log('Registration data received:', body);
    console.log('Form fields details:', {
      name: body.name || 'não fornecido',
      email: body.email || 'não fornecido',
      password: body.password ? '******' : 'não fornecido',
      userType: body.userType || 'não fornecido'
    });

    try {
      const { name, email, password, userType } = registerSchema.parse(body);

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "E-mail já está em uso" },
          { status: 400 }
        );
      }

      // Hash the password with proper salt rounds
      const hashedPassword = await hash(password, 12);

      // Create the user with sanitized data
      const user = await prisma.user.create({
        data: {
          updatedAt: new Date(),
          name: name.trim(),
          email: email.toLowerCase(),
          password: hashedPassword,
          userType: userType
        },
      });

      // Remove sensitive data from response
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(
        {
          user: userWithoutPassword,
          message: "Conta criada com sucesso",
        },
        { status: 201 }
      );
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        return NextResponse.json(
          { 
            message: "Dados inválidos",
            errors: validationError.errors
          },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {

    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Erro ao criar conta"},
      { status: 500 }
    );
  }
}