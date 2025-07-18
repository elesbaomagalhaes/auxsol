export interface ProjetoData {
  id: string
  numProjeto: string
  potenciaGerador: number
  potenciaInversor: number
  createdAt: Date
  cliente: {
    id: string
    nome: string
    cidade: string
    uf: string
    cpf: string
    rua: string
    numero: string
    bairro: string
    cep: string
    fone: string
    email: string
    rgCnh: string
    rgCnhDataEmissao: Date
    complemento?: string | null
  }
  acesso?: {
    id: string
    nomeConcessionaria: string
    contractNumber: string
    tensaoRede: string
    grupoConexao: string
    tipoConexao: string
    tipoSolicitacao: string
    tipoRamal: string
    ramoAtividade: string
    enquadramentoGeracao: string
    tipoGeracao: string
    potenciaInstalada?: number | null
    poste?: string | null
    longitudeUTM: string
    latitudeUTM: string
  } | null
  tecnico?: {
    id: string
    nome: string
    registro: string
    rgCnh: string
    cpf: string
    fone: string
    email: string
    tipoProfissional: string
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cidade: string
    uf: string
    cep: string
  } | null
  kits?: {
    id: string
    tipo: string
    itemId: string
    qtd: number
    potenciaGerador: number | null
    potenciaInversor: number | null
    string: number | null
  }[]
  potenciaGeradorTotal: number
  potenciaInversorTotal: number
}