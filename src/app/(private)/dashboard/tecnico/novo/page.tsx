
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { FormTecnico } from "@/components/dashboard/tecnico/form-tecnico";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation"
import Link from "next/link";

export default async function TecnicoCadastro() {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cadastro de Técnico</h2>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/tecnico">
            <Button variant="outline">Cancelar</Button>
          </Link>
        </div>
      </div>
      <p className="text-muted-foreground">Formulário para cadastro de Técnico.</p>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Técnico</CardTitle>
          <CardDescription>Preencha os dados pessoais e profissionais do técnico</CardDescription>
        </CardHeader>
        <CardContent>
        <FormTecnico /> 
        </CardContent>
      </Card>
    </div>
  );
}

