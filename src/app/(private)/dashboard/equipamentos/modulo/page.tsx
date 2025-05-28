import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma";
import { ModuloTable } from "@/components/dashboard/equipamentos/modulo/modulo-table";

export default async function DashModulo() {

  const session = await auth();
  if (!session) {
    // nada de try/catch aqui
    redirect("/sign-in");
  }

  const modulo = await prisma.modulo.findMany({
    where: {
      userId: session.user.id
    },
    select: {
      id: true,
      fabricante: true,
      modelo: true,
      potenciaNominal: true,
      tensaoCircAberto: true,
      correnteCurtCirc: true,
      tensaoMaxOper: true,
      correnteMaxOper: true,
      eficiencia: true,
      datasheet: true,
      seloInmetro: true,
      comprimento: true,
      largura: true,
      area: true,
      peso: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedModulo = modulo.map(mdl => ({
    ...mdl,
    comprimento: Number(mdl.comprimento),
    largura: Number(mdl.largura),
    area: Number(mdl.area),
    peso: Number(mdl.peso),
    potenciaNominal: Number(mdl.potenciaNominal),
    tensaoMaxOper: Number(mdl.tensaoMaxOper),
    correnteMaxOper: Number(mdl.correnteMaxOper),
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Modulo</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Gerenciador de Modulo
            </CardTitle>
            <CardDescription>Visão geral dos equipamentos Modulos cadastrados  
            </CardDescription>
          </CardHeader>
          <CardContent>
              <ModuloTable data={formattedModulo as any} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

