"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { tecnicoSchema } from "@/lib/schema/tecnicoSchema"
import { toast } from "sonner"
import { showTecnicoSuccessToast } from "@/components/ui/success-toast"
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
import { Separator } from "@/components/ui/separator"
import { z } from "zod"

type FormData = z.infer<typeof tecnicoSchema>;

export const FormTecnico = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState("inver")

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

  const form = useForm<FormData>({
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
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/tecnico", {
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
      showTecnicoSuccessToast(data.nome)

      setTimeout(() => {
        window.location.href = "/dashboard/tecnico"
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
        <div className="grid grid-cols-12 md:grid-cols-12 gap-4">
    
        <div className="col-span-6 md:col-span-6 gap-4 ">
              <FormField
                control={form.control}
                name="tipoProfissional"
                render={({ field }) => (
                  <FormItem className="">
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
                  <Input 
                    placeholder="Número do RG ou CNH" 
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
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="000.000.000-00" 
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
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
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
        <div className="col-span-6 md:col-span-6 gap-4 space-y-2">
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
          <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
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

        <div className="col-span-6 md:col-span-3 gap-4 space-y-2">
          <FormField
            control={form.control}
            name="uf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UF</FormLabel>
                <FormControl>
                  <Input placeholder="SP" maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

          <div className="col-span-12 md:col-span-12 gap-4 space-y-2">
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