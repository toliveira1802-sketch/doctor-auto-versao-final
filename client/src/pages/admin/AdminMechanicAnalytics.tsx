import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, ThumbsUp, ThumbsDown } from "lucide-react";
import { mecanicosMock, ordensServicoMock } from "@/lib/mockData";

export default function AdminMechanicAnalytics() {
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
            <BarChart3 className="w-6 h-6 text-red-500" />
            Analytics dos Mecânicos
          </h1>
          <p className="text-gray-400">Desempenho individual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mecanicosMock.map((mec) => {
          const osDoMecanico = ordensServicoMock.filter(os => os.mecanicoId === mec.id);
          const totalValor = osDoMecanico.reduce((acc, os) => acc + os.valorTotalOs, 0);
          return (
            <Card key={mec.id} className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">{mec.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Especialidade</span>
                  <span className="text-white">{mec.especialidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Nível</span>
                  <span className="text-white">{mec.grauConhecimento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">OS Realizadas</span>
                  <span className="text-white">{osDoMecanico.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Valor Gerado</span>
                  <span className="text-green-400 font-bold">R$ {totalValor.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-green-400">
                    <ThumbsUp className="h-4 w-4" />
                    {mec.qtdePositivos}
                  </div>
                  <div className="flex items-center gap-2 text-red-400">
                    <ThumbsDown className="h-4 w-4" />
                    {mec.qtdeNegativos}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
