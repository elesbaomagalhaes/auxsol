"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/lib/schema/projeto"
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select"
import { toast } from "sonner"
import { useEffect } from "react"

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

interface ClienteStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
}

export default function ClienteSetupStep({ formData, updateFormData, errors }: ClienteStepProps) {

    /**
     * Observa mudanças no campo CEP e busca dados automaticamente
     * quando o campo é preenchido corretamente
     */
    useEffect(() => {
      // Função para buscar e preencher dados do CEP
      const fetchCepData = async () => {
        // Verifica se o CEP tem 8 dígitos numéricos
        if (!formData.cep || formData.cep.replace(/\D/g, '').length !== 8) return;
    
        try {
          // Remove caracteres não numéricos do CEP
          const cep = formData.cep.replace(/\D/g, '');
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
  
          if (!data.erro) {
            // Atualiza os campos de endereço com os dados retornados
            updateFormData('rua', data.logradouro || formData.rua);
            updateFormData('bairro', data.bairro || formData.bairro);
            updateFormData('cidade', data.localidade || formData.cidade);
            updateFormData('numero', data.unidade || formData.numero);
            updateFormData('uf', data.uf);
          } else {
            toast.error('CEP inválido');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
          toast.error("Erro ao buscar dados do CEP.");
        }
      };
    
      fetchCepData();
    }, [formData.cep, updateFormData, formData]);

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 space-y-4 w-scren">
      <div className="col-span-12 md:col-span-2">
        <Label className="py-2" htmlFor="numProjetoC">PROJETO</Label>
        <Input
          id="numProjetoC"
          value={formData.numProjetoC}
          onChange={(e) => updateFormData("numProjetoC", e.target.value)}
          placeholder="núm. projeto"
          className={errors.numProjetoC ? "border-destructive" : ""}
        />
        {errors.numProjetoC && <p className="text-sm text-destructive">{errors.numProjetoC}</p>}
      </div>

      <div className="col-span-12 md:col-span-5">
        <Label className="py-2" htmlFor="nome">NOME COMPLETO</Label>
        <div className="relative">
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => updateFormData("nome", e.target.value)}
            placeholder="Nome completo"
            className={errors.nome ? "border-destructive pr-10" : "pr-10"}
          />

        </div>
        {errors.nome && <p className="text-sm text-destructive">{errors.nome}</p>}
      </div>

      <div className="col-span-6 md:col-span-3">
        <Label className="py-2" htmlFor="rgCnh">RG / CNH</Label>
        <div className="relative">
          <Input
            id="rgCnh"
            value={formData.rgCnh}
            onChange={(e) => updateFormData("rgCnh", e.target.value)}
            placeholder="Rg/Cnh"
            className={errors.rgCnh ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.rgCnh && <p className="text-sm text-destructive">{errors.rgCnh}</p>}
      </div>

      <div className="col-span-6 md:col-span-2">
        <Label className="py-2" htmlFor="rgCnhDataEmissao">D. Emissão</Label>
        <div className="relative">
          <Input
            id="rgCnhDataEmissao"
            type="date"
            value={formData.rgCnhDataEmissao}
            onChange={(e) => updateFormData("rgCnhDataEmissao", e.target.value)}
            placeholder="01/01/2025"
            className={errors.rgCnhDataEmissao ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.rgCnhDataEmissao && <p className="text-sm text-destructive">{errors.rgCnhDataEmissao}</p>}
      </div>
      <div className="col-span-6 md:col-span-2">
        <Label className="py-2" htmlFor="cpf">CPF </Label>
        <div className="relative">
          <Input
            id="cpf"
            value={formData.cpf}
            onChange={(e) => updateFormData("cpf", e.target.value)}
            placeholder="CPF"
            className={errors.cpf ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
      </div>

      <div className="col-span-6 md:col-span-2">
        <Label className="py-2" htmlFor="fone">Fone </Label>
        <div className="relative">
          <Input
            id="fone"
            type="tel"
            value={formData.fone}
            onChange={(e) => updateFormData("fone", e.target.value)}
            placeholder=""
            className={errors.fone ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.fone && <p className="text-sm text-destructive">{errors.fone}</p>}
      </div>

      <div className="col-span-6 md:col-span-4">
        <Label className="py-2" htmlFor="email">Email </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="seu@email.com"
            className={errors.email ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="col-span-12 md:col-span-2">
        <Label className="py-2" htmlFor="cep">CEP</Label>
        <div className="relative">
          <Input
            id="cep"
            type="text"
            value={formData.cep}
            onChange={(e) => updateFormData("cep", e.target.value)}
            placeholder="60000-000"
            className={errors.cep ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.cep && <p className="text-sm text-destructive">{errors.cep}</p>}
      </div>

      <div className="col-span-6 md:col-span-5">
        <Label className="py-2" htmlFor="rua">Logradouro</Label>
        <div className="relative">
          <Input
            id="rua"
            value={formData.rua}
            onChange={(e) => updateFormData("rua", e.target.value)}
            placeholder="Rua X"
            className={errors.rua ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.rua && <p className="text-sm text-destructive">{errors.rua}</p>}
      </div>

      <div className="col-span-6 md:col-span-3">
        <Label className="py-2" htmlFor="complemento">Complemento </Label>
        <div className="relative">
          <Input
            id="complemento"
            value={formData.complemento}
            onChange={(e) => updateFormData("complemento", e.target.value)}
            placeholder=""
            className={errors.complemento ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.complemento && <p className="text-sm text-destructive">{errors.complemento}</p>}
      </div>

      <div className="col-span-6 md:col-span-3">
        <Label className="py-2" htmlFor="numero">Número</Label>
        <div className="relative">
          <Input
            id="numero"
            type="text"
            value={formData.numero}
            onChange={(e) => updateFormData("numero", e.target.value)}
            placeholder="100"
            className={errors.numero ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.numero && <p className="text-sm text-destructive">{errors.numero}</p>}
      </div>

      <div className="col-span-6 md:col-span-5">
        <Label className="py-2" htmlFor="bairro">Bairro</Label>
        <div className="relative">
          <Input
            id="bairro"
            value={formData.bairro}
            onChange={(e) => updateFormData("bairro", e.target.value)}
            placeholder=""
            className={errors.bairro ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.bairro && <p className="text-sm text-destructive">{errors.bairro}</p>}
      </div>

      <div className="col-span-6 md:col-span-4">
        <Label className="py-2" htmlFor="cidade">Cidade</Label>
        <div className="relative">
          <Input
            id="cidade"
            value={formData.cidade}
            onChange={(e) => updateFormData("cidade", e.target.value)}
            placeholder=""
            className={errors.cidade ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.cidade && <p className="text-sm text-destructive">{errors.cidade}</p>}
      </div>

      <div className="col-span-2 md:col-span-2">
      <Label className="py-2" htmlFor="uf">UF</Label>
        <Select value={formData.uf} onValueChange={(value) => updateFormData("uf", value)}>
          <SelectTrigger id="uf" className={errors.uf ? "border-destructive" : ""}>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {estados.map((estado) => (
              <SelectItem key={estado} value={estado}>{estado}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.uf && <p className="text-sm text-destructive">{errors.uf}</p>}
      </div>
      
    </div>
  )
}
