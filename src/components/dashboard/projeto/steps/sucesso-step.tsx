import { CheckCircle2 } from "lucide-react"

export default function SuccessStep() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <CheckCircle2 className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Projeto Cadastrado!</h3>
      <p className="text-muted-foreground max-w-md">
        Siga para o gerenciador de projetos para gerar a documentação necessária para homologação do seu proejto.
      </p>
    </div>
  )
}
