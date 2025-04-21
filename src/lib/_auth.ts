import  prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-mail e senha são obrigatórios.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error("Usuário ou senha inválidos.");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Usuário ou senha inválidos.");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          userType: user.userType,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        userType: token.userType as string,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Type assertion to include userType property
        const customUser = user as {
          id: string;
          name?: string | null;
          email?: string | null;
          userType?: string;
        };

        token.id = customUser.id;
        token.name = customUser.name;
        token.email = customUser.email;
        token.userType = customUser.userType;
      }
      return token;
    },
  },
};