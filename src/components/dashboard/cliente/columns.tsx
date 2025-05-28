"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, FolderOpen, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
// Remove the useToast import
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type Client = {
  id: string;
  numProjeto: string;
  nome: string;
  cidade: string;
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "numProjeto",
    header: "Num. Projeto",
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "cidade",
    header: "Cidade",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const client = row.original;
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        try {
          setIsDeleting(true);
          const response = await fetch(`/api/clients`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: client.id }),
          });

          if (!response.ok) throw new Error("Erro ao deletar cliente");

          toast.success("Cliente excluído", {
            description: `${client.nome} foi removido com sucesso.`,
            duration: 5000,
          });
          
          window.location.reload();
        } catch (error) {
          toast.error("Erro ao excluir", {
            description: "Não foi possível excluir o cliente. Tente novamente.",
            duration: 5000,
          });
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/clients/${client.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/clients/${client.id}/project`}>
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>Projeto</span>
              </Link>
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Deletar</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja deletar este cliente? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                  <AlertDialogCancel className="mt-0">Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="gap-2 sm:gap-2"
                  >
                    {isDeleting ? "Deletando..." : "Deletar"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];