import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { dashboardStatsMock, faturamentoMock, ordensServicoMock } from "@/lib/mockData";

export default function AdminFinanceiro() {
  const totalFaturado = faturamentoMock.reduce((acc, f) => acc + f.valor, 0);
  const totalPendente = ordensServicoMock
    .filter(os => os.status !== "Entregue")
    .reduce((acc, os) => acc + os.valorTotalOs, 0);

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
            <DollarSign className="w-6 h-6 text-red-500" />
            Financeiro
          </h1>
          <p className="text-gray-400">Visão financeira</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Faturamento Mês</p>
              <p className="text-xl font-bold text-white">R$ {dashboardStatsMock.faturamentoMes.toLocaleString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <DollarSign className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Ticket Médio</p>
              <p className="text-xl font-bold text-white">R$ {dashboardStatsMock.ticketMedio.toLocaleString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-500/20">
              <CreditCard className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pendente</p>
              <p className="text-xl font-bold text-white">R$ {totalPendente.toLocaleString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-cyan-500/20">
              <TrendingDown className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Faturado</p>
              <p className="text-xl font-bold text-white">R$ {totalFaturado.toLocaleString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Últimos Faturamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {faturamentoMock.map((fat) => (
              <div key={fat.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">OS #{fat.ordemServicoId}</p>
                  <p className="text-gray-400 text-sm">{fat.formaPagamento || "Pendente"}</p>
                </div>
                <p className="text-green-400 font-bold text-lg">
                  R$ {fat.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
