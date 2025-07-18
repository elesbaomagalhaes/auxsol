"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CargaItem {
  id: string;
  idEquipamento: string;
  qtd: number;
  potenciaW: number;
  createdAt: string;
  updatedAt: string;
  equipamento?: {
    id: string;
    descricao: string;
    tipo: string;
    potencia: number;
    tensao: number;
  };
}

interface CargaTableProps {
  cargas: CargaItem[];
  onRemove: (id: string) => void;
  loading?: boolean;
}

export function CargaTable({ cargas, onRemove, loading = false }: CargaTableProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ids: string[], description: string} | null>(null);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await onRemove(id);
    } finally {
      setRemovingId(null);
    }
  };

  const handleRemoveGroup = async (ids: string[]) => {
    setRemovingId(ids[0]);
    try {
      // Remover todas as instâncias do equipamento
      for (const id of ids) {
        await onRemove(id);
      }
      toast.success("Carga removida com sucesso!");
    } finally {
      setRemovingId(null);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteClick = (ids: string[], description: string) => {
    setItemToDelete({ ids, description });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      handleRemoveGroup(itemToDelete.ids);
    }
  };

  // Agrupar cargas por equipamento
  const cargasAgrupadas = cargas.reduce((acc, carga) => {
    if (!carga || carga.qtd === undefined || carga.potenciaW === undefined) {
      return acc;
    }
    
    const key = carga.idEquipamento;
    if (!acc[key]) {
      acc[key] = {
        ...carga,
        qtd: 0,
        ids: []
      };
    }
    
    acc[key].qtd = Number(acc[key].qtd) + Number(carga.qtd);
    acc[key].ids.push(carga.id);
    
    return acc;
  }, {} as Record<string, CargaItem & { ids: string[] }>);

  const cargasAgrupadasArray = Object.values(cargasAgrupadas);

  // Calcular potência total
  const potenciaTotal = cargasAgrupadasArray.reduce((total, carga) => {
    return total + (Number(carga.qtd) * Number(carga.potenciaW));
  }, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipamentos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando cargas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Equipamentos Cadastrados</CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-800 hover:bg-green-200 text-lg px-4 py-2"
            title="Carga Instalada"
          >
            CI: {potenciaTotal.toFixed(0)} Wp
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {cargasAgrupadasArray.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma carga cadastrada ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-center">Potência (W)</TableHead>
                  <TableHead className="text-center">Potência (GD)</TableHead>
                  <TableHead className="text-center w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargasAgrupadasArray.map((carga) => (
                  <TableRow key={carga.idEquipamento}>
                    <TableCell className="font-medium">
                      {carga.equipamento?.descricao || carga.idEquipamento}
                    </TableCell>
                    <TableCell className="text-center">
                      {Number(carga.qtd).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      {Number(carga.potenciaW).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {(Number(carga.qtd) * Number(carga.potenciaW)).toFixed(2)} W
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(carga.ids, carga.equipamento?.descricao || carga.idEquipamento)}
                                  disabled={removingId === carga.ids[0]}
                                  className="h-8 w-8 p-0 hover:bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent className="text-black">
                              Deletar
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a carga "{itemToDelete?.description}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleConfirmDelete}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}