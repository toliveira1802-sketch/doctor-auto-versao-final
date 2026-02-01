import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cog, Car, Clock, CheckCircle, AlertTriangle, ArrowLeft, FileDown, BarChart3 } from "lucide-react";
import { ordensServicoMock, statusList } from "@/lib/mockData";

export default function GestaoOperacoes() {
  const [isLoading] = useState(false);

  // KPIs baseados nos dados mock
  const total = ordensServicoMock.length;
  const pendentes = ordensServicoMock.filter(os => os.statusId <= 4).length;
  const emAndamento = ordensServicoMock.filter(os => os.statusId >= 5 && os.statusId <= 6).length;
  const concluidos = ordensServicoMock.filter(os => os.statusId >= 7).length;

  const kpiCards = [
    { label: "Total OS", value: total, icon: Car, color: "text-blue-500" },
    { label: "Em Andamento", value: emAndamento, icon: Clock, color: "text-yellow-500" },
    { label: "Concluídos", value: concluidos, icon: CheckCircle, color: "text-green-500" },
    { label: "Pendentes", value: pendentes, icon: AlertTriangle, color: "text-orange-500" },
  ];

  // Agrupar por status
  const statusCounts = statusList.map(status => ({
    status: status.status,
    count: ordensServicoMock.filter(os => os.statusId === status.id).length,
    cor: status.cor,
  }));

  const taxaConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0;

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
              <Cog className="w-6 h-6 text-emerald-500" />
              Operações
            </h1>
            <p className="text-gray-400 mt-1">
              Indicadores operacionais do mês atual
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
        {kpiCards.map((stat) => (
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
        {/* OS por Status */}
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              OS por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusCounts.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.cor }}
                    />
                    <span className="text-gray-300">{item.status}</span>
                  </div>
                  <span className="text-white font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Conclusão */}
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-5xl font-bold text-green-500">
                {taxaConclusao}%
              </p>
              <p className="text-gray-400 mt-2">
                {concluidos} de {total} serviços concluídos
              </p>
              <div className="w-full mt-4 h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min(taxaConclusao, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
