import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCog, Users, Award, TrendingUp, ArrowLeft, FileDown } from "lucide-react";
import { mecanicosMock, colaboradoresMock } from "@/lib/mockData";

export default function GestaoRH() {
  const [isLoading] = useState(false);

  // KPIs baseados nos dados mock
  const totalMecanicos = mecanicosMock.length;
  const mecanicosAtivos = mecanicosMock.length; // Todos ativos por padrão
  const totalColaboradores = colaboradoresMock.length;

  const stats = [
    { label: "Total Mecânicos", value: totalMecanicos, icon: Users, color: "text-blue-500" },
    { label: "Mecânicos Ativos", value: mecanicosAtivos, icon: UserCog, color: "text-green-500" },
    { label: "Total Colaboradores", value: totalColaboradores, icon: TrendingUp, color: "text-purple-500" },
    { label: "Performance Média", value: "4.2/5", icon: Award, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0f1419] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/gestao">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserCog className="w-6 h-6 text-blue-500" />
              Recursos Humanos
            </h1>
            <p className="text-gray-400 mt-1">
              Gestão de pessoas e indicadores de RH
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
          <FileDown className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#1a1f26] border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lista de Mecânicos */}
      <Card className="bg-[#1a1f26] border-gray-800 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Equipe de Mecânicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mecanicosMock.map((mecanico) => (
              <div
                key={mecanico.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-[#252b33]"
              >
                <div>
                  <p className="font-medium text-white">{mecanico.nome}</p>
                  <p className="text-sm text-gray-400">
                    {mecanico.especialidade || "Especialidade: Geral"}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                  Ativo
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Colaboradores */}
      <Card className="bg-[#1a1f26] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserCog className="w-5 h-5" />
            Colaboradores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {colaboradoresMock.map((colaborador) => (
              <div
                key={colaborador.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-[#252b33]"
              >
                <div>
                  <p className="font-medium text-white">{colaborador.nome}</p>
                  <p className="text-sm text-gray-400">{colaborador.cargo}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                  Ativo
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
