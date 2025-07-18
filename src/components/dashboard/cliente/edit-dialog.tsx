"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect, KeyboardEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { clienteSchema } from "@/lib/schema/clienteSchema";
import { z } from "zod";
import type { Cliente } from "./types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof clienteSchema>;

type EditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteData: Cliente | null;
  onSave: (data: Cliente) => void;
};

// START: Adicionar funções helper para máscara de input
const handleDecimalInputChangeForField = (
  inputValue: string,
  fieldOnChange: (value: string | number) => void
) => {
  let value = inputValue.replace(/[^0-9.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) { // Mais de um ponto decimal
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  if (parts.length === 2 && parts[1].length > 2) { // Mais de duas casas decimais
    value = parts[0] + '.' + parts[1].substring(0, 2);
  }
  fieldOnChange(value);
};

const formatDecimalOnBlurForField = (
  inputValue: string,
  fieldOnChange: (value: string | number) => void
) => {
  if (inputValue.trim() === "") {
    fieldOnChange(""); 
    return;
  }
  const num = parseFloat(inputValue);
  if (!isNaN(num)) {
    fieldOnChange(num.toFixed(2));
  } else {
    fieldOnChange(inputValue);
  }
};

const handleIntegerInputChangeForField = (
  inputValue: string,
  fieldOnChange: (value: string | number) => void
) => {
  const value = inputValue.replace(/[^0-9]/g, '');
  fieldOnChange(value); 
};

const preventNonIntegerKeys = (event: KeyboardEvent<HTMLInputElement>) => {
  if (['.', ',', 'e', 'E', '+', '-'].includes(event.key)) {
    event.preventDefault();
  }
};
// END: Adicionar funções helper para máscara de input

export function EditClienteDialog({ open, onOpenChange, clienteData, onSave }: EditDialogProps) {
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
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    },
  });

  useEffect(() => {
    if (clienteData) {
      form.reset({
        nome: clienteData.nome,
        rgCnh: clienteData.rgCnh,
        rgCnhDataEmissao: clienteData.rgCnhDataEmissao.toISOString().split('T')[0],
        cpf: clienteData.cpf,
        fone: clienteData.fone,
        email: clienteData.email,
        rua: clienteData.rua,
        numero: clienteData.numero,
        complemento: clienteData.complemento || "",
        bairro: clienteData.bairro,
        cidade: clienteData.cidade,
        uf: clienteData.uf,
        cep: clienteData.cep,
      });
    }
  }, [clienteData, form]);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Preservar o ID ao salvar
      const updatedData = {
        ...data,
        id: clienteData?.id || "",
        rgCnhDataEmissao: new Date(data.rgCnhDataEmissao),
      };
      
      // Realizar chamada à API para atualizar os dados
      const response = await fetch(`/api/cliente/${updatedData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar: ${response.status}`);
      }
      
      // Chamar a função onSave passada como prop para atualizar o estado local
      onSave(updatedData as Cliente);
      
      // Mostrar mensagem de sucesso
      toast.success("Cliente atualizado com sucesso!");
      
      // Fechar o diálogo e redirecionar após um breve delay para mostrar o feedback
      setTimeout(() => {
        onOpenChange(false);
        // Redirecionar para a página de gerenciamento para recarregar a tabela
        router.push("/dashboard/cliente");
      }, 1500);

    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Não foi possível atualizar o cliente. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[calc(115vh-10rem)] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Atualize as informações do cliente selecionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-12 md:grid-cols-12 gap-4 py-4">
              {/* Dados Pessoais */}
              <div className="col-span-12">
                <h3 className="text-lg font-medium">Dados Pessoais</h3>
                <Separator className="my-2" />
              </div>
              
              <div className="col-span-12 md:col-span-6">
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

              <div className="col-span-12 md:col-span-4">
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

              <div className="col-span-12 md:col-span-8">
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

              <div className="col-span-12 md:col-span-4">
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

              <div className="col-span-12 md:col-span-4">
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

              <div className="col-span-12 md:col-span-8">
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

              <div className="col-span-12 md:col-span-4">
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}