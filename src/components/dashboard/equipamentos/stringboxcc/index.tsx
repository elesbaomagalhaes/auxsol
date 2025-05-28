import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StringBoxCCTable } from "./stringboxcc-table";

export default function StringBoxCCGerenciamento() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Gerenciamento de StringBox CC</h2>
      <p className="text-muted-foreground">
        Visualize, edite e gerencie os equipamentos StringBox CC cadastrados no sistema.
      </p>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-12">
        <Card className="col-span-12">
          <CardHeader>
            <CardTitle>StringBox CC</CardTitle>
            <CardDescription>
              Lista de todos os equipamentos StringBox CC cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StringBoxCCTable data={[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}