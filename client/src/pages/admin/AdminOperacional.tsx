import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wrench,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  ordensServicoMock,
  colaboradoresMock,
  agendamentosMock,
  mecanicosMock,
} from "@/lib/mockData";

export default function AdminOperacional() {
  const [consultorFiltro, setConsultorFiltro] = useState("todos");

  // Dados mock para o operacional
  const capacidadeTotal = 20;
  const veiculosNoPatio = ordensServicoMock.filter(os => os.status !== "Entregue").length;
  const capacidadePercent = Math.round((veiculosNoPatio / capacidadeTotal) * 100);
  
  const emExecucao = ordensServicoMock.filter(os => os.status === "Em Execução").length;
  const retornoNaOficina = 1; // mock
  const foraLoja = 1; // mock

  // Status do pátio
  const statusPatio = [
    { titulo: "Diagnóstico", valor: ordensServicoMock.filter(os => os.status === "Diagnóstico").length, subtitulo: "em análise", cor: "border-red-500" },
    { titulo: "Orçamentos Pendentes", valor: ordensServicoMock.filter(os => os.status === "Orçamento").length, subtitulo: "aguardando consultor", cor: "border-yellow-500" },
    { titulo: "Aguard. Aprovação", valor: ordensServicoMock.filter(os => os.status === "Aguardando Aprovação").length, subtitulo: "pendente", cor: "border-yellow-500" },
    { titulo: "Aguard. Peças", valor: ordensServicoMock.filter(os => os.status === "Aguardando Peça").length, subtitulo: "esperando", cor: "border-orange-500" },
    { titulo: "Pronto pra Iniciar", valor: ordensServicoMock.filter(os => os.status === "Pronto para Iniciar").length, subtitulo: "aguardando", cor: "border-green-500" },
    { titulo: "Em Execução", valor: emExecucao, subtitulo: "trabalhando", cor: "border-cyan-500" },
    { titulo: "Prontos", valor: ordensServicoMock.filter(os => os.status === "Pronto" || os.status === "Aguardando Retirada").length, subtitulo: "aguardando retirada", cor: "border-purple-500" },
    { titulo: "Agendados Hoje", valor: agendamentosMock.filter(a => a.dataAgendamento === "2026-02-03").length, subtitulo: "para entrar", cor: "border-blue-500", destaque: true },
  ];

  // Veículos atrasados (mock)
  const veiculosAtrasados = 4;

  // Tempo médio de permanência por etapa (mock)
  const tempoMedioPorEtapa = [
    { etapa: "Diagnóstico", dias: 0.0, veiculos: 0, alerta: false },
    { etapa: "Orçamentos", dias: 0.0, veiculos: 0, alerta: false },
    { etapa: "Aguard. Aprovação", dias: 0.0, veiculos: 0, alerta: false },
    { etapa: "Aguard. Peças", dias: 17.0, veiculos: 1, alerta: true },
    { etapa: "Pronto pra Iniciar", dias: 0.0, veiculos: 0, alerta: false },
    { etapa: "Em Execução", dias: 2.0, veiculos: 4, alerta: false },
    { etapa: "Prontos", dias: 1.0, veiculos: 1, alerta: false },
  ];

  // Agenda dos mecânicos do dia (mock)
  const agendaMecanicosDia = mecanicosMock.slice(0, 6).map(mec => {
    const osDoMecanico = ordensServicoMock.filter(os => os.mecanicoId === mec.id && os.status !== "Entregue");
    return {
      ...mec,
      osAtribuidas: osDoMecanico.length,
      status: osDoMecanico.length > 0 ? "ocupado" : "livre",
      osAtual: osDoMecanico[0] || null,
    };
  });

  const consultores = colaboradoresMock.filter(c => c.cargo === "Consultor Técnico");

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header com abas */}
      <header className="bg-[#1a1f26] border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold">Doctor Auto</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin/operacional">
              <span className="flex items-center gap-2 text-blue-400 border-b-2 border-blue-400 pb-1 cursor-pointer">
                <Wrench className="h-4 w-4" />
                Operacional
              </span>
            </Link>
            <Link href="/admin/financeiro">
              <span className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                <DollarSign className="h-4 w-4" />
                Financeiro
              </span>
            </Link>
            <Link href="/admin/produtividade">
              <span className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                <TrendingUp className="h-4 w-4" />
                Produtividade
              </span>
            </Link>
            <Link href="/admin/agendamentos">
              <span className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                <Calendar className="h-4 w-4" />
                Agenda
              </span>
            </Link>
            <Link href="/admin/overview">
              <span className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                <Clock className="h-4 w-4" />
                Histórico
              </span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="p-6">
        {/* Título e Cards de Status */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Oficina Doctor Auto</h1>
              <p className="text-gray-400">Gestão de Pátio em Tempo Real</p>
            </div>
            <div className="flex gap-3">
              {/* Capacidade */}
              <Card className={`bg-green-500/10 border-2 ${capacidadePercent > 80 ? "border-red-500" : "border-green-500"}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <CheckCircle className={`h-8 w-8 ${capacidadePercent > 80 ? "text-red-400" : "text-green-400"}`} />
                  <div>
                    <p className={`font-bold ${capacidadePercent > 80 ? "text-red-400" : "text-green-400"}`}>
                      CAPACIDADE {capacidadePercent > 80 ? "ALTA" : "OK"}
                    </p>
                    <p className="text-gray-400 text-sm">Capacidade: {veiculosNoPatio}/{capacidadeTotal} ({capacidadePercent}%)</p>
                    <p className="text-gray-500 text-xs">Clique para ver placas</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fluxo */}
              <Card className="bg-green-500/10 border-2 border-green-500">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-green-400 font-bold">FLUXO OK</p>
                    <p className="text-gray-400 text-sm">🔧 Em Execução: {emExecucao}</p>
                    <p className="text-gray-500 text-xs">Clique para ver placas</p>
                  </div>
                </CardContent>
              </Card>

              {/* Retorno */}
              <Card className="bg-red-500/10 border-2 border-red-500">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {retornoNaOficina}
                  </div>
                  <div>
                    <p className="text-red-400 font-bold">RETORNO</p>
                    <p className="text-gray-400 text-sm">Na oficina</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fora da Loja */}
              <Card className="bg-blue-500/10 border-2 border-blue-500">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {foraLoja}
                  </div>
                  <div>
                    <p className="text-blue-400 font-bold flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      FORA DA LOJA
                    </p>
                    <p className="text-gray-400 text-sm">Externos</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Status Pátio */}
        <Card className="bg-[#1a1f26] border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Status Pátio</h2>
              <Select value={consultorFiltro} onValueChange={setConsultorFiltro}>
                <SelectTrigger className="w-48 bg-[#252b33] border-gray-700 text-white">
                  <SelectValue placeholder="Todos Consultores" />
                </SelectTrigger>
                <SelectContent className="bg-[#252b33] border-gray-700">
                  <SelectItem value="todos" className="text-white">Todos Consultores</SelectItem>
                  {consultores.map(c => (
                    <SelectItem key={c.id} value={String(c.id)} className="text-white">{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {statusPatio.map((status, idx) => (
                <Card 
                  key={idx} 
                  className={`border-l-4 ${status.cor} ${status.destaque ? "bg-blue-500/10" : "bg-[#252b33]"} border-t-0 border-r-0 border-b-0`}
                >
                  <CardContent className="p-4">
                    <p className={`text-sm ${status.destaque ? "text-blue-400" : "text-red-400"}`}>{status.titulo}</p>
                    <p className="text-4xl font-bold text-white my-2">{status.valor}</p>
                    <p className="text-gray-500 text-sm">{status.subtitulo}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Veículos Atrasados */}
        <Card className="bg-yellow-500/10 border-2 border-yellow-500 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
                <div>
                  <p className="text-yellow-400 font-bold">⚠️ VEÍCULOS ATRASADOS</p>
                  <p className="text-gray-400 text-sm">Previsão de entrega ultrapassada</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-yellow-400">{veiculosAtrasados}</p>
                <p className="text-gray-400 text-sm">críticos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tempo Médio de Permanência por Etapa */}
        <Card className="bg-[#1a1f26] border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-white font-bold">Tempo Médio de Permanência por Etapa</h2>
              <p className="text-gray-400 text-sm">Análise de gargalos operacionais</p>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {tempoMedioPorEtapa.map((etapa, idx) => (
                <Card 
                  key={idx} 
                  className={`${etapa.alerta ? "bg-red-500/10 border-red-500" : "bg-[#252b33] border-gray-700"}`}
                >
                  <CardContent className="p-4 text-center">
                    <p className="text-gray-400 text-xs mb-2">{etapa.etapa}</p>
                    <p className={`text-2xl font-bold ${etapa.alerta ? "text-red-400" : "text-white"}`}>
                      {etapa.dias.toFixed(1)}
                    </p>
                    <p className="text-gray-500 text-xs">dias médio</p>
                    <p className="text-gray-600 text-xs">({etapa.veiculos} veículos)</p>
                    {etapa.alerta && <AlertTriangle className="h-4 w-4 text-red-400 mx-auto mt-2" />}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <p className="text-red-400 text-sm">
                🚨 <strong>Gargalos identificados:</strong> Etapas marcadas com ⚠️ estão acima do tempo médio geral e requerem atenção.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Agenda dos Mecânicos do Dia */}
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-bold">Agenda dos Mecânicos - Hoje</h2>
                <p className="text-gray-400 text-sm">Distribuição de trabalho do dia</p>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {agendaMecanicosDia.map((mec) => (
                <Card 
                  key={mec.id} 
                  className={`${mec.status === "ocupado" ? "bg-cyan-500/10 border-cyan-500" : "bg-green-500/10 border-green-500"} border`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-bold">{mec.nome}</p>
                      <span className={`px-2 py-1 rounded text-xs ${mec.status === "ocupado" ? "bg-cyan-500/20 text-cyan-400" : "bg-green-500/20 text-green-400"}`}>
                        {mec.status === "ocupado" ? "Ocupado" : "Livre"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{mec.especialidade}</p>
                    <p className="text-gray-500 text-xs">{mec.grauConhecimento}</p>
                    {mec.osAtual && (
                      <div className="mt-3 p-2 bg-white/5 rounded">
                        <p className="text-white text-sm font-medium">{mec.osAtual.placa}</p>
                        <p className="text-gray-400 text-xs">{mec.osAtual.veiculo}</p>
                        <p className="text-cyan-400 text-xs">{mec.osAtual.status}</p>
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-gray-500 text-xs">OS atribuídas:</span>
                      <span className="text-white font-bold">{mec.osAtribuidas}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
