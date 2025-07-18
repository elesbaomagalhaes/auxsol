import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { EquipamentoTable } from "@/components/dashboard/equipamentos/gerais/equipamento-table"
import { Plus } from "lucide-react"

export default async function EquipamentosPage() {
  const session = await auth()
  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os equipamentos do sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/equipamentos/gerais/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Equipamento
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Equipamentos</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os equipamentos cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipamentoTable />
        </CardContent>
      </Card>
    </div>
  )
}