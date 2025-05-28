"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/lib/loginSchema";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      
      setError("Ocorreu um erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <div className="space-y-2">
        <Input
          {...register("email")}
          type="email"
          placeholder="seu@email.com"
          className="w-full"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Input 
          {...register("password")}
          type="password"
          placeholder="Sua senha"
          className="w-full"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        type="submit"
        className="w-full hover:bg-gray-700"
        disabled={isLoading}
      >
        {isLoading ? (
          "Entrando..."
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" /> Entrar
          </>
        )}
      </Button>
      <div className="text-sm text-center space-x-2">
        <Link href={"/sign-up"} className="text-green-600 hover:underline">
          Criar conta
        </Link>
        <span>·</span>
        <Link href={"/reset"} className="text-green-600 hover:underline">
          Esqueceu a senha?
        </Link>
      </div>
    </form>
  );
}