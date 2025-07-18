import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma";
import { ClienteTable } from "@/components/dashboard/cliente/cliente-table";

export default async function DashCliente() {

  const session = await auth();
  if (!session) {
    // nada de try/catch aqui
    redirect("/sign-in");
  }

  const cliente = await prisma.cliente.findMany({
    where: {
      userId: session.user.id
    },
    select: {
      id: true,
      nome: true,
      rgCnh: true,
      rgCnhDataEmissao: true,
      cpf: true,
      fone: true,
      email: true,
      numProjeto: true,
      rua: true,
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

  const formattedCliente = cliente.map(cli => ({
    ...cli,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Cliente</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Gerenciador de Cliente
            </CardTitle>
            <CardDescription>Visão geral dos clientes cadastrados  
            </CardDescription>
          </CardHeader>
          <CardContent>
              <ClienteTable data={formattedCliente as any} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}