import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Search, Car, User, UserPlus, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AdminNovaOS() {
  const [, setLocation] = useLocation();
  const [searchCliente, setSearchCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<any | null>(null);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<any | null>(null);
  const [motivoVisita, setMotivoVisita] = useState("");
  const [descricaoProblema, setDescricaoProblema] = useState("");
  const [km, setKm] = useState("");
  const [showNovoCliente, setShowNovoCliente] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    telefone: "",
    placa: "",
    veiculo: "",
    cpf: "",
    email: "",
    marca: "",
    ano: "",
  });
  const [showCamposOpcionais, setShowCamposOpcionais] = useState(false);

  // tRPC queries
  const { data: clientes = [], isLoading: loadingClientes } = trpc.clientes.list.useQuery();
  const { data: veiculos = [], isLoading: loadingVeiculos } = trpc.veiculos.list.useQuery();

  // tRPC mutation
  const createOSMutation = trpc.ordensServico.create.useMutation({
    onSuccess: (data) => {
      if (data.success && data.id) {
        toast.success(`OS ${data.numeroOs} criada com sucesso!`);
        setLocation(`/admin/os/${data.id}`);
      } else {
        toast.error(data.error || "Erro ao criar OS");
      }
    },
    onError: () => {
      toast.error("Erro ao criar OS");
    },
  });

  const clientesFiltrados = clientes.filter(c => 
    (c.nomeCompleto?.toLowerCase() || "").includes(searchCliente.toLowerCase()) ||
    (c.cpf || "").includes(searchCliente) ||
    (c.telefone || "").includes(searchCliente)
  );

  const veiculosDoCliente = clienteSelecionado 
    ? veiculos.filter(v => v.clienteId === clienteSelecionado.id)
    : [];

  const handleCriarOS = () => {
    if (!clienteSelecionado && !showNovoCliente) {
      toast.error("Selecione um cliente ou crie um novo");
      return;
    }
    
    if (clienteSelecionado && !veiculoSelecionado) {
      toast.error("Selecione um veículo");
      return;
    }

    createOSMutation.mutate({
      clienteId: clienteSelecionado?.id,
      veiculoId: veiculoSelecionado?.id,
      placa: veiculoSelecionado?.placa || novoCliente.placa,
      km: km ? parseInt(km) : undefined,
      motivoVisita: motivoVisita,
      descricaoProblema: descricaoProblema,
    });
  };

  const handleCriarNovoCliente = () => {
    if (!novoCliente.nome || !novoCliente.telefone || !novoCliente.placa || !novoCliente.veiculo) {
      toast.error("Preencha os campos obrigatórios: Nome, Telefone, Placa e Veículo");
      return;
    }
    // Por enquanto, criar OS diretamente com os dados do novo cliente
    createOSMutation.mutate({
      placa: novoCliente.placa,
      km: km ? parseInt(km) : undefined,
      motivoVisita: motivoVisita,
      descricaoProblema: descricaoProblema,
      observacoes: `Novo cliente: ${novoCliente.nome} - ${novoCliente.telefone} - ${novoCliente.veiculo}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
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
          <p className="text-slate-400">Criar uma nova OS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {/* Card unificado: Cliente e Veículos */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Selecionar Cliente e Veículo
            </CardTitle>
            <Button 
              variant="outline" 
              className="border-green-500 text-green-500 hover:bg-green-500/10"
              onClick={() => {
                setShowNovoCliente(!showNovoCliente);
                if (!showNovoCliente) {
                  setClienteSelecionado(null);
                  setVeiculoSelecionado(null);
                }
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {showNovoCliente ? "Selecionar Existente" : "Novo Cliente"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulário de Novo Cliente */}
            {showNovoCliente ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Novo Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">Nome *</Label>
                    <Input
                      placeholder="Nome do cliente"
                      value={novoCliente.nome}
                      onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Telefone *</Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      value={novoCliente.telefone}
                      onChange={(e) => setNovoCliente({...novoCliente, telefone: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Placa *</Label>
                    <Input
                      placeholder="ABC-1234"
                      value={novoCliente.placa}
                      onChange={(e) => setNovoCliente({...novoCliente, placa: e.target.value.toUpperCase()})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-400">Veículo *</Label>
                    <Input
                      placeholder="Ex: VW Golf GTI 2020"
                      value={novoCliente.veiculo}
                      onChange={(e) => setNovoCliente({...novoCliente, veiculo: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowCamposOpcionais(!showCamposOpcionais)}
                  className="text-blue-400 text-sm hover:underline mt-4 flex items-center gap-1"
                >
                  {showCamposOpcionais ? '▼ Ocultar campos opcionais' : '▶ Mostrar campos opcionais'}
                </button>

                {showCamposOpcionais && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700">
                    <div className="space-y-2">
                      <Label className="text-slate-400">CPF</Label>
                      <Input
                        placeholder="000.000.000-00"
                        value={novoCliente.cpf}
                        onChange={(e) => setNovoCliente({...novoCliente, cpf: e.target.value})}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400">Email</Label>
                      <Input
                        placeholder="email@exemplo.com"
                        value={novoCliente.email}
                        onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400">Marca</Label>
                      <Input
                        placeholder="Ex: Volkswagen"
                        value={novoCliente.marca}
                        onChange={(e) => setNovoCliente({...novoCliente, marca: e.target.value})}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400">Ano</Label>
                      <Input
                        placeholder="Ex: 2020"
                        value={novoCliente.ano}
                        onChange={(e) => setNovoCliente({...novoCliente, ano: e.target.value})}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Busca de Cliente */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por nome, CPF ou telefone..."
                    value={searchCliente}
                    onChange={(e) => setSearchCliente(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Lista de Clientes */}
                {searchCliente && (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {loadingClientes ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                      </div>
                    ) : clientesFiltrados.length === 0 ? (
                      <p className="text-slate-400 text-center py-4">Nenhum cliente encontrado</p>
                    ) : (
                      clientesFiltrados.slice(0, 5).map((cliente) => (
                        <div
                          key={cliente.id}
                          onClick={() => {
                            setClienteSelecionado(cliente);
                            setSearchCliente("");
                            setVeiculoSelecionado(null);
                          }}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            clienteSelecionado?.id === cliente.id
                              ? "bg-blue-500/20 border border-blue-500/50"
                              : "bg-slate-800/50 hover:bg-slate-800"
                          }`}
                        >
                          <p className="font-medium text-white">{cliente.nomeCompleto}</p>
                          <p className="text-sm text-slate-400">{cliente.telefone} • {cliente.cpf}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Cliente Selecionado */}
                {clienteSelecionado && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{clienteSelecionado.nomeCompleto}</p>
                        <p className="text-sm text-slate-400">{clienteSelecionado.telefone}</p>
                      </div>
                      <Check className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                )}

                {/* Veículos do Cliente */}
                {clienteSelecionado && (
                  <div className="space-y-2">
                    <Label className="text-slate-400">Veículos do Cliente</Label>
                    {loadingVeiculos ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                      </div>
                    ) : veiculosDoCliente.length === 0 ? (
                      <p className="text-slate-400 text-center py-4">Nenhum veículo cadastrado</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {veiculosDoCliente.map((veiculo) => (
                          <div
                            key={veiculo.id}
                            onClick={() => setVeiculoSelecionado(veiculo)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
                              veiculoSelecionado?.id === veiculo.id
                                ? "bg-green-500/20 border border-green-500/50"
                                : "bg-slate-800/50 hover:bg-slate-800"
                            }`}
                          >
                            <Car className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="font-medium text-white">{veiculo.marca} {veiculo.modelo}</p>
                              <p className="text-sm text-slate-400 font-mono">{veiculo.placa}</p>
                            </div>
                            {veiculoSelecionado?.id === veiculo.id && (
                              <Check className="w-5 h-5 text-green-400 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Informações da OS */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Car className="h-5 w-5 text-orange-400" />
              Informações da OS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-400">KM Atual</Label>
                <Input
                  placeholder="Ex: 85420"
                  value={km}
                  onChange={(e) => setKm(e.target.value.replace(/\D/g, ''))}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Motivo da Visita</Label>
                <Input
                  placeholder="Ex: Revisão, Troca de óleo, etc."
                  value={motivoVisita}
                  onChange={(e) => setMotivoVisita(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Descrição do Problema</Label>
              <Textarea
                placeholder="Descreva o problema relatado pelo cliente..."
                value={descricaoProblema}
                onChange={(e) => setDescricaoProblema(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão de Criar */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/ordens-servico">
            <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
              Cancelar
            </Button>
          </Link>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={showNovoCliente ? handleCriarNovoCliente : handleCriarOS}
            disabled={createOSMutation.isPending}
          >
            {createOSMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Criar OS
          </Button>
        </div>
      </div>
    </div>
  );
}
