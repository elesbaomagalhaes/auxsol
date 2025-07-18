"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormData } from "@/lib/schema/projetoSchema"
import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
// Removed UfService import - now using API route
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Check, ChevronsUpDown, User, UserRoundSearch, UserRoundMinus, CirclePlus, Circle, CircleCheck } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


interface TechinicStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
  resetTrigger?: boolean // Trigger para resetar estados internos
}

// Estados serão carregados dinamicamente da tabela uf

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

export default function TechinicStep({ formData, updateFormData, errors, resetTrigger }: TechinicStepProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [filteredTecnicos, setFilteredTecnicos] = useState(tecnicosData)
  const [estados, setEstados] = useState<string[]>([])
  const [accordionValue, setAccordionValue] = useState<string>("item-2")
  const [selectedTecnicoId, setSelectedTecnicoId] = useState<string>("")
  const [selectedTecnicoName, setSelectedTecnicoName] = useState<string>("")
  const nomeInputRef = useRef<HTMLInputElement>(null)
  
  // Reset estados internos quando resetTrigger for ativado
  useEffect(() => {
    if (resetTrigger) {
      setOpen(false);
      setSearchValue('');
      setFilteredTecnicos(tecnicosData);
      setEstados([]);
      setAccordionValue("item-2");
      setSelectedTecnicoId("");
      setSelectedTecnicoName("");
    }
  }, [resetTrigger]);
  
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

  // Buscar todos os estados ao carregar o componente
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch('/api/estados');
        if (!response.ok) {
          throw new Error('Falha ao buscar estados');
        }
        const estadosData = await response.json();
        setEstados(estadosData);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
        // Fallback para estados estáticos em caso de erro
        setEstados([
          "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
          "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
          "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        ]);
      }
    };

    fetchEstados();
  }, []);
  
  // Filtra técnicos com base no tipo de profissional selecionado
  useEffect(() => {
    console.log('Tipo profissional selecionado:', formData.tipoProfissional)
    console.log('Técnicos disponíveis:', tecnicosData)
    
    // Se nenhum tipo de profissional foi selecionado, não mostra técnicos
    if (!formData.tipoProfissional) {
      setFilteredTecnicos([])
      return
    }
    
    // Filtra os técnicos pelo tipo de responsável
    const filtered = tecnicosData.filter(tecnico => 
      tecnico.tipoResponsavel === formData.tipoProfissional
    )
    
    console.log('Técnicos filtrados:', filtered)
    setFilteredTecnicos(filtered)
  }, [formData.tipoProfissional])

  // Auto foco no input de nome quando accordion mudar para item-2
  useEffect(() => {
    if (accordionValue === "item-2" && nomeInputRef.current) {
      // Pequeno delay para garantir que o accordion esteja totalmente aberto
      setTimeout(() => {
        nomeInputRef.current?.focus();
      }, 300);
    }
  }, [accordionValue]);

  // Verificar se os campos obrigatórios estão preenchidos e válidos
  const isFormValid = () => {
    const requiredFields = [
      'tipoProfissional', 'nomeT', 'registro', 'rgCnhT', 'cpfT', 
      'foneT', 'emailT', 'cepT', 'logradouroT', 'numeroT', 'bairroT', 'cidadeT', 'ufT'
    ];
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    const allFieldsFilled = requiredFields.every(field => {
      const value = formData[field as keyof FormData];
      return value && value.toString().trim() !== '';
    });
    
    // Verificar se não há erros de validação
    const noValidationErrors = requiredFields.every(field => !errors[field]);
    
    return allFieldsFilled && noValidationErrors;
  };

  // Manter accordion aberto no item-2 quando campos estão validados e preenchidos
  useEffect(() => {
    if (isFormValid() && accordionValue !== "item-2") {
      setAccordionValue("item-2");
    }
  }, [formData, errors, accordionValue]);

  // Função para preencher todos os campos do formulário com os dados do técnico selecionado
  const preencherDadosTecnico = (tecnico: any) => {
    // Preenche todos os campos do formulário com os dados do técnico
    setSelectedTecnicoId(tecnico.id)
    setSelectedTecnicoName(tecnico.nomeT)
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
    // Alterar o accordion para o item-2 (formulário)
    setAccordionValue("item-2")
    toast.success('Dados do técnico carregados com sucesso!')
  }

  // Função para limpar o formulário
  const handleClearForm = () => {
    // Limpar o campo de seleção do técnico
    setSelectedTecnicoId("")
    setSelectedTecnicoName("")
    setSearchValue("")
    
    // Limpar todos os campos do formulário
    updateFormData('tipoProfissional', '')
    updateFormData('nomeT', '')
    updateFormData('registro', '')
    updateFormData('rgCnhT', '')
    updateFormData('cpfT', '')
    updateFormData('foneT', '')
    updateFormData('emailT', '')
    updateFormData('cepT', '')
    updateFormData('logradouroT', '')
    updateFormData('complementoT', '')
    updateFormData('numeroT', '')
    updateFormData('bairroT', '')
    updateFormData('cidadeT', '')
    updateFormData('ufT', '')
    
    // Voltar para o item-1 do accordion para nova busca
    setAccordionValue("item-1")
    
    toast.success('Formulário limpo')
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
  }, [formData.cepT]);
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 space-y-4 w-full max-w-full overflow-hidden">
      {/* Componente de seleção de técnico */}
      <div className="col-span-12 md:col-span-12 max-w-full overflow-hidden">
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-full"
          value={accordionValue}
          onValueChange={setAccordionValue}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Buscar técnico</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="grid grid-cols-12">
                <div className="col-span-12 md:col-span-8 md:col-start-2">
                  <div className="flex flex-col gap-2 pb-8 pt-4">
                    {/* Seleção do tipo de profissional */}
                    <div className="flex flex-col gap-1">
                      <Label className="text-sm font-medium mb-3 block">Responsável técnico</Label>
                      <RadioGroup
                        value={formData.tipoProfissional}
                        onValueChange={(value) => updateFormData("tipoProfissional", value)}
                        className="grid grid-cols-2 gap-2"
                      >
                        <div className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                          formData.tipoProfissional === 'tec' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-border bg-background'
                        }`} onClick={() => updateFormData("tipoProfissional", "tec")}>
                          <RadioGroupItem value="tec" id="tec" className="sr-only" />
                          <div className="flex items-center justify-between">
                            <Label htmlFor="tec" className="cursor-pointer font-medium">Técnico</Label>
                            {formData.tipoProfissional === 'tec' ? (
                              <CircleCheck className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                          formData.tipoProfissional === 'eng' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-border bg-background'
                        }`} onClick={() => updateFormData("tipoProfissional", "eng")}>
                          <RadioGroupItem value="eng" id="eng" className="sr-only" />
                          <div className="flex items-center justify-between">
                            <Label htmlFor="eng" className="cursor-pointer font-medium">Engenheiro</Label>
                            {formData.tipoProfissional === 'eng' ? (
                              <CircleCheck className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </RadioGroup>
                      {errors.tipoProfissional && <p className="text-sm text-destructive">{errors.tipoProfissional}</p>}
                    </div>
                    
                    {/* Busca de técnico - só mostra se um tipo foi selecionado */}
                    {formData.tipoProfissional && (
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className={cn(
                                "w-full justify-between hover:bg-accent hover:text-accent-foreground transition-colors"
                              )}
                            >
                              <div className="flex items-center">
                                <UserRoundSearch className="mr-2 h-4 w-4" />
                                <span>{selectedTecnicoName || "Clique para buscar um técnico..."}  </span>
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
                                  Pressione Enter para selecionar
                                </div>
                                <CommandGroup>
                                  {filteredTecnicos.length === 0 ? (
                                    <div className="px-2 py-3 text-sm text-muted-foreground">
                                      Nenhum {formData.tipoProfissional === 'tec' ? 'técnico' : 'engenheiro'} encontrado
                                    </div>
                                  ) : (
                                    filteredTecnicos
                                      .filter(tecnico => 
                                        tecnico.nomeT.toLowerCase().includes(searchValue.toLowerCase())
                                      )
                                      .map(tecnico => (
                                        <CommandItem
                                          key={tecnico.id}
                                          value={`${tecnico.nomeT} - ${tecnico.cpfT}`}
                                          onSelect={() => {
                                            console.log('onSelect triggered for:', tecnico.nomeT);
                                            preencherDadosTecnico(tecnico);
                                          }}
                                          onMouseDown={(e) => {
                                            console.log('onMouseDown triggered for:', tecnico.nomeT);
                                            e.stopPropagation();
                                            preencherDadosTecnico(tecnico);
                                          }}
                                          className="cursor-pointer flex items-center justify-between"
                                        >
                                          <div className="flex items-center pointer-events-none">
                                            <UserRoundSearch className="mr-2 h-4 w-4" />
                                            <span>{tecnico.nomeT} - {tecnico.cpfT}</span>
                                          </div>
                                          <Check
                                            className={cn(
                                              "ml-auto h-4 w-4 pointer-events-none",
                                              selectedTecnicoId === tecnico.id
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
                      <Button onClick={handleClearForm} type="button">
                        <UserRoundMinus /> Limpar
                      </Button>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <CirclePlus className="h-4 w-4" />
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full max-w-full overflow-hidden px-2">
                <div className="col-span-12 md:col-span-5">
                   <Label className="pb-1" htmlFor="nomeT">Nome completo</Label>
                  <div className="relative">
                    <Input
                      ref={nomeInputRef}
                      id="nomeT"
                      value={formData.nomeT}
                      onChange={(e) => {
                        updateFormData("nomeT", e.target.value);
                        setSearchValue(e.target.value);
                      }}
                      placeholder="Nome completo"
                      className={`input-focus ${errors.nomeT ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.nomeT && <p className="text-sm text-destructive">{errors.nomeT}</p>}
                </div>

                {/* Botão para limpar formulário alinhado com o nome */}
                <div className="col-span-12 md:col-span-2 flex items-end">
                  <Button onClick={handleClearForm} type="button" className="w-full">
                    <UserRoundMinus className="mr-2 h-4 w-4" /> Limpar
                  </Button>
                </div>

                <div className="col-span-6 md:col-span-3">
                   <Label className="pb-1" htmlFor="registro">Número de registro</Label>
                  <div className="relative">
                    <Input
                      id="registro"
                      value={formData.registro}
                      onChange={(e) => updateFormData("registro", e.target.value)}
                      placeholder="Ex: 0019828"
                      className={errors.registro ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.registro && <p className="text-sm text-destructive">{errors.registro}</p>}
                </div>

                <div className="col-span-6 md:col-span-2">
                   <Label className="pb-1" htmlFor="rgCnhT">RG / CNH</Label>
                  <div className="relative">
                    <Input
                      id="rgCnhT"
                      value={formData.rgCnhT}
                      onChange={(e) => updateFormData("rgCnhT", e.target.value)}
                      placeholder="Rg/Cnh"
                      className={errors.rgCnhT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.rgCnhT && <p className="text-sm text-destructive">{errors.rgCnhT}</p>}
                </div>

                <div className="col-span-6 md:col-span-3">
                   <Label className="pb-1" htmlFor="cpfT">CPF</Label>
                  <div className="relative">
                    <Input
                      id="cpfT"
                      value={formData.cpfT}
                      onChange={(e) => updateFormData("cpfT", e.target.value)}
                      placeholder="CPF"
                      className={errors.cpfT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.cpfT && <p className="text-sm text-destructive">{errors.cpfT}</p>}
                </div>

                <div className="col-span-6 md:col-span-3">
                   <Label className="pb-1" htmlFor="foneT">Fone</Label>
                  <div className="relative">
                    <Input
                      id="foneT"
                      type="tel"
                      value={formData.foneT}
                      onChange={(e) => updateFormData("foneT", e.target.value)}
                      placeholder=""
                      className={errors.foneT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.foneT && <p className="text-sm text-destructive">{errors.foneT}</p>}
                </div>

                <div className="col-span-6 md:col-span-4">
                   <Label className="pb-1" htmlFor="emailT">Email</Label>
                  <div className="relative">
                    <Input
                      id="emailT"
                      type="email"
                      value={formData.emailT}
                      onChange={(e) => updateFormData("emailT", e.target.value)}
                      placeholder="seu@email.com"
                      className={errors.emailT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.emailT && <p className="text-sm text-destructive">{errors.emailT}</p>}
                </div>

                <div className="col-span-12 md:col-span-2">
                   <Label className="pb-1" htmlFor="cepT">CEP</Label>
                  <div className="relative">
                    <Input
                      id="cepT"
                      type="text"
                      value={formData.cepT}
                      onChange={(e) => updateFormData("cepT", e.target.value)}
                      placeholder="60000-000"
                      className={errors.cepT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.cepT && <p className="text-sm text-destructive">{errors.cepT}</p>}
                </div>

                <div className="col-span-6 md:col-span-5">
                   <Label className="pb-1" htmlFor="logradouroT">Logradouro</Label>
                  <div className="relative">
                    <Input
                      id="logradouroT"
                      value={formData.logradouroT}
                      onChange={(e) => updateFormData("logradouroT", e.target.value)}
                      placeholder="Rua X"
                      className={errors.logradouroT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.logradouroT && <p className="text-sm text-destructive">{errors.logradouroT}</p>}
                </div>

                <div className="col-span-6 md:col-span-3">
                   <Label className="pb-1" htmlFor="complementoT">Complemento</Label>
                  <div className="relative">
                    <Input
                      id="complementoT"
                      value={formData.complementoT}
                      onChange={(e) => updateFormData("complementoT", e.target.value)}
                      placeholder=""
                      className={errors.complementoT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.complementoT && <p className="text-sm text-destructive">{errors.complementoT}</p>}
                </div>

                <div className="col-span-6 md:col-span-2">
                   <Label className="pb-1" htmlFor="numeroT">Número</Label>
                  <div className="relative">
                    <Input
                      id="numeroT"
                      type="text"
                      value={formData.numeroT}
                      onChange={(e) => updateFormData("numeroT", e.target.value)}
                      placeholder="100"
                      className={errors.numeroT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.numeroT && <p className="text-sm text-destructive">{errors.numeroT}</p>}
                </div>

                <div className="col-span-6 md:col-span-5">
                   <Label className="pb-1" htmlFor="bairroT">Bairro</Label>
                  <div className="relative">
                    <Input
                      id="bairroT"
                      value={formData.bairroT}
                      onChange={(e) => updateFormData("bairroT", e.target.value)}
                      placeholder=""
                      className={errors.bairroT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.bairroT && <p className="text-sm text-destructive">{errors.bairroT}</p>}
                </div>

                <div className="col-span-6 md:col-span-4">
                   <Label className="pb-1" htmlFor="cidadeT">Cidade</Label>
                  <div className="relative">
                    <Input
                      id="cidadeT"
                      value={formData.cidadeT}
                      onChange={(e) => updateFormData("cidadeT", e.target.value)}
                      placeholder=""
                      className={errors.cidadeT ? "border-destructive pr-10" : "pr-10"}
                    />
                  </div>
                  {errors.cidadeT && <p className="text-sm text-destructive">{errors.cidadeT}</p>}
                </div>

                <div className="col-span-2 md:col-span-2">
                   <Label className="pb-1" htmlFor="ufT">UF</Label>
                  <Select value={formData.ufT} onValueChange={(value) => updateFormData("ufT", value)}>
                    <SelectTrigger id="ufT" className={errors.ufT ? "border-destructive" : ""}>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>

  )
}
