"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/lib/schema/projetoSchema"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Search, X, Table, GalleryThumbnails, HousePlug, House, Check, ChevronsUpDown, Circle, CircleCheck, PackagePlus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface PersonalInfoStepProps {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  errors: Record<string, string>
  projetoId?: string
  resetTrigger?: boolean // Trigger para resetar estados internos
}

interface EquipamentoKit {
  id: string
  tipo: 'modulo' | 'inversor' | 'protecaoCA' | 'protecaoCC'
  itemId: string
  nome: string
  modelo: string
  quantidade: number
  potencia?: number
  fabricante: string
  mppt?: number
  stringSelecionada?: string
}

export default function PersonalInfoStep({ formData, updateFormData, errors, projetoId, resetTrigger }: PersonalInfoStepProps) {
  const [equipamentosAdicionados, setEquipamentosAdicionados] = useState<EquipamentoKit[]>([])
  const [tipoEquipamentoSelecionado, setTipoEquipamentoSelecionado] = useState<string>('')
  const [itemBusca, setItemBusca] = useState<string>('')
  const [quantidadeItem, setQuantidadeItem] = useState<number>(1)
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([])
  const [stringSelecionada, setStringSelecionada] = useState<string>('')
  const [openCombobox, setOpenCombobox] = useState(false)
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<any>(null)
  const [carregandoEquipamentos, setCarregandoEquipamentos] = useState(false)
  const [kitsCarregados, setKitsCarregados] = useState(false)

  // Reset estados internos quando resetTrigger for ativado
  useEffect(() => {
    if (resetTrigger) {
      setEquipamentosAdicionados([]);
      setTipoEquipamentoSelecionado('');
      setItemBusca('');
      setQuantidadeItem(1);
      setResultadosBusca([]);
      setStringSelecionada('');
      setOpenCombobox(false);
      setEquipamentoSelecionado(null);
      setCarregandoEquipamentos(false);
      setKitsCarregados(false);
    }
  }, [resetTrigger]);

  // Sincroniza equipamentos adicionados com formData
  useEffect(() => {
    updateFormData('equipamentosKit', equipamentosAdicionados)
  }, [equipamentosAdicionados])

  // Remover carregamento de kits existentes - não há propriedade 'kits' no FormData

  // Função para buscar equipamentos da API
  const buscarEquipamentos = async (tipo: string) => {
    if (!tipo) return []
    
    setCarregandoEquipamentos(true)
    try {
      // Construir URL com parâmetros
      let url = `/api/equipamentos?tipo=${tipo}`
      
      // Se há um cliente selecionado (CPF), incluir na busca para filtrar equipamentos do cliente
      if (formData.cpf) {
        url += `&clienteId=${formData.cpf}`
      }
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Erro ao buscar equipamentos')
      }
      const equipamentos = await response.json()
      return equipamentos
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error)
      toast.error('Erro ao carregar equipamentos')
      return []
    } finally {
      setCarregandoEquipamentos(false)
    }
  }

  // Effect para buscar equipamentos quando o tipo é selecionado
  useEffect(() => {
    if (tipoEquipamentoSelecionado) {
      buscarEquipamentos(tipoEquipamentoSelecionado).then(setResultadosBusca)
      setEquipamentoSelecionado(null)
      setItemBusca('')
    } else {
      setResultadosBusca([])
    }
  }, [tipoEquipamentoSelecionado])

  // Função para calcular total de MPPTs dos inversores
  const calcularTotalMPPTs = () => {
    return equipamentosAdicionados
      .filter(eq => eq.tipo === 'inversor')
      .reduce((total, inversor) => {
        return total + (inversor.mppt || 0) * inversor.quantidade
      }, 0)
  }

  // Função para obter strings já selecionadas
  const obterStringsSelecionadas = () => {
    return equipamentosAdicionados
      .filter(eq => eq.tipo === 'modulo' && eq.stringSelecionada)
      .map(eq => parseInt(eq.stringSelecionada!))
      .filter(str => !isNaN(str))
  }

  // Função para obter strings disponíveis
  const obterStringsDisponiveis = () => {
    const totalMPPTs = calcularTotalMPPTs()
    const stringsSelecionadas = obterStringsSelecionadas()
    const todasStrings = Array.from({ length: totalMPPTs }, (_, i) => i + 1)
    return todasStrings.filter(str => !stringsSelecionadas.includes(str))
  }

  // Função para calcular potência total dos inversores
  const calcularPotenciaInversores = () => {
    return equipamentosAdicionados
      .filter(eq => eq.tipo === 'inversor')
      .reduce((total, inversor) => {
        return total + (inversor.potencia || 0) * inversor.quantidade
      }, 0)
  }

  // Função para calcular potência total dos módulos
  const calcularPotenciaModulos = () => {
    return equipamentosAdicionados
      .filter(eq => eq.tipo === 'modulo')
      .reduce((total, modulo) => {
        return total + (modulo.potencia || 0) * modulo.quantidade
      }, 0)
  }

  // Função para organizar equipamentos: inversores seguidos de seus módulos em ordem crescente
  const organizarEquipamentos = () => {
    const inversores = equipamentosAdicionados.filter(eq => eq.tipo === 'inversor')
    const modulos = equipamentosAdicionados.filter(eq => eq.tipo === 'modulo')
    const outrosEquipamentos = equipamentosAdicionados.filter(eq => eq.tipo !== 'inversor' && eq.tipo !== 'modulo')
    
    const equipamentosOrganizados: EquipamentoKit[] = []
    
    // Para cada inversor, adiciona ele e seus módulos correspondentes em ordem crescente
    inversores.forEach(inversor => {
      equipamentosOrganizados.push(inversor)
      
      // Calcula quantas strings este inversor específico possui
      const mpptsPorInversor = (inversor.mppt || 0) * inversor.quantidade
      
      // Encontra módulos que pertencem a este inversor baseado nas strings
      const modulosDoInversor = modulos.filter(modulo => {
        if (!modulo.stringSelecionada) return false
        
        // Extrai o número da string (ex: "String 1" -> 1)
        const numeroString = parseInt(modulo.stringSelecionada.replace('String ', ''))
        
        // Calcula o range de strings para este inversor
        const inversoresAnteriores = inversores.slice(0, inversores.indexOf(inversor))
        const stringInicial = inversoresAnteriores.reduce((total, inv) => total + (inv.mppt || 0) * inv.quantidade, 0) + 1
        const stringFinal = stringInicial + mpptsPorInversor - 1
        
        return numeroString >= stringInicial && numeroString <= stringFinal
      })
      
      // Ordena os módulos deste inversor por número da string (ordem crescente)
      const modulosOrdenados = modulosDoInversor.sort((a, b) => {
        const numeroStringA = parseInt(a.stringSelecionada!.replace('String ', ''))
        const numeroStringB = parseInt(b.stringSelecionada!.replace('String ', ''))
        return numeroStringA - numeroStringB
      })
      
      // Adiciona os módulos deste inversor em ordem crescente
      equipamentosOrganizados.push(...modulosOrdenados)
    })
    
    // Adiciona módulos sem string selecionada no final
    const modulosSemString = modulos.filter(modulo => !modulo.stringSelecionada)
    equipamentosOrganizados.push(...modulosSemString)
    
    // Adiciona outros equipamentos no final
    equipamentosOrganizados.push(...outrosEquipamentos)
    
    return equipamentosOrganizados
  }

  // Funções para o novo fluxo de equipamentos

  const adicionarEquipamento = () => {
    if (!equipamentoSelecionado) return
    
    const novoEquipamento: EquipamentoKit = {
      id: `${equipamentoSelecionado.id}-${Date.now()}`,
      tipo: tipoEquipamentoSelecionado as 'modulo' | 'inversor' | 'protecaoCA' | 'protecaoCC',
      itemId: equipamentoSelecionado.id,
      nome: equipamentoSelecionado.nome,
      modelo: equipamentoSelecionado.modelo,
      fabricante: equipamentoSelecionado.fabricante,
      quantidade: quantidadeItem,
      potencia: equipamentoSelecionado.potencia ? Number(equipamentoSelecionado.potencia) : undefined,
      mppt: equipamentoSelecionado.mppt ? Number(equipamentoSelecionado.mppt) : undefined,
      stringSelecionada: tipoEquipamentoSelecionado === 'modulo' ? stringSelecionada : undefined
    }
    
    setEquipamentosAdicionados(prev => [...prev, novoEquipamento])
    
    // Toast de feedback baseado no tipo de equipamento
    if (tipoEquipamentoSelecionado === 'modulo') {
      toast.success(`Módulo adicionado à String ${stringSelecionada}`, {
        description: `${quantidadeItem}x ${equipamentoSelecionado.fabricante} ${equipamentoSelecionado.modelo}`
      })
    } else {
      toast.success(`${tipoEquipamentoSelecionado.charAt(0).toUpperCase() + tipoEquipamentoSelecionado.slice(1)} adicionado com sucesso`, {
        description: `${quantidadeItem}x ${equipamentoSelecionado.fabricante} ${equipamentoSelecionado.modelo}`
      })
    }
    
    // Limpar campos após adicionar
    setItemBusca('')
    setQuantidadeItem(1)
    setEquipamentoSelecionado(null)
    setStringSelecionada('')
  }

  const removerEquipamento = (id: string) => {
    setEquipamentosAdicionados(equipamentosAdicionados.filter(eq => eq.id !== id))
  }

  const handleTipoChange = (tipo: string) => {
    setTipoEquipamentoSelecionado(tipo)
    setItemBusca('')
    setResultadosBusca([])
    setStringSelecionada('')
    setEquipamentoSelecionado(null)
    setOpenCombobox(false)
  }



  return (
    <div className="relative">
      {/* Tela semitransparente com loading */}
      {carregandoEquipamentos && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando equipamentos...</p>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
      {/* Título da seção */}
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Cadastro de Equipamentos do Kit</h2>
      </div>
      
      <div className="space-y-6">
            {/* Radio buttons para tipo de equipamento */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Tipo de Equipamento</Label>
              <RadioGroup
                value={tipoEquipamentoSelecionado}
                onValueChange={handleTipoChange}
                className="grid grid-cols-2 lg:grid-cols-6 gap-2"
              >
                <div className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  tipoEquipamentoSelecionado === 'inversor' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-border bg-background'
                }`} onClick={() => handleTipoChange('inversor')}>
                  <RadioGroupItem value="inversor" id="inversor" className="sr-only" />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inversor" className="cursor-pointer font-medium">Inversor</Label>
                    {tipoEquipamentoSelecionado === 'inversor' ? (
                      <CircleCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  tipoEquipamentoSelecionado === 'modulo' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-border bg-background'
                }`} onClick={() => handleTipoChange('modulo')}>
                  <RadioGroupItem value="modulo" id="modulo" className="sr-only" />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="modulo" className="cursor-pointer font-medium">Módulo</Label>
                    {tipoEquipamentoSelecionado === 'modulo' ? (
                      <CircleCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  tipoEquipamentoSelecionado === 'protecaoCA' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-border bg-background'
                }`} onClick={() => handleTipoChange('protecaoCA')}>
                  <RadioGroupItem value="protecaoCA" id="protecaoCA" className="sr-only" />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="protecaoCA" className="cursor-pointer font-medium">Proteção CA</Label>
                    {tipoEquipamentoSelecionado === 'protecaoCA' ? (
                      <CircleCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  tipoEquipamentoSelecionado === 'protecaoCC' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-border bg-background'
                }`} onClick={() => handleTipoChange('protecaoCC')}>
                  <RadioGroupItem value="protecaoCC" id="protecaoCC" className="sr-only" />
                  <div className="flex items-center justify-between">
                    <Label htmlFor="protecaoCC" className="cursor-pointer font-medium">Proteção CC</Label>
                    {tipoEquipamentoSelecionado === 'protecaoCC' ? (
                      <CircleCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Campo de busca e seleção */}
            {tipoEquipamentoSelecionado && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div className="col-span-12 md:col-span-6  lg:col-span-5">
                  <div className="space-y-2">
                    <Label htmlFor="busca-item">Selecione o Item</Label>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCombobox}
                          className="w-full justify-between"
                          disabled={tipoEquipamentoSelecionado === 'modulo' && (() => {
                            const totalMPPTs = calcularTotalMPPTs()
                            const stringsDisponiveis = obterStringsDisponiveis()
                            return totalMPPTs === 0 || stringsDisponiveis.length === 0
                          })()}
                          onClick={() => {
                            if (tipoEquipamentoSelecionado === 'modulo') {
                              const totalMPPTs = calcularTotalMPPTs()
                              const stringsDisponiveis = obterStringsDisponiveis()
                              const stringsSelecionadas = obterStringsSelecionadas()
                              
                              if (totalMPPTs === 0) {
                                toast.info("Adicione inversores primeiro", {
                                  description: "É necessário adicionar inversores para calcular as strings disponíveis"
                                })
                                return
                              } else if (stringsDisponiveis.length === 0) {
                                toast.warning("Todas as strings foram utilizadas", {
                                  description: `Strings ocupadas: ${stringsSelecionadas.sort((a, b) => a - b).join(', ')}`
                                })
                                return
                              }
                            }
                            setOpenCombobox(!openCombobox)
                          }}
                        >
                          {equipamentoSelecionado
                            ? `${equipamentoSelecionado.modelo}`
                            : `Selecionar ${tipoEquipamentoSelecionado}...`}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder={`Buscar ${tipoEquipamentoSelecionado}...`} />
                          <CommandList>
                            <CommandEmpty>
                              {carregandoEquipamentos ? "Carregando..." : "Nenhum equipamento encontrado."}
                            </CommandEmpty>
                            <CommandGroup>
                              {resultadosBusca.map((item) => (
                                <CommandItem
                                  key={item.id}
                                  value={`${item.nome} ${item.modelo} ${item.fabricante}`}
                                  onSelect={() => {
                                    setEquipamentoSelecionado(item)
                                    setItemBusca(`${item.nome} - ${item.modelo}`)
                                    setOpenCombobox(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      equipamentoSelecionado?.id === item.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{item.nome}</span>
                                    <span className="text-sm text-muted-foreground">{item.modelo} - {item.fabricante}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {/* Select para strings do módulo */}
                {tipoEquipamentoSelecionado === 'modulo' && itemBusca && (() => {
                  const totalMPPTs = calcularTotalMPPTs()
                  const stringsDisponiveis = obterStringsDisponiveis()
                  const stringsSelecionadas = obterStringsSelecionadas()
                  
                  if (totalMPPTs > 0) {
                    if (stringsDisponiveis.length > 0) {
                      return (
                        <div className="col-span-2 md:col-span-2">
                          <div className="space-y-2">
                            <Label htmlFor="string-select">
                              String ( {stringsDisponiveis.length}/{totalMPPTs} )
                            </Label>
                            <Select value={stringSelecionada} onValueChange={setStringSelecionada}>
                               <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Selecione a string" />
                               </SelectTrigger>
                               <SelectContent>
                                 {stringsDisponiveis.map((numero) => (
                                   <SelectItem key={numero} value={numero.toString()}>
                                     String {numero}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                          </div>
                        </div>
                      )
                    } else {
                      return null
                    }
                  } else {
                    return null
                  }
                })()}
                
                <div className="col-span-12 sm:col-span-3 lg:col-span-2">
                  <div className="space-y-2">
                    <Label htmlFor="qtd-item">Qtd</Label>
                    <div className="flex items-center border border-input rounded-md bg-background">
                      <Input
                        id="qtd-item"
                        type="number"
                        min="1"
                        value={quantidadeItem}
                        onChange={(e) => setQuantidadeItem(parseInt(e.target.value) || 1)}
                        placeholder="Qtd"
                        className="border-0 rounded-l-md rounded-r-none text-center focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 border-0 rounded-none hover:bg-muted"
                        onClick={() => setQuantidadeItem(Math.max(1, quantidadeItem - 1))}
                        disabled={quantidadeItem <= 1}
                      >
                        -
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 border-0 rounded-r-md rounded-l-none hover:bg-muted"
                        onClick={() => setQuantidadeItem(quantidadeItem + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 sm:col-span-1 lg:col-span-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          onClick={() => {
                            if (equipamentoSelecionado && quantidadeItem > 0) {
                              adicionarEquipamento()
                            }
                          }}
                          disabled={
                            !equipamentoSelecionado || 
                            quantidadeItem <= 0 || 
                            (tipoEquipamentoSelecionado === 'modulo' && 
                             calcularTotalMPPTs() > 0 && 
                             obterStringsDisponiveis().length === 0) ||
                            (tipoEquipamentoSelecionado === 'modulo' && !stringSelecionada)
                          }
                          className="w-full"
                        >
                          <PackagePlus className="h-4 w-4 mr-2" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Adicionar equipamento</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}

            {/* Cards dos equipamentos adicionados */}
            {equipamentosAdicionados.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Equipamentos Adicionados</Label>
                  <div className="flex items-center gap-3">
                    {calcularPotenciaInversores() > 0 && (
                      <Badge variant="outline" className="bg-neutral-50 border-blue-400 p-3">
                        Inversor: {calcularPotenciaInversores().toLocaleString('pt-BR')} kWp
                      </Badge>
                    )}
                    {calcularPotenciaModulos() > 0 && (
                      <Badge variant="outline" className="bg-neutral-50 border-green-400 p-3">
                        Gerador: {calcularPotenciaModulos().toLocaleString('pt-BR')} Wp
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-3">
                  {organizarEquipamentos().map((equipamento, index) => (
                    <Card key={`${equipamento.id}-${index}`} className="relative col-span-3">
                      <CardContent className="pl-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {equipamento.tipo === 'modulo' && <Table className="h-4 w-4 text-green-600" />}
                              {equipamento.tipo === 'inversor' && <GalleryThumbnails className="h-4 w-4 text-blue-600" />}
                              {equipamento.tipo === 'protecaoCA' && <HousePlug className="h-4 w-4 text-orange-600" />}
                              {equipamento.tipo === 'protecaoCC' && <House className="h-4 w-4 text-purple-600" />}
                              <span className="font-medium capitalize">{equipamento.tipo}</span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removerEquipamento(equipamento.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div>{equipamento.fabricante}</div>
                          <div className="mt-1">
                            <div>Modelo: {equipamento.modelo}</div>
                            {equipamento.tipo === 'modulo' ? (
                              <div className="font-medium mt-1 flex gap-3">
                                <span>Qtd: {equipamento.quantidade}</span>
                                {equipamento.stringSelecionada && (
                                  <span className="text-green-600">String: {equipamento.stringSelecionada}</span>
                                )}
                              </div>
                            ) : (
                              <div className="font-medium mt-1">Qtd: {equipamento.quantidade}</div>
                            )}
                            {equipamento.tipo === 'inversor' && equipamento.mppt && (
                              <div className="font-medium mt-1 text-blue-600">MPPT: {equipamento.mppt}</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
        </div>
        
        {/* Mensagens de erro de validação */}
        {(errors.inversor || errors.modulo || errors.protecaoCA || errors.strings) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-red-800 font-medium mb-2">Validação de Equipamentos:</h4>
            <ul className="text-red-700 text-sm space-y-1">
              {errors.inversor && <li key="inversor">• {errors.inversor}</li>}
              {errors.modulo && <li key="modulo">• {errors.modulo}</li>}
              {errors.protecaoCA && <li key="protecaoCA">• {errors.protecaoCA}</li>}
              {errors.strings && <li key="strings">• {errors.strings}</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
