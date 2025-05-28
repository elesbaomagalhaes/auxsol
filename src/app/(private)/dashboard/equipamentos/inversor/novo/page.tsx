
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { FormInversor } from "@/components/dashboard/equipamentos/inversor/form-inversor";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import Link from "next/link";

export default async function StringBoxCCCadastro() {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cadastro de Inversor</h2>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/equipamentos/inversor">
            <Button variant="outline">Cancelar</Button>
          </Link>
        </div>
      </div>
      <p className="text-muted-foreground">Formulário para cadastro de Inversor.</p>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Equipamento</CardTitle>
          <CardDescription>Preencha os dados técnicos do Inversor</CardDescription>
        </CardHeader>
        <CardContent>
        <FormInversor /> 
        </CardContent>
      </Card>
    </div>
  );
}

