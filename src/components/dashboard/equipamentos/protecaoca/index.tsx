import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtecaoCATable } from "./protecaoca-table";

export default function ProtecaoCAGerenciamento() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Proteção CA</h2>
      <p className="text-muted-foreground">
        Visualize, edite e gerencie os equipamentos StringBox CA cadastrados no sistema.
      </p>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>StringBox CA</CardTitle>
            <CardDescription>
              Lista de todos os equipamentos StringBox CA cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProtecaoCATable data={[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}