import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma";
import TecnicoTable from "@/components/dashboard/tecnico/tecnico-table";

export default async function DashTecnico() {

  const session = await auth();
  if (!session) {
    // nada de try/catch aqui
    redirect("/sign-in");
  }

  const tecnico = await prisma.tecnico.findMany({
    where: {
      userId: session.user.id
    },
    select: {
      id: true,
      nome: true,
      registro: true,
      rgCnh: true,
      cpf: true,
      fone: true,
      email: true,
      tipoProfissional: true,
      logradouro: true,
      numero: true,
      complemento: true,
      bairro: true,
      cidade: true,
      uf: true,
      cep: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedTecnico = tecnico.map(tec => ({
    ...tec,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Técnico</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Gerenciador de Técnico
            </CardTitle>
            <CardDescription>Visão geral dos técnicos cadastrados  
            </CardDescription>
          </CardHeader>
          <CardContent>
              <TecnicoTable data={formattedTecnico as any} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

