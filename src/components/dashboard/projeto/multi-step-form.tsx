"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ClientInfoStep from "@/components/dashboard/projeto/steps/cliente-form-step"
import AcessoInfoStep from "@/components/dashboard/projeto/steps/acesso-form-step"
import EquipamentoInfoStep from "@/components/dashboard/projeto/steps/kit-form-step"
import TecnicoInfoStep from "@/components/dashboard/projeto/steps/tecnico-form-step"
import ReviewStep from "@/components/dashboard/projeto/steps/review-step"
import SucessoStep from "@/components/dashboard/projeto/steps/sucesso-step"
import StepIndicator from "@/components/dashboard/projeto/step-indicator"
import {
  formSchema,
  clienteSchema,
  acessoSchema,
  tecnicoSchema,
  type FormData,
} from "@/lib/schema/projetoSchema"
import {  z } from "zod"
import { User, KeyRound, GalleryThumbnails, HardHat, ClipboardCheck } from "lucide-react"
import { toast } from "sonner"
import { showCelebrationToast } from "@/components/ui/success-toast"

/**
 * @fileoverview Componente de formulário multi-etapas para cadastro de projetos
 * Este arquivo implementa um formulário de várias etapas com validação usando Zod
 * para guiar o usuário através do processo de cadastro de um novo projeto.
 */

/**
 * Dados iniciais do formulário
 * @type {FormData} Objeto contendo todos os campos do formulário inicializados como strings vazias
 */
const initialFormData: FormData = {
  // Cliente Schema fields
  nome: "",
  rgCnh: "",
  rgCnhDataEmissao: "",
  cpf: "",
  fone: "",
  email: "",
  numProjetoC: "",
  rua: "",
  complemento: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "",
  cep: "",
  
  // Acesso Schema fields
  concessionaria: "",
  contractNumber: "",
  tensaoRede: "",
  subgrupoConexao: "",
  tipoConexao: "",
  tipoSolicitacao: "",
  tipoRamal: "",
  ramoAtividade: "",
  enquadramentoGeracao: "",
  tipoGeracao: "",
  alocacaoCredito: "",
  poste: "",
  latitudeUTM: "",
  longitudeUTM: "",
  
  // Tecnico Schema fields
  nomeT: "",
  registro: "",
  rgCnhT: "",
  cpfT: "",
  foneT: "",
  tipoProfissional: "",
  tpoPrfInfo: "",
  emailT: "",
  logradouroT: "",
  numeroT: "",
  complementoT: "",
  bairroT: "",
  cidadeT: "",
  ufT: "",
  cepT: "",
  
  // Array de equipamentos (opcional)
  equipamentosKit: []
}



/**
 * Array com os nomes das etapas do formulário
 * @type {string[]} Lista de etapas do formulário multi-etapas com ícones
 */
const steps = [
  "Cliente", 
  "Acesso", 
  "Equipamento", 
  "Técnico", 
  "Review"
]

/**
 * Ícones para cada etapa do formulário
 */
const stepIcons = {
  "Cliente": <User className="h-4 w-4 mr-2" />,
  "Acesso": <KeyRound className="h-4 w-4 mr-2" />,
  "Equipamento": <GalleryThumbnails className="h-4 w-4 mr-2" />,
  "Técnico": <HardHat className="h-4 w-4 mr-2" />,
  "Review": <ClipboardCheck className="h-4 w-4 mr-2" />
}

interface MultiStepFormProps {
  projetoId?: string // ID do projeto para carregar dados existentes
}

/**
 * Componente de formulário multi-etapas
 * 
 * @param {MultiStepFormProps} props - Props do componente
 * @returns {JSX.Element} Componente React que renderiza um formulário de várias etapas
 * com navegação, validação e submissão de dados
 */
export default function MultiStepForm({ projetoId }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  /**
   * Atualiza um campo específico no estado do formulário e limpa erros associados
   * 
   * @param {keyof FormData} fieldName - Nome do campo a ser atualizado
   * @param {string} value - Novo valor para o campo
   */
  const updateFormData = (fieldName: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))

    // Limpa o erro quando o campo é atualizado
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  /**
   * Verifica se a etapa atual é válida sem definir erros
   * 
   * @returns {boolean} Verdadeiro se a validação for bem-sucedida, falso caso contrário
   */
  const isCurrentStepValid = (): boolean => {
    let schema: z.ZodType<any>
    let dataToValidate: any = {}

    // Seleciona o schema apropriado com base na etapa atual
    switch (currentStep) {
      case 0:
        schema = clienteSchema
        dataToValidate = {
          numProjetoC: formData.numProjetoC,
          nome: formData.nome,
          rgCnh: formData.rgCnh,
          rgCnhDataEmissao: formData.rgCnhDataEmissao,
          cpf: formData.cpf,
          fone: formData.fone,
          email: formData.email,
          numero: formData.numero,
          rua: formData.rua,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
          cep: formData.cep,
        }
        break
      case 1:
        schema = acessoSchema
        dataToValidate = {
          concessionaria: formData.concessionaria,
          contractNumber: formData.contractNumber,
          tensaoRede: formData.tensaoRede,
          subgrupoConexao: formData.subgrupoConexao,
          tipoConexao: formData.tipoConexao,
          tipoSolicitacao: formData.tipoSolicitacao,
          tipoRamal: formData.tipoRamal,
          ramoAtividade: formData.ramoAtividade,
          enquadramentoGeracao: formData.enquadramentoGeracao,
          tipoGeracao: formData.tipoGeracao,
          alocacaoCredito: formData.alocacaoCredito,
          poste: formData.poste,
          longitudeUTM: formData.longitudeUTM,
          latitudeUTM: formData.latitudeUTM,
        }
        break
      case 2:
        // Validação customizada para equipamentos
        const equipamentos = formData.equipamentosKit || []
        const temInversor = equipamentos.some((eq: any) => eq.tipo === 'inversor' && eq.quantidade > 0)
        const temModulo = equipamentos.some((eq: any) => eq.tipo === 'modulo' && eq.quantidade > 0)
        const temProtecaoCA = equipamentos.some((eq: any) => eq.tipo === 'protecaoCA' && eq.quantidade > 0)
        
        // Validação das strings
        const inversores = equipamentos.filter((eq: any) => eq.tipo === 'inversor')
        const modulos = equipamentos.filter((eq: any) => eq.tipo === 'modulo')
        const totalMPPTs = inversores.reduce((total: number, inversor: any) => {
          return total + (inversor.mppt || 0) * inversor.quantidade
        }, 0)
        
        const stringsSelecionadas = modulos
          .filter((modulo: any) => modulo.stringSelecionada)
          .map((modulo: any) => parseInt(modulo.stringSelecionada.replace('String ', '')))
          .filter((str: number) => !isNaN(str))
        
        const todasStringsAtribuidas = totalMPPTs > 0 && stringsSelecionadas.length === totalMPPTs
        
        return temInversor && temModulo && temProtecaoCA && todasStringsAtribuidas
      case 3:
        schema = tecnicoSchema
        dataToValidate = {
          nomeT: formData.nomeT,
          registro: formData.registro,
          rgCnhT: formData.rgCnhT,
          cpfT: formData.cpfT, 
          foneT: formData.foneT,
          tipoProfissional: formData.tipoProfissional,
          emailT: formData.emailT,
          logradouroT: formData.logradouroT,
          numeroT: formData.numeroT,
          complementoT: formData.complementoT,
          bairroT: formData.bairroT,
          cidadeT: formData.cidadeT,
          ufT: formData.ufT,
          cepT: formData.cepT,
        }
        break
      default:
        return true
    }

    try {
      schema.parse(dataToValidate)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Valida os dados da etapa atual usando o schema Zod apropriado
   * 
   * @returns {boolean} Verdadeiro se a validação for bem-sucedida, falso caso contrário
   */
  const validateStep = (): boolean => {
    let schema: z.ZodType<any>
    let dataToValidate: any = {}

    // Seleciona o schema apropriado com base na etapa atual
    switch (currentStep) {
      case 0:
        schema = clienteSchema
        dataToValidate = {
          numProjetoC: formData.numProjetoC,
          nome: formData.nome,
          rgCnh: formData.rgCnh,
          rgCnhDataEmissao: formData.rgCnhDataEmissao,
          cpf: formData.cpf,
          fone: formData.fone,
          email: formData.email,
          numero: formData.numero,
          rua: formData.rua,
          complemento: formData.complemento,
          bairro: formData.bairro,
          cidade: formData.cidade,
          uf: formData.uf,
          cep: formData.cep,
        }
        break
      case 1:
        schema = acessoSchema
        dataToValidate = {
          concessionaria: formData.concessionaria,
          contractNumber: formData.contractNumber,
          tensaoRede: formData.tensaoRede,
          subgrupoConexao: formData.subgrupoConexao,
          tipoConexao: formData.tipoConexao,
          tipoSolicitacao: formData.tipoSolicitacao,
          tipoRamal: formData.tipoRamal,
          ramoAtividade: formData.ramoAtividade,
          enquadramentoGeracao: formData.enquadramentoGeracao,
          tipoGeracao: formData.tipoGeracao,
          alocacaoCredito: formData.alocacaoCredito,
          poste: formData.poste,
          longitudeUTM: formData.longitudeUTM,
          latitudeUTM: formData.latitudeUTM,
        }
        break
      case 2:
        // Validação customizada para equipamentos
        const equipamentos = formData.equipamentosKit || []
        const temInversor = equipamentos.some((eq: any) => eq.tipo === 'inversor' && eq.quantidade > 0)
        const temModulo = equipamentos.some((eq: any) => eq.tipo === 'modulo' && eq.quantidade > 0)
        const temProtecaoCA = equipamentos.some((eq: any) => eq.tipo === 'protecaoCA' && eq.quantidade > 0)
        
        // Validação das strings
        const inversores = equipamentos.filter((eq: any) => eq.tipo === 'inversor')
        const modulos = equipamentos.filter((eq: any) => eq.tipo === 'modulo')
        const totalMPPTs = inversores.reduce((total: number, inversor: any) => {
          return total + (inversor.mppt || 0) * inversor.quantidade
        }, 0)
        
        const stringsSelecionadas = modulos
          .filter((modulo: any) => modulo.stringSelecionada)
          .map((modulo: any) => parseInt(modulo.stringSelecionada.replace('String ', '')))
          .filter((str: number) => !isNaN(str))
        
        const todasStringsAtribuidas = totalMPPTs > 0 && stringsSelecionadas.length === totalMPPTs
        
        if (!temInversor || !temModulo || !temProtecaoCA || !todasStringsAtribuidas) {
          const newErrors: Record<string, string> = {}
          if (!temInversor) newErrors.inversor = "É necessário adicionar pelo menos um inversor"
          if (!temModulo) newErrors.modulo = "É necessário adicionar pelo menos um módulo"
          if (!temProtecaoCA) newErrors.protecaoCA = "É necessário adicionar pelo menos uma proteção CA"
          if (!todasStringsAtribuidas && totalMPPTs > 0) {
            const stringsNaoAtribuidas = totalMPPTs - stringsSelecionadas.length
            newErrors.strings = `É necessário atribuir módulos a todas as ${totalMPPTs} strings disponíveis. Faltam ${stringsNaoAtribuidas} string(s).`
          }
          setErrors(newErrors)
          return false
        }
        setErrors({})
        return true
      case 3:
        schema = tecnicoSchema
        dataToValidate = {
          nomeT: formData.nomeT,
          registro: formData.registro,
          rgCnhT: formData.rgCnhT,
          cpfT: formData.cpfT, 
          foneT: formData.foneT,
          tipoProfissional: formData.tipoProfissional,
          emailT: formData.emailT,
          logradouroT: formData.logradouroT,
          numeroT: formData.numeroT,
          complementoT: formData.complementoT,
          bairroT: formData.bairroT,
          cidadeT: formData.cidadeT,
          ufT: formData.ufT,
          cepT: formData.cepT,
        }
        break
      default:
        return true
    }

    try {
      schema.parse(dataToValidate)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  /**
   * Avança para a próxima etapa do formulário se a etapa atual for válida
   * Utiliza a função validateStep para verificar se os dados da etapa atual são válidos
   */
  const handleNext = () => {
   
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    
    }
  }

  /**
   * Retorna para a etapa anterior do formulário
   * Limita o valor mínimo a 0 para evitar índices negativos
   */
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  /**
   * Processa a submissão do formulário
   * Valida todos os dados do formulário usando o schema completo antes do envio
   * Envia os dados para a API e salva no banco de dados usando Prisma
   * Em caso de sucesso, avança para a etapa de conclusão e exibe toast de sucesso
   * Em caso de erro, exibe toast com mensagens de erro detalhadas
   */
  const handleSubmit = async () => {
    // Valida todos os dados do formulário antes do envio
    try {
      console.log('Form data before validation:', formData)
      formSchema.parse(formData)
      
      // Exibe toast de carregamento
      const loadingToast = toast.loading("Salvando projeto...", {
        description: "Enviando dados para o servidor."
      })
      
      // Envia os dados para a API
      const response = await fetch("/api/projeto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      
      // Obtém a resposta em formato JSON
      const responseData = await response.json()
      
      // Remove o toast de carregamento
      toast.dismiss(loadingToast)
      
      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
        // Exibe mensagem de sucesso com animação especial
        showCelebrationToast(formData.numProjetoC)
        
        // Avança para a etapa de conclusão
        setCurrentStep(steps.length)
      } else {
        // Trata erros retornados pela API
        if (responseData.errors) {
          // Erros de validação específicos
          const errorMessages = responseData.errors.map((err: any) => {
            return `${err.path}: ${err.message}`
          })
          
          // Exibe até 3 erros no toast para não sobrecarregar a interface
          const displayErrors = errorMessages.slice(0, 3)
          const remainingCount = errorMessages.length - 3
          const additionalMessage = remainingCount > 0 ? 
            `E mais ${remainingCount} ${remainingCount === 1 ? 'erro' : 'erros'}.` : ''
          
          toast.error("Erro ao salvar o projeto", {
            description: (
              <>
                <p>Por favor, corrija os seguintes erros:</p>
                <ul className="list-disc pl-4 mt-2">
                  {displayErrors.map((msg: string, i: number) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
                {additionalMessage && <p className="mt-1">{additionalMessage}</p>}
              </>
            ),
            duration: 8000
          })
        } else {
          // Erro genérico da API
          toast.error("Erro ao salvar o projeto", {
            description: responseData.message || "Ocorreu um erro ao processar os dados do formulário.",
            duration: 5000
          })
        }
      }
    } catch (error) {
      console.error("Form validation failed:", error)
      console.error('Validation error details:', error)
      
      if (error instanceof z.ZodError) {
        console.log('Zod validation errors:', error.errors)
        // Extrai as mensagens de erro para exibição
        const errorMessages = error.errors.map(err => {
          const field = err.path.join('.') || 'Campo'
          return `${field}: ${err.message}`
        })
        
        // Exibe até 3 erros no toast para não sobrecarregar a interface
        const displayErrors = errorMessages.slice(0, 3)
        const remainingCount = errorMessages.length - 3
        const additionalMessage = remainingCount > 0 ? 
          `E mais ${remainingCount} ${remainingCount === 1 ? 'erro' : 'erros'}.` : ''
        
        toast.error("Erro ao salvar o projeto", {
          description: (
            <>
              <p>Por favor, corrija os seguintes erros:</p>
              <ul className="list-disc pl-4 mt-2">
                {displayErrors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
              {additionalMessage && <p className="mt-1">{additionalMessage}</p>}
            </>
          ),
          duration: 8000
        })
      } else {
        // Erro genérico
        toast.error("Erro ao salvar o projeto", {
          description: "Ocorreu um erro inesperado ao processar os dados do formulário.",
          duration: 5000
        })
      }
    }
  }

  /**
   * Renderiza o componente apropriado para a etapa atual do formulário
   * 
   * @returns {JSX.Element | null} Componente React correspondente à etapa atual ou null
   */
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ClientInfoStep formData={formData} updateFormData={updateFormData} errors={errors} />
      case 1:
        return <AcessoInfoStep formData={formData} updateFormData={updateFormData} errors={errors} projetoId={projetoId} />
      case 2:
        return <EquipamentoInfoStep 
          formData={formData} 
          updateFormData={(field: string, value: any) => {
            updateFormData(field as keyof FormData, value)
          }}
          errors={errors} 
          projetoId={projetoId}
        />
      case 3:
        return <TecnicoInfoStep formData={formData} updateFormData={updateFormData} errors={errors} />
      case 4:
        return <ReviewStep formData={formData} />
      case 5:
        return <SucessoStep />
      default:
        return null
    }
  }

  /**
   * Obtém o título a ser exibido no cabeçalho com base na etapa atual
   * 
   * @returns {string} Título da etapa atual ou mensagem de conclusão
   */
  const getStepTitle = () => {
    if (currentStep >= steps.length) {
      return "Projeto cadastrado com sucesso"
    }
    return steps[currentStep]
  }

  return (
    <Card className="w-full h-full flex flex-col border-0 shadow-none p-0">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">
          {getStepTitle()}
          </CardTitle>
        <CardDescription>
          {currentStep < steps.length ? `Etapa ${currentStep + 1} de ${steps.length}` : "Todas as etapas concluídas"}
        </CardDescription>
      </CardHeader>

      <StepIndicator steps={steps} currentStep={currentStep} stepIcons={stepIcons} />

      <CardContent className="flex-grow px-0">{renderStep()}</CardContent>

      {currentStep < steps.length && (
        <CardFooter className="flex justify-between px-0">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
            Voltar
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext} 
              disabled={!isCurrentStepValid()}
              className={isCurrentStepValid() ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              Próximo
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!isCurrentStepValid()}
              className={isCurrentStepValid() ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              Salvar
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
