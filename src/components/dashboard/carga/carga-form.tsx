"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HousePlus } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  equipamentoId: string;
  quantidade: number;
  potencia: number;
}

interface Equipamento {
  id: string;
  descricao: string;
  tipo: string;
  potencia: number;
  fatorPotencia: number;
  tensao: number;
}

interface CargaFormProps {
  numProjeto: string;
  onSuccess: (carga: any) => void;
}

export function CargaForm({ numProjeto, onSuccess }: CargaFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    equipamentoId: '',
    quantidade: 1,
    potencia: 0
  });

  // Buscar equipamentos disponíveis
  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const response = await fetch('/api/equipamentos/gerais');
        if (response.ok) {
          const data = await response.json();
          setEquipamentos(data);
        } else {
          toast.error('Erro ao carregar equipamentos');
        }
      } catch (error) {
        console.error('Erro ao buscar equipamentos:', error);
        toast.error('Erro ao carregar equipamentos');
      } finally {
        setLoadingEquipamentos(false);
      }
    };

    fetchEquipamentos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.equipamentoId || !formData.quantidade || !formData.potencia) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    const quantidade = formData.quantidade;
    const potencia = formData.potencia;

    if (quantidade <= 0) {
      toast.error("A quantidade deve ser maior que zero");
      return;
    }

    if (potencia <= 0) {
      toast.error("A potência deve ser maior que zero");
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch("/api/carga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numProjeto,
          idEquipamento: formData.equipamentoId,
          qtd: formData.quantidade,
          potenciaW: formData.potencia
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data.carga);
        setFormData({ equipamentoId: "", quantidade: 1, potencia: 0 });
        toast.success("Equipamento adicionado com sucesso!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao adicionar equipamento");
      }
    } catch (error) {
      console.error("Erro ao adicionar carga:", error);
      toast.error("Erro ao adicionar equipamento");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HousePlus className="h-5 w-5" />
          Adicionar Equipamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-9 gap-4">
            <div className="col-span-5 space-y-2">
              <Label htmlFor="equipamento">Equipamento *</Label>
              <Select
                value={formData.equipamentoId}
                onValueChange={(value) => {
                  handleInputChange("equipamentoId", value);
                  // Auto-preencher potência baseada no equipamento selecionado
                  const equipamento = equipamentos.find(eq => eq.id === value);
                  if (equipamento) {
                    handleInputChange("potencia", equipamento.potencia);
                  }
                }}
                disabled={submitting || loadingEquipamentos}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingEquipamentos ? "Carregando..." : "Selecione um equipamento"} />
                </SelectTrigger>
                <SelectContent>
                  {equipamentos.map((equipamento) => (
                    <SelectItem key={equipamento.id} value={equipamento.id}>
                      {equipamento.descricao} - {equipamento.tensao}V - {equipamento.potencia}W ({equipamento.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="quantidade">Quantidade *</Label>
              <div className="flex items-center border border-input rounded-md bg-background">
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  placeholder="Ex: 10"
                  value={formData.quantidade.toString()}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleInputChange("quantidade", value);
                  }}
                  required
                  disabled={submitting}
                  className="h-8 text-sm border-0 rounded-l-md rounded-r-none text-center focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 border-0 rounded-none hover:bg-muted"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, quantidade: Math.max(1, prev.quantidade - 1) }));
                  }}
                  disabled={submitting || formData.quantidade <= 1}
                >
                  -
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 border-0 rounded-r-md rounded-l-none hover:bg-muted"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, quantidade: prev.quantidade + 1 }));
                  }}
                  disabled={submitting}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="col-span-1 space-y-2">
              <Label htmlFor="potencia">Pot. (W)*</Label>
              <Input
                id="potencia"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex: 15.5"
                value={formData.potencia.toString()}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  handleInputChange("potencia", value);
                }}
                required
                disabled={submitting}
                readOnly
                className="h-8 text-sm bg-gray-50 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
            
            <div className="col-span-1 space-y-2">
              <Label className="invisible">Ação</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="submit" 
                      disabled={submitting} 
                      className="w-full h-8 text-sm bg-black hover:bg-gray-800 text-white p-0"
                      size="sm"
                    >
                      <HousePlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p className="text-black">Adicionar</p>
                   </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            * Campos obrigatórios
          </div>
        </form>
      </CardContent>
    </Card>
  );
}