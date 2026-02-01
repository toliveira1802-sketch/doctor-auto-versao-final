import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Car, Search, Clock, Wrench } from "lucide-react";
import { ordensServicoMock, recursosMock, statusList } from "@/lib/mockData";

export default function AdminPatio() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const veiculosNoPatio = ordensServicoMock.filter(os => 
    os.status !== "Entregue" && os.status !== "Cancelado"
  );

  const filteredVeiculos = veiculosNoPatio.filter(os => {
    return searchTerm === "" || 
      os.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.veiculo.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    const s = statusList.find(st => st.status === status);
    return s?.cor || "#6B7280";
  };

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
            <Car className="w-6 h-6 text-red-500" />
            Pátio
          </h1>
          <p className="text-gray-400">Veículos atualmente na oficina</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Car className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total no Pátio</p>
              <p className="text-2xl font-bold text-white">{veiculosNoPatio.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-cyan-500/20">
              <Clock className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Em Execução</p>
              <p className="text-2xl font-bold text-white">{veiculosNoPatio.filter(v => v.status === "Em Execução").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-500/20">
              <Wrench className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Aguardando</p>
              <p className="text-2xl font-bold text-white">{veiculosNoPatio.filter(v => v.status.includes("Aguardando")).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Car className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pronto p/ Entrega</p>
              <p className="text-2xl font-bold text-white">{veiculosNoPatio.filter(v => v.status === "Pronto").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por placa, cliente ou veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      {/* Recursos */}
      <Card className="bg-white/5 border-white/10 mb-6">
        <CardHeader>
          <CardTitle className="text-white">Recursos da Oficina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
            {recursosMock.map((recurso) => (
              <div
                key={recurso.id}
                className={`p-2 rounded-lg text-center text-xs ${
                  recurso.ocupado ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                }`}
              >
                {recurso.nomeRecurso}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Veículos */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Veículos no Pátio ({filteredVeiculos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVeiculos.map((os) => (
              <div
                key={os.id}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setLocation(`/admin/patio/${os.id}`)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    style={{ backgroundColor: `${getStatusColor(os.status)}20`, color: getStatusColor(os.status) }}
                    className="border-0"
                  >
                    {os.status}
                  </Badge>
                  <span className="text-gray-400 text-sm">{os.recurso || "Sem recurso"}</span>
                </div>
                <p className="text-white font-bold text-lg">{os.placa}</p>
                <p className="text-gray-400">{os.veiculo}</p>
                <p className="text-gray-500 text-sm">{os.cliente}</p>
                {os.mecanico && (
                  <p className="text-gray-500 text-xs mt-2">Mecânico: {os.mecanico}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
