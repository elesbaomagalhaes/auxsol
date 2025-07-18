"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CargaForm } from "@/components/dashboard/carga/carga-form";
import { CargaTable } from "@/components/dashboard/carga/carga-table";
import { toast } from "sonner";

interface CargaItem {
  id: string;
  idEquipamento: string;
  qtd: number;
  potenciaW: number;
  createdAt: string;
  updatedAt: string;
}



export default function CargaPage() {
  const searchParams = useSearchParams();
  const projetoId = searchParams.get("projeto");
  
  const [cargas, setCargas] = useState<CargaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [numProjeto, setNumProjeto] = useState<string | null>(null);
  const [potenciaGerador, setPotenciaGerador] = useState<number>(0);


  // Calcular potência total
  const potenciaTotal = cargas.reduce((total, carga) => {
    if (!carga || carga.qtd === undefined || carga.potenciaW === undefined) {
      return total;
    }
    return total + (Number(carga.qtd) * Number(carga.potenciaW));
  }, 0);

  // Buscar dados do projeto e cargas
  const fetchProjetoData = async () => {
    if (!projetoId) return;
    
    try {
      // Primeiro buscar os dados do projeto para obter o numProjeto
      const projetoResponse = await fetch(`/api/projeto/${projetoId}`);
      if (projetoResponse.ok) {
        const projetoData = await projetoResponse.json();
        setNumProjeto(projetoData.numProjeto);
        setPotenciaGerador(Number(projetoData.potenciaGerador) || 0);
        
        // Depois buscar as cargas usando o numProjeto
        const cargaResponse = await fetch(`/api/carga?numProjeto=${projetoData.numProjeto}`);
        if (cargaResponse.ok) {
          const cargaData = await cargaResponse.json();
          setCargas(cargaData.cargas || []);
        } else {
          toast.error("Erro ao carregar cargas");
        }
      } else {
        toast.error("Projeto não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados do projeto");
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova carga e recarregar dados
  const handleAddCarga = async (novaCarga: CargaItem) => {
    // Adicionar temporariamente à lista para feedback imediato
    setCargas(prev => [...prev, novaCarga]);
    
    // Recarregar dados do servidor para garantir consistência
    try {
      const cargaResponse = await fetch(`/api/carga?numProjeto=${numProjeto}`);
      if (cargaResponse.ok) {
        const cargaData = await cargaResponse.json();
        setCargas(cargaData.cargas || []);
      }
    } catch (error) {
      console.error("Erro ao recarregar cargas:", error);
      // Em caso de erro, manter a adição local
    }
  };

  // Remover carga
  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/carga?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setCargas(prev => prev.filter(carga => carga.id !== id));
        toast.success("Carga removida com sucesso!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao remover carga");
      }
    } catch (error) {
      console.error("Erro ao remover carga:", error);
      toast.error("Erro ao remover carga");
    }
  };

  useEffect(() => {
    fetchProjetoData();
  }, [projetoId]);

  if (!projetoId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              ID do projeto não encontrado. Acesse esta página através de um projeto específico.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Carregando dados do projeto...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!numProjeto) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Projeto não encontrado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">C.I - Carga Instalada - {numProjeto}</h1>
        <div className="text-lg font-semibold">
          <Badge 
            variant="secondary" 
            className="text-lg px-4 py-2 bg-gray-100 text-gray-800 border-gray-200"
            title="Geração Distribuída"
          >
            GD: {potenciaGerador.toFixed(0)} Wp
          </Badge>
        </div>
      </div>

      {/* Formulário para adicionar carga */}
      <CargaForm numProjeto={numProjeto} onSuccess={handleAddCarga} />

      {/* Tabela de cargas */}
      <CargaTable 
        cargas={cargas} 
        onRemove={handleRemove} 
        loading={loading} 
      />
    </div>
  );
}