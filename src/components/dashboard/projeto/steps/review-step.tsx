import type { FormData } from "@/lib/schema/projetoSchema"
import { User, KeyRound, GalleryThumbnails, HardHat } from "lucide-react"

interface ReviewStepProps {
  formData: FormData
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground font-bold">{formData.numProjetoC} - Verifique todas as informaçoes enviadas</p>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 font-bold" />
            <h3 className="text-lg font-bold">Cliente</h3>
        </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            <div>
              <p className="text-sm text-muted-foreground font-bold">Nome</p>
              <p>{formData.nome}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">RG/CNH</p>
              <p>{formData.rgCnh}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Data de emissão</p>
              <p>{formData.rgCnhDataEmissao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">CPF</p>
              <p>{formData.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Telefone</p>
              <p>{formData.fone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Email</p>
              <p>{formData.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground font-bold">Endereço</p>
              <p>{formData.rua}, {formData.numero}{formData.complemento ? `, ${formData.complemento}` : ''} - {formData.bairro}, {formData.cidade}/{formData.uf} - CEP: {formData.cep}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="h-5 w-5 text-bold" />
            <h3 className="text-lg font-bold">Acesso</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            <div>
              <p className="text-sm text-muted-foreground font-bold">Concessionária</p>
              <p>{formData.concessionaria}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Conta Contrato</p>
              <p>{formData.contractNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tensão da Rede</p>
              <p>{formData.tensaoRede}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Grupo de Conexão</p>
              <p>{formData.subgrupoConexao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tipo de Conexão</p>
              <p>{formData.tipoConexao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tipo de Solicitação</p>
              <p>{formData.tipoSolicitacao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tipo de Ramal</p>
              <p>{formData.tipoRamal}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Ramo de Atividade</p>
              <p>{formData.ramoAtividade}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Enquadramento da Geração</p>
              <p>{formData.enquadramentoGeracao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tipo de Geração</p>
              <p>{formData.tipoGeracao}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Alocação de Crédito</p>
              <p>{formData.alocacaoCredito}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Poste</p>
              <p>{formData.poste || "Não informado"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground font-bold">Coordenadas UTM</p>
              <p><strong className="font-bold">Latitude:</strong>{formData.latitudeUTM}&emsp;&emsp;
              <strong>Longitude: </strong>{formData.longitudeUTM}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <GalleryThumbnails className="h-5 w-5 text-bold" />
            <h3 className="text-lg font-bold">Equipamentos do Kit</h3>
          </div>
          <div className="space-y-4">
            {formData.equipamentosKit && formData.equipamentosKit.length > 0 ? (
              <div className="grid grid-cols-5 gap-4">
                {(() => {
                  // Ordenar equipamentos por tipo: Inversor, Módulo, Proteção CA, Proteção CC
                  const tipoOrdem = ['inversor', 'modulo', 'protecaoCA', 'protecaoCC'];
                  const equipamentosOrdenados = [...formData.equipamentosKit].sort((a, b) => {
                    const indexA = tipoOrdem.indexOf(a.tipo);
                    const indexB = tipoOrdem.indexOf(b.tipo);
                    return indexA - indexB;
                  });
                  
                  return equipamentosOrdenados.map((equipamento: any, index: number) => (
                    <div key={equipamento.id || index} className="border rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground font-bold mb-1">
                            {equipamento.tipo === 'modulo' && 'Módulo'}
                            {equipamento.tipo === 'inversor' && 'Inversor'}
                            {equipamento.tipo === 'protecaoCA' && 'Proteção CA'}
                            {equipamento.tipo === 'protecaoCC' && 'Proteção CC'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold">--</p>
                          <p className="text-sm">{equipamento.nome}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold">Modelo</p>
                          <p className="text-sm">{equipamento.modelo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold">Fabricante</p>
                          <p className="text-sm">{equipamento.fabricante}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-bold">Quantidade</p>
                          <p className="text-sm">{equipamento.quantidade}</p>
                        </div>
                        {equipamento.potencia && (
                          <div>
                            <p className="text-xs text-muted-foreground font-bold">Potência</p>
                            <p className="text-sm">{equipamento.potencia} {equipamento.tipo === 'modulo' ? 'Wp' : 'kW'}</p>
                          </div>
                        )}
                        {equipamento.stringSelecionada && (
                          <div>
                            <p className="text-xs text-muted-foreground font-bold">String</p>
                            <p className="text-sm">{equipamento.stringSelecionada}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ));
                })()
                }
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhum equipamento adicionado</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <HardHat className="h-5 w-5 text-bold" />
            <h3 className="text-lg font-bold">Técnico</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            <div>
              <p className="text-sm text-muted-foreground font-bold">Nome</p>
              <p>{formData.nomeT}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Registro</p>
              <p>{formData.registro}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">RG/CNH</p>
              <p>{formData.rgCnhT}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">CPF</p>
              <p>{formData.cpfT}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Telefone</p>
              <p>{formData.foneT}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tipo de Profissional</p>
              <p>{formData.tipoProfissional}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Email</p>
              <p>{formData.emailT}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground font-bold">Endereço</p>
              <p>{formData.logradouroT}, {formData.numeroT}{formData.complementoT ? `, ${formData.complementoT}` : ''} - {formData.bairroT}, {formData.cidadeT}/{formData.ufT} - CEP: {formData.cepT}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
