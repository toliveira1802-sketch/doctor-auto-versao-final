import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lightbulb, Plus, ArrowLeft, CheckCircle, Clock, AlertCircle, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface Melhoria {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  status: "pendente" | "em_analise" | "aprovada" | "implementada";
  votos: number;
  criadoPor: string;
  dataCriacao: string;
}

export default function GestaoMelhorias() {
  const [modalOpen, setModalOpen] = useState(false);
  const [novaMelhoria, setNovaMelhoria] = useState({
    titulo: "",
    descricao: "",
    categoria: "sistema",
  });

  const [melhorias, setMelhorias] = useState<Melhoria[]>([
    {
      id: 1,
      titulo: "Notificação por WhatsApp para clientes",
      descricao: "Enviar notificações automáticas via WhatsApp quando o status da OS mudar",
      categoria: "comunicacao",
      status: "em_analise",
      votos: 15,
      criadoPor: "Thalles",
      dataCriacao: "2026-01-15",
    },
    {
      id: 2,
      titulo: "Dashboard mobile para mecânicos",
      descricao: "Criar uma versão mobile do dashboard para os mecânicos acessarem pelo celular",
      categoria: "sistema",
      status: "aprovada",
      votos: 12,
      criadoPor: "Pedro",
      dataCriacao: "2026-01-20",
    },
    {
      id: 3,
      titulo: "Integração com fornecedores de peças",
      descricao: "Integrar com sistemas de fornecedores para consulta de preços e disponibilidade",
      categoria: "integracao",
      status: "pendente",
      votos: 8,
      criadoPor: "Sofia",
      dataCriacao: "2026-01-25",
    },
    {
      id: 4,
      titulo: "Relatório de produtividade semanal",
      descricao: "Gerar relatórios automáticos de produtividade por mecânico toda semana",
      categoria: "relatorios",
      status: "implementada",
      votos: 20,
      criadoPor: "Francisco",
      dataCriacao: "2026-01-10",
    },
  ]);

  const handleCriarMelhoria = () => {
    if (!novaMelhoria.titulo || !novaMelhoria.descricao) {
      toast.error("Preencha o título e a descrição");
      return;
    }

    const nova: Melhoria = {
      id: melhorias.length + 1,
      titulo: novaMelhoria.titulo,
      descricao: novaMelhoria.descricao,
      categoria: novaMelhoria.categoria,
      status: "pendente",
      votos: 0,
      criadoPor: "Usuário",
      dataCriacao: new Date().toISOString().split("T")[0],
    };

    setMelhorias([nova, ...melhorias]);
    setNovaMelhoria({ titulo: "", descricao: "", categoria: "sistema" });
    setModalOpen(false);
    toast.success("Sugestão enviada com sucesso!");
  };

  const handleVotar = (id: number) => {
    setMelhorias(melhorias.map(m => 
      m.id === id ? { ...m, votos: m.votos + 1 } : m
    ));
    toast.success("Voto registrado!");
  };

  const getStatusIcon = (status: Melhoria["status"]) => {
    switch (status) {
      case "implementada": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "aprovada": return <ThumbsUp className="h-4 w-4 text-blue-500" />;
      case "em_analise": return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: Melhoria["status"]) => {
    switch (status) {
      case "implementada": return "Implementada";
      case "aprovada": return "Aprovada";
      case "em_analise": return "Em Análise";
      default: return "Pendente";
    }
  };

  const getStatusColor = (status: Melhoria["status"]) => {
    switch (status) {
      case "implementada": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "aprovada": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "em_analise": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      sistema: "Sistema",
      comunicacao: "Comunicação",
      integracao: "Integração",
      relatorios: "Relatórios",
      outros: "Outros",
    };
    return labels[categoria] || categoria;
  };

  // Estatísticas
  const stats = {
    total: melhorias.length,
    pendentes: melhorias.filter(m => m.status === "pendente").length,
    emAnalise: melhorias.filter(m => m.status === "em_analise").length,
    implementadas: melhorias.filter(m => m.status === "implementada").length,
  };

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
              <Lightbulb className="w-6 h-6 text-cyan-500" />
              Melhorias
            </h1>
            <p className="text-gray-400 mt-1">
              Sugestões e ideias para evolução do sistema
            </p>
          </div>
        </div>
        
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Sugestão
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1f26] border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Nova Sugestão de Melhoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Título *</Label>
                <Input
                  placeholder="Título da sugestão..."
                  value={novaMelhoria.titulo}
                  onChange={(e) => setNovaMelhoria({...novaMelhoria, titulo: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Categoria</Label>
                <select
                  value={novaMelhoria.categoria}
                  onChange={(e) => setNovaMelhoria({...novaMelhoria, categoria: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value="sistema" className="bg-gray-800">Sistema</option>
                  <option value="comunicacao" className="bg-gray-800">Comunicação</option>
                  <option value="integracao" className="bg-gray-800">Integração</option>
                  <option value="relatorios" className="bg-gray-800">Relatórios</option>
                  <option value="outros" className="bg-gray-800">Outros</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Descrição *</Label>
                <Textarea
                  placeholder="Descreva sua sugestão em detalhes..."
                  value={novaMelhoria.descricao}
                  onChange={(e) => setNovaMelhoria({...novaMelhoria, descricao: e.target.value})}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>
              <Button 
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                onClick={handleCriarMelhoria}
              >
                <Plus className="h-4 w-4 mr-2" />
                Enviar Sugestão
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6">
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-gray-400 text-sm">Total de Sugestões</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-gray-400">{stats.pendentes}</p>
            <p className="text-gray-400 text-sm">Pendentes</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-yellow-400">{stats.emAnalise}</p>
            <p className="text-gray-400 text-sm">Em Análise</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1f26] border-gray-800">
          <CardContent className="p-4">
            <p className="text-3xl font-bold text-green-400">{stats.implementadas}</p>
            <p className="text-gray-400 text-sm">Implementadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Melhorias */}
      <div className="space-y-4">
        {melhorias.map((melhoria) => (
          <Card key={melhoria.id} className="bg-[#1a1f26] border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(melhoria.status)}
                    <h3 className="text-white font-semibold">{melhoria.titulo}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(melhoria.status)}`}>
                      {getStatusLabel(melhoria.status)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-300">
                      {getCategoriaLabel(melhoria.categoria)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{melhoria.descricao}</p>
                  <p className="text-gray-500 text-xs">
                    Criado por {melhoria.criadoPor} em {melhoria.dataCriacao}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cyan-400 hover:bg-cyan-500/20"
                    onClick={() => handleVotar(melhoria.id)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="text-white font-bold">{melhoria.votos}</span>
                  <span className="text-gray-500 text-xs">votos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
