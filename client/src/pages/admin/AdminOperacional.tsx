import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  RefreshCw, Search, Clock, FileText, Package, CheckCircle, Wrench, Car, 
  AlertTriangle, Eye, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { ordensServicoMock, mecanicosMock, statusList } from "@/lib/mockData";

interface WorkflowEtapa {
  id: string;
  nome: string;
  ordem: number;
  cor: string;
  icone: string;
}

interface VehicleInWorkflow {
  id: string;
  plate: string;
  model: string;
  status: string;
  mechanic_name: string | null;
  client_name: string | null;
  days_in_stage: number;
  final_price: number;
}

const etapaIcons: Record<string, React.ElementType> = {
  'search': Search,
  'file-text': FileText,
  'clock': Clock,
  'package': Package,
  'check-circle': CheckCircle,
  'wrench': Wrench,
  'car': Car,
};

export default function AdminOperacional() {
  const [etapas, setEtapas] = useState<WorkflowEtapa[]>([]);
  const [vehiclesByEtapa, setVehiclesByEtapa] = useState<Record<string, VehicleInWorkflow[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEtapa, setSelectedEtapa] = useState<WorkflowEtapa | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMechanic, setFilterMechanic] = useState<string>("all");
  const [capacidade, setCapacidade] = useState({ atual: 0, maxima: 20 });
  const [showDelayedModal, setShowDelayedModal] = useState(false);

  const fetchData = () => {
    // Usar dados mock
    const etapasData: WorkflowEtapa[] = statusList.filter(s => s.status !== "Entregue").map(s => ({
      id: s.id.toString(),
      nome: s.status,
      ordem: s.ordem,
      cor: s.cor,
      icone: s.ordem === 1 ? 'search' : s.ordem === 2 ? 'file-text' : s.ordem <= 4 ? 'clock' : s.ordem <= 6 ? 'wrench' : 'car'
    }));
    
    setEtapas(etapasData);

    // Agrupar OS por status
    const grouped: Record<string, VehicleInWorkflow[]> = {};
    etapasData.forEach(e => { grouped[e.id] = []; });

    ordensServicoMock.forEach(os => {
      const etapa = etapasData.find(e => e.nome === os.status);
      if (etapa) {
        const daysInStage = Math.floor((new Date().getTime() - new Date(os.dataEntrada).getTime()) / (1000 * 60 * 60 * 24));
        grouped[etapa.id].push({
          id: os.id.toString(),
          plate: os.placa,
          model: os.veiculo,
          status: os.status,
          mechanic_name: os.mecanico,
          client_name: os.cliente,
          days_in_stage: daysInStage,
          final_price: os.valorTotalOs,
        });
      }
    });

    setVehiclesByEtapa(grouped);
    setCapacidade({ atual: ordensServicoMock.length, maxima: 20 });
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    toast.success("Dados atualizados!");
  };

  const getCapacidadeStatus = () => {
    const percentage = (capacidade.atual / capacidade.maxima) * 100;
    if (percentage <= 75) return { color: 'bg-green-500', label: 'CAPACIDADE OK', textColor: 'text-green-500' };
    if (percentage <= 100) return { color: 'bg-yellow-500', label: 'ATENÇÃO', textColor: 'text-yellow-500' };
    return { color: 'bg-red-500', label: 'OFICINA CHEIA', textColor: 'text-red-500' };
  };

  const capacidadeStatus = getCapacidadeStatus();

  const getDelayedVehicles = () => {
    const delayed: VehicleInWorkflow[] = [];
    Object.values(vehiclesByEtapa).forEach(vehicles => {
      vehicles.forEach(v => {
        if (v.days_in_stage > 5) delayed.push(v);
      });
    });
    return delayed.sort((a, b) => b.days_in_stage - a.days_in_stage);
  };

  const getDaysBadgeColor = (days: number) => {
    if (days <= 2) return 'bg-green-500/20 text-green-500';
    if (days <= 5) return 'bg-yellow-500/20 text-yellow-500';
    return 'bg-red-500/20 text-red-500';
  };

  const filteredVehicles = (vehicles: VehicleInWorkflow[]) => {
    return vehicles.filter(v => {
      const matchesSearch = searchTerm === "" || 
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMechanic = filterMechanic === "all" || v.mechanic_name === filterMechanic;
      
      return matchesSearch && matchesMechanic;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Operacional</h1>
              <p className="text-gray-400">
                Visão em tempo real do fluxo da oficina
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDelayedModal(true)}
              className="gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Ver Atrasados ({getDelayedVehicles().length})
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Capacity Alert */}
        <Card className={`${capacidadeStatus.color}/10 border-${capacidadeStatus.color.replace('bg-', '')}/30`}>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${capacidadeStatus.color} animate-pulse`} />
                <span className={`font-semibold ${capacidadeStatus.textColor}`}>
                  {capacidadeStatus.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-bold text-white">
                  {capacidade.atual} / {capacidade.maxima}
                </span>
                <span className="text-gray-400">veículos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por placa, modelo ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1a1f26] border-gray-700"
            />
          </div>
          <Select value={filterMechanic} onValueChange={setFilterMechanic}>
            <SelectTrigger className="w-[200px] bg-[#1a1f26] border-gray-700">
              <SelectValue placeholder="Filtrar mecânico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos mecânicos</SelectItem>
              {mecanicosMock.filter(m => m.empresaId === 1).map(m => (
                <SelectItem key={m.id} value={m.nome}>{m.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Workflow Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {etapas.map(etapa => {
            const vehicles = filteredVehicles(vehiclesByEtapa[etapa.id] || []);
            const IconComponent = etapaIcons[etapa.icone] || Car;
            
            return (
              <Card 
                key={etapa.id} 
                className="bg-[#1a1f26] border-gray-800 cursor-pointer hover:border-gray-600 transition-all"
                onClick={() => setSelectedEtapa(etapa)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${etapa.cor}20` }}
                    >
                      <IconComponent className="w-4 h-4" style={{ color: etapa.cor }} />
                    </div>
                    <span className="text-white truncate">{etapa.nome}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{vehicles.length}</div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {vehicles.slice(0, 3).map(v => (
                      <div key={v.id} className="p-2 bg-[#252b33] rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{v.plate}</span>
                          <Badge className={getDaysBadgeColor(v.days_in_stage)}>
                            {v.days_in_stage}d
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{v.model}</p>
                      </div>
                    ))}
                    {vehicles.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">+{vehicles.length - 3} mais</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Etapa Detail Modal */}
        <Dialog open={!!selectedEtapa} onOpenChange={() => setSelectedEtapa(null)}>
          <DialogContent className="max-w-2xl bg-[#1a1f26] border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                {selectedEtapa && (
                  <>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedEtapa.cor}20` }}
                    >
                      {(() => {
                        const IconComponent = etapaIcons[selectedEtapa.icone] || Car;
                        return <IconComponent className="w-4 h-4" style={{ color: selectedEtapa.cor }} />;
                      })()}
                    </div>
                    {selectedEtapa.nome}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {selectedEtapa && filteredVehicles(vehiclesByEtapa[selectedEtapa.id] || []).map(v => (
                <div key={v.id} className="p-4 bg-[#252b33] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-lg font-bold text-white">{v.plate}</span>
                      <span className="text-gray-400 ml-2">{v.model}</span>
                    </div>
                    <Badge className={getDaysBadgeColor(v.days_in_stage)}>
                      {v.days_in_stage} dias
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Cliente:</span>
                      <span className="text-white ml-2">{v.client_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Mecânico:</span>
                      <span className="text-white ml-2">{v.mechanic_name || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Valor:</span>
                      <span className="text-green-400 ml-2">R$ {v.final_price.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delayed Vehicles Modal */}
        <Dialog open={showDelayedModal} onOpenChange={setShowDelayedModal}>
          <DialogContent className="max-w-2xl bg-[#1a1f26] border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Veículos Atrasados (+5 dias)
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {getDelayedVehicles().map(v => (
                <div key={v.id} className="p-4 bg-[#252b33] rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-lg font-bold text-white">{v.plate}</span>
                      <span className="text-gray-400 ml-2">{v.model}</span>
                    </div>
                    <Badge className="bg-red-500/20 text-red-500">
                      {v.days_in_stage} dias
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="text-white ml-2">{v.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Mecânico:</span>
                      <span className="text-white ml-2">{v.mechanic_name || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {getDelayedVehicles().length === 0 && (
                <p className="text-center text-gray-400 py-8">Nenhum veículo atrasado!</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
