import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que são públicas (acessíveis sem autenticação)
const publicRoutes = ["/","/solucoes","precos","/login", "/login/cadastro", "/login/resete"];

// Rotas que requerem autenticação
const authRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;

  // Se o usuário está autenticado e tenta acessar uma rota pública
  if (isAuthenticated && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se o usuário não está autenticado e tenta acessar uma rota protegida
  if (!isAuthenticated && authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configurar quais rotas o middleware deve ser executado
export const config = {
  matcher: [
    '/login',
    '/login/cadastro',
    '/login/resete',
    '/dashboard/:path*',
  ]
};