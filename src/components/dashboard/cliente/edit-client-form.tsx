'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientFormSchema, type ClientFormData } from "@/lib/schema/project";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { z } from "zod";

interface EditClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialData?: ClientFormData; // Make initialData optional
}

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export function EditClientForm({ onSubmit, initialData }: EditClientFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData || {
      nome: "",
      rgCnh: "",
      rgCnhDataEmissao: "",
      cpf: "",
      fone: "",
      email: "",
      numProjeto: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: ""
    }
  });

  const { handleSubmit, setValue, control, watch } = form;
  const cepValue = watch("cep");

  useEffect(() => {
    const fetchCepData = async () => {
      if (!cepValue || cepValue.replace(/\D/g, '').length !== 8) return;
  
      try {
        const cep = cepValue.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setValue('rua',  data.logradouro || form.getValues('rua'));
          setValue('bairro', data.bairro || form.getValues('bairro'));
          setValue('cidade', data.localidade || form.getValues('cidade'));
          setValue('uf', data.uf, { shouldValidate: true });
        } else{
          toast.error('CEP inválido');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast.error("Erro ao buscar dados do CEP.");
      }
    };
  
    fetchCepData();
  }, [cepValue, setValue]);

  const handleFormSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    try {
      await clientFormSchema.parseAsync(data); // Validate using zod schema directly
      onSubmit(data);
      toast.success("Dados salvos com sucesso!");
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join(', ');
        toast.error(`Erro de validação: ${errorMessages}`);
      } else {
        toast.error('Não foi possível processar sua solicitação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4">
          <FormField
            control={control}
            name="numProjeto"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-3">
                <FormLabel>Cód Projeto</FormLabel>
                <FormControl>
                  <Input  placeholder="código" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="nome"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-4">
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input  className="uppercase" placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="rgCnh"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>RG/CNH</FormLabel>
                <FormControl>
                  <Input placeholder="Número do RG ou CNH" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="rgCnhDataEmissao"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Data de Emissão</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4">
          <FormField
            control={control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-3">
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="CPF ou CNPJ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="fone"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-4">
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-4">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={control}
            name="cep"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-2">
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="00000-000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="rua"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input  className="uppercase" {...field} placeholder="Mesmo da instalação e da geradora"  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="numero"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-3">
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="Número" {...field}  className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={control}
            name="complemento"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-2">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Complemento" {...field}  className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="bairro"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-4">
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Bairro" {...field}  className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="cidade"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-4">
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="uf"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-2">
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
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
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
