export interface Tecnico {
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
  complemento?: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  createdAt: Date
  updatedAt: Date
  userId?: string
}