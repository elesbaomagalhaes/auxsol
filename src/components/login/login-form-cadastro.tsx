"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { UserPlus, Eye, EyeOff, BadgeCheck, Rocket } from "lucide-react";
import Link from "next/link";
import { RegisterFormData, registerSchema } from "@/lib/loginSchema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function FormCadastroUser() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"int" | "eng" | null>(null);

    const planos = [
    {
      id: "int",
      name: "Integrador",
      description: "Conteúdo completo para integradores",
      icon: BadgeCheck,
    },
    {
      id: "eng",
      name: "Engenheiro",
      description: "Conteúdo completo para engenheiros",
      icon: Rocket,
    }
  ]

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      userType: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Mostrar toast de carregamento
      const loadingToast = toast.loading("Criando sua conta...");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      // Remover toast de carregamento
      toast.dismiss(loadingToast);

      if (!response.ok) {
        if (responseData.message === "E-mail já está em uso") {
          toast.error("E-mail já cadastrado", {
            description: "Este e-mail já está sendo usado por outra conta.",
            duration: 5000,
          });
        } else if (responseData.errors) {
          // Mostrar erros de validação específicos
          toast.error("Dados inválidos", {
            description: "Verifique os campos e tente novamente.",
            duration: 5000,
          });
        } else {
          toast.error("Erro ao criar conta", {
            description: responseData.message || "Ocorreu um erro ao processar seu cadastro.",
            duration: 5000,
          });
        }
        throw new Error(responseData.message || "Erro ao criar conta");
      }

      toast.success("Conta criada com sucesso", {
        description: "Você será redirecionado para a página de login.",
        duration: 5000,
      });

      // Pequeno atraso para o usuário ver o toast antes do redirecionamento
      setTimeout(() => {
        router.push("/sign-in");
        router.refresh();
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        toast.error("Erro ao criar conta", {
          description: "Ocorreu um erro ao criar a conta",
          duration: 5000,
        });
        setError("Ocorreu um erro ao criar a conta");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input
          {...register("name")}
          type="text"
          placeholder="Nome completo"
          className="w-full"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

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
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Sua senha"
            className="w-full pr-10"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">Escolha seu plano</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {planos.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "rounded-lg border p-4 cursor-pointer transition-colors duration-300",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-muted hover:border-green-400"
              )}
              onClick={() => {
                setSelectedPlan(plan.id as "int" | "eng");
                setValue("userType", plan.id as "int" | "eng");
                clearErrors("userType");
              }}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-2">
        Plano selecionado:{" "}
        <span className="font-bold text-primary">
          {selectedPlan ? selectedPlan.toUpperCase() : "Nenhum"}
        </span>
      </p>

      {/* Campo oculto para envio do plano no formulário */}
        <Input
          {...register("userType")}
          type="hidden"
          placeholder="plano"
          className="w-full"
          
        />
      {errors.userType && (
          <p className="text-sm text-red-500">{errors.userType.message}</p>
        )}
    </div>
      

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? (
          "Criando conta..."
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" /> Criar Conta
          </>
        )}
      </Button>

      <div className="text-sm text-center">
        <span className="text-gray-600">Já possui uma conta?</span>{" "}
        <Link href={"/sign-in"} className="text-green-600 hover:underline">
          Faça login
        </Link>
      </div>
    </form>
  );
}