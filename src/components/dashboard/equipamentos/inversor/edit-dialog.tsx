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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, KeyboardEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { inversorSchema, type InversorSchema } from "@/lib/schema/inversorSchema";
import  type { Inversor } from "../types";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react"; // Added Info
import { Separator } from "@/components/ui/separator"; // Added Separator
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Added Tooltip imports
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
  inversorData: Inversor | null;
  onSave: (data: Inversor) => void;
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

export function EditInversorDialog({
  open,
  onOpenChange,
  inversorData,
  onSave,
}: EditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Inicializar o formulário com React Hook Form e validação Zod
  const form = useForm<InversorSchema>({
    resolver: zodResolver(inversorSchema),
    defaultValues: {
      fabricante: "",
      modelo: "",
      potenciaNomEnt: 0,
      potenciaMaxEnt: 0,
      tensaoMaxEnt: "",
      tensaoInic: "",
      tensaoNomEnt: "",
      numeroEntMPPT: 0,
      potenciaMaxMPPT: "",
      correnteMaxEnt: "",
      correnteMaxCurtCirc: "",
      potenciaNomSai: 0,
      potenciaMaxSai: 0,
      correnteNomSai: "",
      correnteMaxSai: "",
      tensaoNomSai: "",
      THD: "",
      frequenciaNom: "",
      fatorPotencia: 0,
      tensaoMaxsSai: "",
      tensaoMinSai: "",
      eficiencia: 0,
    },
  });

  // Atualizar o formulário quando stringBoxData mudar
  useEffect(() => {
    if (inversorData) {
      // Reset do formulário com os novos valores
      form.reset({
      fabricante: inversorData.fabricante,
      modelo: inversorData.modelo,
      potenciaNomEnt: inversorData.potenciaNomEnt,
      potenciaMaxEnt: inversorData.potenciaMaxEnt,
      tensaoMaxEnt: inversorData.tensaoMaxEnt,
      tensaoInic: inversorData.tensaoInic,
      tensaoNomEnt: inversorData.tensaoNomEnt,
      numeroEntMPPT: inversorData.numeroEntMPPT,
      potenciaMaxMPPT: inversorData.potenciaMaxMPPT,
      correnteMaxEnt: inversorData.correnteMaxEnt,
      correnteMaxCurtCirc: inversorData.correnteMaxCurtCirc,
      potenciaNomSai: inversorData.potenciaNomSai,
      potenciaMaxSai: inversorData.potenciaMaxSai,
      correnteNomSai: inversorData.correnteNomSai,
      correnteMaxSai: inversorData.correnteMaxSai,
      tensaoNomSai: inversorData.tensaoNomSai,
      THD: inversorData.THD,
      frequenciaNom: inversorData.frequenciaNom,
      fatorPotencia: inversorData.fatorPotencia,
      tensaoMaxsSai: inversorData.tensaoMaxsSai,
      tensaoMinSai: inversorData.tensaoMinSai,
      eficiencia: inversorData.eficiencia,
      });
    }
  }, [inversorData, form]);

  const handleSubmit = async (data: InversorSchema) => {
    setIsLoading(true);
    try {
      // Preservar o ID ao salvar
      const updatedData = {
        ...data,
        id: inversorData?.id || "",
      };
      
      // Realizar chamada à API para atualizar os dados
      const response = await fetch(`/api/equipamentos/inversor/${updatedData.id}`, {
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
      toast.success("Inversor atualizado com sucesso!");
      
      // Fechar o diálogo e redirecionar após um breve delay para mostrar o feedback
      setTimeout(() => {
        onOpenChange(false);
        // Redirecionar para a página de gerenciamento para recarregar a tabela
        window.location.href = "/dashboard/equipamentos/inversor";
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar Inversor:", error);
      toast.error("Não foi possível atualizar o Inversor. Tente novamente.");
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
              <DialogTitle>Editar Inversor</DialogTitle>
              <DialogDescription>
                Atualize as informações do Inversor selecionado.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-12 md:grid-cols-12 gap-4 py-4">
              <div className="col-span-12 gap-4 space-y-2">
                <h2 className="font-bold">- Entradas</h2>
                <Separator />
              </div>
              <div className="col-span-6 md:col-span-6 space-y-2 gap-4">
                <FormField
                  control={form.control}
                  name="fabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricante</FormLabel>
                      <FormControl>
                        <Input placeholder="Fabricante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-6 space-y-2 gap-4">
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Modelo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="potenciaNomEnt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pot. Nom. Entrada (kW)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="potenciaMaxEnt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pot. Máx. Entrada (kW)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="tensaoMaxEnt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Máx. Entrada (V)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="tensaoInic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão de Inicialização (V)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y">
                <FormField
                  control={form.control}
                  name="tensaoNomEnt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Nom. Entrada (V)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="numeroEntMPPT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Núm. Entradas MPPT</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => handleIntegerInputChangeForField(e.target.value, field.onChange)}
                          onKeyDown={preventNonIntegerKeys}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="potenciaMaxMPPT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pot. Máx. MPPT (W)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="correnteMaxEnt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corr. Máx. Entrada (A)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-4 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="correnteMaxCurtCirc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corr. Máx. Curto-Circuito (A)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 gap-4 space-y-2">
                <h2 className="font-bold">- Saídas</h2>
                <Separator />
              </div>
              <div className="col-span-6 md:col-span-4 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="potenciaNomSai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pot. Nom. Saída (kW)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-4 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="potenciaMaxSai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pot. Máx. Saída (kW)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="correnteNomSai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corr. Nom. Saída (A)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="correnteMaxSai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corr. Máx. Saída (A)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="tensaoNomSai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Nom. Saída (V)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="THD"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>THD (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="frequenciaNom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência Nom. (Hz)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="fatorPotencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fator de Potência</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="tensaoMaxsSai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Máx. Saída (V)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="tensaoMinSai"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Mín. Saída (V)</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="eficiencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eficiência (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value}
                        />
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