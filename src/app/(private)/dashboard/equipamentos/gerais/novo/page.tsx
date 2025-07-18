import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { EquipamentoForm } from "@/components/dashboard/equipamentos/gerais/equipamento-form"
import { ArrowLeft } from "lucide-react"

export default async function NovoEquipamentoPage() {
  const session = await auth()
  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/equipamentos/gerais">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Equipamento</h1>
          <p className="text-muted-foreground">
            Cadastre um novo equipamento no sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Equipamento</CardTitle>
          <CardDescription>
            Preencha as informações do equipamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipamentoForm />
        </CardContent>
      </Card>
    </div>
  )
}