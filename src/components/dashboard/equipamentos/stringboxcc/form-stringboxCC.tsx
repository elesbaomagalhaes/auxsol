"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { stringBoxCCSchema } from "@/lib/schema/stringbox-cc"
import { type StringBoxCCSchema } from "@/lib/schema/stringbox-cc"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export const FormStringboxCC = () => {
  const [isLoading, setIsLoading] = useState(false);
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
  })

  const onSubmit = async (data: StringBoxCCSchema) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/equipamentos/protecaocc", {
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
        window.location.href = "/dashboard/equipamentos/protecao/cc"
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
          <div className="col-span-6 gap-4 space-y-2">
            <FormField
              control={form.control}
              name="fabricante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fabricante</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do fabricante"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 gap-4 space-y-2">
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Modelo do equipamento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6 md:col-span-4 space-y-2 gap-4">
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
          </div>
          <div className="col-span-6 md:col-span-4 space-y-2">
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

          <div className="col-span-6 md:col-span-4 gap-4 space-y-2">
            <FormField
              control={form.control}
              name="tensaoMaxOperacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tensão Máx. Operação</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 1000V"
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
              name="correnteMaxOperacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corrente Máx. Operação</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 15A"
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
              name="classeDps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe DPS</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Classe II"
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
              name="nivelProtecao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Proteção</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 1,5kV"
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
              name="correnteNominalDescarga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corrente Nominal de Descarga</FormLabel>
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
              name="correnteMaxDescarga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corrente Máx. de Descarga</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 40kA"
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
              name="numeroPoloSeccionadora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Núm. de Polos da Seccionadora</FormLabel>
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
          </div>
          <div className="col-span-6 md:col-span-4 gap-4 space-y-2">
            <FormField
              control={form.control}
              name="grauProtecao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grau de Proteção</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: IP65"
                      {...field}
                    />
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