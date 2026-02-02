import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  User, TrendingUp, Car, Calendar, 
  Target, RefreshCw, Award, Medal
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { mecanicosMock, ordensServicoMock } from "@/lib/mockData";

interface MechanicProduction {
  id: number;
  name: string;
  emoji: string;
  valorProduzido: number;
  carrosEntregues: number;
  metaSemanal: number;
  metaMensal: number;
}

type PeriodFilter = 'semana1' | 'semana2' | 'semana3' | 'semana4' | 'mes';

const MECHANIC_EMOJIS: Record<string, string> = {
  'Samuel': '🐦',
  'Tadeu': '🦅',
  'Aldo': '🦉',
  'João': '🦆',
  'Pedro': '🦜',
  'Wendel': '🐧',
  'Alessandro': '🦊',
};

export default function AdminProdutividade() {
  const [mechanics, setMechanics] = useState<MechanicProduction[]>([]);
  const [period, setPeriod] = useState<PeriodFilter>('mes');
  const [loading, setLoading] = useState(true);
  const [totalProduzido, setTotalProduzido] = useState(0);
  const [totalCarros, setTotalCarros] = useState(0);

  const fetchData = () => {
    // Usar dados mock
    const mechanicsList: MechanicProduction[] = mecanicosMock
      .filter(m => m.empresaId === 1)
      .map(m => {
        // Simular produção baseada nos dados mock
        const osDoMecanico = ordensServicoMock.filter(os => os.mecanicoId === m.id);
        const valorProduzido = osDoMecanico.reduce((sum, os) => sum + os.valorTotalOs, 0) + (Math.random() * 50000);
        const carrosEntregues = osDoMecanico.length + Math.floor(Math.random() * 10);
        
        return {
          id: m.id,
          name: m.nome,
          emoji: MECHANIC_EMOJIS[m.nome] || '👤',
          valorProduzido: Math.round(valorProduzido),
          carrosEntregues,
          metaSemanal: 25000,
          metaMensal: 100000,
        };
      });

    // Sort by production
    mechanicsList.sort((a, b) => b.valorProduzido - a.valorProduzido);

    setMechanics(mechanicsList);
    setTotalProduzido(mechanicsList.reduce((sum, m) => sum + m.valorProduzido, 0));
    setTotalCarros(mechanicsList.reduce((sum, m) => sum + m.carrosEntregues, 0));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCurrentWeek = () => {
    const weekInMonth = Math.ceil(new Date().getDate() / 7);
    return `Semana ${weekInMonth}`;
  };

  const getMeta = (mechanic: MechanicProduction) => {
    return period === 'mes' ? mechanic.metaMensal : mechanic.metaSemanal;
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Medal className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Medal className="w-5 h-5 text-amber-700" />;
      default: return <span className="text-sm text-gray-500">{index + 1}º</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentMonth = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Produtividade dos Mecânicos</h1>
            <p className="text-muted-foreground">
              {getCurrentWeek()} - {currentMonth}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana1">Semana 1</SelectItem>
                <SelectItem value="semana2">Semana 2</SelectItem>
                <SelectItem value="semana3">Semana 3</SelectItem>
                <SelectItem value="semana4">Semana 4</SelectItem>
                <SelectItem value="mes">Mês Todo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Produzido</p>
                  <p className="text-2xl font-bold text-green-500">{formatCurrency(totalProduzido)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Carros Entregues</p>
                  <p className="text-2xl font-bold">{totalCarros}</p>
                </div>
                <Car className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Médio</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalCarros > 0 ? totalProduzido / totalCarros : 0)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mecânicos Ativos</p>
                  <p className="text-2xl font-bold">{mechanics.length}</p>
                </div>
                <User className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mechanics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mechanics.map((mechanic, index) => {
            const meta = getMeta(mechanic);
            const percentage = meta > 0 ? (mechanic.valorProduzido / meta) * 100 : 0;
            const metaAtingida = percentage >= 100;

            return (
              <Card 
                key={mechanic.id}
                className={`relative overflow-hidden transition-all ${
                  metaAtingida ? 'ring-2 ring-green-500 border-green-500/30' : ''
                }`}
              >
                {/* Rank Badge */}
                <div className="absolute top-4 right-4">
                  {getRankIcon(index)}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{mechanic.emoji}</span>
                    <span className="text-lg">{mechanic.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold">
                      {formatCurrency(mechanic.valorProduzido)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mechanic.carrosEntregues} veículos entregues
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Meta {period === 'mes' ? 'Mensal' : 'Semanal'}</span>
                      <span className="font-medium">{formatCurrency(meta)}</span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${metaAtingida ? '[&>div]:bg-green-500' : ''}`}
                    />
                    <p className={`text-xs text-center ${metaAtingida ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {percentage.toFixed(0)}% da meta
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
