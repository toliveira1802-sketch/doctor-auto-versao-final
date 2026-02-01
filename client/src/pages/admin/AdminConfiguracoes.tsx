import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Settings, Building, Users, Bell, Shield } from "lucide-react";

export default function AdminConfiguracoes() {
  const configs = [
    { id: 1, titulo: "Dados da Empresa", descricao: "Informações cadastrais", icon: Building },
    { id: 2, titulo: "Usuários", descricao: "Gerenciar colaboradores", icon: Users },
    { id: 3, titulo: "Notificações", descricao: "Configurar alertas", icon: Bell },
    { id: 4, titulo: "Segurança", descricao: "Permissões e acessos", icon: Shield },
  ];

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
            <Settings className="w-6 h-6 text-red-500" />
            Configurações
          </h1>
          <p className="text-gray-400">Configurações do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configs.map((config) => {
          const Icon = config.icon;
          return (
            <Card key={config.id} className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 rounded-lg bg-blue-500/20">
                  <Icon className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">{config.titulo}</p>
                  <p className="text-gray-400">{config.descricao}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
