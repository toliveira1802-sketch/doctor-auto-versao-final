import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Search, Car, User, UserPlus } from "lucide-react";
import { clientesMock, veiculosMock } from "@/lib/mockData";
import { toast } from "sonner";

export default function AdminNovaOS() {
  const [, setLocation] = useLocation();
  const [searchCliente, setSearchCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<typeof clientesMock[0] | null>(null);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<typeof veiculosMock[0] | null>(null);
  const [motivoVisita, setMotivoVisita] = useState("");
  const [km, setKm] = useState("");
  const [showNovoCliente, setShowNovoCliente] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    telefone: "",
    placa: "",
    veiculo: "",
    // Campos opcionais
    cpf: "",
    email: "",
    marca: "",
    ano: "",
  });
  const [showCamposOpcionais, setShowCamposOpcionais] = useState(false);

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

  const handleCriarNovoCliente = () => {
    if (!novoCliente.nome || !novoCliente.telefone || !novoCliente.placa || !novoCliente.veiculo) {
      toast.error("Preencha os campos obrigatórios: Nome, Telefone, Placa e Veículo");
      return;
    }
    toast.success("Cliente e veículo criados com sucesso!");
    setShowNovoCliente(false);
    // Aqui você conectaria com o backend para criar o cliente e veículo
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

      <div className="grid grid-cols-1 gap-6">
        {/* Card unificado: Cliente e Veículos */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Selecionar Cliente e Veículo
            </CardTitle>
            <Button 
              variant="outline" 
              className="border-green-500 text-green-500 hover:bg-green-500/10"
              onClick={() => setShowNovoCliente(!showNovoCliente)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Novo Cliente
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulário de Novo Cliente */}
            {showNovoCliente && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Novo Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Nome *</Label>
                    <Input
                      placeholder="Nome do cliente"
                      value={novoCliente.nome}
                      onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Telefone *</Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={novoCliente.telefone}
                      onChange={(e) => setNovoCliente({...novoCliente, telefone: e.target.value})}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Placa *</Label>
                    <Input
                      placeholder="ABC-1234"
                      value={novoCliente.placa}
                      onChange={(e) => setNovoCliente({...novoCliente, placa: e.target.value.toUpperCase()})}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">Veículo *</Label>
                    <Input
                      placeholder="Ex: VW Golf GTI 2020"
                      value={novoCliente.veiculo}
                      onChange={(e) => setNovoCliente({...novoCliente, veiculo: e.target.value})}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                
                {/* Botão para mostrar campos opcionais */}
                <button
                  type="button"
                  onClick={() => setShowCamposOpcionais(!showCamposOpcionais)}
                  className="text-blue-400 text-sm hover:underline mt-2 flex items-center gap-1"
                >
                  {showCamposOpcionais ? '▼ Ocultar campos opcionais' : '▶ Mostrar campos opcionais (CPF, Email, Marca, Ano)'}
                </button>

                {/* Campos opcionais */}
                {showCamposOpcionais && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      <Label className="text-gray-400">CPF</Label>
                      <Input
                        placeholder="000.000.000-00"
                        value={novoCliente.cpf}
                        onChange={(e) => setNovoCliente({...novoCliente, cpf: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400">Email</Label>
                      <Input
                        placeholder="email@exemplo.com"
                        value={novoCliente.email}
                        onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400">Marca</Label>
                      <Input
                        placeholder="Ex: Volkswagen"
                        value={novoCliente.marca}
                        onChange={(e) => setNovoCliente({...novoCliente, marca: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-400">Ano</Label>
                      <Input
                        placeholder="Ex: 2020"
                        value={novoCliente.ano}
                        onChange={(e) => setNovoCliente({...novoCliente, ano: e.target.value})}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleCriarNovoCliente}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Salvar Cliente
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-white"
                    onClick={() => setShowNovoCliente(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Busca e seleção de cliente */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar cliente por nome, CPF ou telefone..."
                value={searchCliente}
                onChange={(e) => setSearchCliente(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Lista de Clientes - só mostra quando tem busca */}
              <div>
                <h4 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Clientes
                </h4>
                {searchCliente.length === 0 ? (
                  <div className="bg-white/5 rounded-lg p-8 text-center">
                    <p className="text-gray-400">Digite para buscar um cliente</p>
                  </div>
                ) : clientesFiltrados.length === 0 ? (
                  <div className="bg-white/5 rounded-lg p-8 text-center">
                    <p className="text-gray-400">Nenhum cliente encontrado</p>
                  </div>
                ) : (
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
                )}
              </div>

              {/* Lista de Veículos do Cliente */}
              <div>
                <h4 className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Veículos do Cliente
                </h4>
                {!clienteSelecionado ? (
                  <div className="bg-white/5 rounded-lg p-8 text-center">
                    <p className="text-gray-400">Selecione um cliente primeiro</p>
                  </div>
                ) : veiculosDoCliente.length === 0 ? (
                  <div className="bg-white/5 rounded-lg p-8 text-center">
                    <p className="text-gray-400">Cliente não possui veículos cadastrados</p>
                    <Button variant="outline" className="mt-4 border-blue-500 text-blue-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Veículo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
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
              </div>
            </div>

            {/* Resumo da Seleção */}
            {clienteSelecionado && veiculoSelecionado && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
                <p className="text-green-400 font-semibold">Selecionado:</p>
                <p className="text-white">{clienteSelecionado.nomeCompleto} • {veiculoSelecionado.placa} - {veiculoSelecionado.marca} {veiculoSelecionado.modelo}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dados da OS */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Dados da OS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
