"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/lib/schema/projeto"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GalleryThumbnails, House, HousePlug, PlusCircle, Table, Trash2 } from "lucide-react"
import { useState } from "react"

interface PersonalInfoStepProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  errors: Record<string, string>
}

interface Inversor {
  id: number
  fabricante: string
  modelo: string
  quantidade: string
}

export default function PersonalInfoStep({ formData, updateFormData, errors }: PersonalInfoStepProps) {
  const [inversoresAdicionais, setInversoresAdicionais] = useState<Inversor[]>([])
  
  // Constante para definir o número máximo de inversores adicionais
  const MAX_INVERSORES = 3

  const fabricanteMod = [
    { id: 1, nome: "Intelbras" },
  ]

  const fabricanteInv = [
    { id: 1, nome: "Intelbras" },
  ]
 
  const modulos = [
    { id: 1, fabricanteModId: 1, modelo: "Modulo 550Wp", potencia: 550  },
    { id: 2, fabricanteModId:1, modelo: "Modulo 555Wp", potencia: 555  },
  ]

  const inversores = [
    { id: 1, fabricanteInvId: 1, modelo: "IONS 3000Wp", potencia: 3000  },
    { id: 2, fabricanteInvId:1, modelo: "IONS 5000Wp", potencia:5000 },
  ]
  
  // Função para adicionar um novo conjunto de campos de inversor
  const adicionarInversor = () => {
    // Verifica se já atingiu o limite máximo de inversores
    if (inversoresAdicionais.length >= MAX_INVERSORES) {
      return
    }
    
    const novoId = inversoresAdicionais.length > 0 
      ? Math.max(...inversoresAdicionais.map(inv => inv.id)) + 1 
      : 1
    
    setInversoresAdicionais([...inversoresAdicionais, {
      id: novoId,
      fabricante: "",
      modelo: "",
      quantidade: ""
    }])
  }
  
  // Função para remover um inversor adicional
  const removerInversor = (id: number) => {
    setInversoresAdicionais(inversoresAdicionais.filter(inv => inv.id !== id))
  }
  
  // Função para atualizar os dados de um inversor adicional
  const atualizarInversor = (id: number, campo: string, valor: string) => {
    setInversoresAdicionais(inversoresAdicionais.map(inv => 
      inv.id === id ? { ...inv, [campo]: valor } : inv
    ))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 space-y-4 w-scren">
      <div className="grid grid-cols-12 col-span-12 gap-4 border-l-2  p-4 border-green-500">
      <div className="col-span-6 md:col-span-4
      ">
      <Label className="py-2" htmlFor="fabricanteMod">
      <Table className="h-4 w-4" />
        Fabricante do módulo</Label>
        <Select value={formData.fabricanteMod} onValueChange={(value) => {
          updateFormData("fabricanteMod", value);
          // Encontra o nome do fabricante selecionado e armazena
          const fabricanteModSelecionado = fabricanteMod.find(f => f.id.toString() === value);
          if (fabricanteModSelecionado) {
            updateFormData("fbcModInfo", fabricanteModSelecionado.nome);
          }
        }}>
          <SelectTrigger id="fabricanteMod" className={errors.fabricanteMod ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Escolha a Fabricante do módulo" />
          </SelectTrigger>
          <SelectContent>
            {fabricanteMod.map((mod) => (
              <SelectItem key={mod.id} value={mod.id.toString()}>{mod.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.fabricanteMod && <p className="text-sm text-destructive">{errors.fabricanteMod}</p>}
        <Input type="hidden" id="fbcModInfo" value={formData.fbcModInfo || ""}/>
      </div>
      
      <div className="col-span-6 md:col-span-5
      ">
      <Label className="py-2" htmlFor="potenciaMod">Modelo / Potência (Wp) </Label>
        <Select value={formData.potenciaMod} onValueChange={(value) => {
          updateFormData("potenciaMod", value);
          // Encontra o nome do módulo selecionado e armazena
          const moduloSelecionado = modulos.find(m => m.potencia.toString() === value);
          if (moduloSelecionado) {
            updateFormData("ptcModInfo", moduloSelecionado.modelo);
          }
        }}>
          <SelectTrigger id="potenciaMod" className={errors.potenciaMod ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Escolha a Fabricante do módulo" />
          </SelectTrigger>
          <SelectContent>
            {modulos.map((modulo) => (
              <SelectItem key={modulo.id} value={modulo.potencia.toString()}>{modulo.modelo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.potenciaMod && <p className="text-sm text-destructive">{errors.potenciaMod}</p>}
        <Input type="hidden" id="ptcModInfo" value={formData.ptcModInfo || ""}/>
      </div> 
    
    <div className="col-span-6 md:col-span-2">
        <Label className="py-2" htmlFor="qtdMod">Quantidade</Label>
        <Input
          id="qtdMod"
          type="number"
          min="1"
          value={formData.qtdMod}
          onChange={(e) => updateFormData("qtdMod", e.target.value)}
          placeholder="Qtd"
          className={errors.qtdMod ? "border-destructive" : ""}
        />
        {errors.qtdMod && <p className="text-sm text-destructive">{errors.qtdMod}</p>}
      </div>
    </div>

    <div className="grid grid-cols-12 col-span-12 gap-4 border-l-2
     p-4 border-cyan-500">
      <div className="col-span-6 md:col-span-4">
        <Label className="py-2" htmlFor="fabricanteInv">
          <GalleryThumbnails className="h-4 w-4" />
          Fabricante do inversor
          </Label>
        <Select value={formData.fabricanteInv} onValueChange={(value) => {
          updateFormData("fabricanteInv", value);
          // Encontra o nome do fabricante selecionado e armazena
          const fabricanteInvSelecionado = fabricanteInv.find(f => f.id.toString() === value);
          if (fabricanteInvSelecionado) {
            updateFormData("fbcInvInfo", fabricanteInvSelecionado.nome);
          }
        }}>
          <SelectTrigger id="fabricanteInv" className={errors.fabricanteInv ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Escolha a Fabricante do inversor" />
          </SelectTrigger>
          <SelectContent>
            {fabricanteInv.map((inv) => (
              <SelectItem key={inv.id} value={inv.id.toString()}>{inv.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.fabricanteInv && <p className="text-sm text-destructive">{errors.fabricanteInv}</p>}
        <Input type="hidden" id="fbcInvInfo" value={formData.fbcInvInfo || ""}/>
      </div>

      <div className="col-span-6 md:col-span-5">
        <Label className="py-2" htmlFor="potenciaInv">Modelo / Potência (kWp)</Label>
        <Select value={formData.potenciaInv} onValueChange={(value) => {
          updateFormData("potenciaInv", value);
          // Encontra o nome do inversor selecionado e armazena
          const inversorSelecionado = inversores.find(i => i.potencia.toString() === value);
          if (inversorSelecionado) {
            updateFormData("ptcInvInfo", inversorSelecionado.modelo);
          }
        }}>
          <SelectTrigger id="potenciaInv" className={errors.potenciaInv ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Escolha o modelo do inversor" />
          </SelectTrigger>
          <SelectContent>
            {inversores.map((inversor) => (
              <SelectItem key={inversor.id} value={inversor.potencia.toString()}>{inversor.modelo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.potenciaInv && <p className="text-sm text-destructive">{errors.potenciaInv}</p>}
        <Input type="hidden" id="ptcInvInfo" value={formData.ptcInvInfo || ""}/>
      </div> 

      <div className="col-span-3 md:col-span-2">
        <Label className="py-2" htmlFor="qtdInv">Quantidade</Label>
        <div className="flex items-center gap-2">
          <Input
            id="qtdInv"
            type="number"
            min="0"
            value={formData.qtdInv}
            onChange={(e) => updateFormData("qtdInv", e.target.value)}
            placeholder="Qtd"
            className={errors.qtdInv ? "border-destructive" : ""}
          />
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-2 whitespace-nowrap" 
            onClick={adicionarInversor}
            disabled={inversoresAdicionais.length >= MAX_INVERSORES}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        {errors.qtdInv && <p className="text-sm text-destructive">{errors.qtdInv}</p>}
      </div>
      
      {/* Linha para Tensões de Entrada */}
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="tensaoMaxEnt">Tensão Máx. Entrada (V)</Label>
        <Input
          id="tensaoMaxEnt"
          type="number"
          step="any"
          value={formData.tensaoMaxEnt || ""}
          onChange={(e) => updateFormData("tensaoMaxEnt", e.target.value)}
          placeholder="Ex: 600"
          className={errors.tensaoMaxEnt ? "border-destructive" : ""}
        />
        {errors.tensaoMaxEnt && <p className="text-sm text-destructive">{errors.tensaoMaxEnt}</p>}
      </div>
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="tensaoInicializacao">Tensão Inicialização (V)</Label>
        <Input
          id="tensaoInicializacao"
          type="number"
          step="any"
          value={formData.tensaoInicializacao || ""}
          onChange={(e) => updateFormData("tensaoInicializacao", e.target.value)}
          placeholder="Ex: 100"
          className={errors.tensaoInicializacao ? "border-destructive" : ""}
        />
        {errors.tensaoInicializacao && <p className="text-sm text-destructive">{errors.tensaoInicializacao}</p>}
      </div>
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="tensaoNominalEnt">Tensão Nominal Entrada (V)</Label>
        <Input
          id="tensaoNominalEnt"
          type="number"
          step="any"
          value={formData.tensaoNominalEnt || ""}
          onChange={(e) => updateFormData("tensaoNominalEnt", e.target.value)}
          placeholder="Ex: 380"
          className={errors.tensaoNominalEnt ? "border-destructive" : ""}
        />
        {errors.tensaoNominalEnt && <p className="text-sm text-destructive">{errors.tensaoNominalEnt}</p>}
      </div>

      {/* Linha para Potência e Correntes de Entrada */}
      <div className="col-span-12 md:col-span-3">
        <Label className="py-2" htmlFor="numeroEntMPPT">Nº Entradas MPPT</Label>
        <Input
          id="numeroEntMPPT"
          type="number"
          min="1"
          value={formData.numeroEntMPPT || ""}
          onChange={(e) => updateFormData("numeroEntMPPT", e.target.value)}
          placeholder="Ex: 2"
          className={errors.numeroEntMPPT ? "border-destructive" : ""}
        />
        {errors.numeroEntMPPT && <p className="text-sm text-destructive">{errors.numeroEntMPPT}</p>}
      </div>
      <div className="col-span-12 md:col-span-3">
        <Label className="py-2" htmlFor="potenciaMaxMPPT">Potência Máx. MPPT (W)</Label>
        <Input
          id="potenciaMaxMPPT"
          type="number"
          step="any"
          value={formData.potenciaMaxMPPT || ""}
          onChange={(e) => updateFormData("potenciaMaxMPPT", e.target.value)}
          placeholder="Ex: 3500"
          className={errors.potenciaMaxMPPT ? "border-destructive" : ""}
        />
        {errors.potenciaMaxMPPT && <p className="text-sm text-destructive">{errors.potenciaMaxMPPT}</p>}
      </div>
      <div className="col-span-12 md:col-span-3">
        <Label className="py-2" htmlFor="correnteMaxEnt">Corrente Máx. Entrada (A)</Label>
        <Input
          id="correnteMaxEnt"
          type="number"
          step="any"
          value={formData.correnteMaxEnt || ""}
          onChange={(e) => updateFormData("correnteMaxEnt", e.target.value)}
          placeholder="Ex: 10"
          className={errors.correnteMaxEnt ? "border-destructive" : ""}
        />
        {errors.correnteMaxEnt && <p className="text-sm text-destructive">{errors.correnteMaxEnt}</p>}
      </div>
      <div className="col-span-12 md:col-span-3">
        <Label className="py-2" htmlFor="correnteMaxCurtCirc">Corrente Máx. Curto-Circuito (A)</Label>
        <Input
          id="correnteMaxCurtCirc"
          type="number"
          step="any"
          value={formData.correnteMaxCurtCirc || ""}
          onChange={(e) => updateFormData("correnteMaxCurtCirc", e.target.value)}
          placeholder="Ex: 15"
          className={errors.correnteMaxCurtCirc ? "border-destructive" : ""}
        />
        {errors.correnteMaxCurtCirc && <p className="text-sm text-destructive">{errors.correnteMaxCurtCirc}</p>}
      </div>

      {/* Linha para Correntes e Tensão de Saída */}
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="correnteNominalSai">Corrente Nominal Saída (A)</Label>
        <Input
          id="correnteNominalSai"
          type="number"
          step="any"
          value={formData.correnteNominalSai || ""}
          onChange={(e) => updateFormData("correnteNominalSai", e.target.value)}
          placeholder="Ex: 13.6"
          className={errors.correnteNominalSai ? "border-destructive" : ""}
        />
        {errors.correnteNominalSai && <p className="text-sm text-destructive">{errors.correnteNominalSai}</p>}
      </div>
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="correnteMaxSai">Corrente Máx. Saída (A)</Label>
        <Input
          id="correnteMaxSai"
          type="number"
          step="any"
          value={formData.correnteMaxSai || ""}
          onChange={(e) => updateFormData("correnteMaxSai", e.target.value)}
          placeholder="Ex: 15"
          className={errors.correnteMaxSai ? "border-destructive" : ""}
        />
        {errors.correnteMaxSai && <p className="text-sm text-destructive">{errors.correnteMaxSai}</p>}
      </div>
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="tensaoNominalSai">Tensão Nominal Saída (V)</Label>
        <Input
          id="tensaoNominalSai"
          type="number"
          step="any"
          value={formData.tensaoNominalSai || ""}
          onChange={(e) => updateFormData("tensaoNominalSai", e.target.value)}
          placeholder="Ex: 220"
          className={errors.tensaoNominalSai ? "border-destructive" : ""}
        />
        {errors.tensaoNominalSai && <p className="text-sm text-destructive">{errors.tensaoNominalSai}</p>}
      </div>

      {/* Linha para THD, Frequência e Fator de Potência */}
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="THD">THD (%)</Label>
        <Input
          id="THD"
          type="number"
          step="any"
          value={formData.THD || ""}
          onChange={(e) => updateFormData("THD", e.target.value)}
          placeholder="Ex: 3"
          className={errors.THD ? "border-destructive" : ""}
        />
        {errors.THD && <p className="text-sm text-destructive">{errors.THD}</p>}
      </div>
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="frequenciaNominal">Frequência Nominal (Hz)</Label>
        <Input
          id="frequenciaNominal"
          type="number"
          step="any"
          value={formData.frequenciaNominal || ""}
          onChange={(e) => updateFormData("frequenciaNominal", e.target.value)}
          placeholder="Ex: 60"
          className={errors.frequenciaNominal ? "border-destructive" : ""}
        />
        {errors.frequenciaNominal && <p className="text-sm text-destructive">{errors.frequenciaNominal}</p>}
      </div>
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="fatorPotencia">Fator de Potência</Label>
        <Input
          id="fatorPotencia"
          type="number"
          step="any"
          value={formData.fatorPotencia || ""}
          onChange={(e) => updateFormData("fatorPotencia", e.target.value)}
          placeholder="Ex: 0.99"
          className={errors.fatorPotencia ? "border-destructive" : ""}
        />
        {errors.fatorPotencia && <p className="text-sm text-destructive">{errors.fatorPotencia}</p>}
      </div>

      {/* Linha para Tensões de Saída e Eficiência */}
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="tensaoMaxsSai">Tensão Máx. Saída (V)</Label>
        <Input
          id="tensaoMaxsSai"
          type="number"
          step="any"
          value={formData.tensaoMaxsSai || ""}
          onChange={(e) => updateFormData("tensaoMaxsSai", e.target.value)}
          placeholder="Ex: 253"
          className={errors.tensaoMaxsSai ? "border-destructive" : ""}
        />
        {errors.tensaoMaxsSai && <p className="text-sm text-destructive">{errors.tensaoMaxsSai}</p>}
      </div>
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="tensaoMinSai">Tensão Mín. Saída (V)</Label>
        <Input
          id="tensaoMinSai"
          type="number"
          step="any"
          value={formData.tensaoMinSai || ""}
          onChange={(e) => updateFormData("tensaoMinSai", e.target.value)}
          placeholder="Ex: 180"
          className={errors.tensaoMinSai ? "border-destructive" : ""}
        />
        {errors.tensaoMinSai && <p className="text-sm text-destructive">{errors.tensaoMinSai}</p>}
      </div>
      <div className="col-span-12 md:col-span-4">
        <Label className="py-2" htmlFor="eficiencia">Eficiência (%)</Label>
        <Input
          id="eficiencia"
          type="number"
          step="any"
          value={formData.eficiencia || ""}
          onChange={(e) => updateFormData("eficiencia", e.target.value)}
          placeholder="Ex: 98.5"
          className={errors.eficiencia ? "border-destructive" : ""}
        />
        {errors.eficiencia && <p className="text-sm text-destructive">{errors.eficiencia}</p>}
      </div>

      {/* Inversores adicionais */}
      {inversoresAdicionais.map((inversor) => (
        <div key={inversor.id} className="col-span-12 grid grid-cols-12 gap-4 relative">
          <div className="absolute top-2 right-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive" 
              onClick={() => removerInversor(inversor.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="col-span-12 md:col-span-4">
            <Label className="py-2" htmlFor={`fabricanteInv${inversor.id}`}>
            <GalleryThumbnails className="h-4 w-4" />
              Fabricante do inversor</Label>
            <Select 
              value={inversor.fabricante} 
              onValueChange={(value) => {
                atualizarInversor(inversor.id, "fabricante", value);
                // Aqui não podemos usar updateFormData pois são inversores adicionais
                // que são gerenciados pelo estado local inversoresAdicionais
              }}
            >
              <SelectTrigger id={`fabricanteInv${inversor.id}`} className="w-full">
                <SelectValue placeholder="Escolha a Fabricante do inversor" />
              </SelectTrigger>
              <SelectContent>
                {fabricanteInv.map((inv) => (
                  <SelectItem key={inv.id} value={inv.id.toString()}>{inv.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 md:col-span-5">
            <Label className="py-2" htmlFor={`potenciaInv${inversor.id}`}>Modelo / Potência(kWp)</Label>
            <Select 
              value={inversor.modelo} 
              onValueChange={(value) => {
                atualizarInversor(inversor.id, "modelo", value);
                // Aqui não podemos usar updateFormData pois são inversores adicionais
                // que são gerenciados pelo estado local inversoresAdicionais
              }}
            >
              <SelectTrigger id={`potenciaInv${inversor.id}`} className="w-full">
                <SelectValue placeholder="Escolha o modelo / potência" />
              </SelectTrigger>
              <SelectContent>
                {inversores.map((inv) => (
                  <SelectItem key={inv.id} value={inv.potencia.toString()}>{inv.modelo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 md:col-span-2">
            <Label className="py-2" htmlFor={`qtdInv${inversor.id}`}>Quantidade</Label>
            <Input
              id={`qtdInv${inversor.id}`}
              type="number"
              min="0"
              value={inversor.quantidade}
              onChange={(e) => atualizarInversor(inversor.id, "quantidade", e.target.value)}
              placeholder="Qtd"
            />
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-12 col-span-12 gap-4 border-l-2  p-4 border-indigo-500">
      <div className="col-span-6 md:col-span-5
      ">
      <Label className="py-2" htmlFor="modeloStrCC">
        <HousePlug className="h-4 w-4" />
        String box C.C - descrição do modelo / tipo </Label>
        <Select value={formData.modeloStrCC} onValueChange={(value) => {
          updateFormData("modeloStrCC", value);
          // Encontra o nome do modelo selecionado e armazena
          const modeloStrCCSelecionado = modulos.find(m => m.potencia.toString() === value);
          if (modeloStrCCSelecionado) {
            updateFormData("mdlStrCCInfo", modeloStrCCSelecionado.modelo);
          }
        }}>
          <SelectTrigger id="modeloStrCC" className={errors.modeloStrCC ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Escolha a Fabricante a string box" />
          </SelectTrigger>
          <SelectContent>
            {modulos.map((modulo) => (
              <SelectItem key={modulo.id} value={modulo.potencia.toString()}>{modulo.modelo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.modeloStrCC && <p className="text-sm text-destructive">{errors.modeloStrCC}</p>}
        <Input type="hidden" id="mdlStrCCInfo" value={formData.mdlStrCCInfo || ""}/>
      </div> 
    
    <div className="col-span-6 md:col-span-2">
        <Label className="py-2" htmlFor="qtdStrCC">Quantidade</Label>
        <Input
          id="qtdStrCC"
          type="number"
          min="1"
          value={formData.qtdStrCC}
          onChange={(e) => updateFormData("qtdStrCC", e.target.value)}
          placeholder="Qtd"
          className={errors.qtdStrCC ? "border-destructive" : ""}
        />
        {errors.qtdStrCC && <p className="text-sm text-destructive">{errors.qtdStrCC}</p>}
      </div>
    </div>


    <div className="grid grid-cols-12 col-span-12 gap-4 border-l-2  p-4 border-orange-500">
      <div className="col-span-6 md:col-span-5
      ">
      <Label className="py-2" htmlFor="modeloStrCA">
        <HousePlug className="h-4 w-4" />
        String box C.A - descrição do modelo / tipo </Label>
        <Select value={formData.modeloStrCA} onValueChange={(value) => {
          updateFormData("modeloStrCA", value);
          // Encontra o nome do modelo selecionado e armazena
          const modeloStrCASelecionado = modulos.find(m => m.potencia.toString() === value);
          if (modeloStrCASelecionado) {
            updateFormData("mdlStrCAInfo", modeloStrCASelecionado.modelo);
          }
        }}>
          <SelectTrigger id="modeloStrCA" className={errors.modeloStrCA ? " border-destructive w-full" : "w-full"}>
            <SelectValue placeholder="Escolha a Fabricante a string box" />
          </SelectTrigger>
          <SelectContent>
            {modulos.map((modulo) => (
              <SelectItem key={modulo.id} value={modulo.potencia.toString()}>{modulo.modelo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.modeloStrCA && <p className="text-sm text-destructive">{errors.modeloStrCA}</p>}
        <Input type="hidden" id="mdlStrCAInfo" value={formData.mdlStrCAInfo || ""}/>
      </div> 
    
    <div className="col-span-6 md:col-span-2">
        <Label className="py-2" htmlFor="qtdStrCC">Quantidade</Label>
        <Input
          id="qtdStrCA"
          type="number"
          min="1"
          value={formData.qtdStrCA}
          onChange={(e) => updateFormData("qtdStrCA", e.target.value)}
          placeholder="Qtd"
          className={errors.qtdStrCA ? "border-destructive" : ""}
        />
        {errors.qtdStrCA && <p className="text-sm text-destructive">{errors.qtdStrCA}</p>}
      </div>
    </div>
    </div>
  )
}
