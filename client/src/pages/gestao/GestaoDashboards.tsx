import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserCog,
  Cog,
  DollarSign,
  Laptop,
  Megaphone,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const modules = [
  {
    title: "Recursos Humanos",
    description: "Gerencie mecânicos, performance e feedbacks da equipe",
    url: "/gestao/rh",
    icon: UserCog,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Operações",
    description: "Acompanhe agendamentos, status e fluxo operacional",
    url: "/gestao/operacoes",
    icon: Cog,
    color: "from-emerald-500 to-emerald-600"
  },
  {
    title: "Financeiro",
    description: "Monitore faturamento, metas e indicadores financeiros",
    url: "/gestao/financeiro",
    icon: DollarSign,
    color: "from-amber-500 to-amber-600"
  },
  {
    title: "Tecnologia",
    description: "Dados do sistema, usuários e métricas de uso",
    url: "/gestao/tecnologia",
    icon: Laptop,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Comercial e Marketing",
    description: "Promoções, campanhas e aquisição de clientes",
    url: "/gestao/comercial",
    icon: Megaphone,
    color: "from-rose-500 to-rose-600"
  },
  {
    title: "Melhorias",
    description: "Sugestões e ideias para evolução do sistema",
    url: "/gestao/melhorias",
    icon: Lightbulb,
    color: "from-cyan-500 to-cyan-600"
  },
];

export default function GestaoDashboards() {
  return (
    <div className="min-h-screen bg-[#0f1419] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão</h1>
          <p className="text-gray-400">Dashboards e indicadores de desempenho</p>
        </div>
      </div>

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Link key={module.url} href={module.url}>
              <Card className="group relative overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 bg-[#1a1f26] border-gray-800 h-full">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                  <div>
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {module.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center gap-2 mt-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
                    <span className="text-sm font-medium">Acessar</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
