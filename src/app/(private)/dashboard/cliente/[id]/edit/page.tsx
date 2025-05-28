import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth";
import { Users, Wrench, Package, KeyRound, BarChart3 } from "lucide-react"
import ClienteTable from "@/components/dashboard/cliente/cliente-table";
import { columns } from "@/components/dashboard/cliente/columns";
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma";

export default async function Dashboard() {

  const session = await auth();
  if (!session) {
    // nada de try/catch aqui
    redirect("/sign-in");
  }

  const clients = await prisma.cliente.findMany({
    select: {
      id: true,
      numProjeto: true,
      nome: true,
      cidade: true,
    },
    orderBy: {
      numProjeto: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-9">
          <CardHeader>
            <CardTitle>Gerenciador de clientes</CardTitle>
            <CardDescription>Visão geral das atividades do último mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <ClienteTable   columns={columns} data={clients} /> 
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
            <CardDescription>Últimos clientes cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cliente {i}</p>
                    <p className="text-xs text-muted-foreground">
                      Adicionado há {i} dia{i > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

