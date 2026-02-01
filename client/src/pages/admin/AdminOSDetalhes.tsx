import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, User, Car, Wrench, DollarSign, Clock, Calendar } from "lucide-react";
import { ordensServicoMock, statusList, clientesMock, veiculosMock, mecanicosMock, servicosCatalogoMock } from "@/lib/mockData";

export default function AdminOSDetalhes() {
  const params = useParams();
  const id = Number(params.id);
  
  const os = ordensServicoMock.find(o => o.id === id);
  const cliente = os ? clientesMock.find(c => c.id === os.clienteId) : null;
  const veiculo = os ? veiculosMock.find(v => v.id === os.veiculoId) : null;
  const mecanico = os ? mecanicosMock.find(m => m.id === os.mecanicoId) : null;

  const getStatusColor = (status: string) => {
    const s = statusList.find(st => st.status === status);
    return s?.cor || "#6B7280";
  };

  if (!os) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/ordens-servico">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">OS não encontrada</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/ordens-servico">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-500" />
              {os.numeroOs}
            </h1>
            <p className="text-gray-400">{os.placa} • {os.veiculo}</p>
          </div>
        </div>
        <Badge
          style={{ backgroundColor: `${getStatusColor(os.status)}20`, color: getStatusColor(os.status) }}
          className="border-0 text-lg px-4 py-2"
        >
          {os.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info do Cliente */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Nome</p>
                <p className="text-white font-medium">{cliente?.nomeCompleto || os.cliente}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Telefone</p>
                <p className="text-white">{cliente?.telefone || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{cliente?.email || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">CPF</p>
                <p className="text-white">{cliente?.cpf || "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Info do Veículo */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Car className="h-5 w-5 text-green-400" />
                Informações do Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Placa</p>
                <p className="text-white font-bold text-lg">{os.placa}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Modelo</p>
                <p className="text-white">{veiculo?.modelo || os.veiculo}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ano</p>
                <p className="text-white">{veiculo?.ano || "-"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">KM Atual</p>
                <p className="text-white">{os.km.toLocaleString("pt-BR")} km</p>
              </div>
            </CardContent>
          </Card>

          {/* Motivo da Visita */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-orange-400" />
                Motivo da Visita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">{os.motivoVisita || "Não informado"}</p>
            </CardContent>
          </Card>

          {/* Serviços */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" />
                Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {servicosCatalogoMock.slice(0, 3).map((servico) => (
                  <div key={servico.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{servico.nome}</p>
                      <p className="text-gray-400 text-sm">{servico.tipo} • {servico.tempoEstimado} min</p>
                    </div>
                    <p className="text-white font-medium">
                      R$ {servico.valorBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Status e Datas */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                Status e Datas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Status Atual</p>
                <Badge
                  style={{ backgroundColor: `${getStatusColor(os.status)}20`, color: getStatusColor(os.status) }}
                  className="border-0 mt-1"
                >
                  {os.status}
                </Badge>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Data de Entrada</p>
                <p className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {os.dataEntrada.toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Mecânico Responsável</p>
                <p className="text-white">{mecanico?.nome || os.mecanico || "Não atribuído"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Recurso</p>
                <p className="text-white">{os.recurso || "Não alocado"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Valores */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Total Orçamento</p>
                <p className="text-white text-xl font-bold">
                  R$ {os.totalOrcamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Valor Total OS</p>
                <p className="text-green-400 text-2xl font-bold">
                  R$ {os.valorTotalOs.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 space-y-3">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Editar OS
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Imprimir
              </Button>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                Enviar por WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
