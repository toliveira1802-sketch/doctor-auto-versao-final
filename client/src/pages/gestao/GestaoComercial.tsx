import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Users, Target, TrendingUp, ArrowLeft, FileDown, Eye } from "lucide-react";
import { clientesMock } from "@/lib/mockData";

export default function GestaoComercial() {
  const [isLoading] = useState(false);

  // KPIs mock
  const kpis = {
    totalClients: clientesMock.length,
    newClients: 12,
    promoClicks: 245,
    activePromos: 3,
    conversionRate: 15,
    averageTicket: 850,
    monthlyRevenue: 125000,
    leadCount: 45,
  };

  const statCards = [
    { label: "Total de Clientes", value: kpis.totalClients, icon: Users, color: "text-blue-500" },
    { label: "Novos Clientes (Mês)", value: kpis.newClients, icon: TrendingUp, color: "text-green-500" },
    { label: "Cliques em Promoções", value: kpis.promoClicks, icon: Eye, color: "text-purple-500" },
    { label: "Promoções Ativas", value: kpis.activePromos, icon: Target, color: "text-orange-500" },
  ];

  // Promoções mock
  const promotions = [
    { title: "Revisão de Inverno", clicks: 120, status: "Ativa" },
    { title: "Desconto Primeira Visita", clicks: 85, status: "Ativa" },
    { title: "Pacote Freios + Suspensão", clicks: 40, status: "Ativa" },
  ];

  // Novos clientes por dia
  const dailyClients = [
    { date: "Seg", count: 3 },
    { date: "Ter", count: 2 },
    { date: "Qua", count: 4 },
    { date: "Qui", count: 1 },
    { date: "Sex", count: 2 },
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
              <Megaphone className="w-6 h-6 text-rose-500" />
              Comercial e Marketing
            </h1>
            <p className="text-gray-400 mt-1">
              Métricas de aquisição e campanhas
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
        {/* Performance das Promoções */}
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance das Promoções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promotions.map((promo) => (
                <div key={promo.title} className="flex items-center justify-between p-3 rounded-lg bg-[#252b33]">
                  <div>
                    <p className="text-white font-medium">{promo.title}</p>
                    <p className="text-gray-400 text-sm">{promo.clicks} cliques</p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                    {promo.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Novos Clientes por Dia */}
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Novos Clientes (Última Semana)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-40 gap-2">
              {dailyClients.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-rose-500 rounded-t"
                    style={{ height: `${day.count * 25}%` }}
                  />
                  <span className="text-gray-400 text-sm mt-2">{day.date}</span>
                  <span className="text-white font-semibold">{day.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas Adicionais */}
        <Card className="bg-[#1a1f26] border-gray-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Métricas de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-[#252b33] text-center">
                <p className="text-3xl font-bold text-cyan-400">{kpis.conversionRate}%</p>
                <p className="text-gray-400 text-sm">Taxa de Conversão</p>
              </div>
              <div className="p-4 rounded-lg bg-[#252b33] text-center">
                <p className="text-3xl font-bold text-amber-400">R$ {kpis.averageTicket}</p>
                <p className="text-gray-400 text-sm">Ticket Médio</p>
              </div>
              <div className="p-4 rounded-lg bg-[#252b33] text-center">
                <p className="text-3xl font-bold text-emerald-400">R$ {(kpis.monthlyRevenue / 1000).toFixed(0)}k</p>
                <p className="text-gray-400 text-sm">Faturamento Mensal</p>
              </div>
              <div className="p-4 rounded-lg bg-[#252b33] text-center">
                <p className="text-3xl font-bold text-pink-400">{kpis.leadCount}</p>
                <p className="text-gray-400 text-sm">Leads do Mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
