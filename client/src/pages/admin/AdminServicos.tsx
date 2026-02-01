import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Wrench, Plus } from "lucide-react";
import { servicosCatalogoMock } from "@/lib/mockData";

export default function AdminServicos() {
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
              <Wrench className="w-6 h-6 text-red-500" />
              Catálogo de Serviços
            </h1>
            <p className="text-gray-400">Serviços disponíveis</p>
          </div>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400">Serviço</th>
                <th className="text-left p-4 text-gray-400">Tipo</th>
                <th className="text-left p-4 text-gray-400">Tempo Est.</th>
                <th className="text-right p-4 text-gray-400">Valor Base</th>
              </tr>
            </thead>
            <tbody>
              {servicosCatalogoMock.map((servico) => (
                <tr key={servico.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 text-white font-medium">{servico.nome}</td>
                  <td className="p-4 text-gray-400">{servico.tipo}</td>
                  <td className="p-4 text-gray-400">{servico.tempoEstimado} min</td>
                  <td className="p-4 text-white text-right">
                    R$ {servico.valorBase.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
