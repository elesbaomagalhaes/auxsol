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
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { protecaoCASchema, type ProtecaoCASchema } from "@/lib/schema/protecao-ca";
import  type { ProtecaoCA } from "../types";
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
  protecaoCAData: ProtecaoCA | null;
  onSave: (data: ProtecaoCA) => void;
};

export function EditProtecaoCADialog({
  open,
  onOpenChange,
  protecaoCAData,
  onSave,
}: EditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Inicializar o formulário com React Hook Form e validação Zod
  const form = useForm<ProtecaoCASchema>({
    resolver: zodResolver(protecaoCASchema),
    defaultValues: {
      modelo: "", // Added
      numeroPoloDisjuntor: 0,
      tensaoNomDisjuntor: "",
      correnteNomDisjuntor: "",
      frequenciaNomDisjuntor: "",
      elementoProtDisjuntor: "", 
      curvaDisjuntor: "",
      classeDps: "",
      tensaoNomDPS: "",
      correnteNomDPS: "",
      correnteMaxDPS: "",
      numeroPoloDPS: 0
    },
  });

  // Atualizar o formulário quando stringBoxData mudar
  useEffect(() => {
    if (protecaoCAData) {
      // Reset do formulário com os novos valores
      form.reset({
        modelo: protecaoCAData.modelo ?? "", // Added
        numeroPoloDisjuntor: protecaoCAData.numeroPoloDisjuntor,
        tensaoNomDisjuntor: protecaoCAData.tensaoNomDisjuntor,
        frequenciaNomDisjuntor: protecaoCAData.frequenciaNomDisjuntor,
        correnteNomDisjuntor: protecaoCAData.correnteNomDisjuntor,
        elementoProtDisjuntor: protecaoCAData.elementoProtDisjuntor, // Corrected typo
        curvaDisjuntor: protecaoCAData.curvaDisjuntor,
        classeDps: protecaoCAData.classeDps,
        tensaoNomDPS: protecaoCAData.tensaoNomDPS,
        correnteNomDPS: protecaoCAData.correnteNomDPS,
        correnteMaxDPS: protecaoCAData.correnteMaxDPS,
        numeroPoloDPS: protecaoCAData.numeroPoloDPS
      });
    }
  }, [protecaoCAData, form]);

  const handleSubmit = async (data: ProtecaoCASchema) => {
    setIsLoading(true);
    try {
      // Preservar o ID ao salvar
      const updatedData = {
        ...data,
        id: protecaoCAData?.id || "",
      };
      
      // Realizar chamada à API para atualizar os dados
      const response = await fetch(`/api/equipamentos/protecaoca/${updatedData.id}`, {
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
      toast.success("Protecao CA atualizada com sucesso!");
      
      // Fechar o diálogo e redirecionar após um breve delay para mostrar o feedback
      setTimeout(() => {
        onOpenChange(false);
        // Redirecionar para a página de gerenciamento para recarregar a tabela
        window.location.href = "/dashboard/equipamentos/protecao/ca";
      }, 1500);
    } catch (error) {
      console.error("Erro ao atualizar Proteçao CA:", error);
      toast.error("Não foi possível atualizar a Proteção CA. Tente novamente.");
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
              <DialogTitle>Editar Proteção CA</DialogTitle>
              <DialogDescription>
                Atualize as informações da Proteção CA selecionada.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
              <div className="col-span-12 md:col-span-6 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo ou potência do sistema (kWp)
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-1 w-3 h-3 text-muted-foreground cursor-pointer inline-block" />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Escolha a potência de saída do inversor para ilustrar<br />
                            a configuração dessa proteção CA</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-green-600 border-1"
                          placeholder="Ex. use a potência nom. de saída do inversor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-6 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="correnteNomDisjuntor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corrente Nom. do Disjuntor (A)</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a corrente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10A">10A</SelectItem>
                            <SelectItem value="16A">16A</SelectItem>
                            <SelectItem value="20A">20A</SelectItem>
                            <SelectItem value="25A">25A</SelectItem>
                            <SelectItem value="32A">32A</SelectItem>
                            <SelectItem value="40A">40A</SelectItem>
                            <SelectItem value="50A">50A</SelectItem>
                            <SelectItem value="63A">63A</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-3 gap-4 space-y-2">
                <FormField
                  control={form.control}
                  name="frequenciaNomDisjuntor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência (Hz)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 60Hz" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12 md:col-span-4 space-y-2 gap-4">
                <FormField
                  control={form.control}
                  name="tensaoNomDisjuntor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Nom. Disjutor (V)</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a tensão" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="127/230V">127/230V</SelectItem>
                            <SelectItem value="230/400V">230/400V</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-5 space-y-2">
                <FormField
                  control={form.control}
                  name="curvaDisjuntor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curva de At. Disjuntor</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a curva" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Curva B">Curva B</SelectItem>
                            <SelectItem value="Curva C">Curva C</SelectItem>
                            <SelectItem value="Curva D">Curva D</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-4 space-y-2">
                <FormField
                  control={form.control}
                  name="elementoProtDisjuntor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Elem. de Prot. do Disjutor</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a proteção" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="term">Térmico</SelectItem>
                            <SelectItem value="magn">Magnético</SelectItem>
                            <SelectItem value="tmg">Termomagnético</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-4 space-y-2">
                <FormField
                  control={form.control}
                  name="numeroPoloDisjuntor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Núm. de Polos do Disjuntor</FormLabel>
                      <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione por núm. de fase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1P - Monopolar</SelectItem>
                        <SelectItem value="2">2P - Bipolar</SelectItem>
                        <SelectItem value="3">3P - Tripolar</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>                      
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-12">
                <Separator className="my-4" />
              </div>

              <div className="col-span-12 md:col-span-3 space-y-2">
                <FormField
                  control={form.control}
                  name="classeDps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe DPS</FormLabel>
                      <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a classe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLASSE I">Classe I</SelectItem>
                        <SelectItem value="CLASSE II">Classe II</SelectItem>
                        <SelectItem value="CLASSE III">Classe III</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-3 space-y-2">
                <FormField
                  control={form.control}
                  name="tensaoNomDPS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tensão Nominal DPS (V)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 275V" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-3 space-y-2">
                <FormField
                  control={form.control}
                  name="correnteNomDPS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corr. Nom. de Desc (kA)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 20kA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-3 space-y-2">
                <FormField
                  control={form.control}
                  name="correnteMaxDPS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corr. Máx. de Desc (kA)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 40kA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-5 space-y-2">
                <FormField
                  control={form.control}
                  name="numeroPoloDPS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Núm. de Polos da Seccionadora</FormLabel>
                      <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione os polos por fase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">F+N - 2P</SelectItem>
                        <SelectItem value="3">F+F+N 3P</SelectItem>
                        <SelectItem value="4">F+F+F+N - 4P</SelectItem>
                      </SelectContent>
                    </Select>
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