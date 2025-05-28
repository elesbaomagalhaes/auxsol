/**
 * @fileoverview Middleware para controle de acesso baseado em autenticação.
 * Redireciona usuários autenticados de rotas públicas para o dashboard
 * e usuários não autenticados de rotas protegidas para a página de login.
 */
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lista de rotas públicas que não exigem autenticação.
 * @type {string[]}
 */
const publicRoutes = ["/","/solucoes","precos","/login", "/login/cadastro", "/login/resete"];

/**
 * Lista de rotas que exigem autenticação.
 * @type {string[]}
 */
const authRoutes = ["/dashboard"];

/**
 * Função de middleware principal.
 * Verifica o status de autenticação do usuário e redireciona conforme necessário.
 * @param {NextRequest} request - O objeto da requisição Next.js.
 * @returns {Promise<NextResponse>} A resposta Next.js (redirecionamento ou continuação).
 */
export async function middleware(request: NextRequest) {

  // Obtém o token JWT da requisição
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Verifica se o usuário está autenticado
  const isAuthenticated = !!token;
  // Obtém o caminho da URL atual
  const path = request.nextUrl.pathname;

  // Se o usuário está autenticado e tenta acessar uma rota pública (exceto a raiz talvez?)
  // Redireciona para o dashboard
  if (isAuthenticated && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Se o usuário não está autenticado e tenta acessar uma rota protegida
  // Redireciona para a página de login
  if (!isAuthenticated && authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se nenhuma das condições acima for atendida, permite que a requisição continue
  return NextResponse.next();
}

/**
 * Configuração do matcher para o middleware.
 * Define em quais rotas o middleware será executado.
 */
export const config = {
  matcher: [
    '/login',
    '/login/cadastro',
    '/login/resete',
    '/dashboard/:path*', // Aplica a todas as sub-rotas do dashboard
  ]
};