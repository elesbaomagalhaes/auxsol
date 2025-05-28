/**
 * @fileoverview Configuração do NextAuth para autenticação.
 * Utiliza o PrismaAdapter para integração com o banco de dados e o provedor Credentials para login com email e senha.
 */
// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

/**
 * Instância do PrismaAdapter para conectar o NextAuth ao banco de dados Prisma.
 */
const adapter = PrismaAdapter(prisma);

/**
 * Configuração principal do NextAuth.
 * Exporta funções e handlers para autenticação, login e logout.
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
      adapter,
    providers: [
        /**
         * Provedor de credenciais para autenticação com email e senha.
         */
        Credentials({
            /**
             * Define os campos esperados para as credenciais.
             */
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            /**
             * Função de autorização que valida as credenciais do usuário.
             * @param {Record<string, unknown>} credentials - As credenciais fornecidas pelo usuário.
             * @returns {Promise<User | null>} O objeto do usuário se a autenticação for bem-sucedida, caso contrário, null.
             */
            authorize: async (credentials) => {
                // Verifica se email e senha foram fornecidos
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                // Busca o usuário no banco de dados pelo email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                // Verifica se o usuário existe e possui senha cadastrada
                if (!user || !user.password) {
                    // Não jogue um erro aqui para evitar revelar se um email existe
                    return null;
                }

                // Compara a senha fornecida com a senha hashada no banco
                const isPasswordValid = await compare(
                    credentials.password as string,
                    user.password
                );

                // Se a senha for inválida, retorna null
                if (!isPasswordValid) {
                    return null;
                }
                // Retorna o objeto do usuário sem a senha
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    userType: user.userType,
                    image: user.image
                  };

                //const { password, ...userWithoutPassword } = user;
                //return userWithoutPassword;
            }
        })
      ],

    /**
     * Callbacks para personalizar o comportamento do NextAuth.
     */
    callbacks: {
      /**
       * Callback JWT: Modifica o token JWT antes de ser salvo.
       * Adiciona uma flag 'credentials' se o login foi feito por este provedor.
       * @param {object} params - Parâmetros do callback JWT.
       * @param {JWT} params.token - O token JWT.
       * @param {Account | null} params.account - Informações da conta do provedor.
       * @returns {Promise<JWT>} O token JWT modificado.
       */
      async jwt({ token, account, user}) {
        // Adiciona uma flag ao token se o login foi via Credentials
        if (account?.provider === "credentials") {
          token.credentials = true;
        }

        // cria o tipo correto de propriedade userType
        if (user) {
          token.id = user.id as string;
          token.name = user.name;
          token.email = user.email;
          token.userType = (user as any).userType;
          token.image = user.image as string 
        }
        
        return token;
      },
    },

      /**
       * Configurações do JWT.
       */
      jwt: {
        /**
         * Função de codificação personalizada para o JWT.
         * Se o login foi via Credentials, cria uma sessão no banco de dados e retorna o token da sessão.
         * Caso contrário, usa a função de codificação padrão.
         * @param {object} params - Parâmetros para codificação.
         * @param {JWT} params.token - O token a ser codificado.
         * @param {string} params.secret - O segredo para codificação.
         * @returns {Promise<string>} O token codificado (token de sessão ou JWT padrão).
         */
        encode: async function (params){
        // Se o token possui a flag 'credentials', indica login via email/senha
        if(params.token?.credentials) {
          // Gera um token de sessão único
          const sessionToken = uuid();

          // Garante que o ID do usuário (sub) existe no token
          if(!params.token.sub){
            throw new Error("Não existe id dentro do token");
          }

          // Cria a sessão no banco de dados usando o adapter
          const createdSession = await adapter?.createSession?.({
              sessionToken: sessionToken,
              userId: params.token.sub,
              expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // Expira em 1 hora
          })

          // Verifica se a sessão foi criada com sucesso
          if (!createdSession){
            throw new Error("Não foi possível criar uma sessão");
          }
          // Retorna o token da sessão criada
          return sessionToken;
        }
        // Para outros tipos de login, usa a codificação padrão do NextAuth
        return defaultEncode(params);

    }}
    });