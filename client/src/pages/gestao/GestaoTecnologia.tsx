import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Laptop, Users, Database, Activity, ArrowLeft, FileDown, Server, Wifi } from "lucide-react";
import { colaboradoresMock, clientesMock, ordensServicoMock } from "@/lib/mockData";

export default function GestaoTecnologia() {
  const [isLoading] = useState(false);

  // KPIs mock
  const kpis = {
    totalUsers: colaboradoresMock.length + clientesMock.length,
    activeUsers: colaboradoresMock.length,
    totalRecords: ordensServicoMock.length + clientesMock.length,
    uptime: 99.9,
  };

  const statCards = [
    { label: "Total Usuários", value: kpis.totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Usuários Ativos", value: kpis.activeUsers, icon: Activity, color: "text-green-500" },
    { label: "Registros no Sistema", value: kpis.totalRecords, icon: Database, color: "text-purple-500" },
    { label: "Uptime", value: `${kpis.uptime}%`, icon: Server, color: "text-orange-500" },
  ];

  // Métricas de uso
  const usageMetrics = [
    { module: "Dashboard", visits: 1250, percentage: 35 },
    { module: "Ordens de Serviço", visits: 980, percentage: 28 },
    { module: "Agendamentos", visits: 650, percentage: 18 },
    { module: "Clientes", visits: 420, percentage: 12 },
    { module: "Financeiro", visits: 250, percentage: 7 },
  ];

  return (
    <div className="min-h-screen bg-[#0f1419] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/gestao">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Laptop className="w-6 h-6 text-purple-500" />
              Tecnologia
            </h1>
            <p className="text-gray-400 mt-1">
              Dados do sistema, usuários e métricas de uso
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
          <FileDown className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="bg-[#1a1f26] border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Uso por Módulo */}
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Uso por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageMetrics.map((item) => (
                <div key={item.module}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">{item.module}</span>
                    <span className="text-white font-semibold">{item.visits} visitas</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status do Sistema */}
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#252b33]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-300">Servidor Principal</span>
                </div>
                <span className="text-green-400 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#252b33]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-300">Banco de Dados</span>
                </div>
                <span className="text-green-400 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#252b33]">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-gray-300">API</span>
                </div>
                <span className="text-green-400 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#252b33]">
                <div className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Latência Média</span>
                </div>
                <span className="text-white font-medium">45ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
