import { TableProperties } from "lucide-react";
import { z } from "zod"

// Personal Information Schema
export const clienteSchema = z.object({
    nome: z.string().min(10, "O nome deve ser completo"),
    rgCnh: z.string().min(5, "Digite um CPF/CNPJ válido"),
    cpf: z.string().min(11, "CPF/CNPJ inválido"),
    rgCnhDataEmissao: z.string().refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Data de emissão é obrigatória"),
    fone: z.string().min(10, "Telefone inválido"),
    email: z.string().email("E-mail inválido"),
    numProjetoC: z.string().min(5, "Digite um código válido"),
    rua: z.string().min(3, "Rua é obrigatória"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(2, "Indique o bairro"),
    cidade: z.string().min(2, "Indique a cidade"),
    uf: z.string().length(2, "Indique o estado"),
    cep: z.string().length(9, "CEP deve ter 9 dígitos")
})

// Contact Information Schema
export const acessoSchema = z.object({
    concessionaria: z.string().min(3, "Concessionária é obrigatório"),
    conInfo: z.string().optional(),
    contractNumber: z.string().min(5, "C.Contrato é obrigatório"),
    tensaoRede: z.string().min(2, "Campo é obrigatório"),
    tnsRdeInfo: z.string().optional(),
    grupoConexao: z.string().min(1, "Campo é obrigatório"),
    gpoCnxInfo: z.string().optional(),
    tipoConexao: z.string().min(1, "Campo obrigatório"),
    tpoCnxInfo: z.string().optional(),
    tipoSolicitacao: z.string().min(1, "Campo é obrigatório"),
    tpoSolInfo: z.string().optional(),
    tipoRamal: z.string().min(2, "escolha o ramal"),
    tpoRmlInfo: z.string().optional(),
    ramoAtividade: z.string().min(1, "Campo é obrigatório"),
    rmoAtiInfo: z.string().optional(),
    enquadramentoGeracao: z.string().min(1, "Campo é obrigatório"),
    enqGerInfo: z.string().optional(),
    tipoGeracao: z.string().min(2, "Campo obrigatório"),
    tpoGerInfo: z.string().optional(),
    poste: z.string().optional(),
    latitudeUTM: z.string().min(6, "Latitude inválida"),
    longitudeUTM: z.string().min(6, "Longitude inválida")
})

// Account Setup Schema
export const equipamentoSchema = z
  .object({
      fabricanteMod: z.string().min(1, "Fabricante é obrigatório"),
      fbcModInfo: z.string().optional(),
      potenciaMod: z.string().min(2, "Potencia é obrigatória"),
      ptcModInfo: z.string().optional(),
      qtdMod: z.string().min(1,"Indique a quantidade").refine((val) => !isNaN(Number(val)) && Number(val) > 0,{ message: "indique uma quantidade"}),
      fabricanteInv: z.string().min(1, "Fabricante é obrigatório"),
      fbcInvInfo: z.string().optional(),
      potenciaInv: z.string().min(2, "Potencia é obrigatória"),
      ptcInvInfo: z.string().optional(),
      qtdInv: z.string().min(1,"Quantidade deve ser maior que 0").refine((val) => !isNaN(Number(val)) && Number(val) > 0,{ message: "indique uma quantidade"}),
      tensaoMaxEnt: z.string().optional(),
      tensaoInicializacao: z.string().optional(),
      tensaoNominalEnt: z.string().optional(),
      numeroEntMPPT: z.string().min(1, "Nº de entradas MPPT é obrigatório").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Indique uma quantidade válida"}),
      potenciaMaxMPPT: z.string().optional(),
      correnteMaxEnt: z.string().optional(),
      correnteMaxCurtCirc: z.string().optional(),
      potenciaNominalSai: z.string().optional(), // Já existe no schema.prisma, mas pode ser útil ter no form
      potenciaMaxSai: z.string().optional(), // Já existe no schema.prisma, mas pode ser útil ter no form
      correnteNominalSai: z.string().optional(),
      correnteMaxSai: z.string().optional(),
      tensaoNominalSai: z.string().optional(),
      THD: z.string().optional(),
      frequenciaNominal: z.string().optional(),
      fatorPotencia: z.string().optional(),
      tensaoMaxsSai: z.string().optional(),
      tensaoMinSai: z.string().optional(),
      eficiencia: z.string().optional(),
      modeloStrCC: z.string().min(3, "Fabricante é obrigatório"),
      mdlStrCCInfo: z.string().optional(),
      qtdStrCC: z.string().min(1,"Quantidade deve ser maior que 0").refine((val) => !isNaN(Number(val)) && Number(val) > 0,{ message: "indique uma quantidade"}),
      modeloStrCA: z.string().min(3, "Fabricante é obrigatório"),
      mdlStrCAInfo: z.string().optional(),
      qtdStrCA: z.string().min(1,"Quantidade deve ser maior que 0").refine((val) => !isNaN(Number(val)) && Number(val) > 0,{ message: "indique uma quantidade"}),
    
  })

// Techinic Schema
export const tecnicoSchema = z.object({
    nomeT: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    registro: z.string().min(5, "CREA/CFT é obrigatório"),
    rgCnhT: z.string().min(5, "CREA/CFT é obrigatório"),
    cpfT: z.string().min(11, "CPF/CNPJ inválido"),
    foneT: z.string().min(10, "Telefone inválido"),
    tipoProfissional: z.string().min(2,"Escolha uma profissão"),
    tpoPrfInfo: z.string().optional(),
    emailT: z.string().email("E-mail inválido"),
      logradouroT: z.string().min(3, "Rua é obrigatória"),
      numeroT: z.string().min(1, "Número é obrigatório"),
      complementoT: z.string().optional(),
      bairroT: z.string().min(2, "Bairro é obrigatório"),
      cidadeT: z.string().min(2, "Cidade é obrigatória"),
      ufT: z.string().length(2, "Estado deve ter 2 caracteres"),
      cepT: z.string().min(8, "CEP deve ter 8 dígitos")
})

// Combined Form Schema
export const formSchema = z.object({
  ...clienteSchema.shape,
  ...acessoSchema.shape,
  ...equipamentoSchema.shape,
  ...tecnicoSchema.shape,
})

// Infer the type from the schema
export type FormData = z.infer<typeof formSchema>
