import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Receipt, Target, ArrowLeft, FileDown } from "lucide-react";

export default function GestaoFinanceiro() {
  const [isLoading] = useState(false);

  // KPIs mock
  const kpis = {
    totalRevenue: 125000,
    avgTicket: 850,
    totalAppointments: 147,
    monthGoal: 150000,
    goalProgress: 83,
  };

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  const statCards = [
    { label: "Faturamento (Mês)", value: formatCurrency(kpis.totalRevenue), icon: DollarSign, color: "text-green-500" },
    { label: "Ticket Médio", value: formatCurrency(kpis.avgTicket), icon: Receipt, color: "text-blue-500" },
    { label: "Serviços Faturados", value: kpis.totalAppointments, icon: TrendingUp, color: "text-purple-500" },
    { label: "Meta do Mês", value: formatCurrency(kpis.monthGoal), icon: Target, color: "text-orange-500" },
  ];

  // Dados mock de faturamento diário
  const dailyRevenue = [
    { date: "01/02", value: 4500 },
    { date: "02/02", value: 6200 },
    { date: "03/02", value: 3800 },
    { date: "04/02", value: 7100 },
    { date: "05/02", value: 5500 },
    { date: "06/02", value: 8200 },
    { date: "07/02", value: 4900 },
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
              <DollarSign className="w-6 h-6 text-amber-500" />
              Financeiro
            </h1>
            <p className="text-gray-400 mt-1">
              Indicadores financeiros do mês atual
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
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Faturamento Diário */}
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Faturamento Diário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyRevenue.map((item) => (
                <div key={item.date} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.date}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(item.value / 10000) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold w-24 text-right">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progresso da Meta */}
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Progresso da Meta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <p className="text-5xl font-bold text-amber-500">
                {kpis.goalProgress}%
              </p>
              <p className="text-gray-400 mt-2">
                {formatCurrency(kpis.totalRevenue)} de {formatCurrency(kpis.monthGoal)}
              </p>
              <div className="w-full mt-4 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${Math.min(kpis.goalProgress, 100)}%` }}
                />
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Faltam {formatCurrency(kpis.monthGoal - kpis.totalRevenue)} para atingir a meta
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
