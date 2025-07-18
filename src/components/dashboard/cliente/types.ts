export type Cliente = {
  id: string;
  nome: string;
  rgCnh: string;
  rgCnhDataEmissao: Date;
  cpf: string;
  fone: string;
  email: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  numProjeto?: string;
  uf: string;
  cep: string;
  createdAt?: Date;
  updatedAt?: Date;
};