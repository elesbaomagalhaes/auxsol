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
import { tecnicoSchema, type TecnicoSchema } from "@/lib/schema/tecnicoSchema";
import  type { Tecnico } from "./types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Added Info
import { Separator } from "@/components/ui/separator"; // Added Separator

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {useRouter} from "next/navigation";


type EditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tecnicoData: Tecnico | null;
  onSave: (data: Tecnico) => void;
};

// END: Adicionar funções helper para máscara de input

export function EditTecnicoDialog({
  open,
  onOpenChange,
  tecnicoData,
  onSave,
}: EditDialogProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const router = useRouter();
  const form = useForm<TecnicoSchema>({
    resolver: zodResolver(tecnicoSchema),
    defaultValues: {
      nome: "",
      registro: "",
      rgCnh: "",
      cpf: "",
      fone: "",
      email: "",
      tipoProfissional: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    },
  });

  useEffect(() => {
    
    if (tecnicoData && form.formState.isDirty === false) {
      form.reset({
        ...tecnicoData,
      });
      setSelectedMethod(tecnicoData.tipoProfissional || "");
    }
  }, [tecnicoData]);

  const handleSubmit = async (data: TecnicoSchema) => {
    setIsLoading(true);
    try {
      // Preservar o ID ao salvar
      const updatedData = {
        ...data,
        id: tecnicoData?.id || "",
      };
      
      // Realizar chamada à API para atualizar os dados
      const response = await fetch(`/api/tecnico/${updatedData.id}`, {
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
      onSave({
        ...updatedData,
        createdAt: tecnicoData?.createdAt || new Date(),
        updatedAt: new Date()
      });
      
      // Mostrar mensagem de sucesso
      toast.success("Técnico atualizado com sucesso!");
      
      // Fechar o diálogo e redirecionar após um breve delay para mostrar o feedback
      setTimeout(() => {
        onOpenChange(false);
        // Redirecionar para a página de gerenciamento para recarregar a tabela
        router.push("/dashboard/tecnico");
      }, 1500);

    } catch (error) {
      console.error("Erro ao atualizar Técnico:", error);
      toast.error("Não foi possível atualizar o Técnico. Tente novamente.");
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
              <DialogTitle>Editar Técnico</DialogTitle>
              <DialogDescription>
                Atualize as informações do técnico selecionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-12 md:grid-cols-12 gap-4 py-4">
              <div className="col-span-12 gap-4 space-y-2">
                <h2 className="font-bold">- Dados Pessoais</h2>
                <Separator />
              </div>
              
              <div className="col-span-6 md:col-span-6 space-y-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo do técnico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-12 md:col-span-6 space-y-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoProfissional"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo Profissional</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <label
                            className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              field.value === "Engenheiro"
                                ? "border-stone-700 bg-white"
                                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <input
                              type="radio"
                              {...field}
                              value="Engenheiro"
                              name="tipoProfissional"
                              checked={field.value === "Engenheiro"}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setSelectedMethod(e.target.value);
                              }}
                              className="sr-only"
                            />
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">Engenheiro</span>
                            </div>
                          </label>
                          <label
                            className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              field.value === "Técnico"
                                ? "border-stone-700 bg-white"
                                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                            }`}
                          >
                            <input
                              type="radio"
                              {...field}
                              value="Técnico"
                              name="tipoProfissional"
                              checked={field.value === "Técnico"}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setSelectedMethod(e.target.value);
                              }}
                              className="sr-only"
                            />
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">Técnico</span>
                            </div>
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-6 space-y-2 gap-4">
                <FormField
                  control={form.control}
                  name="registro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registro CREA/CFT</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do registro profissional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="rgCnh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RG/CNH</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do RG ou CNH" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
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
              
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-12 gap-4 space-y-2">
                <h2 className="font-bold">- Endereço</h2>
                <Separator />
              </div>
              
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
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
              
              <div className="col-span-6 md:col-span-5 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="logradouro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logradouro</FormLabel>
                      <FormControl>
                        <Input placeholder="Rua, Avenida, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-4 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto, Bloco, etc. (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-4 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-4 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="col-span-6 md:col-span-2 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="uf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF</FormLabel>
                      <FormControl>
                        <Input placeholder="SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}