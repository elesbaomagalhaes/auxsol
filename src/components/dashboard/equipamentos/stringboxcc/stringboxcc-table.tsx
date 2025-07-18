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
import { Trash2, Edit, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { EditStringBoxCCDialog } from "./edit-dialog";
import { type StringBoxCC } from "../types";
import Link from "next/link";
import { toast } from "sonner";
// Usando o tipo StringBoxCC importado de ./types

interface StringBoxCCTableProps {
  data: StringBoxCC[];
}

export function StringBoxCCTable({ data }: StringBoxCCTableProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Added for loading state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentStringBox, setCurrentStringBox] = useState<StringBoxCC | null>(null);

  const handleDeleteClick = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleConfirmDelete = async (id: string) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/equipamentos/protecaocc/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao deletar String Box CC: ${response.status}`);
      }

      toast.success("String Box CC deletada com sucesso!");
      // Atualizar a UI: recarregar a página para refletir a exclusão
      // Ou, alternativamente, filtrar o item da lista 'data' localmente
      // e atualizar o estado, se 'data' for gerenciado por estado no componente pai.
      // Por simplicidade e para garantir consistência com o servidor, recarregamos.
      setShowDeleteConfirm(null);
      // Forçar recarregamento da página para atualizar a lista
      window.location.reload(); 
    } catch (error) {
      console.error("Erro ao deletar String Box:", error);
      toast.error((error as Error).message || "Não foi possível deletar a String Box. Tente novamente.");
      setShowDeleteConfirm(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleEditClick = (id: string) => {
    const stringBoxToEdit = data.find(sb => sb.id === id) || null;
    setCurrentStringBox(stringBoxToEdit);
    setEditDialogOpen(true);
  };
  
  const handleSaveEdit = (updatedData: StringBoxCC) => {
    // Aqui você implementaria a lógica para salvar as alterações
    console.log('Dados atualizados:', updatedData);
    // Após salvar, você atualizaria o estado ou recarregaria os dados
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link href="/dashboard/equipamentos/protecao/cc/novo">
            <Plus className="h-4 w-4 mr-2" /> Novo
          </Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fabricante</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Entradas/Saídas</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((stringBox) => (
            <TableRow key={stringBox.id}>
              <TableCell className="font-medium">{stringBox.fabricante}</TableCell>
              <TableCell>{stringBox.modelo}</TableCell>
              <TableCell>{`${stringBox.numeroEntradas}/${stringBox.numeroSaidas}`}</TableCell>
              <TableCell className="text-right space-x-2">
                {showDeleteConfirm === stringBox.id ? (
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleConfirmDelete(stringBox.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
                      aria-label="Editar StringBox CC"
                      onClick={() => handleEditClick(stringBox.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            aria-label="Deletar String Box CC"
                            onClick={() => handleDeleteClick(stringBox.id)}
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
      <EditStringBoxCCDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        stringBoxData={currentStringBox}
        onSave={handleSaveEdit}
      />
    </>
  );
}