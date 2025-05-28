import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma";
import { StringBoxCCTable } from "@/components/dashboard/equipamentos/stringboxcc/stringboxcc-table";


export default async function Dashboard() {

  const session = await auth();
  if (!session) {
    // nada de try/catch aqui
    redirect("/sign-in");
  }

  const stringBoxesCC = await prisma.stringBoxCC.findMany({
    where: {
      userId: session.user.id
    },
    select: {
      id: true,
      fabricante: true,
      modelo: true,
      numeroEntradas: true,
      numeroSaidas: true,
      tensaoMaxOperacao: true,
      correnteMaxOperacao: true,
      classeDps: true,
      nivelProtecao: true,
      correnteNominalDescarga: true,
      correnteMaxDescarga: true,
      numeroPoloSeccionadora: true,
      grauProtecao: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">StringBox CC</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Gerenciador de StringBox CC
            </CardTitle>
            <CardDescription>Visão geral dos equipamentos StringBox CC cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <StringBoxCCTable data={stringBoxesCC} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

