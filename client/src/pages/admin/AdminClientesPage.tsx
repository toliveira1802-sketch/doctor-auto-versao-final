import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  Users,
  Car,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AdminClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  // Buscar clientes
  const { data: clientes, isLoading: loadingClientes } = trpc.clientes.list.useQuery();
  
  // Buscar veículos
  const { data: veiculos, isLoading: loadingVeiculos } = trpc.veiculos.list.useQuery();

  // Filtrar clientes pelo termo de busca
  const filteredClientes = clientes?.filter((cliente) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cliente.nomeCompleto?.toLowerCase().includes(searchLower) ||
      cliente.cpf?.toLowerCase().includes(searchLower) ||
      cliente.email?.toLowerCase().includes(searchLower) ||
      cliente.telefone?.toLowerCase().includes(searchLower)
    );
  });

  // Obter veículos de um cliente específico
  const getVeiculosDoCliente = (clienteId: number) => {
    return veiculos?.filter((v) => v.clienteId === clienteId) || [];
  };

  // Cliente selecionado para modal
  const clienteSelecionado = clientes?.find((c) => c.id === selectedClientId);
  const veiculosDoClienteSelecionado = selectedClientId
    ? getVeiculosDoCliente(selectedClientId)
    : [];

  const toggleExpand = (clienteId: number) => {
    setExpandedClientId(expandedClientId === clienteId ? null : clienteId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Clientes</h1>
            <p className="text-gray-400">Visualização de clientes e veículos</p>
          </div>
        </div>
        <Badge variant="outline" className="text-white border-white/20">
          <Users className="h-4 w-4 mr-2" />
          {clientes?.length || 0} clientes
        </Badge>
      </div>

      {/* Search */}
      <Card className="mb-6 bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, CPF, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total de Clientes</p>
              <p className="text-2xl font-bold text-white">{clientes?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Car className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total de Veículos</p>
              <p className="text-2xl font-bold text-white">{veiculos?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Car className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Média Veículos/Cliente</p>
              <p className="text-2xl font-bold text-white">
                {clientes?.length ? (veiculos?.length || 0 / clientes.length).toFixed(1) : "0"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clientes Table */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingClientes || loadingVeiculos ? (
            <div className="text-center py-8 text-gray-400">Carregando...</div>
          ) : filteredClientes?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Nenhum cliente encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Nome</TableHead>
                  <TableHead className="text-gray-400">CPF</TableHead>
                  <TableHead className="text-gray-400">Contato</TableHead>
                  <TableHead className="text-gray-400">Cidade/UF</TableHead>
                  <TableHead className="text-gray-400">Veículos</TableHead>
                  <TableHead className="text-gray-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes?.map((cliente) => {
                  const veiculosCliente = getVeiculosDoCliente(cliente.id);
                  const isExpanded = expandedClientId === cliente.id;

                  return (
                    <>
                      <TableRow
                        key={cliente.id}
                        className="border-white/10 hover:bg-white/5 cursor-pointer"
                        onClick={() => toggleExpand(cliente.id)}
                      >
                        <TableCell className="text-white font-medium">
                          {cliente.nomeCompleto}
                        </TableCell>
                        <TableCell className="text-gray-300">{cliente.cpf || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {cliente.telefone && (
                              <span className="text-gray-300 flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" /> {cliente.telefone}
                              </span>
                            )}
                            {cliente.email && (
                              <span className="text-gray-400 flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" /> {cliente.email}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {cliente.cidade && cliente.estado
                            ? `${cliente.cidade}/${cliente.estado}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-green-400 border-green-400/30"
                          >
                            <Car className="h-3 w-3 mr-1" />
                            {veiculosCliente.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClientId(cliente.id);
                            }}
                          >
                            Ver detalhes
                          </Button>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 inline ml-2 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 inline ml-2 text-gray-400" />
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Veículos expandidos */}
                      {isExpanded && veiculosCliente.length > 0 && (
                        <TableRow className="bg-white/5 border-white/10">
                          <TableCell colSpan={6} className="p-4">
                            <div className="text-sm text-gray-400 mb-2">
                              Veículos de {cliente.nomeCompleto}:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {veiculosCliente.map((veiculo) => (
                                <div
                                  key={veiculo.id}
                                  className="bg-white/5 rounded-lg p-3 border border-white/10"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Car className="h-4 w-4 text-green-400" />
                                    <span className="text-white font-medium">
                                      {veiculo.placa}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-300">
                                    {veiculo.marca} {veiculo.modelo}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {veiculo.ano} • {veiculo.combustivel || "N/A"}
                                  </div>
                                  {veiculo.kmAtual ? (
                                    <div className="text-xs text-gray-500 mt-1">
                                      KM: {veiculo.kmAtual.toLocaleString()}
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Cliente */}
      <Dialog open={!!selectedClientId} onOpenChange={() => setSelectedClientId(null)}>
        <DialogContent className="bg-gray-900 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalhes do Cliente</DialogTitle>
          </DialogHeader>

          {clienteSelecionado && (
            <div className="space-y-6">
              {/* Info do Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Nome Completo</label>
                  <p className="text-white font-medium">
                    {clienteSelecionado.nomeCompleto}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">CPF</label>
                  <p className="text-white">{clienteSelecionado.cpf || "-"}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {clienteSelecionado.email || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Telefone</label>
                  <p className="text-white flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {clienteSelecionado.telefone || "-"}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-400">Endereço</label>
                  <p className="text-white flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {clienteSelecionado.endereco
                      ? `${clienteSelecionado.endereco}, ${clienteSelecionado.cidade}/${clienteSelecionado.estado} - CEP: ${clienteSelecionado.cep}`
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Veículos do Cliente */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Car className="h-5 w-5 text-green-400" />
                  Veículos ({veiculosDoClienteSelecionado.length})
                </h3>
                {veiculosDoClienteSelecionado.length === 0 ? (
                  <p className="text-gray-400">Nenhum veículo cadastrado</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {veiculosDoClienteSelecionado.map((veiculo) => (
                      <div
                        key={veiculo.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className="bg-green-500/20 text-green-400 border-0">
                                {veiculo.placa}
                              </Badge>
                              <span className="text-gray-400 text-sm">
                                {veiculo.ano}
                              </span>
                            </div>
                            <p className="text-white font-medium">
                              {veiculo.marca} {veiculo.modelo}
                            </p>
                            {veiculo.versao && (
                              <p className="text-gray-400 text-sm">{veiculo.versao}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Combustível</p>
                            <p className="text-white">{veiculo.combustivel || "N/A"}</p>
                            {veiculo.kmAtual ? (
                              <>
                                <p className="text-gray-400 text-sm mt-2">KM Atual</p>
                                <p className="text-white">
                                  {veiculo.kmAtual.toLocaleString()}
                                </p>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
