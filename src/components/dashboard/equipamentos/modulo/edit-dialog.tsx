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
import { moduloFormSchema, type ModuloSchema } from "@/lib/schema/moduloSchema"; // Mantido moduloFormSchema
import  type { Modulo } from "../types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; 
import { Separator } from "@/components/ui/separator"; 
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
  moduloData: Modulo | null;
  onSave: (data: Modulo) => void;
};


// START: Funções helper para máscara de input (mantidas como estão no form-modulo.tsx)
const handleDecimalInputChangeForField = (
  inputValue: string,
  fieldOnChange: (value: string | number) => void
) => {
  let value = inputValue.replace(/[^0-9.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) { // Mais de um ponto decimal
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  if (parts.length === 2 && parts[1] && parts[1].length > 2) { // Mais de duas casas decimais
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
// END: Funções helper para máscara de input

export function EditModuloDialog({
  open,
  onOpenChange,
  moduloData,
  onSave,
}: EditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ModuloSchema>({
    resolver: zodResolver(moduloFormSchema), // Usando moduloFormSchema
    defaultValues: {
      fabricante: "",
      modelo: "",
      potenciaNominal: 0,
      tensaoCircAberto: "",
      correnteCurtCirc: "",
      tensaoMaxOper: 0,
      correnteMaxOper: 0,
      eficiencia: "",
      datasheet: "",
      seloInmetro: "",
      comprimento: 0,
      largura: 0,
      area: 0,
      peso: 0,
    },
  });

  const { watch, setValue, reset } = form; // Adicionado watch, setValue e reset

  // Atualizar o formulário quando moduloData mudar
  useEffect(() => {
    if (moduloData) {
      reset({
        fabricante: moduloData.fabricante,
        modelo: moduloData.modelo,
        potenciaNominal: moduloData.potenciaNominal,
        tensaoCircAberto: moduloData.tensaoCircAberto,
        correnteCurtCirc: moduloData.correnteCurtCirc,
        tensaoMaxOper: moduloData.tensaoMaxOper,
        correnteMaxOper: moduloData.correnteMaxOper,
        eficiencia: moduloData.eficiencia,
        datasheet: moduloData.datasheet,
        seloInmetro: moduloData.seloInmetro,
        comprimento: moduloData.comprimento,
        largura: moduloData.largura,
        area: moduloData.area,
        peso: moduloData.peso,
      });
    }
  }, [moduloData, reset]);

  // Efeito para calcular a área quando comprimento ou largura mudam
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'comprimento' || name === 'largura') {
        const comprimento = parseFloat(String(value.comprimento || 0));
        const largura = parseFloat(String(value.largura || 0));
        if (!isNaN(comprimento) && !isNaN(largura) && comprimento > 0 && largura > 0) {
          const areaCalculada = (comprimento * largura) / 1000000; // Convertendo mm² para m²
          setValue('area', parseFloat(areaCalculada.toFixed(2)));
        } else {
          setValue('area', 0);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const handleSubmit = async (data: ModuloSchema) => {
    setIsLoading(true);
    try {
      // Preservar o ID ao salvar
      const updatedData = {
        ...data,
        id: moduloData?.id || "",
        seloInmetro: data.seloInmetro || "",
        datasheet: data.datasheet || "",
      };
      
      // Realizar chamada à API para atualizar os dados
      const response = await fetch(`/api/equipamentos/modulo/${updatedData.id}`, {
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
      toast.success("Módulo atualizado com sucesso!");
      
      // Fechar o diálogo e redirecionar após um breve delay para mostrar o feedback
      setTimeout(() => {
        onOpenChange(false);
        // Redirecionar para a página de gerenciamento para recarregar a tabela
        window.location.href = "/dashboard/equipamentos/modulo";
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar Módulo:", error);
      toast.error("Não foi possível atualizar o Módulo. Tente novamente.");
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
              <DialogTitle>Editar Módulo</DialogTitle>
              <DialogDescription>
                Atualize as informações do Módulo selecionado.
              </DialogDescription>
            </DialogHeader>
            {/* FORMULÁRIO ATUALIZADO COM BASE NO form-modulo.tsx */}
            <div className="grid grid-cols-12 md:grid-cols-12 gap-4">
              {/* Section: Dados do Módulo */}
              <div className="col-span-12 gap-4 space-y-2">
                <h2 className="font-bold">- Dados do Módulo</h2>
                <Separator />
              </div>
              
              {/* Fabricante */}
              <div className="col-span-6 md:col-span-6 space-y-2 gap-4">
                <FormField
                  control={form.control}
                  name="fabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricante</FormLabel>
                      <FormControl>
                        <Input placeholder="Fabricante do Módulo" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Modelo */}
              <div className="col-span-6 md:col-span-6 space-y-2 gap-4">
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Modelo do Módulo" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Potência Nominal */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="potenciaNominal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potência Nominal (Wp)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="450.00" 
                          {...field} 
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value === 0 ? "" : String(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tensão Circ. Aberto (Voc) */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="tensaoCircAberto" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Circ. Aberto (Voc)</FormLabel>
                      <FormControl>
                        <Input placeholder="49.50" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Corrente Curto-Circ. (Isc) */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="correnteCurtCirc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrente Curto-Circ. (Isc)</FormLabel>
                      <FormControl>
                        <Input placeholder="11.60" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tensão Máx. Oper. (Vmp) */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="tensaoMaxOper"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Máx. Oper. (Vmp)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="41.50" 
                          {...field} 
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value === 0 ? "" : String(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Corrente Máx. Oper. (Imp) */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="correnteMaxOper"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrente Máx. Oper. (Imp)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="10.85" 
                          {...field} 
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value === 0 ? "" : String(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Eficiência */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="eficiencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eficiência (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="20.70" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Datasheet */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="datasheet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Datasheet (Link ou Nome)</FormLabel>
                      <FormControl>
                        <Input placeholder="Link para o datasheet" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Selo Inmetro */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="seloInmetro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selo Inmetro (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do selo" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section: Dimensões e Peso */}
              <div className="col-span-12 gap-4 space-y-2 pt-4">
                <h2 className="font-bold">- Dimensões e Peso</h2>
                <Separator />
              </div>

              {/* Comprimento */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="comprimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comprimento (mm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="2094.00" 
                          {...field} 
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value === 0 ? "" : String(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Largura */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="largura"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Largura (mm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="1038.00" 
                          {...field} 
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value === 0 ? "" : String(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Área */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área (m²)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="2.17" 
                          {...field} 
                          readOnly // Tornar o campo somente leitura
                          value={field.value === 0 ? "" : String(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Peso */}
              <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="peso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peso (kg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="23.50" 
                          {...field} 
                          onChange={(e) => handleDecimalInputChangeForField(e.target.value, field.onChange)}
                          onBlur={(e) => formatDecimalOnBlurForField(e.target.value, field.onChange)}
                          value={field.value === 0 ? "" : String(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div> {/* End of grid */}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}