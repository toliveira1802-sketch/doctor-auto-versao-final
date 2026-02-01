import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Plus, Search } from "lucide-react";
import { ordensServicoMock, statusList } from "@/lib/mockData";

export default function AdminOrdensServico() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const getStatusColor = (status: string) => {
    const s = statusList.find(st => st.status === status);
    return s?.cor || "#6B7280";
  };

  const filteredOS = ordensServicoMock.filter(os => {
    const matchesSearch = searchTerm === "" || 
      os.numeroOs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.placa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || os.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-500" />
              Ordens de Serviço
            </h1>
            <p className="text-gray-400">Gestão de todas as OS</p>
          </div>
        </div>
        <Link href="/admin/nova-os">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova OS
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por número, cliente ou placa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
        >
          <option value="todos" className="bg-gray-800">Todos os Status</option>
          {statusList.map((s) => (
            <option key={s.id} value={s.status} className="bg-gray-800">{s.status}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {statusList.slice(0, 5).map((s) => {
          const count = ordensServicoMock.filter(os => os.status === s.status).length;
          return (
            <Card key={s.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: s.cor }}>{count}</p>
                <p className="text-gray-400 text-sm">{s.status}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* OS List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Lista de OS ({filteredOS.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredOS.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhuma OS encontrada</p>
          ) : (
            filteredOS.map((os) => (
              <div
                key={os.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setLocation(`/admin/os/${os.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{os.numeroOs}</p>
                    <p className="text-gray-400 text-sm">{os.cliente}</p>
                    <p className="text-gray-500 text-xs">{os.placa} • {os.veiculo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    style={{ backgroundColor: `${getStatusColor(os.status)}20`, color: getStatusColor(os.status) }}
                    className="border-0 mb-1"
                  >
                    {os.status}
                  </Badge>
                  <p className="text-gray-400 text-sm">{os.mecanico || "Sem mecânico"}</p>
                  <p className="text-white font-medium">R$ {os.valorTotalOs.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
