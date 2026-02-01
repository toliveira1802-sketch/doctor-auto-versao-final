import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          {/* Pendências do dia */}
          <Card className="bg-[#1a1f26] border-gray-800 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h2 className="text-white font-medium">Pendências do dia</h2>
                </div>
                <Link href="/admin/operacional">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs h-7">
                    Linhas da equipe <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="flex gap-4">
                {equipeConsultores.map((consultor) => (
                  <div key={consultor.id} className="flex items-center gap-2 bg-[#252b33] rounded-lg px-3 py-2">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="text-white text-sm">{consultor.nome}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs: Operacional, Financeiro, Produtividade, Agenda */}
          <Tabs defaultValue="operacional" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-800 w-full justify-start rounded-none h-auto p-0 mb-6">
              <TabsTrigger 
                value="operacional" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-blue-400 data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none px-4 py-3 text-gray-400"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Operacional
              </TabsTrigger>
              <TabsTrigger 
                value="financeiro"
                className="data-[state=active]:bg-transparent data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-400 rounded-none px-4 py-3 text-gray-400"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Financeiro
              </TabsTrigger>
              <TabsTrigger 
                value="produtividade"
                className="data-[state=active]:bg-transparent data-[state=active]:text-purple-400 data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none px-4 py-3 text-gray-400"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Produtividade
              </TabsTrigger>
              <TabsTrigger 
                value="agenda"
                className="data-[state=active]:bg-transparent data-[state=active]:text-orange-400 data-[state=active]:border-b-2 data-[state=active]:border-orange-400 rounded-none px-4 py-3 text-gray-400"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agenda
              </TabsTrigger>
            </TabsList>

            {/* Tab Operacional */}
            <TabsContent value="operacional" className="mt-0">
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

                {/* Novos Clientes (Mês) */}
                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <Users className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{novosClientesMes}</p>
                      <p className="text-gray-500 text-sm">Novos Clientes (Mês)</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Retorno do Mês */}
                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{retornoMes}</p>
                      <p className="text-gray-500 text-sm">Retorno do Mês</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Financeiro */}
            <TabsContent value="financeiro" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
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

                {/* Valor p/ Ger. Hoje */}
                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-yellow-500/10">
                      <DollarSign className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">R$ {valorGerarHoje.toLocaleString("pt-BR")}</p>
                      <p className="text-gray-500 text-sm">Valor p/ Ger. Hoje</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Concluídos (Mês) */}
                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <ClipboardList className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{concluidosMes}</p>
                      <p className="text-gray-500 text-sm">Concluídos (Mês)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Produtividade */}
            <TabsContent value="produtividade" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <TrendingUp className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{stats.osEmExecucao}</p>
                      <p className="text-gray-500 text-sm">Em Execução</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <ClipboardList className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{concluidosMes}</p>
                      <p className="text-gray-500 text-sm">Concluídos (Mês)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-orange-500/10">
                      <Wrench className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{stats.osAguardandoPeca}</p>
                      <p className="text-gray-500 text-sm">Aguardando Peça</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-red-500/10">
                      <Users className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{stats.osAguardandoAprovacao}</p>
                      <p className="text-gray-500 text-sm">Aguardando Aprovação</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab Agenda */}
            <TabsContent value="agenda" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-orange-500/10">
                      <Calendar className="h-6 w-6 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{agendamentosHoje}</p>
                      <p className="text-gray-500 text-sm">Agendamentos Hoje</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1f26] border-gray-800">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <Calendar className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">{stats.agendamentosSemana}</p>
                      <p className="text-gray-500 text-sm">Agendamentos Semana</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#1a1f26] border-gray-800 col-span-2">
                  <CardContent className="p-4">
                    <h3 className="text-white font-medium mb-3">Próximos Agendamentos</h3>
                    <div className="space-y-2">
                      {agendamentosMock.slice(0, 3).map((ag) => (
                        <div key={ag.id} className="flex items-center justify-between p-3 bg-[#252b33] rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-orange-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{ag.horaAgendamento} - {ag.dataAgendamento}</p>
                              <p className="text-gray-400 text-sm">{ag.cliente}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white">{ag.placa}</p>
                            <p className="text-gray-400 text-sm">{ag.motivoVisita}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
