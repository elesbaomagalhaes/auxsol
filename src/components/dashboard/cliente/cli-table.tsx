import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Edit, FolderKanban } from "lucide-react";

// Dados de exemplo - substitua por dados reais da sua API ou estado
const clientes = [
  {
    id: "1",
    nome: "João Silva",
    cidade: "São Paulo",
    telefone: "(11) 99999-1111",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    cidade: "Rio de Janeiro",
    telefone: "(21) 98888-2222",
  },
  {
    id: "3",
    nome: "Carlos Pereira",
    cidade: "Belo Horizonte",
    telefone: "(31) 97777-3333",
  },
];

export function ClienteTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Cidade</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.map((cliente) => (
          <TableRow key={cliente.id}>
            <TableCell className="font-medium">{cliente.nome}</TableCell>
            <TableCell>{cliente.cidade}</TableCell>
            <TableCell>{cliente.telefone}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="icon" aria-label="Editar Cliente">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Ver Projetos">
                <FolderKanban className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" aria-label="Deletar Cliente">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}