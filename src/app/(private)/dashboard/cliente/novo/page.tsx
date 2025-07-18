import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { FormCliente } from "@/components/dashboard/cliente/form-cliente";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import Link from "next/link";

export default async function ClienteCadastro() {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cadastro de Cliente</h2>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/cliente">
            <Button variant="outline">Cancelar</Button>
          </Link>
        </div>
      </div>
      <p className="text-muted-foreground">Formulário para cadastro de Cliente.</p>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
          <CardDescription>Preencha os dados pessoais e de endereço do cliente</CardDescription>
        </CardHeader>
        <CardContent>
        <FormCliente /> 
        </CardContent>
      </Card>
    </div>
  );
}