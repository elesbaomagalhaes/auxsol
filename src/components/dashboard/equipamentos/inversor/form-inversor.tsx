"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { inversorSchema } from "@/lib/schema/inversorSchema"
import { toast } from "sonner"
import { showEquipamentoSuccessToast } from "@/components/ui/success-toast"
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

type FormData = z.infer<typeof inversorSchema>;

export const FormInversor = () => {
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
      potenciaMaxSai: 0,
      potenciaNomSai: 0,
      correnteNomSai: "",
      correnteMaxSai: "",
      tensaoNomSai: "",
      THD: "",
      tipoInv: "",
      frequenciaNom: "",
      fatorPotencia: 0,
      tensaoMaxsSai: "",
      tensaoMinSai: "",
      eficiencia: 0,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/equipamentos/inversor", {
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
      showEquipamentoSuccessToast("Inversor", `${data.fabricante} ${data.modelo}`)

      setTimeout(() => {
        window.location.href = "/dashboard/equipamentos/inversor"
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
                name="tipoInv"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <div className="flex gap-4">
                        <label
                          className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            field.value === "inv"
                              ? "border-stone-700 bg-white"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <input
                            type="radio"
                            {...field}
                            value="inv"
                            name="tipoInv"
                            checked={field.value === "inv"}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setSelectedMethod(e.target.value); // Sincroniza o estado visual
                            }}
                            className="sr-only"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">Inversor</span>
                          </div>
                        </label>

                        <label
                          className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            field.value === "mic"
                              ? "border-stone-700 bg-white"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <input
                            type="radio"
                            {...field}
                            value="mic"
                            name="tipoInv"
                            checked={field.value === "mic"}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setSelectedMethod(e.target.value); // Sincroniza o estado visual
                            }}
                            className="sr-only"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">Microinversor</span>
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
                    placeholder="3.00" 
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
                  <Input  step="0.01" placeholder="0.00" {...field} />
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
                  <Input  step="0.01" placeholder="0.00" {...field} />
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
                  <Input  step="0.01" placeholder="0.00" {...field} />
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
            name="potenciaMaxMPPT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pot. Máx. MPPT (W)</FormLabel>
                <FormControl>
                  <Input  placeholder="0.00" {...field} />
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
                  <Input  placeholder="0.00" {...field} />
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
                  <Input  placeholder="0.00" {...field} />
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
                  <Input  placeholder="0.00" {...field} />
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
                  <Input  placeholder="0.00" {...field} />
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
                  <Input  placeholder="0.00" {...field} />
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
                  <Input  placeholder="0.00" {...field} />
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