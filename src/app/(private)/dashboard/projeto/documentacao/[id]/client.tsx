'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Upload, BarChart3, Loader2, FileCheck, Sparkles} from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"
import { AnexosGallery } from "@/components/dashboard/projeto/anexos-gallery"
import { calcularGeracaoAnual, parametrizar, calcularCorrenteCorrigida, type TipoLigacao, type ResultadoParametrizacao } from "@/lib/utils"
import { toast } from "sonner"
import axios from 'axios'

interface DocumentacaoPageClientProps {
  projeto: any
  inversor: any
}

export function DocumentacaoPageClient({ projeto, inversor }: DocumentacaoPageClientProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [hasAnexos, setHasAnexos] = useState(false)
  const [isLoadingTransition, setIsLoadingTransition] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [isGeneratingHsp, setIsGeneratingHsp] = useState(false)
  const [isSavingGeracao, setIsSavingGeracao] = useState(false)
  const [resultadoParametrizacao, setResultadoParametrizacao] = useState<ResultadoParametrizacao | null>(null)
  
  // Estados para os valores HSP mensais
  const [hspValues, setHspValues] = useState({
    jan: projeto.jan || '',
    fev: projeto.fev || '',
    mar: projeto.mar || '',
    abr: projeto.abr || '',
    mai: projeto.mai || '',
    jun: projeto.jun || '',
    jul: projeto.jul || '',
    ago: projeto.ago || '',
    set: projeto.set || '',
    out: projeto.out || '',
    nov: projeto.nov || '',
    dez: projeto.dez || ''
  })
  
  // Estados para os valores de geração mensal (em kWh)
  const [geracaoValues, setGeracaoValues] = useState({
    jan: projeto.jan ? projeto.jan.toString() : '',
    fev: projeto.fev ? projeto.fev.toString() : '',
    mar: projeto.mar ? projeto.mar.toString() : '',
    abr: projeto.abr ? projeto.abr.toString() : '',
    mai: projeto.mai ? projeto.mai.toString() : '',
    jun: projeto.jun ? projeto.jun.toString() : '',
    jul: projeto.jul ? projeto.jul.toString() : '',
    ago: projeto.ago ? projeto.ago.toString() : '',
    set: projeto.set ? projeto.set.toString() : '',
    out: projeto.out ? projeto.out.toString() : '',
    nov: projeto.nov ? projeto.nov.toString() : '',
    dez: projeto.dez ? projeto.dez.toString() : ''
  })
  
  // Verificar se há dados de geração salvos no banco
  const hasGeracaoData = () => {
    return Object.values(geracaoValues).some(value => value !== '' && parseFloat(value) > 0)
  }
  
  // Verificar se já existem anexos ao carregar o componente
  useEffect(() => {
    const checkExistingAnexos = async () => {
      try {
        const response = await fetch(`/api/projeto/anexos?projetoId=${projeto.id}`)
        const data = await response.json()
        if (data.success && data.anexos.length > 0) {
          setHasAnexos(true)
        }
      } catch (error) {
        console.error('Erro ao verificar anexos existentes:', error)
      }
    }
    
    checkExistingAnexos()
  }, [projeto.id])
  
  // Verificar se já existem dados de parametrização salvos no banco
  useEffect(() => {
    const checkExistingParametrizacao = () => {
      if (projeto.disjuntorPadrao && projeto.sessaoCondutor && projeto.numFases && inversor) {
        // Reconstruir o resultado da parametrização com os dados salvos
        const tipoLigacao = inversor.tipoLigacao?.toLowerCase() as TipoLigacao
        const tipoDisjuntor = projeto.numFases === 1 ? 'Monopolar' : 'Tripolar'
        const fases = projeto.numFases === 1 ? '1 fase + 1 neutro' : '3 fases + 1 neutro'
        
        const resultadoSalvo: ResultadoParametrizacao = {
          disjuntor: {
            corrente: projeto.disjuntorPadrao,
            tipo: tipoDisjuntor
          },
          condutor: {
            secao: projeto.sessaoCondutor,
            fases: fases
          }
        }
        
        setResultadoParametrizacao(resultadoSalvo)
      }
    }
    
    checkExistingParametrizacao()
  }, [projeto, inversor])
  
  const handleSaveSuccess = () => {
    // Incrementar o trigger para forçar atualização do AnexosGallery
    setRefreshTrigger(prev => prev + 1)
    
    // Iniciar loading de transição
    setIsLoadingTransition(true)
    
    // Após 2,5 segundos, marcar que há anexos (desabilitar upload)
    setTimeout(() => {
      setHasAnexos(true)
      setIsLoadingTransition(false)
    }, 2500)
  }
  
  const handleAnexoDeleted = () => {
    // Callback para quando um anexo é deletado
    // Verificar se ainda há anexos após um delay para coordenar com a animação
    setTimeout(async () => {
      try {
        const response = await fetch(`/api/projeto/anexos?projetoId=${projeto.id}`)
        const data = await response.json()
        if (data.success && data.anexos.length === 0) {
          // Iniciar loading de transição
          setIsLoadingTransition(true)
          
          // Após 2,5 segundos, reabilitar o upload
          setTimeout(() => {
            setHasAnexos(false)
            setIsLoadingTransition(false)
          }, 2500)
        }
      } catch (error) {
        console.error('Erro ao verificar anexos após exclusão:', error)
      }
    }, 800) // Delay aumentado para coordenar com a animação de exclusão
  }

  const handleGenerateAcessoPdf = async () => {
    try {
      setIsGeneratingPdf(true)
      
      const response = await fetch('/api/projeto/acesso/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projetoId: projeto.numProjeto })
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      
      // Limpar a URL após um tempo para liberar memória
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleGenerateHspData = async () => {
    try {
      setIsGeneratingHsp(true)
      
      const response = await axios.post('/api/projeto/nasa-power', {
        projetoId: projeto.id
      })

      if (response.data.success) {
        const hspData = response.data.data
        const newHspValues = {
          jan: hspData.jan || '',
          fev: hspData.fev || '',
          mar: hspData.mar || '',
          abr: hspData.abr || '',
          mai: hspData.mai || '',
          jun: hspData.jun || '',
          jul: hspData.jul || '',
          ago: hspData.ago || '',
          set: hspData.set || '',
          out: hspData.out || '',
          nov: hspData.nov || '',
          dez: hspData.dez || ''
        }
        
        setHspValues(newHspValues)
        
        // Calcular geração mensal usando a potência do gerador
        const potenciaGerador = Number(projeto.potenciaGerador) // Potência em Watts
        const hspArray = [
          parseFloat(newHspValues.jan) || 0,
          parseFloat(newHspValues.fev) || 0,
          parseFloat(newHspValues.mar) || 0,
          parseFloat(newHspValues.abr) || 0,
          parseFloat(newHspValues.mai) || 0,
          parseFloat(newHspValues.jun) || 0,
          parseFloat(newHspValues.jul) || 0,
          parseFloat(newHspValues.ago) || 0,
          parseFloat(newHspValues.set) || 0,
          parseFloat(newHspValues.out) || 0,
          parseFloat(newHspValues.nov) || 0,
          parseFloat(newHspValues.dez) || 0
        ]
        
        const geracaoArray = calcularGeracaoAnual(hspArray, potenciaGerador)
        
        setGeracaoValues({
          jan: geracaoArray[0].toString(),
          fev: geracaoArray[1].toString(),
          mar: geracaoArray[2].toString(),
          abr: geracaoArray[3].toString(),
          mai: geracaoArray[4].toString(),
          jun: geracaoArray[5].toString(),
          jul: geracaoArray[6].toString(),
          ago: geracaoArray[7].toString(),
          set: geracaoArray[8].toString(),
          out: geracaoArray[9].toString(),
          nov: geracaoArray[10].toString(),
          dez: geracaoArray[11].toString()
        })
        
        toast.success('Cálculo de geração concluído!', {
          description: `Dados calculados para coordenadas: ${response.data.coordinates.latitude}, ${response.data.coordinates.longitude}`,
          duration: 4000
        })
      } else {
        throw new Error(response.data.error || 'Erro ao gerar dados HSP')
      }
      
    } catch (error: any) {
      console.error('Erro ao gerar dados HSP:', error)
      alert(`Erro ao gerar dados HSP: ${error.response?.data?.error || error.message}`)
    } finally {
      setIsGeneratingHsp(false)
    }
  }

  const handleSaveGeracaoData = async () => {
    try {
      setIsSavingGeracao(true)
      
      const response = await axios.put(`/api/projeto/${projeto.id}`, {
        jan: parseFloat(geracaoValues.jan) || null,
        fev: parseFloat(geracaoValues.fev) || null,
        mar: parseFloat(geracaoValues.mar) || null,
        abr: parseFloat(geracaoValues.abr) || null,
        mai: parseFloat(geracaoValues.mai) || null,
        jun: parseFloat(geracaoValues.jun) || null,
        jul: parseFloat(geracaoValues.jul) || null,
        ago: parseFloat(geracaoValues.ago) || null,
        set: parseFloat(geracaoValues.set) || null,
        out: parseFloat(geracaoValues.out) || null,
        nov: parseFloat(geracaoValues.nov) || null,
        dez: parseFloat(geracaoValues.dez) || null
      })

      if (response.data) {
        toast.success('Dados de geração salvos!', {
          description: 'Os dados de geração mensal foram salvos com sucesso no banco de dados.',
          duration: 4000
        })
      } else {
        throw new Error('Erro ao salvar dados de geração')
      }
      
    } catch (error: any) {
      console.error('Erro ao salvar dados de geração:', error)
      toast.error('Erro ao salvar dados', {
        description: error.response?.data?.error || 'Ocorreu um erro ao salvar os dados de geração.',
        duration: 4000
      })
    } finally {
      setIsSavingGeracao(false)
    }
  }

  const handleParametrizar = async () => {
    // Toast de loading
    const loadingToast = toast.loading('Calculando parametrização...', {
      description: 'Processando dados do inversor e calculando componentes necessários.',
    })

    try {
      if (!inversor || !inversor.correnteNomSai || !inversor.tipoLigacao) {
        toast.dismiss(loadingToast)
        toast.error('Dados insuficientes', {
          description: 'Corrente nominal de saída e tipo de ligação são obrigatórios para parametrização.',
          duration: 4000
        })
        return
      }

      const correnteNominal = parseFloat(inversor.correnteNomSai)
      const tipoLigacao = inversor.tipoLigacao.toLowerCase() as TipoLigacao

      if (!['monofásico', 'trifásico'].includes(tipoLigacao)) {
        toast.dismiss(loadingToast)
        toast.error('Tipo de ligação inválido', {
          description: 'O tipo de ligação deve ser "monofásico" ou "trifásico".',
          duration: 4000
        })
        return
      }

      const resultado = parametrizar(correnteNominal, tipoLigacao)
      setResultadoParametrizacao(resultado)
      
      // Calcular número de fases e polos do disjuntor
      const numFases = tipoLigacao === 'monofásico' ? 1 : 3
      const numPoloDisjuntor = tipoLigacao === 'monofásico' ? 1 : 3
      
      // Verificar se já existem dados de parametrização
      const temParametrizacao = projeto.disjuntorPadrao || projeto.sessaoCondutor || projeto.numFases || projeto.numeroPoloDisjuntor
      const acao = temParametrizacao ? 'Atualizando' : 'Salvando'
      
      // Atualizar toast de loading
      toast.loading(`${acao} parametrização...`, {
        id: loadingToast,
        description: `${acao} dados calculados no banco de dados.`,
      })
      
      // Salvar/atualizar dados no banco de dados
      const response = await axios.put(`/api/projeto/${projeto.id}`, {
        disjuntorPadrao: resultado.disjuntor.corrente,
        sessaoCondutor: resultado.condutor.secao,
        numFases: numFases,
        numPoloDisjuntor: numPoloDisjuntor
      })
      
      // Verificar se a resposta foi bem-sucedida
      if (response.status === 200) {
        toast.success(`✅ Parametrização ${temParametrizacao ? 'atualizada' : 'salva'} com sucesso!`, {
          id: loadingToast,
          description: `Disjuntor: ${resultado.disjuntor.corrente}A ${resultado.disjuntor.tipo} | Condutor: ${resultado.condutor.secao}mm² (${resultado.condutor.fases}) | ${numFases} fase(s), ${numPoloDisjuntor} polo(s)`,
          duration: 6000
        })
      } else {
        throw new Error('Resposta inesperada do servidor')
      }
      
    } catch (error: any) {
      console.error('Erro na parametrização:', error)
      
      // Verificar se é erro de salvamento ou cálculo
      if (error.response) {
        toast.error('⚠️ Erro ao salvar parametrização', {
          id: loadingToast,
          description: `Cálculo realizado com sucesso, mas houve erro ao salvar: ${error.response?.data?.error || error.message || 'Erro desconhecido'}`,
          duration: 6000
        })
      } else {
        toast.error('❌ Falha na parametrização', {
          id: loadingToast,
          description: `Erro durante o processo: ${error.message || 'Ocorreu um erro inesperado durante a parametrização.'}`,
          duration: 5000
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentação para Homologação</h1>
          <p className="text-muted-foreground">
            Gere e baixe a documentação necessária para homologação do projeto
          </p>
        </div>
      </div>

      {/* Card de Informações do Projeto - 12 colunas */}
      <div className="mb-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {projeto.numProjeto}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{projeto.cliente.nome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium">{projeto.cliente.cidade} - {projeto.cliente.uf}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potência do Gerador</p>
                <p className="font-medium">{Number(projeto.potenciaGerador)} W</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potência do Inversor</p>
                <p className="font-medium">{Number(projeto.potenciaInversor)} W</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consumo</p>
                <p className="font-medium">{Number(projeto.consumo || 0)} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de Documentos - 12 colunas */}
      <div className="mb-6">
        <div className="h-full flex flex-col">
          <div className="space-y-3 flex-1">
            {/* Lista de documentos disponíveis */}
            <div className="grid grid-cols-1 md:grid-cols-10 gap-3">
              {/* Solicitação de acesso */}
              <div className="md:col-span-2 flex items-center justify-between p-3 border rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium">Solicitação de acesso</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleGenerateAcessoPdf}
                  disabled={isGeneratingPdf}
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-1" />
                    </>
                  )}
                </Button>
              </div>

              {/* Memorial Técnico */}
              <div className="md:col-span-2 flex items-center justify-between p-3 border rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium">Memorial Técnico</span>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </Button>
              </div>

              {/* Diagramas */}
              <div className="md:col-span-2 flex items-center justify-between p-3 border rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium">Diagramas e projetos</span>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </Button>
              </div>

              {/* Relatório de comissionamento */}
              <div className="md:col-span-2 flex items-center justify-between p-3 border rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-medium">Rel. de comission-amento</span>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </Button>
              </div>

              {/* Solicitação de vistoria */}
              <div className="md:col-span-2 flex items-center justify-between p-3 border rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-red-600" />
                  <span className="text-xs font-medium">Solicitação de vistoria</span>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card de Parametrização - 12 colunas */}
      <div className="mb-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Parametrização
            </CardTitle>
            <CardDescription>
              Configure os parâmetros do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inversor ? (
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                  <Card className="border border-gray-200 bg-gray-50 rounded-3xl p-3 h-64">
                    <div className="text-center h-full flex flex-col justify-between">
                       <div>
                         {/* Título */}
                         <h3 className="text-xl font-medium text-green-500">
                           Inversor
                         </h3>
                         
                         {/* Linha divisória */}
                         <hr className="border-gray-300 mx-2 my-2" />
                         
                         {/* Subtítulo */}
                         <p className="font-medium text-black">
                           corrente de saída
                         </p>
                       </div>
                       
                       {/* Valor principal */}
                       <div className="text-5xl font-light text-green-500">
                         {inversor.correnteNomSai}<span className="text-3xl">A</span>
                       </div>
                       
                       {/* Informações adicionais */}
                       <div className="text-sm font-medium text-black">
                         {inversor.modelo} <br/> {inversor.tensaoNomSai} V | {inversor.potenciaNomSai} kWp
                       </div>
                     </div>
                  </Card>
                </div>
                
                <div className="col-span-3">
                   <Card className="border border-gray-200 bg-gray-50 rounded-3xl p-3 h-64">
                     <div className="text-center h-full flex flex-col justify-between">
                       <div>
                         {/* Título */}
                         <h3 className="text-xl font-medium text-orange-500">
                           Ligação
                         </h3>
                         
                         {/* Linha divisória */}
                         <hr className="border-gray-300 mx-2 my-2" />
                         
                         {/* Subtítulo */}
                         <p className="font-medium text-black">
                           Tipo de ligação
                         </p>
                       </div>
                       
                       {/* Valor principal */}
                       <div className="text-2xl font-medium text-orange-500">
                         {inversor.tipoLigacao || 'Não informado'}
                       </div>
                       
                       {/* Botão Parametrizar */}
                       <div className="flex justify-center">
                         <Button 
                           variant="outline" 
                           size="sm" 
                           className="text-orange-500 border-orange-500 hover:bg-orange-50 flex items-center gap-2"
                           onClick={handleParametrizar}
                         >
                           <Sparkles className="h-4 w-4" />
                           Parametrizar
                         </Button>
                       </div>
                     </div>
                   </Card>
                 </div>
                
                <div className="col-span-6">
                  {resultadoParametrizacao ? (
                    <div className="grid grid-cols-2 gap-6">
                      {/* Card do Disjuntor */}
                       <Card className="border border-gray-200 bg-gray-50 rounded-3xl p-3 h-64">
                         <div className="text-center h-full flex flex-col justify-between">
                          <div>
                            {/* Título */}
                             <h3 className="text-xl font-medium text-black">
                               Disjuntor
                             </h3>
                            
                            {/* Linha divisória */}
                            <hr className="border-gray-300 mx-2 my-2" />
                            
                            {/* Subtítulo */}
                            <p className="font-medium text-black">
                              Corrente nominal
                            </p>
                          </div>
                          
                          {/* Valor principal */}
                           <div className="text-5xl font-light text-black">
                             {resultadoParametrizacao.disjuntor.corrente}<span className="text-3xl">A</span>
                           </div>
                          
                          {/* Informações adicionais */}
                          <div className="text-sm font-medium text-black">
                            {resultadoParametrizacao.disjuntor.tipo}
                            <div>
                            <span>Padrão de entrada</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                      
                      {/* Card do Condutor */}
                       <Card className="border border-gray-200 bg-gray-50 rounded-3xl p-3 h-64">
                          <div className="text-center h-full flex flex-col justify-between">
                           <div>
                             {/* Título */}
                              <h3 className="text-xl font-medium text-red-500">
                                Condutor
                              </h3>
                             
                             {/* Linha divisória */}
                             <hr className="border-gray-300 mx-2 my-2" />
                             
                             {/* Subtítulo */}
                             <p className="font-medium text-black">
                               Seção do fio
                             </p>
                           </div>
                           
                           {/* Valor principal */}
                            <div className="text-5xl font-light text-red-500">
                              {resultadoParametrizacao.condutor.secao}<span className="text-2xl">mm²</span>
                            </div>
                           
                           {/* Informações adicionais */}
                           <div className="text-sm font-medium text-black space-y-1">
                             <div>{resultadoParametrizacao.condutor.fases}</div>
                             {/* Corrente corrigida */}
                              <div className="text-red-500">
                                <span>
                                {(() => {
                                  const correnteNominal = parseFloat(inversor.correnteNomSai)
                                  const tipoLigacao = inversor.tipoLigacao.toLowerCase() as TipoLigacao
                                  const correnteCorrigida = calcularCorrenteCorrigida(correnteNominal, tipoLigacao)
                                  return `${correnteCorrigida.toFixed(2)} C. corrigida`
                                })()} 
                                </span>
                              </div>
                           </div>
                         </div>
                       </Card>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-muted-foreground h-full">
                      <p>Clique em "Parametrizar" para calcular disjuntor e condutor</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum inversor encontrado para este projeto</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid com Card de Upload/Anexos (6 colunas) e Card de Geração Estimada (6 colunas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Card de Upload e Anexos - 6 colunas */}
        <div className="lg:col-span-6">
          <Card className={`h-full flex flex-col transition-all duration-300 ${
            hasAnexos 
              ? 'opacity-60 bg-gray-50/50' 
              : 'opacity-100'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className={`h-5 w-5 ${
                  hasAnexos ? 'text-gray-400' : ''
                }`} />
                Upload de Anexos
                {hasAnexos && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-2">
                    Desabilitado
                  </span>
                )}
              </CardTitle>
              <CardDescription className={hasAnexos ? 'text-gray-400' : ''}>
                {hasAnexos 
                  ? 'Upload desabilitado - anexos já foram enviados' 
                  : 'Faça upload de imagens e documentos'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <FileUpload 
                maxFiles={10} 
                projetoId={projeto.id} 
                onSaveSuccess={handleSaveSuccess}
                disabled={hasAnexos}
              />
              {/* Galeria de Anexos integrada */}
              <div className="mt-4">
                <AnexosGallery 
                  projetoId={projeto.id} 
                  refreshTrigger={refreshTrigger}
                  onAnexoDeleted={handleAnexoDeleted}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card de Geração Estimada - 6 colunas */}
        <div className="lg:col-span-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Geração estimada
              </CardTitle>
              <CardDescription>
                Calcule a geração estimada do sistema mês a mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    <span className="font-semibold">Geração Anual:</span> {(
                      parseFloat(geracaoValues.jan || '0') +
                      parseFloat(geracaoValues.fev || '0') +
                      parseFloat(geracaoValues.mar || '0') +
                      parseFloat(geracaoValues.abr || '0') +
                      parseFloat(geracaoValues.mai || '0') +
                      parseFloat(geracaoValues.jun || '0') +
                      parseFloat(geracaoValues.jul || '0') +
                      parseFloat(geracaoValues.ago || '0') +
                      parseFloat(geracaoValues.set || '0') +
                      parseFloat(geracaoValues.out || '0') +
                      parseFloat(geracaoValues.nov || '0') +
                      parseFloat(geracaoValues.dez || '0')
                    ).toFixed(2)} kWh
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    <span className="font-semibold">Consumo Anual:</span> {(Number(projeto.consumo || 0) * 12).toFixed(2)} kWh
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="janeiro-geracao" className="text-sm font-medium">Janeiro</Label>
                    <Input 
                      id="janeiro-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.jan}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, jan: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fevereiro-geracao" className="text-sm font-medium">Fevereiro</Label>
                    <Input 
                      id="fevereiro-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.fev}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, fev: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marco-geracao" className="text-sm font-medium">Março</Label>
                    <Input 
                      id="marco-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.mar}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, mar: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abril-geracao" className="text-sm font-medium">Abril</Label>
                    <Input 
                      id="abril-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.abr}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, abr: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maio-geracao" className="text-sm font-medium">Maio</Label>
                    <Input 
                      id="maio-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.mai}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, mai: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="junho-geracao" className="text-sm font-medium">Junho</Label>
                    <Input 
                      id="junho-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.jun}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, jun: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="julho-geracao" className="text-sm font-medium">Julho</Label>
                    <Input 
                      id="julho-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.jul}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, jul: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agosto-geracao" className="text-sm font-medium">Agosto</Label>
                    <Input 
                      id="agosto-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.ago}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, ago: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setembro-geracao" className="text-sm font-medium">Setembro</Label>
                    <Input 
                      id="setembro-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.set}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, set: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outubro-geracao" className="text-sm font-medium">Outubro</Label>
                    <Input 
                      id="outubro-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.out}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, out: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="novembro-geracao" className="text-sm font-medium">Novembro</Label>
                    <Input 
                      id="novembro-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.nov}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, nov: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dezembro-geracao" className="text-sm font-medium">Dezembro</Label>
                    <Input 
                      id="dezembro-geracao" 
                      type="number" 
                      placeholder="Geração (kWh)" 
                      step="0.01"
                      value={geracaoValues.dez}
                      onChange={(e) => setGeracaoValues(prev => ({ ...prev, dez: e.target.value }))}
                      className="h-10 bg-gray-50" 
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateHspData}
                    disabled={isGeneratingHsp}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {isGeneratingHsp ? 'Calculando...' : 'Calcular Geração'}
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-black hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSaveGeracaoData}
                    disabled={!hasGeracaoData() || isSavingGeracao}
                  >
                    {isSavingGeracao ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading Overlay durante transições */}
      {isLoadingTransition && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="text-lg font-medium text-gray-700">Processando...</p>
            <p className="text-sm text-gray-500">Aguarde enquanto atualizamos a interface</p>
          </div>
        </div>
      )}


    </div>
  )
}