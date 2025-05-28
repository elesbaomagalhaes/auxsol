
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { FormStringboxCC } from "@/components/dashboard/equipamentos/stringboxcc/form-stringboxCC";
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
        <h2 className="text-3xl font-bold tracking-tight">Cadastro de StringBox CC</h2>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/equipamentos/stringbox/cc">
            <Button variant="outline">Cancelar</Button>
          </Link>
        </div>
      </div>
      <p className="text-muted-foreground">Formulário para cadastro de StringBox CC.</p>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Equipamento</CardTitle>
          <CardDescription>Preencha os dados técnicos do StringBox CC</CardDescription>
        </CardHeader>
        <CardContent>
        <FormStringboxCC /> 
        </CardContent>
      </Card>
    </div>
  );
}

