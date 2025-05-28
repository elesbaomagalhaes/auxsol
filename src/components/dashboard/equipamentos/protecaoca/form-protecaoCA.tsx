"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { protecaoCASchema } from "@/lib/schema/protecao-ca"
import { toast } from "sonner"
import { useState } from "react"
import { ChevronDown, ChevronUp, Info, Loader2 } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type FormData = z.infer<typeof protecaoCASchema>;

export const FormProtecaoCA = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  
  const form = useForm<FormData>({
      resolver: zodResolver(protecaoCASchema),
    defaultValues: {
      numeroPoloDisjuntor: 0,
      tensaoNomDisjuntor: "",
      correnteNomDisjuntor: "",
      frequenciaNomDisjuntor: "",
      elementoProtDisjuntor: "",
      curvaDisjuntor: "",
      classeDps: "",
      correnteNomDPS: "",
      correnteMaxDPS: "",
      tensaoNomDPS: "",
      numeroPoloDPS: 0,
      modelo: ""
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/equipamentos/protecaoca", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log(response)

      if (!response.ok) {
        throw new Error("Erro ao salvar dados")
      }

      // Mostrar mensagem de sucesso e redirecionar
      toast.success("Dados salvos com sucesso!")

      setTimeout(() => {
        window.location.href = "/dashboard/equipamentos/protecao/ca"
      }, 2000) // Redireciona após 2 segundos

    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      toast.error("Não foi possível processar sua solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-6 md:col-span-6 gap-4 space-y-2">
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo ou potência do sistema (kWp)
                  <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
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
          <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
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
          <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
            <FormField
              control={form.control}
              name="frequenciaNomDisjuntor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência (Hz)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex. 60Hz"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6 md:col-span-3 space-y-2 gap-4">
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
          <div className="col-span-6 md:col-span-3 space-y-2">
            <FormField
              control={form.control}
              name="curvaDisjuntor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Curva de Atuação Disjuntor</FormLabel>
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
          <div className="col-span-6 md:col-span-4 space-y-2 gap-4">
            <FormField
              control={form.control}
              name="elementoProtDisjuntor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elemento de Prot. do Disjutor</FormLabel>
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
          <div className="col-span-6 md:col-span-3 space-y-2">
            <FormField
              control={form.control}
              name="numeroPoloDisjuntor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Núm. de polos disjuntor</FormLabel>
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
          <div className="col-span-12 gap-4 space-y-2">
            <ChevronUp />
            <h2>Disjutor</h2>
            <Separator />
            <h2>DPS</h2>
            <ChevronDown />
          </div>
          <div className="col-span-6 md:col-span-3 space-y-2">
            <FormField
              control={form.control}
              name="classeDps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe do DPS</FormLabel>
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
          <div className="col-span-6 md:col-span-4 gap-4 space-y-2">
            <FormField
              control={form.control}
              name="correnteNomDPS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corrente Nom. de descarga (In)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 20kA"
                      {...field}
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
              name="correnteMaxDPS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corr. Máx. de descarga (In)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 45kA"
                      {...field}
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
              name="tensaoNomDPS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tensão. Máx. de operação(Uc)</FormLabel>
                  <FormControl>
                    <Input
                    type="string"
                      placeholder="Ex: 275Vca"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 md:col-span-4 space-y-2">
            <FormField
              control={form.control}
              name="numeroPoloDPS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Núm. de polos DPS
      <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent side="top">
       <p>F = FASE, N = NEUTRO<br />
       O número de polos é a soma do número de fases mais neutro!</p>
      </TooltipContent>
    </Tooltip>
    </FormLabel>
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

          <div className="col-span-12">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}