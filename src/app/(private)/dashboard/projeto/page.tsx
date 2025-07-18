import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth";

import { redirect } from "next/navigation"
import prisma from "@/lib/prisma";
import MultiStepForm from "@/components/dashboard/projeto/multi-step-form";

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
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardContent className="px-4">
            <div className="h-full w-full">
              <MultiStepForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

