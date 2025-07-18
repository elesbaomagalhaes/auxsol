"use client"

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2, Edit, Plus, Loader2 } from "lucide-react"; // Added Loader2
import { useState } from "react";
import { toast } from "sonner"; // Added toast
import { EditTecnicoDialog } from "./edit-dialog";
import { type Tecnico } from "./types";
import Link from "next/link";
// Usando o tipo protecao CA importado de ./types

interface TecnicoTableProps {
  data: Tecnico[];
}

export function TecnicoTable({ data }: TecnicoTableProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Added for loading state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTecnico, setCurrentTecnico] = useState<Tecnico | null>(null);

  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleConfirmDelete = async (id: string) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/tecnico/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao deletar técnico: ${response.status}`);
      }

      toast.success("Técnico deletado com sucesso!");
      // Atualizar a UI: recarregar a página para refletir a exclusão
      // Ou, alternativamente, filtrar o item da lista 'data' localmente
      // e atualizar o estado, se 'data' for gerenciado por estado no componente pai.
      // Por simplicidade e para garantir consistência com o servidor, recarregamos.
      setShowDeleteConfirm(null);
      // Forçar recarregamento da página para atualizar a lista
      window.location.reload(); 
    } catch (error) {
      console.error("Erro ao deletar técnico:", error);
      toast.error((error as Error).message || "Não foi possível deletar a técnico. Tente novamente.");
      setShowDeleteConfirm(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleEditClick = (id: string) => {
    const tecnicoEdit = data.find(tecnico => tecnico.id === id) || null;
    setCurrentTecnico(tecnicoEdit);
    setEditDialogOpen(true);
  };
  
  const handleSaveEdit = (updatedData: Tecnico) => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log('Dados atualizados:', updatedData);
    // Após salvar, você atualizaria o estado ou recarregaria os dados
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/dashboard/tecnico/novo">
            <Plus className="h-4 w-4 mr-2" /> Novo
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo de Técnico</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>UF</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tecnico) => (
            <TableRow key={tecnico.id}>
              <TableCell className="font-medium">{tecnico.nome}</TableCell>
              <TableCell>{tecnico.tipoProfissional}</TableCell>
              <TableCell>{tecnico.cidade}</TableCell>
              <TableCell>{tecnico.uf}</TableCell>
              <TableCell className="text-right space-x-2">
                {showDeleteConfirm === tecnico.id ? (
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleConfirmDelete(tecnico.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Confirmar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancelDelete}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      aria-label="Editar Técnico"
                      onClick={() => handleEditClick(tecnico.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            aria-label="Deletar Técnico"
                            onClick={() => handleDeleteClick(tecnico.id)}
                            className="hover:bg-transparent"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-black">
                          Deletar
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Diálogo de edição */}
      <EditTecnicoDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tecnicoData={currentTecnico}
        onSave={handleSaveEdit}
      />
    </>
  );
}

export default TecnicoTable;