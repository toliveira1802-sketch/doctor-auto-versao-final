import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BarChart3, Target } from "lucide-react";
import { metasProdutividadeMock } from "@/lib/mockData";

export default function AdminProdutividade() {
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
            Produtividade
          </h1>
          <p className="text-gray-400">Metas e desempenho</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metasProdutividadeMock.map((meta) => {
          const percentualHoras = (meta.horasRealizadas / meta.metaHoras) * 100;
          const percentualValor = (meta.valorRealizado / meta.metaValor) * 100;
          return (
            <Card key={meta.mecanicoId} className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-400" />
                  {meta.mecanico}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Horas</span>
                    <span className="text-white">{meta.horasRealizadas}h / {meta.metaHoras}h</span>
                  </div>
                  <Progress value={percentualHoras} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Valor</span>
                    <span className="text-white">
                      R$ {meta.valorRealizado.toLocaleString("pt-BR")} / R$ {meta.metaValor.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <Progress value={percentualValor} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
