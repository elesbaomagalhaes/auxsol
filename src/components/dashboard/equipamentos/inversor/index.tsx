import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InversorTable } from "./inversor-table";

export default function ProtecaoCAGerenciamento() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Inversor</h2>
      <p className="text-muted-foreground">
        Visualize, edite e gerencie os equipamentos Inversor cadastrados no sistema.
      </p>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Inversor</CardTitle>
            <CardDescription>
              Lista de todos os equipamentos Inversor cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InversorTable data={[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}