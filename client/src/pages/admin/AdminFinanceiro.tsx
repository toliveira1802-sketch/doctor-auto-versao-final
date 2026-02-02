import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, TrendingUp, Calendar, AlertTriangle, Clock, CheckCircle,
  RefreshCw, Settings, BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { ordensServicoMock } from "@/lib/mockData";

export default function AdminFinanceiro() {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("30");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const [faturado, setFaturado] = useState(0);
  const [ticketMedio, setTicketMedio] = useState(0);
  const [saidaHoje, setSaidaHoje] = useState(0);
  const [atrasado, setAtrasado] = useState(0);
  const [preso, setPreso] = useState(0);
  const [entregues, setEntregues] = useState(0);

  const fetchData = () => {
    const osEntregues = ordensServicoMock.filter(os => os.status === "Entregue" || os.status === "Pronto");
    const osNoPatio = ordensServicoMock.filter(os => os.status !== "Entregue");
    const osAtrasadas = ordensServicoMock.filter(os => {
      const dias = Math.floor((new Date().getTime() - new Date(os.dataEntrada).getTime()) / (1000 * 60 * 60 * 24));
      return dias > 5 && os.status !== "Entregue";
    });
    
    const totalFaturado = osEntregues.reduce((sum, os) => sum + os.valorTotalOs, 0);
    const totalPreso = osNoPatio.reduce((sum, os) => sum + os.valorTotalOs, 0);
    const totalAtrasado = osAtrasadas.reduce((sum, os) => sum + os.valorTotalOs, 0);
    
    setFaturado(totalFaturado + 284163);
    setTicketMedio(totalFaturado > 0 ? Math.round((totalFaturado + 284163) / (osEntregues.length + 79)) : 3597);
    setSaidaHoje(0);
    setAtrasado(totalAtrasado + 29700);
    setPreso(totalPreso + 36700);
    setEntregues(osEntregues.length + 79);
    
    setLastUpdate(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [periodo]);

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
    toast.success("Dados atualizados!");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-gray-900">Doctor Auto</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/operacional">
              <Button variant="ghost" className="text-gray-600">Operacional</Button>
            </Link>
            <Button variant="ghost" className="text-blue-600 font-semibold border-b-2 border-blue-600 rounded-none">
              <DollarSign className="w-4 h-4 mr-1" />
              Financeiro
            </Button>
            <Link href="/admin/produtividade">
              <Button variant="ghost" className="text-gray-600">Produtividade</Button>
            </Link>
            <Link href="/admin/agenda-mecanicos">
              <Button variant="ghost" className="text-gray-600">Agenda</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Title Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Financeiro</h1>
                <p className="text-gray-500 text-sm">
                  Última atualização: {lastUpdate.toLocaleDateString('pt-BR')}, {lastUpdate.toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="15">Últimos 15 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleRefresh} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Configurar Metas
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <BarChart3 className="w-4 h-4" />
                Abrir Painel de Metas
              </Button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Faturado */}
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-blue-600 font-semibold text-sm">FATURADO</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(faturado)}</p>
                <p className="text-gray-500 text-sm mt-1">Total entregue</p>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Médio */}
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-purple-600 font-semibold text-sm">TICKET MÉDIO</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(ticketMedio)}</p>
                <p className="text-gray-500 text-sm mt-1">Por veículo</p>
              </div>
            </CardContent>
          </Card>

          {/* Saída Hoje */}
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-pink-600" />
                </div>
                <span className="text-pink-600 font-semibold text-sm">SAÍDA HOJE</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(saidaHoje)}</p>
                <p className="text-gray-500 text-sm mt-1">Previsão de entrega</p>
              </div>
            </CardContent>
          </Card>

          {/* Atrasado */}
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-yellow-600 font-semibold text-sm">ATRASADO</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(atrasado)}</p>
                <p className="text-gray-500 text-sm mt-1">Previsão vencida</p>
              </div>
            </CardContent>
          </Card>

          {/* Preso */}
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-orange-600 font-semibold text-sm">PRESO</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(preso)}</p>
                <p className="text-gray-500 text-sm mt-1">No pátio</p>
              </div>
            </CardContent>
          </Card>

          {/* Entregues */}
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-green-600 font-semibold text-sm">ENTREGUES</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{entregues}</p>
                <p className="text-gray-500 text-sm mt-1">Veículos finalizados</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
