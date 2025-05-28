import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth";
import { Users, Wrench, Package, KeyRound, BarChart3 } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function Dashboard() {

  const session = await auth();
  if (!session) {
    // nada de try/catch aqui
    redirect("/sign-in");
  }

  // Se chegou aqui, a sessão é válida
  const stats = [
    {
      title: "Total de Clientes",
      value: "254",
      description: "12 novos este mês",
      icon: Users,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Técnicos Ativos",
      value: "12",
      description: "2 em atendimento",
      icon: Wrench,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Porteções",
      value: "543",
      description: "32 em manutenção",
      icon: Package,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Acessos",
      value: "128",
      description: "24 hoje",
      icon: KeyRound,
      color: "bg-purple-100 text-purple-700",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
        <Link href="/dashboard/projetos/novo" className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <span>Novo Projeto</span>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Visão geral das atividades do último mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Gráfico de atividades</span>
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

