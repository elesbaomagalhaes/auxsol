import * as z from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 10;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "archive/pdf"
];

export const clientFormSchema = z.object({
  nome: z.string().min(10, "O nome deve ser completo"),
  rgCnh: z.string().min(5, "CNH Oou RG deve ter pelo menos 5 caracteres"),
  cpf: z.string().min(11, "CPF/CNPJ inválido"),
  rgCnhDataEmissao: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, "Data de emissão do RG/CNH é obrigatória"),
  fone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  numProjeto: z.string().min(5, "O código deve ter pelo menos 5 caracteres"),
  rua: z.string().min(3, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(2, "Indique o bairro"),
  cidade: z.string().min(2, "Indique a cidade"),
  uf: z.string().length(2, "Indique o estado"),
  cep: z.string().length(9, "CEP deve ter 8 dígitos"), 
});

export const utilityFormSchema = z.object({
  nomeConcessionaria: z.string().min(3, "Concessionária é obrigatório"),
  contractNumber: z.string().min(5, "C.Contrato é obrigatório"),
  tensaoRede: z.string().min(2, "Campo é obrigatório"),
  grupoConexao: z.string().min(2, "Campo é obrigatório"),
  tipoConexao: z.string().min(2, "Campo obrigatório"),
  tipoSolicitacao: z.string().min(2, "Campo é obrigatório"),
  tipoRamal: z.string().min(2, "Campo é obrigatório"),
  ramoAtividade: z.string().min(2, "Campo é obrigatório"),
  enquadramentoGeracao: z.string().min(2, "Campo é obrigatório"),
  tipoGeracao: z.string().min(2, "Campo obrigatório"),
  potenciaInstalada: z.string().optional(),
  numProjeto: z.string().min(4, "Digite um código válido"),
  poste: z.string().optional(),
  latitudeUTM: z.string().min(10, "Latitude inválida"),
  longitudeUTM: z.string().min(10, "Longitude inválida"),
  fotoMedidor: z.string().optional()
});

export const plantFormSchema = z.object({
  numProjeto: z.string().min(5, "O código deve ter pelo menos 5 caracteres"),
  modulo: z.object({
    fabricanteMod: z.string().min(3, "Fabricante é obrigatório"),
    potenciaMod: z.string().min(2, "Potencia é obrigatória"),
    qtdMod: z.number().min(1,"Quantidade deve ser maior que 0")
  }),
  inversor: z.object({
    fabricanteInv: z.string().min(3, "Fabricante é obrigatório"),
    potenciaInv: z.string().min(2, "Potencia é obrigatória"),
    qtdInv: z.number().min(1,"Quantidade deve ser maior que 0")
  }),
  stringBox: z.object({
    fabricanteStrCC: z.string().min(3, "Fabricante é obrigatório"),
    qtdESStrCC: z.string().min(2, "Potencia é obrigatória"),
    qtdStrCC: z.number().min(1,"Quantidade deve ser maior que 0")
  })
});

export const technicalManagerFormSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  crea: z.string().min(5, "CREA/CFT é obrigatório"),
  fone: z.string().min(10, "Telefone inválido"),
  profissao: z.string().min(2,"Escolha uma profissão"),
  email: z.string().email("E-mail inválido"),
  address: z.object({
    rua: z.string().min(3, "Rua é obrigatória"),
    numero: z.string().min(1, "Número é obrigatório"),
    complemento: z.string().optional(),
    bairro: z.string().min(2, "Bairro é obrigatório"),
    cidade: z.string().min(2, "Cidade é obrigatória"),
    uf: z.string().length(2, "Estado deve ter 2 caracteres"),
    cep: z.string().length(8, "CEP deve ter 8 dígitos")
  })
});

export const projectSchema = z.object({
  client: clientFormSchema,
  utility: utilityFormSchema,
  plant: plantFormSchema,
  technicalManager: technicalManagerFormSchema
});

export type ClientFormData = z.infer<typeof clientFormSchema>;
export type UtilityFormData = z.infer<typeof utilityFormSchema>;
export type PlantFormData = z.infer<typeof plantFormSchema>;
export type TechnicalManagerFormData = z.infer<typeof technicalManagerFormSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;