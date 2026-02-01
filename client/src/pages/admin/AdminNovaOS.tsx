import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Search, Car, User } from "lucide-react";
import { clientesMock, veiculosMock, mecanicosMock } from "@/lib/mockData";
import { toast } from "sonner";

export default function AdminNovaOS() {
  const [, setLocation] = useLocation();
  const [searchCliente, setSearchCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<typeof clientesMock[0] | null>(null);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<typeof veiculosMock[0] | null>(null);
  const [motivoVisita, setMotivoVisita] = useState("");
  const [km, setKm] = useState("");

  const clientesFiltrados = clientesMock.filter(c => 
    c.nomeCompleto.toLowerCase().includes(searchCliente.toLowerCase()) ||
    c.cpf.includes(searchCliente) ||
    c.telefone.includes(searchCliente)
  );

  const veiculosDoCliente = clienteSelecionado 
    ? veiculosMock.filter(v => v.clienteId === clienteSelecionado.id)
    : [];

  const handleCriarOS = () => {
    if (!clienteSelecionado || !veiculoSelecionado) {
      toast.error("Selecione um cliente e um veículo");
      return;
    }
    toast.success("OS criada com sucesso!");
    setLocation("/admin/ordens-servico");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/ordens-servico">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plus className="w-6 h-6 text-red-500" />
            Nova Ordem de Serviço
          </h1>
          <p className="text-gray-400">Criar uma nova OS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Selecionar Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, CPF ou telefone..."
                value={searchCliente}
                onChange={(e) => setSearchCliente(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {clientesFiltrados.map((cliente) => (
                <div
                  key={cliente.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    clienteSelecionado?.id === cliente.id 
                      ? "bg-red-500/20 border border-red-500" 
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => {
                    setClienteSelecionado(cliente);
                    setVeiculoSelecionado(null);
                  }}
                >
                  <p className="text-white font-medium">{cliente.nomeCompleto}</p>
                  <p className="text-gray-400 text-sm">{cliente.cpf} • {cliente.telefone}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Car className="h-5 w-5 text-green-400" />
              Selecionar Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!clienteSelecionado ? (
              <p className="text-gray-400 text-center py-8">Selecione um cliente primeiro</p>
            ) : veiculosDoCliente.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Cliente não possui veículos cadastrados</p>
            ) : (
              <div className="space-y-2">
                {veiculosDoCliente.map((veiculo) => (
                  <div
                    key={veiculo.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      veiculoSelecionado?.id === veiculo.id 
                        ? "bg-red-500/20 border border-red-500" 
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setVeiculoSelecionado(veiculo)}
                  >
                    <p className="text-white font-bold">{veiculo.placa}</p>
                    <p className="text-gray-400">{veiculo.marca} {veiculo.modelo}</p>
                    <p className="text-gray-500 text-sm">{veiculo.ano} • {veiculo.kmAtual.toLocaleString("pt-BR")} km</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Dados da OS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-400">KM Atual</Label>
                <Input
                  type="number"
                  placeholder="Ex: 125000"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Mecânico Responsável</Label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white">
                  <option value="" className="bg-gray-800">Selecione...</option>
                  {mecanicosMock.map((mec) => (
                    <option key={mec.id} value={mec.id} className="bg-gray-800">{mec.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-400">Motivo da Visita</Label>
              <Textarea
                placeholder="Descreva o motivo da visita..."
                value={motivoVisita}
                onChange={(e) => setMotivoVisita(e.target.value)}
                className="bg-white/5 border-white/10 text-white min-h-24"
              />
            </div>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={handleCriarOS}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Ordem de Serviço
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
