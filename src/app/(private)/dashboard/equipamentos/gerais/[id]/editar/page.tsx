import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { EquipamentoForm } from "@/components/dashboard/equipamentos/gerais/equipamento-form"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { headers } from "next/headers"

interface EditarEquipamentoPageProps {
  params: Promise<{
    id: string
  }>
}

async function getEquipamento(id: string) {
  try {
    const headersList = await headers()
    const cookie = headersList.get('cookie')
    
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/equipamentos/gerais/${id}`, {
      cache: 'no-store',
      headers: {
        cookie: cookie || '',
      },
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar equipamento:', error)
    return null
  }
}

export default async function EditarEquipamentoPage({ params }: EditarEquipamentoPageProps) {
  const session = await auth()
  if (!session) {
    redirect("/sign-in")
  }

  const { id } = await params
  const equipamento = await getEquipamento(id)
  
  if (!equipamento) {
    notFound()
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
          <h1 className="text-3xl font-bold tracking-tight">Editar Equipamento</h1>
          <p className="text-muted-foreground">
            Edite as informações do equipamento
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Equipamento</CardTitle>
          <CardDescription>
            Atualize as informações do equipamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipamentoForm equipamento={equipamento} />
        </CardContent>
      </Card>
    </div>
  )
}