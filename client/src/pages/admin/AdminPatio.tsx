import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Car, Search, Clock, Wrench, CheckCircle, AlertTriangle, Timer, Loader2, GripVertical } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Status do Kanban com cores
const kanbanColumns = [
  { id: "diagnostico", label: "Diagnóstico", cor: "#3B82F6", icon: Search },
  { id: "orcamento", label: "Orçamento", cor: "#8B5CF6", icon: AlertTriangle },
  { id: "aprovacao", label: "Aprovação", cor: "#F59E0B", icon: Timer },
  { id: "execucao", label: "Em Execução", cor: "#06B6D4", icon: Wrench },
  { id: "pronto", label: "Pronto", cor: "#22C55E", icon: CheckCircle },
];

export default function AdminPatio() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroConsultor, setFiltroConsultor] = useState("todos");
  const [draggedOS, setDraggedOS] = useState<number | null>(null);

  // tRPC queries
  const { data: ordensServico = [], isLoading, refetch } = trpc.ordensServico.list.useQuery();
  const { data: recursos = [] } = trpc.recursos.list.useQuery();
  const { data: colaboradores = [] } = trpc.colaboradores.list.useQuery();

  // tRPC mutation para atualizar status
  const updateStatusMutation = trpc.ordensServico.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado!");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });

  // Filtrar veículos no pátio (não entregues)
  const veiculosNoPatio = ordensServico.filter(os => 
    os.status !== "entregue" && os.status !== "cancelado"
  );

  // Aplicar filtros
  const filteredVeiculos = veiculosNoPatio.filter(os => {
    const matchSearch = searchTerm === "" || 
      (os.placa?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (os.numeroOs?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchConsultor = filtroConsultor === "todos" || 
      os.colaboradorId === parseInt(filtroConsultor);
    
    return matchSearch && matchConsultor;
  });

  // Agrupar por status para o Kanban
  const getOSByStatus = (statusId: string) => {
    return filteredVeiculos.filter(os => {
      const status = os.status?.toLowerCase() || "";
      if (statusId === "diagnostico") return status === "diagnostico";
      if (statusId === "orcamento") return status === "orcamento";
      if (statusId === "aprovacao") return status === "aprovacao" || status === "aguardando_aprovacao";
      if (statusId === "execucao") return status === "execucao" || status === "em_execucao";
      if (statusId === "pronto") return status === "pronto" || status === "aguardando_retirada";
      return false;
    });
  };

  // Calcular tempo no pátio
  const calcularTempoNoPatio = (dataEntrada: Date | string | null) => {
    if (!dataEntrada) return "-";
    const entrada = new Date(dataEntrada);
    const agora = new Date();
    const diffMs = agora.getTime() - entrada.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);
    
    if (diffDias > 0) return `${diffDias}d ${diffHoras % 24}h`;
    return `${diffHoras}h`;
  };

  // Drag and Drop handlers
  const handleDragStart = (osId: number) => {
    setDraggedOS(osId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedOS) {
      updateStatusMutation.mutate({ id: draggedOS, status: newStatus });
      setDraggedOS(null);
    }
  };

  // Consultores para filtro
  const consultores = colaboradores.filter(c => 
    c.cargo?.toLowerCase().includes("consultor")
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-red-500" />
            Pátio - Visão Kanban
          </h1>
          <p className="text-slate-400">Arraste os cards para alterar o status</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {kanbanColumns.map((col) => {
          const count = getOSByStatus(col.id).length;
          const Icon = col.icon;
          return (
            <Card key={col.id} className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-4 flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${col.cor}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color: col.cor }} />
                </div>
                <div>
                  <p className="text-slate-400 text-xs">{col.label}</p>
                  <p className="text-xl font-bold text-white">{count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por placa ou número da OS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <Select value={filtroConsultor} onValueChange={setFiltroConsultor}>
          <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Consultor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos consultores</SelectItem>
            {consultores.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Recursos da Oficina */}
      <Card className="bg-slate-900/50 border-slate-800 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm">Recursos da Oficina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recursos.map((recurso) => {
              const osUsando = veiculosNoPatio.find(os => os.recursoId === recurso.id);
              return (
                <div
                  key={recurso.id}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    osUsando 
                      ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                      : "bg-green-500/20 text-green-400 border border-green-500/30"
                  }`}
                  title={osUsando ? `Em uso: ${osUsando.placa}` : "Disponível"}
                >
                  {recurso.nomeRecurso}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
        {kanbanColumns.map((col) => {
          const osNaColuna = getOSByStatus(col.id);
          const Icon = col.icon;
          
          return (
            <div
              key={col.id}
              className="bg-slate-900/30 rounded-lg p-3 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Header da coluna */}
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
                <Icon className="h-4 w-4" style={{ color: col.cor }} />
                <span className="text-white font-medium text-sm">{col.label}</span>
                <Badge 
                  className="ml-auto border-0 text-xs"
                  style={{ backgroundColor: `${col.cor}30`, color: col.cor }}
                >
                  {osNaColuna.length}
                </Badge>
              </div>

              {/* Cards da coluna */}
              <div className="space-y-3">
                {osNaColuna.map((os) => (
                  <div
                    key={os.id}
                    draggable
                    onDragStart={() => handleDragStart(os.id)}
                    className={`bg-slate-800/80 rounded-lg p-3 cursor-grab hover:bg-slate-800 transition-all border border-slate-700 hover:border-slate-600 ${
                      draggedOS === os.id ? "opacity-50" : ""
                    }`}
                    onClick={() => setLocation(`/admin/os/${os.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold">{os.placa || "-"}</span>
                      <GripVertical className="h-4 w-4 text-slate-500" />
                    </div>
                    <p className="text-slate-400 text-xs mb-1 truncate">
                      {os.numeroOs}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {calcularTempoNoPatio(os.dataEntrada)}
                      </span>
                      {os.valorTotalOs && parseFloat(os.valorTotalOs) > 0 && (
                        <span className="text-green-400 font-medium">
                          R$ {parseFloat(os.valorTotalOs).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {osNaColuna.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    Nenhum veículo
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total no pátio */}
      <div className="mt-6 text-center text-slate-400">
        Total de veículos no pátio: <span className="text-white font-bold">{veiculosNoPatio.length}</span>
      </div>
    </div>
  );
}
