import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Wrench } from "lucide-react";
import { mecanicosMock, ordensServicoMock } from "@/lib/mockData";

export default function AdminAgendaMecanicos() {
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
            <Users className="w-6 h-6 text-red-500" />
            Agenda dos Mecânicos
          </h1>
          <p className="text-gray-400">Distribuição de trabalho</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mecanicosMock.slice(0, 6).map((mec) => {
          const osDoMecanico = ordensServicoMock.filter(os => os.mecanicoId === mec.id);
          return (
            <Card key={mec.id} className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-400" />
                  {mec.nome}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">{mec.especialidade} • {mec.grauConhecimento}</p>
                <div className="space-y-2">
                  {osDoMecanico.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Sem OS atribuídas</p>
                  ) : (
                    osDoMecanico.map((os) => (
                      <div key={os.id} className="p-3 bg-white/5 rounded-lg">
                        <p className="text-white font-medium">{os.numeroOs}</p>
                        <p className="text-gray-400 text-sm">{os.placa} • {os.status}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
