"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { clienteSchema } from "@/lib/schema/clienteSchema";
import { z } from "zod";
import { toast } from "sonner";
import { showClienteSuccessToast } from "@/components/ui/success-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormData = z.infer<typeof clienteSchema>;

export function FormCliente() {
  const [isLoading, setIsLoading] = useState(false);
  const [estados, setEstados] = useState<string[]>([]);
  const router = useRouter();

  // Buscar todos os estados ao carregar o componente
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch('/api/estados');
        if (!response.ok) {
          throw new Error('Falha ao buscar estados');
        }
        const estadosData = await response.json();
        setEstados(estadosData);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
        // Fallback para estados estáticos em caso de erro
        setEstados([
          "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
          "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
          "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        ]);
      }
    };

    fetchEstados();
  }, []);

  // END: Adicionar funções helper para máscara de input
  const form = useForm<FormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      rgCnh: "",
      rgCnhDataEmissao: "",
      cpf: "",
      fone: "",
      email: "",
      rua: "",
      numero: "",
      complemento: "",
      numProjeto: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      // Converter a data de emissão para objeto Date
      const formattedData = {
        ...data,
        rgCnhDataEmissao: new Date(data.rgCnhDataEmissao),
      };

      // Enviar dados para a API
      const response = await fetch("/api/cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao cadastrar: ${response.status}`);
      }

      // Mostrar mensagem de sucesso
      showClienteSuccessToast(data.nome);

      // Redirecionar após um breve delay para mostrar o feedback
      setTimeout(() => {
        router.push("/dashboard/cliente");
      }, 1500);

    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error("Não foi possível cadastrar o cliente. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-12 md:grid-cols-12 gap-4 py-4">
          {/* Dados Pessoais */}
          <div className="col-span-12">
            <h3 className="text-lg font-medium">Dados Pessoais</h3>
            <Separator className="my-2" />
          </div>
          
          <div className="col-span-12 md:col-span-5">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="rgCnh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RG/CNH</FormLabel>
                  <FormControl>
                    <Input placeholder="RG ou CNH" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <FormField
              control={form.control}
              name="rgCnhDataEmissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Emissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input placeholder="CPF ou CNPJ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="fone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Endereço */}
          <div className="col-span-12">
            <h3 className="text-lg font-medium">Endereço</h3>
            <Separator className="my-2" />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="rua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, Avenida, etc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-2">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Complemento (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-2">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-12 md:col-span-2">
            <FormField
              control={form.control}
              name="uf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/dashboard/cliente")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Cadastrar Cliente"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}