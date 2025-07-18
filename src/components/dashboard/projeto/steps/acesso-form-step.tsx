"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/lib/schema/projetoSchema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info, X, Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"


interface ContactInfoStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
  projetoId?: string // ID do projeto para carregar dados existentes
  resetTrigger?: boolean // Trigger para resetar estados internos
}

export default function AcessoStep({ formData, updateFormData, errors, projetoId, resetTrigger }: ContactInfoStepProps) {
  const [isLoadingSelects, setIsLoadingSelects] = useState(true);
  const [concessionaria, setConcessionaria] = useState<Array<{ id: string; sigla: string; nome: string; estado: string }>>([]);
  const [tensaoRede, setTensaoRede] = useState<Array<{ id: number; sigla: string; descricao: string }>>([]);
  const [subgrupoConexao, setSubgrupoConexao] = useState<Array<{ id: number; sigla: string; descricao: string }>>([]);
  const [tipoConexao, setTipoConexao] = useState<Array<{ id: number; sigla: string; descricao: string }>>([]);
  const [tipoSolicitacao, setTipoSolicitacao] = useState<Array<{ id: number; sigla: string; descricao: string }>>([]);
  const [tipoRamal, setTipoRamal] = useState<Array<{ id: number; sigla: string; descricao: string }>>([]);
  const [ramoAtividade, setRamoAtividade] = useState<Array<{ id: number; sigla: string; descricao: string }>>([]);
  const [enquadramentoGeracao, setEnquadramentoGeracao] = useState<Array<{ id: number; sigla: string; descricao: string }>>([]);
  const [tipoGeracao, setTipoGeracao] = useState<Array<{ id: number; sigla: string; descricao: string }>>([]);
  const [alocacaoCredito, setAlocacaoCredito] = useState<Array<{ id: number; sigla: string; descricao: string }>>([]);
  
  // Estados para o campo de tags de conta contrato
  const [contractTags, setContractTags] = useState<string[]>([]);
  const [currentContractInput, setCurrentContractInput] = useState("");

  // Reset estados internos quando resetTrigger for ativado
  useEffect(() => {
    if (resetTrigger) {
      setIsLoadingSelects(true);
      setConcessionaria([]);
      setTensaoRede([]);
      setSubgrupoConexao([]);
      setTipoConexao([]);
      setTipoSolicitacao([]);
      setTipoRamal([]);
      setRamoAtividade([]);
      setEnquadramentoGeracao([]);
      setTipoGeracao([]);
      setContractTags([]);
      setCurrentContractInput("");
    }
  }, [resetTrigger]);

  // Inicializar tags do contractNumber existente
  useEffect(() => {
    if (formData.contractNumber && formData.contractNumber.trim()) {
      const existingTags = formData.contractNumber.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
      setContractTags(existingTags);
    }
  }, []);

  useEffect(() => {
    const fetchConcessionarias = async () => {
      try {
        const response = await fetch('/api/concessionarias');
        if (response.ok) {
          const data = await response.json();
          setConcessionaria(data);
        } else {
          throw new Error('Erro ao buscar concessionárias');
        }
      } catch (error) {
        console.error('Erro ao carregar concessionárias:', error);
        // Fallback estático em caso de erro
        setConcessionaria([
          { id: "1", sigla: "EQTMA", nome: "Equatorial Maranhão", estado: "MA" },
          { id: "2", sigla: "EQTPI", nome: "Equatorial Piauí", estado: "PI" },
        ]);
      }
    };

    const fetchFormSelects = async () => {
      try {
        const response = await fetch('/api/form-selects');
        if (response.ok) {
          const data = await response.json();
          setTensaoRede(data.tensaoRede || []);
          setSubgrupoConexao(data.subgrupoConexao || []);
          setTipoConexao(data.tipoConexao || []);
          setTipoSolicitacao(data.tipoSolicitacao || []);
          setTipoRamal(data.tipoRamal || []);
          setRamoAtividade(data.ramoAtividade || []);
          setEnquadramentoGeracao(data.enquadramentoGeracao || []);
          setTipoGeracao(data.tipoGeracao || []);
          setAlocacaoCredito(data.alocacaoCredito || []);
        } else {
          throw new Error('Erro ao buscar dados dos selects');
        }
      } catch (error) {
        console.error('Erro ao carregar dados dos selects:', error);
        // Fallback estático em caso de erro (ordenado alfabeticamente)
        setTensaoRede([
          { id: 1, sigla: "127V", descricao: "127 V" },
          { id: 2, sigla: "220V", descricao: "220 V" },
          { id: 3, sigla: "380V", descricao: "380 V" }
        ]);
        setSubgrupoConexao([
          { id: 2, sigla: "bi", descricao: "BIFÁSICO" },
          { id: 1, sigla: "mono", descricao: "MONOFÁSICO" },
          { id: 3, sigla: "tri", descricao: "TRIFÁSICO" }
        ]);
        setTipoConexao([
          { id: 2, sigla: "existente", descricao: "Conexão Existente" },
          { id: 1, sigla: "nova", descricao: "Nova Conexão" }
        ]);
        setTipoSolicitacao([
          { id: 2, sigla: "parecer", descricao: "Parecer de Acesso" },
          { id: 1, sigla: "acesso", descricao: "Solicitação de Acesso" }
        ]);
        setTipoRamal([
          { id: 1, sigla: "aereo", descricao: "Aéreo" },
          { id: 2, sigla: "subterraneo", descricao: "Subterrâneo" }
        ]);
        setRamoAtividade([
          { id: 2, sigla: "comercial", descricao: "Comercial" },
          { id: 3, sigla: "industrial", descricao: "Industrial" },
          { id: 1, sigla: "residencial", descricao: "Residencial" }
        ]);
        setEnquadramentoGeracao([
          { id: 1, sigla: "micro", descricao: "Microgeração" },
          { id: 2, sigla: "mini", descricao: "Minigeração" }
        ]);
        setTipoGeracao([
          { id: 2, sigla: "eolica", descricao: "Eólica" },
          { id: 1, sigla: "solar", descricao: "Solar Fotovoltaica" }
        ]);
        setAlocacaoCredito([
          { id: 1, sigla: "prioridade", descricao: "Ordem de Prioridade" },
          { id: 2, sigla: "percentual", descricao: "Percentual do Excedente" }
        ]);
      }
    };

    const loadData = async () => {
      setIsLoadingSelects(true);
      await Promise.all([fetchConcessionarias(), fetchFormSelects()]);
      setIsLoadingSelects(false);
    };

    loadData();
  }, []);

  // Componente de select sem loading individual
  const SelectField = ({ 
    label, 
    id, 
    placeholder, 
    value, 
    onValueChange, 
    options, 
    error, 
    className = "w-full",
    colSpan = "col-span-6 md:col-span-4" 
  }: {
    label: string;
    id: string;
    placeholder: string;
    value: string;
    onValueChange: (value: string) => void;
    options: Array<{ id: string | number; sigla?: string; nome?: string; descricao?: string }>;
    error?: string;
    className?: string;
    colSpan?: string;
  }) => (
    <div className={colSpan}>
      <Label className="py-2" htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className={error ? "border-destructive " + className : className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {options.map((option) => (
            <SelectItem key={option.id} value={option.sigla || option.id.toString()}>
              {option.nome || option.descricao}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
      <div className="col-span-12">
        <Label className="py-2" htmlFor="contractNumber">Conta Contrato por ordem de prioridade</Label>
        <div className="relative">
          <div className={`flex flex-wrap items-center gap-1 min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background ${errors.contractNumber ? "border-destructive" : ""} focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2`}>
            {/* Tags existentes dentro do input */}
             {contractTags.map((tag, index) => (
               <div key={index} className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm ${
                 index === 0 
                   ? "bg-green-100 text-green-700 border border-green-200" 
                   : "bg-blue-100 text-blue-700 border border-blue-200"
               }`}>
                 <span>{tag}</span>
                 {index === 0 && <span className="text-xs text-green-600 ml-1">(geradora)</span>}
                 <Button
                   type="button"
                   variant="ghost"
                   size="sm"
                   className="h-4 w-4 p-0 hover:bg-destructive/20"
                   onClick={() => {
                     const newTags = contractTags.filter((_, i) => i !== index);
                     setContractTags(newTags);
                     updateFormData("contractNumber", newTags.join(","));
                   }}
                 >
                   <X className="h-3 w-3" />
                 </Button>
               </div>
             ))}
            {/* Input para nova tag */}
            <input
              id="contractNumber"
              type="text"
              value={currentContractInput}
              onChange={(e) => {
                // Validação: aceita apenas números, vírgulas, hífens, pontos e espaços
                const value = e.target.value;
                const validPattern = /^[0-9,\-\.\/\s]*$/;
                if (validPattern.test(value)) {
                  setCurrentContractInput(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && currentContractInput.trim()) {
                  e.preventDefault();
                  const newTag = currentContractInput.trim();
                  if (!contractTags.includes(newTag)) {
                    const newTags = [...contractTags, newTag];
                    setContractTags(newTags);
                    updateFormData("contractNumber", newTags.join(","));
                  }
                  setCurrentContractInput("");
                }
              }}
              placeholder={contractTags.length === 0 ? "Digite a conta contrato e pressione Enter" : "Adicionar outra..."}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
            />
          </div>
        </div>
        {errors.contractNumber && <p className="text-sm text-destructive">{errors.contractNumber}</p>}
      </div>
      
      <SelectField
        label="Concessionária"
        id="concessionaria"
        placeholder="Escolha a concessionaria"
        value={concessionaria.find(c => c.nome === formData.concessionaria)?.sigla || ''}
        onValueChange={(value) => {
          const concessionariaSelecionada = concessionaria.find(c => c.sigla === value);
          if (concessionariaSelecionada) {
            updateFormData("concessionaria", concessionariaSelecionada.nome);
          }
        }}
        options={concessionaria}
        error={errors.concessionaria}
        colSpan="col-span-6 md:col-span-4"
      />
      <SelectField
        label="Tensão rede"
        id="tensaoRede"
        placeholder="Tensão"
        value={tensaoRede.find(t => t.descricao === formData.tensaoRede)?.sigla || ''}
        onValueChange={(value) => {
          const tensaoSelecionada = tensaoRede.find(t => t.sigla === value);
          if (tensaoSelecionada) {
            updateFormData("tensaoRede", tensaoSelecionada.descricao);
          }
        }}
        options={tensaoRede}
        error={errors.tensaoRede}
        colSpan="col-span-6 md:col-span-2"
      />

      <SelectField
        label="Subgrupo de conexão"
        id="subgrupoConexao"
        placeholder="Grupo"
        value={subgrupoConexao.find(g => g.descricao === formData.subgrupoConexao)?.sigla || subgrupoConexao.find(g => g.descricao === formData.subgrupoConexao)?.id.toString() || ''}
        onValueChange={(value) => {
          const grupoSelecionado = subgrupoConexao.find(g => (g.sigla || g.id.toString()) === value);
          if (grupoSelecionado) {
            updateFormData("subgrupoConexao", grupoSelecionado.descricao);
          }
        }}
        options={subgrupoConexao}
        error={errors.subgrupoConexao}
        colSpan="col-span-6 md:col-span-2"
      />

      <SelectField
        label="Tipo de conexão"
        id="tipoConexao"
        placeholder="Tipo"
        value={tipoConexao.find(t => t.descricao === formData.tipoConexao)?.sigla || ''}
        onValueChange={(value) => {
          const tipoConexaoSelecionado = tipoConexao.find(t => t.sigla === value);
          if (tipoConexaoSelecionado) {
            updateFormData("tipoConexao", tipoConexaoSelecionado.descricao);
          }
        }}
        options={tipoConexao}
        error={errors.tipoConexao}
        colSpan="col-span-6 md:col-span-2"
      />
      
      <SelectField
        label="Tipo de Ramal"
        id="tipoRamal"
        placeholder="Ramal"
        value={tipoRamal.find(t => t.descricao === formData.tipoRamal)?.sigla || ''}
        onValueChange={(value) => {
          const tipoRamalSelecionado = tipoRamal.find(t => t.sigla === value);
          if (tipoRamalSelecionado) {
            updateFormData("tipoRamal", tipoRamalSelecionado.descricao);
          }
        }}
        options={tipoRamal}
        error={errors.tipoRamal}
        colSpan="col-span-12 md:col-span-2"
      />

      <SelectField
        label="Tipo de Solicitação"
        id="tipoSolicitacao"
        placeholder="Solicitação"
        value={tipoSolicitacao.find(t => t.descricao === formData.tipoSolicitacao)?.sigla || ''}
        onValueChange={(value) => {
          const tipoSolicitacaoSelecionado = tipoSolicitacao.find(t => t.sigla === value);
          if (tipoSolicitacaoSelecionado) {
            updateFormData("tipoSolicitacao", tipoSolicitacaoSelecionado.descricao);
          }
        }}
        options={tipoSolicitacao}
        error={errors.tipoSolicitacao}
        colSpan="col-span-12 md:col-span-8"
      />

      <SelectField
        label="Ramo de atividade"
        id="ramoAtividade"
        placeholder="Atividade"
        value={ramoAtividade.find(r => r.descricao === formData.ramoAtividade)?.sigla || ''}
        onValueChange={(value) => {
          const ramoAtividadeSelecionado = ramoAtividade.find(r => r.sigla === value);
          if (ramoAtividadeSelecionado) {
            updateFormData("ramoAtividade", ramoAtividadeSelecionado.descricao);
          }
        }}
        options={ramoAtividade}
        error={errors.ramoAtividade}
        colSpan="col-span-12 md:col-span-4"
      />

      <SelectField
        label="Enquadramento da geração"
        id="enquadramentoGeracao"
        placeholder="Escolha o enquadramento da geração"
        value={enquadramentoGeracao.find(e => e.descricao === formData.enquadramentoGeracao)?.sigla || ''}
        onValueChange={(value) => {
          const enquadramentoGeracaoSelecionado = enquadramentoGeracao.find(e => e.sigla === value);
          if (enquadramentoGeracaoSelecionado) {
            updateFormData("enquadramentoGeracao", enquadramentoGeracaoSelecionado.descricao);
          }
        }}
        options={enquadramentoGeracao}
        error={errors.enquadramentoGeracao}
        colSpan="col-span-12 md:col-span-4"
      />

      <SelectField
        label="Tipo de Geração"
        id="tipoGeracao"
        placeholder="Escolha o tipo de geração"
        value={tipoGeracao.find(t => t.descricao === formData.tipoGeracao)?.sigla || ''}
        onValueChange={(value) => {
          const tipoGeracaoSelecionado = tipoGeracao.find(t => t.sigla === value);
          if (tipoGeracaoSelecionado) {
            updateFormData("tipoGeracao", tipoGeracaoSelecionado.descricao);
          }
        }}
        options={tipoGeracao}
        error={errors.tipoGeracao}
        colSpan="col-span-12 md:col-span-4"
      />

      <SelectField
        label="Alocação de Crédito"
        id="alocacaoCredito"
        placeholder="Escolha a alocação de crédito"
        value={alocacaoCredito.find(a => a.descricao === formData.alocacaoCredito)?.sigla || ''}
        onValueChange={(value) => {
          const alocacaoCreditoSelecionado = alocacaoCredito.find(a => a.sigla === value);
          if (alocacaoCreditoSelecionado) {
            updateFormData("alocacaoCredito", alocacaoCreditoSelecionado.descricao);
          }
        }}
        options={alocacaoCredito}
        error={errors.alocacaoCredito}
        colSpan="col-span-12 md:col-span-4"
      />

      <div className="col-span-12 md:col-span-2">
        <Label className="py-2" htmlFor="poste">Código do Poste
        <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
      </TooltipTrigger>
      <TooltipContent side="top">
       <p>Indique o código do poste no qual o cliente esteja conectado,<br />
       geralmente encontrado numa plaquinha de metal junto ao poste.<br />
       Caso esteja inlegivél ou não tenha digite apenas 3 asteriscos (***) e prossiga!
       </p>
      </TooltipContent>
    </Tooltip>
        </Label>

        <div className="relative">
          <Input
            id="poste"
            value={formData.poste}
            onChange={(e) => updateFormData("poste", e.target.value)}
            placeholder="Número do poste"
            className={errors.poste ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.poste && <p className="text-sm text-destructive">{errors.poste}</p>}
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="longitudeUTM">Longitude UTM</Label>
        <div className="relative">
          <Input
            id="longitudeUTM"
            value={formData.longitudeUTM}
            onChange={(e) => updateFormData("longitudeUTM", e.target.value)}
            placeholder="Longitude"
            className={errors.longitudeUTM ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.longitudeUTM && <p className="text-sm text-destructive">{errors.longitudeUTM}</p>}
      </div>

      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="latitudeUTM">Latitude UTM</Label>
        <div className="relative">
          <Input
            id="latitudeUTM"
            value={formData.latitudeUTM}
            onChange={(e) => updateFormData("latitudeUTM", e.target.value)}
            placeholder="Latitude"
            className={errors.latitudeUTM ? "border-destructive pr-10" : "pr-10"}
          />
        </div>
        {errors.latitudeUTM && <p className="text-sm text-destructive">{errors.latitudeUTM}</p>}
      </div>


      </div>
  )
}
