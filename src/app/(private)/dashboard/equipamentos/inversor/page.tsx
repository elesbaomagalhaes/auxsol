import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma";
import { InversorTable } from "@/components/dashboard/equipamentos/inversor/inversor-table";

export default async function DashInversor() {

  const session = await auth();
  if (!session) {
    // nada de try/catch aqui
    redirect("/sign-in");
  }

  const inversor = await prisma.inversor.findMany({
    where: {
      userId: session.user.id
    },
    select: {
      id: true,
      fabricante: true,
      modelo: true,
      potenciaNomEnt: true,
      potenciaMaxEnt: true,
      tensaoMaxEnt: true,
      tensaoInic: true,
      tensaoNomEnt: true,
      numeroEntMPPT: true,
      potenciaMaxMPPT: true,
      correnteMaxEnt: true,
      correnteMaxCurtCirc: true,
      potenciaMaxSai: true,
      potenciaNomSai: true,
      correnteNomSai: true,
      correnteMaxSai: true,
      tensaoNomSai: true,
      THD: true,
      tipoInv: true,
      frequenciaNom: true,
      fatorPotencia: true,
      tensaoMaxsSai: true,
      tensaoMinSai: true,
      eficiencia: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedInversor = inversor.map(inv => ({
    ...inv,
    potenciaNomEnt: Number(inv.potenciaNomEnt),
    potenciaMaxEnt: Number(inv.potenciaMaxEnt),
    potenciaNomSai: Number(inv.potenciaNomSai),
    potenciaMaxSai: Number(inv.potenciaMaxSai),
    fatorPotencia: Number(inv.fatorPotencia),
    eficiencia: Number(inv.eficiencia),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Inversor</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Gerenciador de Inversor
            </CardTitle>
            <CardDescription>Visão geral dos equipamentos Inversores cadastrados  
            </CardDescription>
          </CardHeader>
          <CardContent>
              <InversorTable data={formattedInversor as any} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

