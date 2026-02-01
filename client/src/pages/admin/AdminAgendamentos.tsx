import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Car,
  Search,
  Plus,
  Check,
  RefreshCw,
  X,
  Smartphone,
  Link2,
  Pencil,
  CheckCircle,
} from "lucide-react";

export default function AdminAgendamentos() {
  const [busca, setBusca] = useState("");
  const [filtroOrigem, setFiltroOrigem] = useState("todas");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  // Mock de agendamentos com dados completos
  const agendamentos = [
    {
      id: 1,
      clienteNome: "João Silva",
      origem: "App Cliente",
      origemIcon: "app",
      status: "Confirmado",
      data: "24/01/2024",
      hora: "09:00",
      veiculo: "Volkswagen Golf GTI 2020",
      placa: "ABC-1234",
      servicos: ["Troca de Óleo", "Revisão de Freios"],
      observacao: null,
    },
    {
      id: 2,
      clienteNome: "Maria Santos",
      origem: "Kommo CRM",
      origemIcon: "kommo",
      status: "Aguardando",
      data: "24/01/2024",
      hora: "10:30",
      veiculo: "Honda Civic 2022",
      placa: "XYZ-5678",
      servicos: ["Diagnóstico Elétrico"],
      observacao: "Lead do Kommo - primeiro contato",
    },
    {
      id: 3,
      clienteNome: "Carlos Oliveira",
      origem: "Manual",
      origemIcon: "manual",
      status: "Confirmado",
      data: "25/01/2024",
      hora: "14:00",
      veiculo: "Toyota Corolla 2021",
      placa: "DEF-9012",
      servicos: ["Alinhamento e Balanceamento"],
      observacao: null,
    },
    {
      id: 4,
      clienteNome: "Ana Paula",
      origem: "App Cliente",
      origemIcon: "app",
      status: "Aguardando",
      data: "25/01/2024",
      hora: "16:00",
      veiculo: "Jeep Compass 2023",
      placa: "GHI-3456",
      servicos: ["Revisão Completa"],
      observacao: null,
    },
  ];

  // Estatísticas
  const hoje = agendamentos.filter(a => a.data === "24/01/2024").length;
  const aguardando = agendamentos.filter(a => a.status === "Aguardando").length;
  const doKommo = agendamentos.filter(a => a.origem === "Kommo CRM").length;
  const confirmados = agendamentos.filter(a => a.status === "Confirmado").length;

  // Filtros
  const agendamentosFiltrados = agendamentos.filter(a => {
    const matchBusca = busca === "" || 
      a.clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
      a.placa.toLowerCase().includes(busca.toLowerCase()) ||
      a.veiculo.toLowerCase().includes(busca.toLowerCase());
    
    const matchOrigem = filtroOrigem === "todas" || a.origem === filtroOrigem;
    const matchStatus = filtroStatus === "todos" || a.status === filtroStatus;
    
    return matchBusca && matchOrigem && matchStatus;
  });

  const [, setLocation] = useLocation();
  const criarOS = trpc.ordensServico.create.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`OS ${data.numeroOs} criada com sucesso!`);
        // Redirecionar para o Operacional (Kanban) com a OS em Diagnóstico
        setLocation("/admin/operacional");
      } else {
        toast.error(data.error || "Erro ao criar OS");
      }
    },
    onError: () => {
      toast.error("Erro ao criar OS");
    },
  });

  const handleConfirmarChegada = (agendamento: typeof agendamentos[0]) => {
    // Criar OS automaticamente com status "diagnostico"
    criarOS.mutate({
      placa: agendamento.placa,
      motivoVisita: agendamento.servicos.join(", "),
      observacoes: agendamento.observacao || undefined,
    });
  };

  const getOrigemBadge = (origem: string, origemIcon: string) => {
    switch (origemIcon) {
      case "app":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Smartphone className="h-3 w-3" />
            {origem}
          </span>
        );
      case "kommo":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Link2 className="h-3 w-3" />
            {origem}
          </span>
        );
      case "manual":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30">
            <Pencil className="h-3 w-3" />
            {origem}
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "Confirmado") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 border border-green-500/30">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f1419] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
          <p className="text-gray-400 text-sm">Gerencie os agendamentos da oficina</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/novo-agendamento">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{hoje}</p>
              <p className="text-gray-400 text-sm">Hoje</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1f26] border-gray-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{aguardando}</p>
              <p className="text-gray-400 text-sm">Aguardando</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1f26] border-gray-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Link2 className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{doKommo}</p>
              <p className="text-gray-400 text-sm">Do Kommo</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1f26] border-gray-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{confirmados}</p>
              <p className="text-gray-400 text-sm">Confirmados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar cliente, placa ou veículo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-[#1a1f26] border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        <Select value={filtroOrigem} onValueChange={setFiltroOrigem}>
          <SelectTrigger className="w-40 bg-[#1a1f26] border-gray-700 text-white">
            <SelectValue placeholder="Todas origens" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1f26] border-gray-700">
            <SelectItem value="todas">Todas origens</SelectItem>
            <SelectItem value="App Cliente">App Cliente</SelectItem>
            <SelectItem value="Kommo CRM">Kommo CRM</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-40 bg-[#1a1f26] border-gray-700 text-white">
            <SelectValue placeholder="Todos status" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1f26] border-gray-700">
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="Confirmado">Confirmado</SelectItem>
            <SelectItem value="Aguardando">Aguardando</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white gap-2">
          <Calendar className="h-4 w-4" />
          Filtrar data
        </Button>
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {agendamentosFiltrados.map((agendamento) => (
          <Card key={agendamento.id} className="bg-[#1a1f26] border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {/* Nome e badges */}
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{agendamento.clienteNome}</span>
                    {getOrigemBadge(agendamento.origem, agendamento.origemIcon)}
                    {getStatusBadge(agendamento.status)}
                  </div>

                  {/* Data, hora, veículo */}
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {agendamento.data}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {agendamento.hora}
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      {agendamento.veiculo}
                    </span>
                    <span className="text-gray-500 font-mono">{agendamento.placa}</span>
                  </div>

                  {/* Serviços */}
                  <div className="flex items-center gap-2">
                    {agendamento.servicos.map((servico, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs"
                      >
                        🔧 {servico}
                      </span>
                    ))}
                  </div>

                  {/* Observação */}
                  {agendamento.observacao && (
                    <p className="text-gray-500 text-sm italic">{agendamento.observacao}</p>
                  )}
                </div>

                {/* Botões de ação */}
                <div className="flex items-center gap-2">
                  {agendamento.status === "Aguardando" && (
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-500 hover:bg-green-600/10 gap-2"
                      onClick={() => handleConfirmarChegada(agendamento)}
                    >
                      <Check className="h-4 w-4" />
                      Confirmar
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-500 hover:bg-blue-600/10 gap-2"
                    onClick={() => handleConfirmarChegada(agendamento)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirmar Chegada
                  </Button>

                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:bg-gray-600/10 gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reagendar
                  </Button>

                  <Button
                    variant="outline"
                    className="border-red-600 text-red-500 hover:bg-red-600/10 gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
