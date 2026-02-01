import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, Users, Car, FileText, DollarSign, Calendar, Wrench, CheckCircle, AlertCircle } from "lucide-react";
import { dashboardStatsMock, ordensServicoMock, clientesMock, veiculosMock, mecanicosMock } from "@/lib/mockData";

export default function AdminDashboardOverview() {
  const stats = dashboardStatsMock;

  const statCards = [
    { title: "Veículos no Pátio", value: ordensServicoMock.length, icon: Car, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Agendamentos Hoje", value: stats.agendamentosHoje, icon: Calendar, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { title: "Faturamento do Mês", value: `R$ ${stats.faturamentoMes.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-emerald-500", bgColor: "bg-emerald-500/10", change: 15 },
    { title: "Aguardando Aprovação", value: stats.osAguardandoAprovacao, icon: AlertCircle, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { title: "Concluídos Hoje", value: stats.osConcluidas, icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-500/10" },
    { title: "Clientes Ativos", value: clientesMock.length, icon: Users, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-red-500" />
            Visão Geral
          </h1>
          <p className="text-gray-400">Resumo completo da operação</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  {stat.change !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <TrendingUp className="w-3 h-3" />
                      <span>{stat.change}% vs mês anterior</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/5 border-white/10 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-red-500" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/admin/nova-os">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Car className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-sm text-white text-center">Nova OS</span>
              </div>
            </Link>
            <Link href="/admin/patio">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Car className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm text-white text-center">Ver Pátio</span>
              </div>
            </Link>
            <Link href="/admin/agendamentos">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Calendar className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-sm text-white text-center">Agendamentos</span>
              </div>
            </Link>
            <Link href="/admin/financeiro">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-sm text-white text-center">Financeiro</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Mecânicos Performance */}
      <Card className="bg-white/5 border-white/10 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Performance dos Mecânicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mecanicosMock.slice(0, 4).map((mec) => (
              <div key={mec.id} className="bg-white/5 rounded-lg p-4">
                <p className="text-white font-medium">{mec.nome}</p>
                <p className="text-gray-400 text-sm">{mec.especialidade}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-green-400">+{mec.qtdePositivos}</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-red-400">-{mec.qtdeNegativos}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* OS por Status */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Ordens de Serviço por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {["Diagnóstico", "Orçamento", "Aguardando Aprovação", "Em Execução", "Pronto"].map((status) => {
              const count = ordensServicoMock.filter(os => os.status === status).length;
              return (
                <div key={status} className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-gray-400 text-sm">{status}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
