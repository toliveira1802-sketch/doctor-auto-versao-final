import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// Tabs removido - usando links diretos
import {
  LayoutDashboard,
  Eye,
  Car,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Wrench,
  DollarSign,
  TrendingUp,
  Users,
  ClipboardList,
  ChevronDown,
  PlusCircle,
  BarChart3,
} from "lucide-react";
import {
  dashboardStatsMock,
  ordensServicoMock,
  agendamentosMock,
  clientesMock,
  empresasMock,
  colaboradoresMock,
} from "@/lib/mockData";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [colaborador, setColaborador] = useState<any>(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(1);
  const [cadastroOpen, setCadastroOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("colaborador");
    if (stored) {
      setColaborador(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("colaborador");
    setLocation("/login");
  };

  const stats = dashboardStatsMock;
  
  // Pendências do dia - equipe de consultores técnicos
  const equipeConsultores = colaboradoresMock.filter(c => 
    ["Consultor Técnico", "Direção"].includes(c.cargo) && c.empresaId === empresaSelecionada
  ).slice(0, 3);
  
  // Métricas
  const veiculosNoPatio = ordensServicoMock.filter(os => os.status !== "Entregue").length;
  const agendamentosHoje = agendamentosMock.filter(a => a.dataAgendamento === "2026-02-03").length;
  const novosClientesMes = clientesMock.length;
  const retornoMes = ordensServicoMock.filter(os => os.status === "Entregue").length;
  const faturadoMes = stats.faturamentoMes;
  const valorGerarHoje = ordensServicoMock
    .filter(os => os.status === "Pronto" || os.status === "Aguardando Retirada")
    .reduce((acc, os) => acc + os.valorTotalOs, 0);
  const concluidosMes = ordensServicoMock.filter(os => os.status === "Entregue").length;

  const empresaAtual = empresasMock.find(e => e.id === empresaSelecionada);

  return (
    <div className="min-h-screen bg-[#0f1419] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1a1f26] border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">Doctor Auto</span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1">
          <Link href="/admin">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 bg-red-600 text-white hover:bg-red-700 h-9 text-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          
          <Link href="/admin/overview">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-white/5 h-9 text-sm"
            >
              <Eye className="h-4 w-4" />
              Visão Geral
            </Button>
          </Link>
          
          <Link href="/admin/nova-os">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-white/5 h-9 text-sm"
            >
              <PlusCircle className="h-4 w-4" />
              Nova OS
            </Button>
          </Link>
          
          <Link href="/admin/patio">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-white/5 h-9 text-sm"
            >
              <Car className="h-4 w-4" />
              Pátio
            </Button>
          </Link>
          
          <Link href="/admin/agendamentos">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-white/5 h-9 text-sm"
            >
              <Calendar className="h-4 w-4" />
              Agendamentos
            </Button>
          </Link>

          {/* Cadastro com submenu */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between gap-2 text-gray-400 hover:text-white hover:bg-white/5 h-9 text-sm"
              onClick={() => setCadastroOpen(!cadastroOpen)}
            >
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Cadastro
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${cadastroOpen ? "rotate-180" : ""}`} />
            </Button>
            {cadastroOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <Link href="/admin/clientes">
                  <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-white hover:bg-white/5 h-8 text-xs">
                    Clientes
                  </Button>
                </Link>
                <Link href="/admin/servicos">
                  <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-white hover:bg-white/5 h-8 text-xs">
                    Serviços
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <Link href="/admin/configuracoes">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-white/5 h-9 text-sm"
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </Link>
          
          {/* Gestão - visível para Direção e Gestão */}
          {colaborador && (colaborador.cargo === "Direção" || colaborador.cargo === "Gestão") && (
            <Link href="/gestao">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 h-9 text-sm border border-amber-500/30 mt-2"
              >
                <BarChart3 className="h-4 w-4" />
                Gestão
              </Button>
            </Link>
          )}
        </nav>

        {/* User Info */}
        <div className="p-3 border-t border-gray-800">
          {colaborador && (
            <div className="mb-2 px-2">
              <p className="text-white font-medium text-sm">{colaborador.nome}</p>
              <p className="text-gray-500 text-xs">{colaborador.cargo}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-gray-400 hover:text-red-400 h-9 text-sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 bg-[#1a1f26] border-b border-gray-800 flex items-center justify-between px-6">
          <div>
            <h1 className="text-white font-semibold">Dashboard</h1>
            <p className="text-gray-500 text-xs">Bem-vindo de volta, {colaborador?.nome || "Usuário"}</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={empresaSelecionada}
              onChange={(e) => setEmpresaSelecionada(Number(e.target.value))}
              className="bg-[#252b33] border border-gray-700 rounded px-3 py-1.5 text-white text-sm"
            >
              {empresasMock.map((emp) => (
                <option key={emp.id} value={emp.id} className="bg-[#252b33]">
                  {emp.nomeEmpresa}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-gray-400 -ml-7 pointer-events-none" />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Pendências do dia - Botão único que vai para página de pendências */}
          <Link href="/admin/pendencias">
            <Card className="bg-[#1a1f26] border-gray-800 mb-6 cursor-pointer hover:bg-[#252b33] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h2 className="text-white font-medium">Pendências do dia</h2>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Tabs: Operacional, Financeiro, Produtividade, Agenda - Todos como links */}
          <div className="w-full">
            <div className="bg-transparent border-b border-gray-800 w-full flex justify-start h-auto p-0 mb-6">
              <Link href="/admin/operacional">
                <div className="flex items-center px-4 py-3 text-gray-400 hover:text-blue-400 cursor-pointer border-b-2 border-transparent hover:border-blue-400">
                  <Wrench className="h-4 w-4 mr-2" />
                  Operacional
                </div>
              </Link>
              <Link href="/admin/financeiro">
                <div className="flex items-center px-4 py-3 text-gray-400 hover:text-green-400 cursor-pointer border-b-2 border-transparent hover:border-green-400">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financeiro
                </div>
              </Link>
              <Link href="/admin/produtividade">
                <div className="flex items-center px-4 py-3 text-gray-400 hover:text-purple-400 cursor-pointer border-b-2 border-transparent hover:border-purple-400">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Produtividade
                </div>
              </Link>
              <Link href="/admin/agenda-mecanicos">
                <div className="flex items-center px-4 py-3 text-gray-400 hover:text-orange-400 cursor-pointer border-b-2 border-transparent hover:border-orange-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agenda Mec.
                </div>
              </Link>
            </div>

            {/* Cards do Dashboard - Resumo */}
            <div className="grid grid-cols-2 gap-4">
              {/* Veículos no Pátio */}
              <Card className="bg-[#1a1f26] border-gray-800">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Car className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{veiculosNoPatio}</p>
                    <p className="text-gray-500 text-sm">Veículos no Pátio</p>
                  </div>
                </CardContent>
              </Card>

              {/* Agendamentos Hoje */}
              <Card className="bg-[#1a1f26] border-gray-800">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10">
                    <Calendar className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{agendamentosHoje}</p>
                    <p className="text-gray-500 text-sm">Agendamentos Hoje</p>
                  </div>
                </CardContent>
              </Card>

              {/* Faturado (Mês) */}
              <Card className="bg-[#1a1f26] border-gray-800">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">R$ {faturadoMes.toLocaleString("pt-BR")}</p>
                    <p className="text-gray-500 text-sm">Faturado (Mês)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Retorno do Mês */}
              <Card className="bg-[#1a1f26] border-gray-800">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{retornoMes}</p>
                    <p className="text-gray-500 text-sm">Retorno do Mês</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
