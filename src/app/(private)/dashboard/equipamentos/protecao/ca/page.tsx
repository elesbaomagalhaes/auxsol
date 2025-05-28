import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma";
import { ProtecaoCATable } from "@/components/dashboard/equipamentos/protecaoca/protecaoca-table";



export default async function DashProtecaoCA() {

  const session = await auth();
  if (!session) {
    // nada de try/catch aqui
    redirect("/sign-in");
  }

  const protecaoca = await prisma.protecaoCA.findMany({
    where: {
      userId: session.user.id
    },
    select: {
      id: true,
      numeroPoloDisjuntor: true,
      tensaoNomDisjuntor: true,
      correnteNomDisjuntor: true,
      frequenciaNomDisjuntor: true,
      elementoProtDisjuntor: true,
      curvaDisjuntor: true,
      classeDps: true,
      correnteNomDPS: true,
      correnteMaxDPS: true,
      numeroPoloDPS: true,
      tensaoNomDPS: true,
      modelo: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Proteção CA</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Gerenciador de Proteção CA
            </CardTitle>
            <CardDescription>Visão geral dos equipamentos Proteção CA cadastrados  
            </CardDescription>
          </CardHeader>
          <CardContent>
              <ProtecaoCATable data={protecaoca as any} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

