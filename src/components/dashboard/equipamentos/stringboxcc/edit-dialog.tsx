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
import { useState, useEffect } from "react";
import type { StringBoxCC } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { stringBoxCCSchema, type StringBoxCCSchema } from "@/lib/schema/stringbox-cc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type EditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stringBoxData: StringBoxCC | null;
  onSave: (data: StringBoxCC) => void;
};

export function EditStringBoxCCDialog({
  open,
  onOpenChange,
  stringBoxData,
  onSave,
}: EditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Inicializar o formulário com React Hook Form e validação Zod
  const form = useForm<StringBoxCCSchema>({
    resolver: zodResolver(stringBoxCCSchema),
    defaultValues: {
      fabricante: "",
      modelo: "",
      numeroEntradas: 0,
      numeroSaidas: 0,
      tensaoMaxOperacao: "",
      correnteMaxOperacao: "",
      classeDps: "",
      nivelProtecao: "",
      correnteNominalDescarga: "",
      correnteMaxDescarga: "",
      numeroPoloSeccionadora: 0,
      grauProtecao: "",
    },
  });

  // Atualizar o formulário quando stringBoxData mudar
  useEffect(() => {
    if (stringBoxData) {
      // Reset do formulário com os novos valores
      form.reset({
        fabricante: stringBoxData.fabricante,
        modelo: stringBoxData.modelo,
        numeroEntradas: stringBoxData.numeroEntradas,
        numeroSaidas: stringBoxData.numeroSaidas,
        tensaoMaxOperacao: stringBoxData.tensaoMaxOperacao,
        correnteMaxOperacao: stringBoxData.correnteMaxOperacao,
        classeDps: stringBoxData.classeDps,
        nivelProtecao: stringBoxData.nivelProtecao,
        correnteNominalDescarga: stringBoxData.correnteNominalDescarga,
        correnteMaxDescarga: stringBoxData.correnteMaxDescarga,
        numeroPoloSeccionadora: stringBoxData.numeroPoloSeccionadora,
        grauProtecao: stringBoxData.grauProtecao,
      });
    }
  }, [stringBoxData, form]);

  const handleSubmit = async (data: StringBoxCCSchema) => {
    setIsLoading(true);
    try {
      // Preservar o ID ao salvar
      const updatedData = {
        ...data,
        id: stringBoxData?.id || "",
      };
      
      // Realizar chamada à API para atualizar os dados
      const response = await fetch(`/api/equipamentos/protecaocc/${updatedData.id}`, {
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
      onSave(updatedData);
      
      // Mostrar mensagem de sucesso
      toast.success("StringBox CC atualizada com sucesso!");
      
      // Fechar o diálogo e redirecionar após um breve delay para mostrar o feedback
      setTimeout(() => {
        onOpenChange(false);
        // Redirecionar para a página de gerenciamento para recarregar a tabela
        window.location.href = "/dashboard/equipamentos/protecao/cc";
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar StringBox CC:", error);
      toast.error("Não foi possível atualizar a StringBox CC. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Editar StringBox CC</DialogTitle>
              <DialogDescription>
                Atualize as informações da StringBox CC selecionada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricante</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do fabricante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Modelo do equipamento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numeroEntradas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Entradas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 4"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numeroSaidas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Saídas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 1"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tensaoMaxOperacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Máx. Operação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1000V" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="correnteMaxOperacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrente Máx. Operação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 15A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="classeDps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe DPS</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Classe II" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nivelProtecao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Proteção</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1,5kV" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="correnteNominalDescarga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrente Nominal de Descarga</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 20kA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="correnteMaxDescarga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrente Máx. de Descarga</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 40kA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numeroPoloSeccionadora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Polos da Seccionadora</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 2"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grauProtecao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grau de Proteção</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: IP65" {...field} />
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