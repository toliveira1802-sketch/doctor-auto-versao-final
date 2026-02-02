import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, Plus, Filter, Eye, FileText, AlertTriangle,
  CheckCircle, XCircle, Clock, Wrench, Loader2,
  ChevronDown, ChevronRight, DollarSign, Calendar, ExternalLink, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  diagnostico: { label: "Diagnóstico", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: Wrench },
  orcamento: { label: "Orçamento", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: FileText },
  aguardando_aprovacao: { label: "Aguardando", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  aprovado: { label: "Aprovado", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  parcial: { label: "Parcial", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: AlertTriangle },
  recusado: { label: "Recusado", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
  em_execucao: { label: "Em Execução", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: Wrench },
  concluido: { label: "Concluído", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle },
  entregue: { label: "Entregue", color: "bg-gray-500/10 text-gray-500 border-gray-500/20", icon: CheckCircle },
};

const itemStatusConfig: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  aprovado: { label: "Aprovado", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  recusado: { label: "Recusado", color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export default function AdminOrdensServico() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // tRPC queries
  const { data: ordensServico = [], isLoading } = trpc.ordensServico.list.useQuery();
  const { data: clientes = [] } = trpc.clientes.list.useQuery();
  const { data: veiculos = [] } = trpc.veiculos.list.useQuery();

  // Helper to get client/vehicle info
  const getClienteNome = (clienteId: number | null) => {
    if (!clienteId) return "Cliente não informado";
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nomeCompleto || "Cliente não informado";
  };

  const getVeiculoInfo = (veiculoId: number | null) => {
    if (!veiculoId) return { marca: "", modelo: "", placa: "" };
    const veiculo = veiculos.find(v => v.id === veiculoId);
    return veiculo || { marca: "", modelo: "", placa: "" };
  };

  // Filter OS based on search and status
  const filteredOS = ordensServico.filter(os => {
    const cliente = getClienteNome(os.clienteId);
    const veiculo = getVeiculoInfo(os.veiculoId);
    
    const matchesSearch =
      (os.numeroOs?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (os.placa?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (veiculo.marca?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (veiculo.modelo?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || os.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: ordensServico.length,
    finalizadas: ordensServico.filter(os => os.status === "concluido" || os.status === "entregue").length,
    diagnostico: ordensServico.filter(os => os.status === "diagnostico").length,
    orcamento: ordensServico.filter(os => os.status === "orcamento" || os.status === "aguardando_aprovacao").length,
    aprovado: ordensServico.filter(os => os.status === "aprovado" || os.status === "em_execucao").length,
    parcial: ordensServico.filter(os => os.status === "parcial").length,
    recusado: ordensServico.filter(os => os.status === "recusado").length,
    valorTotal: ordensServico
      .filter(os => os.status === "concluido" || os.status === "entregue")
      .reduce((acc, os) => acc + parseFloat(String(os.valorTotalOs || 0)), 0),
  };

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatCurrency = (value: number | string | null) => {
    if (value === null || value === undefined) return "R$ 0,00";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-7 h-7 text-red-500" />
                Ordens de Serviço
              </h1>
              <p className="text-slate-400 text-sm">Gerencie todas as OS da oficina</p>
            </div>
          </div>
          <Link href="/admin/nova-os">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova OS
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Total</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-white">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-400">Diagnóstico</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-orange-500">{stats.diagnostico}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-400">Orçamento</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-blue-500">{stats.orcamento}</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-400">Em Execução</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-green-500">{stats.aprovado}</p>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-400">Recusadas</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-red-500">{stats.recusado}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-400">Faturado</span>
              </div>
              <p className="text-lg font-bold mt-1 text-emerald-500">{formatCurrency(stats.valorTotal)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="todas" className="w-full">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="todas" className="data-[state=active]:bg-slate-800">Todas</TabsTrigger>
            <TabsTrigger value="finalizadas" className="data-[state=active]:bg-slate-800 relative">
              Finalizadas
              {stats.finalizadas > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-emerald-500/20 text-emerald-400">
                  {stats.finalizadas}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="parciais" className="data-[state=active]:bg-slate-800 relative">
              Parciais
              {stats.parcial > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-yellow-500/20 text-yellow-400">
                  {stats.parcial}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="recusadas" className="data-[state=active]:bg-slate-800 relative">
              Recusadas
              {stats.recusado > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-red-500/20 text-red-400">
                  {stats.recusado}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="space-y-4 mt-4">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por número, placa, veículo ou cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900/50 border-slate-800 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-800 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                  <SelectItem value="orcamento">Orçamento</SelectItem>
                  <SelectItem value="aguardando_aprovacao">Aguardando Aprovação</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="recusado">Recusado</SelectItem>
                  <SelectItem value="em_execucao">Em Execução</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : filteredOS.length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Nenhuma OS encontrada</h3>
                  <p className="text-slate-400 mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Tente ajustar os filtros de busca"
                      : "Comece criando uma nova ordem de serviço"}
                  </p>
                  <Link href="/admin/nova-os">
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova OS
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-900/50 border-slate-800">
                      <TableHead className="w-10 text-slate-400"></TableHead>
                      <TableHead className="text-slate-400">Número</TableHead>
                      <TableHead className="text-slate-400">Cliente / Veículo</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="hidden md:table-cell text-slate-400">Entrada</TableHead>
                      <TableHead className="hidden lg:table-cell text-slate-400">Valor</TableHead>
                      <TableHead className="text-right text-slate-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOS.map((os) => {
                      const status = statusConfig[os.status || 'diagnostico'] || statusConfig.diagnostico;
                      const StatusIcon = status.icon;
                      const isExpanded = expandedRows.has(os.id);
                      const cliente = getClienteNome(os.clienteId);
                      const veiculo = getVeiculoInfo(os.veiculoId);

                      return (
                        <TableRow
                          key={os.id}
                          className="hover:bg-slate-800/50 cursor-pointer border-slate-800"
                          onClick={() => setLocation(`/admin/os/${os.id}`)}
                        >
                          <TableCell className="w-10">
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </TableCell>
                          <TableCell>
                            <div className="font-mono font-medium text-white">
                              {os.numeroOs}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-white">{cliente}</p>
                              <p className="text-sm text-slate-400">
                                {veiculo.placa || os.placa} - {veiculo.marca} {veiculo.modelo}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("gap-1", status.color)}>
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-slate-400">
                            {formatDate(os.dataEntrada)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="text-right">
                              {os.status === "concluido" || os.status === "entregue" ? (
                                <span className="font-medium text-green-500">
                                  {formatCurrency(os.valorTotalOs)}
                                </span>
                              ) : os.valorAprovado && parseFloat(String(os.valorAprovado)) > 0 ? (
                                <span className="font-medium text-white">
                                  {formatCurrency(os.valorAprovado)}
                                </span>
                              ) : (
                                <span className="text-slate-400">
                                  {formatCurrency(os.totalOrcamento)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Ver orçamento do cliente"
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`/cliente/orcamento/${os.id}`, '_blank');
                                }}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Ver detalhes"
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocation(`/admin/os/${os.id}`);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="finalizadas" className="space-y-4 mt-4">
            {ordensServico.filter(os => os.status === "concluido" || os.status === "entregue").length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Nenhuma OS finalizada</h3>
                  <p className="text-slate-400">As ordens concluídas aparecerão aqui</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {ordensServico
                  .filter(os => os.status === "concluido" || os.status === "entregue")
                  .map((os) => {
                    const cliente = getClienteNome(os.clienteId);
                    const veiculo = getVeiculoInfo(os.veiculoId);
                    return (
                      <Card key={os.id} className="bg-emerald-500/5 border-emerald-500/20 cursor-pointer hover:bg-emerald-500/10 transition-colors" onClick={() => setLocation(`/admin/os/${os.id}`)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-lg text-white">{os.numeroOs}</span>
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {os.status === "entregue" ? "Entregue" : "Concluído"}
                                </Badge>
                              </div>
                              <div>
                                <p className="font-medium text-white">{cliente}</p>
                                <p className="text-sm text-slate-400">{veiculo.placa || os.placa} - {veiculo.marca} {veiculo.modelo}</p>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Entrada: {formatDate(os.dataEntrada)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4 text-emerald-500" />
                                  <span className="text-emerald-400 font-medium">
                                    Final: {formatCurrency(os.valorTotalOs)}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver OS
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="parciais" className="space-y-4 mt-4">
            {ordensServico.filter(os => os.status === "parcial").length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Nenhuma OS parcial</h3>
                  <p className="text-slate-400">As ordens com aprovação parcial aparecerão aqui</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {ordensServico
                  .filter(os => os.status === "parcial")
                  .map((os) => {
                    const cliente = getClienteNome(os.clienteId);
                    const veiculo = getVeiculoInfo(os.veiculoId);
                    return (
                      <Card key={os.id} className="bg-yellow-500/5 border-yellow-500/20 cursor-pointer hover:bg-yellow-500/10 transition-colors" onClick={() => setLocation(`/admin/os/${os.id}`)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-lg text-white">{os.numeroOs}</span>
                                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Parcial
                                </Badge>
                              </div>
                              <div>
                                <p className="font-medium text-white">{cliente}</p>
                                <p className="text-sm text-slate-400">{veiculo.placa || os.placa} - {veiculo.marca} {veiculo.modelo}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver OS
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recusadas" className="space-y-4 mt-4">
            {ordensServico.filter(os => os.status === "recusado").length === 0 ? (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-12 text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Nenhuma OS recusada</h3>
                  <p className="text-slate-400">As ordens recusadas aparecerão aqui</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {ordensServico
                  .filter(os => os.status === "recusado")
                  .map((os) => {
                    const cliente = getClienteNome(os.clienteId);
                    const veiculo = getVeiculoInfo(os.veiculoId);
                    return (
                      <Card key={os.id} className="bg-red-500/5 border-red-500/20 cursor-pointer hover:bg-red-500/10 transition-colors" onClick={() => setLocation(`/admin/os/${os.id}`)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-lg text-white">{os.numeroOs}</span>
                                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Recusado
                                </Badge>
                              </div>
                              <div>
                                <p className="font-medium text-white">{cliente}</p>
                                <p className="text-sm text-slate-400">{veiculo.placa || os.placa} - {veiculo.marca} {veiculo.modelo}</p>
                              </div>
                              {os.motivoRecusa && (
                                <p className="text-sm text-red-400">Motivo: {os.motivoRecusa}</p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver OS
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
