import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, User, Wrench, FileText, Phone, Clock, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Status com cores
const statusColors: Record<string, string> = {
  diagnostico: "#3B82F6",
  orcamento: "#8B5CF6",
  aprovacao: "#F59E0B",
  aguardando_aprovacao: "#F59E0B",
  execucao: "#06B6D4",
  em_execucao: "#06B6D4",
  pronto: "#22C55E",
  aguardando_retirada: "#84CC16",
  entregue: "#6B7280",
};

const statusLabels: Record<string, string> = {
  diagnostico: "Diagnóstico",
  orcamento: "Orçamento",
  aprovacao: "Aguardando Aprovação",
  aguardando_aprovacao: "Aguardando Aprovação",
  execucao: "Em Execução",
  em_execucao: "Em Execução",
  pronto: "Pronto",
  aguardando_retirada: "Aguardando Retirada",
  entregue: "Entregue",
};

export default function AdminPatioDetalhes() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const id = Number(params.id);
  
  // tRPC query
  const { data: osCompleta, isLoading } = trpc.ordensServico.getCompleta.useQuery({ id });

  const getStatusColor = (status: string) => {
    return statusColors[status?.toLowerCase()] || "#6B7280";
  };

  const getStatusLabel = (status: string) => {
    return statusLabels[status?.toLowerCase()] || status;
  };

  // Calcular tempo no pátio
  const calcularTempoNoPatio = (dataEntrada: Date | string | null) => {
    if (!dataEntrada) return "-";
    const entrada = new Date(dataEntrada);
    const agora = new Date();
    const diffMs = agora.getTime() - entrada.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);
    
    if (diffDias > 0) return `${diffDias} dias e ${diffHoras % 24} horas`;
    return `${diffHoras} horas`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (!osCompleta?.os) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/patio">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Veículo não encontrado</h1>
        </div>
      </div>
    );
  }

  const { os, cliente, veiculo, mecanico } = osCompleta;
  const statusColor = getStatusColor(os.status || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/patio">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-red-500" />
            {os.placa || veiculo?.placa || "-"}
          </h1>
          <p className="text-slate-400">{veiculo?.modelo || "-"}</p>
        </div>
        <Badge
          style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
          className="border-0 text-sm px-3 py-1"
        >
          {getStatusLabel(os.status || "")}
        </Badge>
      </div>

      {/* Tempo no pátio */}
      <Card className="bg-amber-500/10 border-amber-500/30 mb-6">
        <CardContent className="p-4 flex items-center gap-3">
          <Clock className="h-6 w-6 text-amber-400" />
          <div>
            <p className="text-amber-400 text-sm">Tempo no Pátio</p>
            <p className="text-white font-bold text-lg">{calcularTempoNoPatio(os.dataEntrada)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações do Veículo */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-400" />
              Informações do Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Placa</span>
              <span className="text-white font-medium">{os.placa || veiculo?.placa || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Veículo</span>
              <span className="text-white">{veiculo?.modelo || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Marca</span>
              <span className="text-white">{veiculo?.marca || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ano</span>
              <span className="text-white">{veiculo?.ano || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">KM</span>
              <span className="text-white">{os.km?.toLocaleString("pt-BR") || "-"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Cliente */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-green-400" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Nome</span>
              <span className="text-white font-medium">{cliente?.nomeCompleto || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Telefone</span>
              <span className="text-white">{cliente?.telefone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">OS</span>
              <span className="text-white">{os.numeroOs || "-"}</span>
            </div>
            {cliente?.telefone && (
              <Button 
                variant="outline" 
                className="w-full border-green-500 text-green-500 hover:bg-green-500/10"
                onClick={() => window.open(`https://wa.me/55${cliente.telefone?.replace(/\D/g, "")}`, "_blank")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contatar via WhatsApp
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Informações do Serviço */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-400" />
              Informações do Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Mecânico</span>
              <span className="text-white">{mecanico?.nome || "Não atribuído"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <Badge
                style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
                className="border-0"
              >
                {getStatusLabel(os.status || "")}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Motivo</span>
              <span className="text-white text-right max-w-[200px]">{os.motivoVisita || "-"}</span>
            </div>
            {os.descricaoProblema && (
              <div className="pt-2 border-t border-slate-700">
                <span className="text-slate-400 text-sm">Problema Relatado:</span>
                <p className="text-white text-sm mt-1">{os.descricaoProblema}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Valores */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              Valores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Orçado</span>
              <span className="text-white">
                R$ {parseFloat(os.totalOrcamento || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Valor Aprovado</span>
              <span className="text-green-400">
                R$ {parseFloat(os.valorAprovado || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700">
              <span className="text-slate-400">Valor Total OS</span>
              <span className="text-white font-bold text-xl">
                R$ {parseFloat(os.valorTotalOs || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-4 mt-6">
        <Button 
          className="bg-red-600 hover:bg-red-700"
          onClick={() => setLocation(`/admin/os/${os.id}`)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Ver OS Completa
        </Button>
      </div>
    </div>
  );
}
