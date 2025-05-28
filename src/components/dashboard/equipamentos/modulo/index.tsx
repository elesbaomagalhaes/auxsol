import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuloTable } from "./modulo-table";

export default function ProtecaoCAGerenciamento() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de Módulo</h2>
      <p className="text-muted-foreground">
        Visualize, edite e gerencie os equipamentos Módulos cadastrados no sistema.
      </p>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>Módulo</CardTitle>
            <CardDescription>
              Lista de todos os equipamentos Módulos cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModuloTable data={[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}