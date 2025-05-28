"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "@/lib/schema/projeto"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Check, ChevronsUpDown, User } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


interface TechinicStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
}

const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

// Dados de exemplo para técnicos - em produção, isso seria buscado de uma API
const tecnicosData = [
  {
    "id": "cm9w10amn00000sp73iugs0gl",
    "tipoResponsavel": "tec",
    "nomeT": "João da Silva Andrade",
    "registro": "0019828",
    "rgCnhT": "123456789",
    "cpfT": "123.456.789-00",
    "foneT": "(98) 91234-5678",
    "emailT": "joao.andrade@tecexemplo.com",
    "cepT": "65620000",
    "logradouroT": "Rua das Energias Renováveis",
    "complementeoT": "Bloco B, Sala 12",
    "numeroT": "100",
    "bairroT": "Centro Solar",
    "cidadeT": "Coelho Neto",
    "ufT": "MA",
    "UserId": "user123",
  },
  {
    "id": "87654321098765432109876543210",
    "tipoResponsavel": "eng",
    "nomeT": "Maria Oliveira Santos",
    "registroT": "12345",
    "rgCnhT": "987654321",
    "cpfT": "987.654.321-00",
    "foneT": "(98) 98765-4321",
    "emailT": "maria.santos@engexemplo.com",
    "cepT": "65620-000",
    "logradouroT": "Avenida dos Engenheiros",
    "complementeoTec": "Sala 45",
    "numeroT": "200",
    "bairroT": "Bairro Técnico",
    "cidadeT": "São Luís",
    "ufT": "MA",
    "UserId": "user123",
  },
  {
    "id": "87654321098765432109876543213",
    "tipoResponsavel": "eng",
    "nomeT": "Biuena Oliveira Santos",
    "registroT": "12345",
    "rgCnhT": "987654321",
    "cpfT": "987.654.321-00",
    "foneT": "(98) 98765-4321",
    "emailT": "maria.santos@engexemplo.com",
    "cepT": "65000000",
    "logradouroT": "Avenida dos Engenheiros",
    "complementeoTec": "Sala 45",
    "numeroT": "200",
    "bairroT": "Bairro Técnico",
    "cidadeT": "São Luís",
    "ufT": "MA",
    "UserId": "user123",
  }
]

export default function TechinicStep({ formData, updateFormData, errors }: TechinicStepProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredTecnicos, setFilteredTecnicos] = useState(tecnicosData)
  
  // Inicializa os campos do técnico com valores vazios para evitar erro de componente não controlado para controlado
  useEffect(() => {
    if (formData.nomeT === undefined) updateFormData('nomeT', '')
    if (formData.registro === undefined) updateFormData('registro', '')
    if (formData.rgCnhT === undefined) updateFormData('rgCnhT', '')
    if (formData.cpfT === undefined) updateFormData('cpfT', '')
    if (formData.foneT === undefined) updateFormData('foneT', '')
    if (formData.emailT === undefined) updateFormData('emailT', '')
    if (formData.cepT === undefined) updateFormData('cepT', '')
    if (formData.logradouroT === undefined) updateFormData('logradouroT', '')
    if (formData.complementoT === undefined) updateFormData('complementoT', '')
    if (formData.numeroT === undefined) updateFormData('numeroT', '')
    if (formData.bairroT === undefined) updateFormData('bairroT', '')
    if (formData.cidadeT === undefined) updateFormData('cidadeT', '')
    if (formData.ufT === undefined) updateFormData('ufT', '')
  }, [])
  
  // Filtra técnicos com base no tipo de profissional selecionado e no ID do usuário
  useEffect(() => {
    // Em produção, aqui você faria uma chamada à API para buscar técnicos
    // com o mesmo tipo de responsável e mesmo UserId
    console.log('Tipo profissional selecionado:', formData.tipoProfissional)
    console.log('Técnicos disponíveis:', tecnicosData)
    
    // Se nenhum tipo de profissional foi selecionado, mostra todos os técnicos
    if (!formData.tipoProfissional) {
      setFilteredTecnicos(tecnicosData)
      return
    }
    
    // Filtra os técnicos pelo tipo de responsável
    const filtered = tecnicosData.filter(tecnico => 
      tecnico.tipoResponsavel === formData.tipoProfissional
    )
    
    console.log('Técnicos filtrados:', filtered)
    setFilteredTecnicos(filtered)
  }, [formData.tipoProfissional])

  // Função para preencher todos os campos do formulário com os dados do técnico selecionado
  const preencherDadosTecnico = (tecnico: any) => {
    // Preenche todos os campos do formulário com os dados do técnico
    updateFormData('nomeT', tecnico.nomeT || '')
    updateFormData('registro', tecnico.registro || tecnico.registroT || '')
    updateFormData('rgCnhT', tecnico.rgCnhT || '')
    updateFormData('cpfT', tecnico.cpfT || '')
    updateFormData('foneT', tecnico.foneT || '')
    updateFormData('emailT', tecnico.emailT || '')
    updateFormData('cepT', tecnico.cepT || '')
    updateFormData('logradouroT', tecnico.logradouroT || '')
    updateFormData('complementoT', tecnico.complementeoT || tecnico.complementeoT || '')
    updateFormData('numeroT', tecnico.numeroT || '')
    updateFormData('bairroT', tecnico.bairroT || '')
    updateFormData('cidadeT', tecnico.cidadeT || '')
    updateFormData('ufT', tecnico.ufT || '')
    
    setOpen(false)
    toast.success('Dados do técnico carregados com sucesso!')
  }

  /**
   * Observa mudanças no campo CEP e busca dados automaticamente
   * quando o campo é preenchido corretamente
   */
  useEffect(() => {
    // Função para buscar e preencher dados do CEP
    const fetchCepData = async () => {
      // Verifica se o CEP tem 8 dígitos numéricos
      if (!formData.cepT || formData.cepT.replace(/\D/g, '').length !== 8) return;
  
      try {
        // Remove caracteres não numéricos do CEP
        const cep = formData.cepT.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
            // Atualiza os campos de endereço com os dados retornados
            updateFormData('logradouroT', data.logradouro || formData.logradouroT);
            updateFormData('bairroT', data.bairro || formData.bairroT);
            updateFormData('cidadeT', data.localidade || formData.cidadeT);
            updateFormData('numeroT', data.unidade || formData.numeroT);
            updateFormData('ufT', data.uf || formData.ufT);

        } else {
          toast.error('CEP inexistente, corrija o CEP.');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast.error("Erro ao buscar dados do CEP.");
      }
    };
  
    fetchCepData();
  }, [formData.cepT, updateFormData, formData]);
    
  return (
    <div className="grid grid-cols-12 md:grid-cols-12 gap-4 space-y-6">
      <div className="col-span-12 md:col-span-12 grid grid-cols-12 gap-4 items-end">
        <div className="col-span-6 md:col-span-3">
          <Label className="py-2 pb-4">Responsável técnico</Label>
          <RadioGroup
            value={formData.tipoProfissional}
            onValueChange={(value) => updateFormData("tipoProfissional", value)}
            className={`flex space-x-4 ${errors.tipoProfissional ? "border-destructive" : ""}`}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tec" id="tec" />
              <Label htmlFor="tec" className="cursor-pointer">
                Técnico
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="eng" id="eng" />
              <Label htmlFor="eng" className="cursor-pointer">
                Engenheiro
              </Label>
            </div>
          </RadioGroup>
          {errors.tipoProfissional && <p className="text-sm text-destructive">{errors.tipoProfissional}</p>}
        </div>
        
        <div className="col-span-6 md:col-span-9">
          <div className="relative">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between hover:bg-accent hover:text-accent-foreground transition-colors",
                    errors.nomeT ? "border-destructive" : ""
                  )}
                >
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{formData.nomeT || "Clique para buscar e selecionar um técnico..."}</span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Buscar técnico..." 
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {formData.tipoProfissional 
                        ? "Nenhum técnico encontrado para este tipo de profissional." 
                        : "Selecione um tipo de profissional primeiro."}
                    </CommandEmpty>
                    <div className="px-2 py-1 text-xs text-muted-foreground border-b">
                      Use o Enter para selecionar
                    </div>
                    <CommandGroup>
                      
                      {filteredTecnicos.length === 0 ? (
                        <div className="px-2 py-3 text-sm text-muted-foreground">
                          Selecione um tipo de profissional primeiro
                        </div>
                      ) : (
                        filteredTecnicos
                          .filter(tecnico => 
                            tecnico.nomeT.toLowerCase().includes(searchValue.toLowerCase())
                          )
                          .map(tecnico => (
                            <CommandItem
                              key={tecnico.id}
                              value={tecnico.nomeT}
                              onSelect={() => preencherDadosTecnico(tecnico)}
                              
                              className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>{tecnico.nomeT}</span>
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  formData.nomeT === tecnico.nomeT
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="col-span-6 md:col-span-8">
        <Label className="py-2" htmlFor="nomeT">nomeT completo</Label>
        <div className="relative">
          <Input
            id="nomeT"
            value={formData.nomeT}
            onChange={(e) => {
              updateFormData("nomeT", e.target.value);
              setSearchValue(e.target.value);
            }}
            placeholder="nomeT completo"
            className={cn(errors.nomeT ? "border-destructive pr-4" : "pr-4")}
          />
        </div>
        {errors.nomeT && <p className="text-sm text-destructive">{errors.nomeT}</p>}
      </div>

      <div className="col-span-6 md:col-span-4">
        <Label className="py-2" htmlFor="registro">Número de registro</Label>
        <div className="relative">
          <Input
            id="registro"
            value={formData.registro}
            onChange={(e) => updateFormData("registro", e.target.value)}
            placeholder="Ex: 0019828"
            className={errors.registro ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.registro && <p className="text-sm text-destructive">{errors.registro}</p>}
      </div>

      <div className="col-span-6 md:col-span-4">
        <Label className="py-2" htmlFor="rgCnhT">RG / CNH</Label>
        <div className="relative">
          <Input
            id="rgCnhT"
            value={formData.rgCnhT}
            onChange={(e) => updateFormData("rgCnhT", e.target.value)}
            placeholder="Rg/Cnh"
            className={errors.rgCnhT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.rgCnhT && <p className="text-sm text-destructive">{errors.rgCnhT}</p>}
      </div>

      <div className="col-span-6 md:col-span-4">
        <Label className="py-2" htmlFor="cpfT">CPF</Label>
        <div className="relative">
          <Input
            id="cpfT"
            value={formData.cpfT}
            onChange={(e) => updateFormData("cpfT", e.target.value)}
            placeholder="cpfT"
            className={errors.cpfT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.cpfT && <p className="text-sm text-destructive">{errors.cpfT}</p>}
      </div>

      <div className="col-span-6 md:col-span-4">
        <Label className="py-2" htmlFor="foneT">Celular</Label>
        <div className="relative">
          <Input
            id="foneT"
            type="tel"
            value={formData.foneT}
            onChange={(e) => updateFormData("foneT", e.target.value)}
            placeholder=""
            className={errors.foneT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.foneT && <p className="text-sm text-destructive">{errors.foneT}</p>}
      </div>

      <div className="col-span-6 md:col-span-6">
        <Label className="py-2" htmlFor="emailT">Email</Label>
        <div className="relative">
          <Input
            id="emailT"
            type="emailT"
            value={formData.emailT}
            onChange={(e) => updateFormData("emailT", e.target.value)}
            placeholder="seu@emailT.com"
            className={errors.emailT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.emailT && <p className="text-sm text-destructive">{errors.emailT}</p>}
      </div>

      <div className="col-span-12 md:col-span-3">
        <Label className="py-2" htmlFor="cepT">CEP</Label>
        <div className="relative">
          <Input
            id="cepT"
            type="text"
            value={formData.cepT}
            onChange={(e) => updateFormData("cepT", e.target.value)}
            placeholder="60000-000"
            className={errors.cepT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.cepT && <p className="text-sm text-destructive">{errors.cepT}</p>}
      </div>

      <div className="col-span-6 md:col-span-9">
        <Label className="py-2" htmlFor="logradouroT">logradouroT</Label>
        <div className="relative">
          <Input
            id="logradouroT"
            value={formData.logradouroT}
            onChange={(e) => updateFormData("logradouroT", e.target.value)}
            placeholder="logradouroT X"
            className={errors.logradouroT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.logradouroT && <p className="text-sm text-destructive">{errors.logradouroT}</p>}
      </div>

      <div className="col-span-6 md:col-span-3">
        <Label className="py-2" htmlFor="complementoT">Complemento </Label>
        <div className="relative">
          <Input
            id="complementoT"
            value={formData.complementoT}
            onChange={(e) => updateFormData("complementoT", e.target.value)}
            placeholder=""
            className={errors.complementoT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.complementoT && <p className="text-sm text-destructive">{errors.complementoT}</p>}
      </div>

      <div className="col-span-6 md:col-span-2">
        <Label className="py-2" htmlFor="numeroT">Número</Label>
        <div className="relative">
          <Input
            id="numeroT"
            type="text"
            value={formData.numeroT}
            onChange={(e) => updateFormData("numeroT", e.target.value)}
            placeholder="100"
            className={errors.numeroT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.numeroT && <p className="text-sm text-destructive">{errors.numeroT}</p>}
      </div>

      <div className="col-span-6 md:col-span-7">
        <Label className="py-2" htmlFor="bairroT">Bairro</Label>
        <div className="relative">
          <Input
            id="bairroT"
            value={formData.bairroT}
            onChange={(e) => updateFormData("bairroT", e.target.value)}
            placeholder=""
            className={errors.bairroT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.bairroT && <p className="text-sm text-destructive">{errors.bairroT}</p>}
      </div>

      <div className="col-span-6 md:col-span-7">
        <Label className="py-2" htmlFor="cidadeT">Cidade</Label>
        <div className="relative">
          <Input
            id="cidadeT"
            value={formData.cidadeT}
            onChange={(e) => updateFormData("cidadeT", e.target.value)}
            placeholder=""
            className={errors.cidadeT ? "border-destructive pr-4" : "pr-4"}
          />
        </div>
        {errors.cidadeT && <p className="text-sm text-destructive">{errors.cidadeT}</p>}
      </div>

      <div className="col-span-2 md:col-span-3">
      <Label className="py-2" htmlFor="ufT">UF</Label>
        <Select value={formData.ufT} onValueChange={(value) => updateFormData("ufT", value)}>
          <SelectTrigger id="`ufT`" className={errors.ufT ? "border-destructive" : ""}>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {estados.map((estado) => (
              <SelectItem key={estado} value={estado}>{estado}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.ufT && <p className="text-sm text-destructive">{errors.ufT}</p>}
      </div>
      </div>

  )
}
