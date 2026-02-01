import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, User, Wrench, FileText } from "lucide-react";
import { ordensServicoMock, statusList } from "@/lib/mockData";

export default function AdminPatioDetalhes() {
  const params = useParams();
  const id = Number(params.id);
  
  const os = ordensServicoMock.find(o => o.id === id);

  const getStatusColor = (status: string) => {
    const s = statusList.find(st => st.status === status);
    return s?.cor || "#6B7280";
  };

  if (!os) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/patio">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Veículo não encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/patio">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-red-500" />
            {os.placa}
          </h1>
          <p className="text-gray-400">{os.veiculo}</p>
        </div>
        <Badge
          style={{ backgroundColor: `${getStatusColor(os.status)}20`, color: getStatusColor(os.status) }}
          className="border-0 ml-auto"
        >
          {os.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-400" />
              Informações do Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Placa</span>
              <span className="text-white font-medium">{os.placa}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Veículo</span>
              <span className="text-white">{os.veiculo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">KM</span>
              <span className="text-white">{os.km.toLocaleString("pt-BR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recurso</span>
              <span className="text-white">{os.recurso || "Não alocado"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-green-400" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Nome</span>
              <span className="text-white font-medium">{os.cliente}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">OS</span>
              <span className="text-white">{os.numeroOs}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-400" />
              Informações do Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Mecânico</span>
              <span className="text-white">{os.mecanico || "Não atribuído"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status</span>
              <Badge
                style={{ backgroundColor: `${getStatusColor(os.status)}20`, color: getStatusColor(os.status) }}
                className="border-0"
              >
                {os.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Descrição</span>
              <span className="text-white">{os.motivoVisita || "Sem descrição"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              Valores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Valor Total</span>
              <span className="text-white font-bold text-xl">
                R$ {os.valorTotalOs.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mt-6">
        <Link href={`/admin/os/${os.id}`}>
          <Button className="bg-red-600 hover:bg-red-700">
            <FileText className="h-4 w-4 mr-2" />
            Ver OS Completa
          </Button>
        </Link>
      </div>
    </div>
  );
}
