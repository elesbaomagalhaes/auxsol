"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/lib/schema/projetoSchema"
import { toast } from "sonner"
import { useEffect, useState, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {  Search, Eraser, Users } from "lucide-react"

// Estados serão carregados dinamicamente da tabela uf

interface ClienteStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
  numProjeto?: string // Número do projeto para carregar dados do cliente
  resetTrigger?: boolean // Trigger para resetar estados internos
}

export default function ClienteSetupStep({ formData, updateFormData, errors, numProjeto, resetTrigger }: ClienteStepProps) {
  const [estados, setEstados] = useState<string[]>([]);
  const [isLoadingCliente, setIsLoadingCliente] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSearchTerm, setDialogSearchTerm] = useState("");
  const [dialogClientes, setDialogClientes] = useState<any[]>([]);
  const [isDialogSearching, setIsDialogSearching] = useState(false);
  const numProjetoInputRef = useRef<HTMLInputElement>(null);

  // Reset estados internos quando resetTrigger for ativado
  useEffect(() => {
    if (resetTrigger) {
      setEstados([]);
      setIsLoadingCliente(false);
    }
  }, [resetTrigger]);

  // Foco automático no campo número do projeto ao montar o componente
  useEffect(() => {
    if (numProjetoInputRef.current) {
      numProjetoInputRef.current.focus();
    }
  }, []);

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
          "MA", "PI"
        ]);
      }
    };

    fetchEstados();
  }, []);

  // Carregar dados do cliente quando numProjeto for fornecido
  useEffect(() => {
    const fetchClienteData = async () => {
      if (!numProjeto) return;
      
      setIsLoadingCliente(true);
      try {
        const response = await fetch(`/api/cliente/by-projeto/${numProjeto}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Cliente não encontrado para este projeto');
            return;
          }
          throw new Error('Falha ao buscar dados do cliente');
        }
        
        const clienteData = await response.json();
        
        console.log('Dados do cliente recebidos:', clienteData);
        console.log('Data de emissão recebida:', clienteData.rgCnhDataEmissao);
        
        // Preencher formulário com dados do cliente
        updateFormData('nome', clienteData.nome || '');
        updateFormData('cpf', clienteData.cpf || '');
        updateFormData('fone', clienteData.fone || '');
        updateFormData('email', clienteData.email || '');
        updateFormData('rua', clienteData.rua || '');
        updateFormData('numero', clienteData.numero || '');
        updateFormData('complemento', clienteData.complemento || '');
        updateFormData('bairro', clienteData.bairro || '');
        updateFormData('cidade', clienteData.cidade || '');
        updateFormData('uf', clienteData.uf || '');
        updateFormData('cep', clienteData.cep || '');
        updateFormData('rgCnh', clienteData.rgCnh || '');
        
        if (clienteData.rgCnhDataEmissao) {
          console.log('Processando data de emissão:', clienteData.rgCnhDataEmissao);
          const dataEmissao = new Date(clienteData.rgCnhDataEmissao);
          console.log('Data convertida:', dataEmissao);
          if (!isNaN(dataEmissao.getTime())) {
            const formattedDate = dataEmissao.toISOString().split('T')[0];
            console.log('Data formatada:', formattedDate);
            updateFormData('rgCnhDataEmissao', formattedDate);
          } else {
            console.error('Data inválida:', clienteData.rgCnhDataEmissao);
          }
        } else {
          console.log('Nenhuma data de emissão encontrada');
        }
        
        toast.success('Dados do cliente carregados com sucesso!');
      } catch (error) {
        console.error('Erro ao buscar dados do cliente:', error);
        toast.error('Erro ao carregar dados do cliente');
      } finally {
        setIsLoadingCliente(false);
      }
    };

    fetchClienteData();
  }, [numProjeto, updateFormData]);





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
    }, [formData.cep]);

  // Função para selecionar um cliente
  const selecionarCliente = (cliente: any) => {
    console.log('Cliente selecionado:', cliente);
    console.log('Data de emissão do cliente selecionado:', cliente.rgCnhDataEmissao);
    
    updateFormData('nome', cliente.nome);
    updateFormData('cpf', cliente.cpf || '');
    updateFormData('fone', cliente.fone || '');
    updateFormData('email', cliente.email || '');
    updateFormData('cep', cliente.cep || '');
    updateFormData('rua', cliente.rua || '');
    updateFormData('numero', cliente.numero || '');
    updateFormData('complemento', cliente.complemento || '');
    updateFormData('bairro', cliente.bairro || '');
    updateFormData('cidade', cliente.cidade || '');
    updateFormData('uf', cliente.uf || '');
    updateFormData('rgCnh', cliente.rgCnh || '');
    
    if (cliente.rgCnhDataEmissao) {
      console.log('Processando data de emissão do cliente selecionado:', cliente.rgCnhDataEmissao);
      const dataEmissao = new Date(cliente.rgCnhDataEmissao);
      console.log('Data convertida:', dataEmissao);
      if (!isNaN(dataEmissao.getTime())) {
        const formattedDate = dataEmissao.toISOString().split('T')[0];
        console.log('Data formatada:', formattedDate);
        updateFormData('rgCnhDataEmissao', formattedDate);
      } else {
        console.error('Data inválida do cliente selecionado:', cliente.rgCnhDataEmissao);
      }
    } else {
      console.log('Nenhuma data de emissão no cliente selecionado');
      updateFormData('rgCnhDataEmissao', '');
    }
    
    toast.success('Dados do cliente carregados com sucesso!');
  };

  // Função para limpar todos os dados do cliente
  const limparDadosCliente = () => {
    updateFormData('nome', '');
    updateFormData('cpf', '');
    updateFormData('fone', '');
    updateFormData('email', '');
    updateFormData('cep', '');
    updateFormData('rua', '');
    updateFormData('complemento', '');
    updateFormData('numero', '');
    updateFormData('bairro', '');
    updateFormData('cidade', '');
    updateFormData('uf', '');
    updateFormData('rgCnh', '');
    updateFormData('rgCnhDataEmissao', '');
    toast.success('Dados do cliente limpos com sucesso!');
  };

  // Função para buscar clientes no diálogo
  const buscarClientesDialog = async (termo: string) => {
    if (termo.length < 2) {
      setDialogClientes([]);
      return;
    }

    setIsDialogSearching(true);
    try {
      const response = await fetch(`/api/clientes/buscar?nome=${encodeURIComponent(termo)}`);
      if (response.ok) {
        const data = await response.json();
        setDialogClientes(data);
      } else {
        console.error('Erro ao buscar clientes');
        setDialogClientes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setDialogClientes([]);
    } finally {
      setIsDialogSearching(false);
    }
  };

  // Função para selecionar um cliente do diálogo
  const selecionarClienteDialog = (cliente: any) => {
    selecionarCliente(cliente);
    setDialogOpen(false);
    setDialogSearchTerm("");
    setDialogClientes([]);
  };



  // Effect para buscar clientes no diálogo quando o termo de busca do diálogo muda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (dialogSearchTerm) {
        buscarClientesDialog(dialogSearchTerm);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [dialogSearchTerm]);

  return (
    
    <div className="max-w-full overflow-hidden pl-4">
      {/* Indicador de carregamento */}
      {isLoadingCliente && (
        <div className="mb-4">
          <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-700">Carregando dados do cliente...</span>
          </div>
        </div>
      )}
      {/* Formulário de cliente */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-2 inpur-focus mr-2">
        <Label className="py-2" htmlFor="numProjetoC">Núm. Projeto</Label>
        <Input
          ref={numProjetoInputRef}
          id="numProjetoC"
          value={formData.numProjetoC}
          onChange={(e) => updateFormData("numProjetoC", e.target.value)}
          placeholder="Digite o projeto"
          className={`input-focus ${errors.numProjetoC ? "border-destructive" : ""}`}
          autoComplete="off"
        />
        {errors.numProjetoC && <p className="text-sm text-destructive">{errors.numProjetoC}</p>}
      </div>

      <div className="col-span-12 md:col-span-7">
        <Label className="py-2" htmlFor="nome">Nome completo</Label>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 flex-shrink-0"
                title="Buscar cliente cadastrado"
              >
                <Users className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Buscar Cliente Cadastrado</DialogTitle>
                <DialogDescription>
                  Digite o nome do cliente para buscar nos registros cadastrados.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Digite o nome do cliente..."
                    value={dialogSearchTerm}
                    onChange={(e) => setDialogSearchTerm(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                  {isDialogSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {dialogClientes.length === 0 && !isDialogSearching && dialogSearchTerm.length >= 2 && (
                    <div className="text-center py-4 text-gray-500">
                      Nenhum cliente encontrado.
                    </div>
                  )}
                  {dialogClientes.length > 0 && (
                    <div className="space-y-2">
                      {dialogClientes.map((cliente) => (
                        <div
                          key={cliente.id}
                          onClick={() => selecionarClienteDialog(cliente)}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{cliente.nome}</span>
                            <span className="text-sm text-gray-500">
                              {cliente.cpf && `CPF: ${cliente.cpf}`}
                              {cliente.fone && ` • Tel: ${cliente.fone}`}
                              {cliente.email && ` • Email: ${cliente.email}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setDialogSearchTerm("");
                    setDialogClientes([]);
                  }}
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="relative flex-1">
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => updateFormData("nome", e.target.value)}
              placeholder="Digite o nome completo do cliente"
              className={`input-focus ${errors.nome ? "border-destructive" : ""}`}
              autoComplete="off"
            />
          </div>
        <button
          type="button"
          onClick={limparDadosCliente}
          className="flex items-center justify-center h-10 px-3 bg-black hover:bg-gray-800 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          title="Limpar formulário"
        >
          <Eraser className="h-4 w-4" />
        </button>
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
            autoComplete="off"
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
            required
            max={new Date().toISOString().split('T')[0]}
            className={errors.rgCnhDataEmissao ? "border-destructive pr-10" : "pr-10"}
            autoComplete="off"
          />
        </div>
        {errors.rgCnhDataEmissao && <p className="text-sm text-destructive">{errors.rgCnhDataEmissao}</p>}
      </div>
      <div className="col-span-6 md:col-span-3">
        <Label className="py-2" htmlFor="cpf">CPF </Label>
        <div className="relative">
          <Input
            id="cpf"
            value={formData.cpf}
            onChange={(e) => updateFormData("cpf", e.target.value)}
            placeholder="CPF"
            className={errors.cpf ? "border-destructive pr-10" : "pr-10"}
            autoComplete="off"
          />
        </div>
        {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
      </div>

      <div className="col-span-6 md:col-span-3">
        <Label className="py-2" htmlFor="fone">Fone </Label>
        <div className="relative">
          <Input
            id="fone"
            type="tel"
            value={formData.fone}
            onChange={(e) => updateFormData("fone", e.target.value)}
            placeholder=""
            className={errors.fone ? "border-destructive pr-10" : "pr-10"}
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="col-span-12 md:col-span-2 mr-2">
        <Label className="py-2" htmlFor="cep">CEP</Label>
        <div className="relative">
          <Input
            id="cep"
            type="text"
            value={formData.cep}
            onChange={(e) => updateFormData("cep", e.target.value)}
            placeholder="60000-000"
            className={errors.cep ? "border-destructive pr-10" : "pr-10"}
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
        {errors.complemento && <p className="text-sm text-destructive">{errors.complemento}</p>}
      </div>

      <div className="col-span-6 md:col-span-2 mr-2">
        <Label className="py-2" htmlFor="numero">Número</Label>
        <div className="relative">
          <Input
            id="numero"
            type="text"
            value={formData.numero}
            onChange={(e) => updateFormData("numero", e.target.value)}
            placeholder="100"
            className={errors.numero ? "border-destructive pr-10" : "pr-10"}
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
        {errors.cidade && <p className="text-sm text-destructive">{errors.cidade}</p>}
      </div>

      <div className="col-span-2 md:col-span-2 mr-2">
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
    </div>
  )
}
