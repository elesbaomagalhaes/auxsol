import type { FormData } from "@/lib/schema/projeto"
import { Separator } from "@radix-ui/react-separator"
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
              <p>{formData.conInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Conta Contrato</p>
              <p>{formData.contractNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tensão da Rede</p>
              <p>{formData.tnsRdeInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Grupo de Conexão</p>
              <p>{formData.gpoCnxInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tipo de Conexão</p>
              <p>{formData.tpoCnxInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tipo de Solicitação</p>
              <p>{formData.tpoSolInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tipo de Ramal</p>
              <p>{formData.tpoRmlInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Ramo de Atividade</p>
              <p>{formData.rmoAtiInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Enquadramento da Geração</p>
              <p>{formData.enqGerInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Tipo de Geração</p>
              <p>{formData.tpoGerInfo}</p>
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
            <h3 className="text-lg font-bold">Equipamento</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground font-bold">Módulos</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Fabricante</p>
              <p>{formData.fbcModInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Potência (Wp)</p>
              <p>{formData.ptcModInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Quantidade</p>
              <p>{formData.qtdMod}</p>
            </div>
            <div className="col-span-2 mt-2">
              <p className="text-sm text-muted-foreground font-bold">Inversores</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Fabricante</p>
              <p>{formData.fbcInvInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Potência (kWp)</p>
              <p>{formData.ptcInvInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Quantidade</p>
              <p>{formData.qtdInv}</p>
            </div>
            <div className="col-span-2 mt-2">
              <p className="text-sm text-muted-foreground font-bold">Stringbox CC</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Modelo</p>
              <p>{formData.mdlStrCCInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Quantidade</p>
              <p>{formData.qtdStrCC}</p>
            </div>
            <div className="col-span-2 mt-2">
              <p className="text-sm text-muted-foreground font-bold">Stringbox CA</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Modelo</p>
              <p>{formData.mdlStrCAInfo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold">Quantidade</p>
              <p>{formData.qtdStrCA}</p>
            </div>
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
