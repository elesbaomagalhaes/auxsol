"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { FormData } from "@/lib/schema/projeto"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface ContactInfoStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
}

export default function ContactInfoStep({ formData, updateFormData, errors }: ContactInfoStepProps) {

const concessionarias = [
  { id: 1, sigla: "EQTMA", nome: "Equatorial Maranhão" },
  { id: 2, sigla: "EQTPI", nome: "Equatorial Piauí" },
  { id: 3, sigla: "EQTPA", nome: "Equatorial Pará" },
]

const tensaoRede = [
  { id: 1, sigla: "110V", nome: "127 V" },
  { id: 2, sigla: "220V", nome: "220 V" },
  { id: 3, sigla: "380", nome: "380 V" }
]

const grupoConexao = [
  { id: 1, sigla: "mono", nome: "MONOFASE" },
  { id: 2, sigla: "bi", nome: "BIFASE" },
  { id: 3, sigla: "tri", nome: "TRIFASE" }
]

const tipoConexao = [
  { id: 1, sigla: "110V", nome: "127 V" },
  { id: 2, sigla: "220V", nome: "220 V" },
  { id: 3, sigla: "380", nome: "380 V" }
]

const tipoSolicitacao = [
  { id: 1, sigla: "110V", nome: "127 V" },
  { id: 2, sigla: "220V", nome: "220 V" },
  { id: 3, sigla: "380", nome: "380 V" }
]

const tipoRamal = [
  { id: 1, sigla: "110V", nome: "127 V" },
  { id: 2, sigla: "220V", nome: "220 V" },
  { id: 3, sigla: "380", nome: "380 V" }
]

const ramoAtividade = [
  { id: 1, sigla: "110V", nome: "127 V" },
  { id: 2, sigla: "220V", nome: "220 V" },
  { id: 3, sigla: "380", nome: "380 V" }
]

const enquadramentoGeracao = [
  { id: 1, sigla: "110V", nome: "127 V" },
  { id: 2, sigla: "220V", nome: "220 V" },
  { id: 3, sigla: "380", nome: "380 V" }
]

const tipoGeracao = [
  { id: 1, sigla: "110V", nome: "127 V" },
  { id: 2, sigla: "220V", nome: "220 V" },
  { id: 3, sigla: "380", nome: "380 V" }
]

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 space-y-4 w-scren">
      <div className="col-span-6 md:col-span-4">
      <Label className="py-2" htmlFor="concessionaria">Concessionária</Label>
        <Select value={formData.concessionaria} onValueChange={(value) => {
          updateFormData("concessionaria", value);
          // Encontra o nome da concessionária selecionada e armazena
          const concessionariaSelecionada = concessionarias.find(c => c.sigla === value);
          if (concessionariaSelecionada) {
            updateFormData("conInfo", concessionariaSelecionada.nome);
          }
        }}>
          <SelectTrigger id="concessionaria" className={errors.concessionaria ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Escolha a concessionaria" />
          </SelectTrigger>
          <SelectContent>
            {concessionarias.map((concess) => (
              <SelectItem key={concess.id} value={concess.sigla}>{concess.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.concessionaria && <p className="text-sm text-destructive">{errors.concessionaria}</p>}
        <Input type="hidden" id="conInfo" value={formData.conInfo || ""} />
      </div>

      <div className="col-span-6 md:col-span-3">
        <Label className="py-2" htmlFor="contractNumber">Conta Contrato</Label>
        <div className="relative">
          <Input
            id="contractNumber"
            value={formData.contractNumber}
            onChange={(e) => updateFormData("contractNumber", e.target.value)}
            placeholder="Conta Contrato da Geradora"
            className={errors.contractNumber ? "border-destructive  pr-10" : "pr-10"}
          />
        </div>
        {errors.contractNumber && <p className="text-sm text-destructive">{errors.contractNumber}</p>}
      </div>

      <div className="col-span-6 md:col-span-2">
      <Label className="py-2" htmlFor="tensaoRede">Tensão da Rede</Label>
        <Select value={formData.tensaoRede} onValueChange={(value) => {
          updateFormData("tensaoRede", value);
          // Encontra o nome da tensão selecionada e armazena
          const tensaoSelecionada = tensaoRede.find(t => t.sigla === value);
          if (tensaoSelecionada) {
            updateFormData("tnsRdeInfo", tensaoSelecionada.nome);
          }
        }}>
          <SelectTrigger id="tensaoRede" className={errors.tensaoRede ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Tensão" />
          </SelectTrigger>
          <SelectContent>
            {tensaoRede.map((tensao) => (
              <SelectItem key={tensao.id} value={tensao.sigla}>{tensao.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tensaoRede && <p className="text-sm text-destructive">{errors.tensaoRede}</p>}
        <Input type="hidden" id="tnsRdeInfo" value={formData.tnsRdeInfo || ""} />
      </div>

       <div className="col-span-6 md:col-span-2">
      <Label className="py-2" htmlFor="grupoConexao">Grupo de Conexão</Label>
        <Select value={formData.grupoConexao} onValueChange={(value) => {
          updateFormData("grupoConexao", value);
          // Encontra o nome do grupo de conexão selecionado e armazena
          const grupoSelecionado = grupoConexao.find(g => g.id.toString() === value);
          if (grupoSelecionado) {
            updateFormData("gpoCnxInfo", grupoSelecionado.nome);
          }
        }}>
          <SelectTrigger id="grupoConexao" className={errors.grupoConexao ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Grupo" />
          </SelectTrigger>
          <SelectContent>
            {grupoConexao.map((conexao) => (
              <SelectItem key={conexao.id} value={conexao.id.toString()}>{conexao.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.grupoConexao && <p className="text-sm text-destructive">{errors.grupoConexao}</p>}
        <Input type="hidden" id="gpoCnxInfo" value={formData.gpoCnxInfo || ""} />
      </div>

      <div className="col-span-6 md:col-span-3">
      <Label className="py-2" htmlFor="tipoConexao">Tipo de conexão</Label>
        <Select value={formData.tipoConexao} onValueChange={(value) => {
          updateFormData("tipoConexao", value);
          // Encontra o nome do tipo de conexão selecionado e armazena
          const tipoConexaoSelecionado = tipoConexao.find(t => t.sigla === value);
          if (tipoConexaoSelecionado) {
            updateFormData("tpoCnxInfo", tipoConexaoSelecionado.nome);
          }
        }}>
          <SelectTrigger id="tipoConexao" className={errors.tipoConexao ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Tipo de Conexão" />
          </SelectTrigger>
          <SelectContent>
            {tensaoRede.map((tensao) => (
              <SelectItem key={tensao.id} value={tensao.sigla}>{tensao.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tipoConcexao && <p className="text-sm text-destructive">{errors.tipoConcexao}</p>}
        <Input type="hidden" id="tpoCnxInfo" value={formData.tpoCnxInfo || ""} />
      </div>

            <div className="col-span-6 md:col-span-5">
      <Label className="py-2" htmlFor="tipoSolicitacao">Tipo de Solicitação</Label>
        <Select value={formData.tipoSolicitacao} onValueChange={(value) => {
          updateFormData("tipoSolicitacao", value);
          // Encontra o nome do tipo de solicitação selecionado e armazena
          const tipoSolicitacaoSelecionado = tipoSolicitacao.find(t => t.sigla === value);
          if (tipoSolicitacaoSelecionado) {
            updateFormData("tpoSolInfo", tipoSolicitacaoSelecionado.nome);
          }
        }}>
          <SelectTrigger id="tipoSolicitacao" className={errors.tipoSolicitacao ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Solicitação" />
          </SelectTrigger>
          <SelectContent>
            {tensaoRede.map((tensao) => (
              <SelectItem key={tensao.id} value={tensao.sigla}>{tensao.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tipoSolicitacao && <p className="text-sm text-destructive">{errors.tipoSolicitacao}</p>}
        <Input type="hidden" id="tpoSolInfo" value={formData.tpoSolInfo || ""} />
      </div>

      <div className="col-span-6 md:col-span-2">
      <Label className="py-2" htmlFor="tipoRamal">Tipo de Ramal</Label>
        <Select value={formData.tipoRamal} onValueChange={(value) => {
          updateFormData("tipoRamal", value);
          // Encontra o nome do tipo de ramal selecionado e armazena
          const tipoRamalSelecionado = tipoRamal.find(t => t.sigla === value);
          if (tipoRamalSelecionado) {
            updateFormData("tpoRmlInfo", tipoRamalSelecionado.nome);
          }
        }}>
          <SelectTrigger id="tipoRamal" className={errors.tipoRamal ? " border-destructive min-w-full" : "w-full"}>
            <SelectValue placeholder="Ramal" />
          </SelectTrigger>
          <SelectContent>
            {tensaoRede.map((tensao) => (
              <SelectItem key={tensao.id} value={tensao.sigla}>{tensao.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tipoRamal && <p className="text-sm text-destructive">{errors.tipoRamal}</p>}
        <Input type="hidden" id="tpoRmlInfo" value={formData.tpoRmlInfo || ""} />
      </div>

            <div className="col-span-6 md:col-span-3">
      <Label className="py-2" htmlFor="ramoAtividade">Ramo de atividade</Label>
        <Select value={formData.ramoAtividade} onValueChange={(value) => {
          updateFormData("ramoAtividade", value);
          // Encontra o nome do ramo de atividade selecionado e armazena
          const ramoAtividadeSelecionado = ramoAtividade.find(r => r.sigla === value);
          if (ramoAtividadeSelecionado) {
            updateFormData("rmoAtiInfo", ramoAtividadeSelecionado.nome);
          }
        }}>
          <SelectTrigger id="ramoAtividade" className={errors.ramoAtividade ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Atividade" />
          </SelectTrigger>
          <SelectContent>
            {tensaoRede.map((tensao) => (
              <SelectItem key={tensao.id} value={tensao.sigla}>{tensao.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.ramoAtividade && <p className="text-sm text-destructive">{errors.ramoAtividade}</p>}
        <Input type="hidden" id="rmoAtiInfo" value={formData.rmoAtiInfo || ""} />
      </div>

            <div className="col-span-6 md:col-span-5">
      <Label className="py-2" htmlFor="enquadramentoGeracao">Enquadramento da geração</Label>
        <Select value={formData.enquadramentoGeracao} onValueChange={(value) => {
          updateFormData("enquadramentoGeracao", value);
          // Encontra o nome do enquadramento de geração selecionado e armazena
          const enquadramentoGeracaoSelecionado = enquadramentoGeracao.find(e => e.sigla === value);
          if (enquadramentoGeracaoSelecionado) {
            updateFormData("enqGerInfo", enquadramentoGeracaoSelecionado.nome);
          }
        }}>
          <SelectTrigger id="enquadramentoGeracao" className={errors.enquadramentoGeracao ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Escolha o enquadramento da geração" />
          </SelectTrigger>
          <SelectContent>
            {tensaoRede.map((tensao) => (
              <SelectItem key={tensao.id} value={tensao.sigla}>{tensao.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.enquadramentoGeracao && <p className="text-sm text-destructive">{errors.enquadramentoGeracao}</p>}
        <Input type="hidden" id="enqGerInfo" value={formData.enqGerInfo || ""} />
      </div>

            <div className="col-span-6 md:col-span-4">
      <Label className="py-2" htmlFor="tipoGeracao">Tipo de Geração</Label>
        <Select value={formData.tipoGeracao} onValueChange={(value) => {
          updateFormData("tipoGeracao", value);
          // Encontra o nome do tipo de geração selecionado e armazena
          const tipoGeracaoSelecionado = tipoGeracao.find(t => t.sigla === value);
          if (tipoGeracaoSelecionado) {
            updateFormData("tpoGerInfo", tipoGeracaoSelecionado.nome);
          }
        }}>
          <SelectTrigger id="tipoGeracao" className={errors.tipoGeracao ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Escolha o tipo de geração" />
          </SelectTrigger>
          <SelectContent>
            {tensaoRede.map((tensao) => (
              <SelectItem key={tensao.id} value={tensao.sigla}>{tensao.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tipoGeracao && <p className="text-sm text-destructive">{errors.tipoGeracao}</p>}
        <Input type="hidden" id="tpoGerInfo" value={formData.tpoGerInfo || ""} />
      </div>

      <div className="col-span-6 md:col-span-3">
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

      <div className="col-span-6 md:col-span-3">
        <Label className="py-2" htmlFor="rgCnh">Longitude UTM</Label>
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

      <div className="col-span-6 md:col-span-3">
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
