import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Users,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { colaboradoresMock } from "@/lib/mockData";
import { toast } from "sonner";

interface Pendencia {
  id: number;
  nomePendencia: string;
  responsavelId: number;
  criadorId: number;
  status: "pendente" | "feita" | "feita_ressalvas" | "nao_feita";
  dataCriacao: string;
  observacoes?: string;
}

export default function AdminPendencias() {
  const [colaborador, setColaborador] = useState<any>(null);
  const [pendencias, setPendencias] = useState<Pendencia[]>([
    // Dados mock iniciais
    { id: 1, nomePendencia: "Ligar para cliente sobre peça", responsavelId: 1, criadorId: 2, status: "pendente", dataCriacao: "2026-02-01" },
    { id: 2, nomePendencia: "Verificar garantia do motor", responsavelId: 7, criadorId: 1, status: "feita", dataCriacao: "2026-02-01" },
    { id: 3, nomePendencia: "Orçamento para cliente VIP", responsavelId: 8, criadorId: 1, status: "feita_ressalvas", dataCriacao: "2026-02-01", observacoes: "Falta confirmar valor da peça" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [consultorSelecionado, setConsultorSelecionado] = useState<number | null>(null);
  const [novaPendencia, setNovaPendencia] = useState({
    nomePendencia: "",
    responsavelId: 0,
    observacoes: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("colaborador");
    if (stored) {
      setColaborador(JSON.parse(stored));
    }
  }, []);

  // Equipe de consultores técnicos + Thalles
  const equipeConsultores = colaboradoresMock.filter(c => 
    ["Consultor Técnico", "Direção"].includes(c.cargo)
  );

  const handleCriarPendencia = () => {
    if (!novaPendencia.nomePendencia || !novaPendencia.responsavelId) {
      toast.error("Preencha o nome da pendência e selecione o responsável");
      return;
    }

    const nova: Pendencia = {
      id: pendencias.length + 1,
      nomePendencia: novaPendencia.nomePendencia,
      responsavelId: novaPendencia.responsavelId,
      criadorId: colaborador?.id || 1,
      status: "pendente",
      dataCriacao: new Date().toISOString().split("T")[0],
      observacoes: novaPendencia.observacoes,
    };

    setPendencias([...pendencias, nova]);
    setNovaPendencia({ nomePendencia: "", responsavelId: 0, observacoes: "" });
    setModalOpen(false);
    toast.success("Pendência criada com sucesso!");
  };

  const handleAtualizarStatus = (id: number, novoStatus: Pendencia["status"]) => {
    setPendencias(pendencias.map(p => 
      p.id === id ? { ...p, status: novoStatus } : p
    ));
    toast.success("Status atualizado!");
  };

  const getStatusIcon = (status: Pendencia["status"]) => {
    switch (status) {
      case "feita": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "feita_ressalvas": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "nao_feita": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusLabel = (status: Pendencia["status"]) => {
    switch (status) {
      case "feita": return "Feita";
      case "feita_ressalvas": return "Feita c/ Ressalvas";
      case "nao_feita": return "Não Feita";
      default: return "Pendente";
    }
  };

  const getStatusColor = (status: Pendencia["status"]) => {
    switch (status) {
      case "feita": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "feita_ressalvas": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "nao_feita": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const pendenciasDoConsultor = consultorSelecionado
    ? pendencias.filter(p => p.responsavelId === consultorSelecionado)
    : pendencias;

  const getNomeColaborador = (id: number) => {
    const col = colaboradoresMock.find(c => c.id === id);
    return col?.nome || "Desconhecido";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Pendências do Dia</h1>
            <p className="text-gray-400">Gerencie as pendências da equipe</p>
          </div>
        </div>
        
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Pendência
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1f26] border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Nova Pendência</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-gray-400">Nome da Pendência *</Label>
                <Input
                  placeholder="Descreva a pendência..."
                  value={novaPendencia.nomePendencia}
                  onChange={(e) => setNovaPendencia({...novaPendencia, nomePendencia: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Responsável *</Label>
                <select
                  value={novaPendencia.responsavelId}
                  onChange={(e) => setNovaPendencia({...novaPendencia, responsavelId: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                >
                  <option value={0} className="bg-gray-800">Selecione...</option>
                  {equipeConsultores.map((col) => (
                    <option key={col.id} value={col.id} className="bg-gray-800">{col.nome}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Quem Criou</Label>
                <Input
                  value={colaborador?.nome || "Usuário"}
                  disabled
                  className="bg-white/5 border-white/10 text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Data de Criação</Label>
                <Input
                  value={new Date().toLocaleDateString("pt-BR")}
                  disabled
                  className="bg-white/5 border-white/10 text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-400">Observações</Label>
                <Textarea
                  placeholder="Observações adicionais..."
                  value={novaPendencia.observacoes}
                  onChange={(e) => setNovaPendencia({...novaPendencia, observacoes: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleCriarPendencia}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Pendência
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Consultores */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <Button
          variant={consultorSelecionado === null ? "default" : "outline"}
          className={consultorSelecionado === null ? "bg-red-600 hover:bg-red-700" : "border-gray-600 text-gray-400"}
          onClick={() => setConsultorSelecionado(null)}
        >
          Todos
        </Button>
        {equipeConsultores.map((consultor) => {
          const qtdPendencias = pendencias.filter(p => p.responsavelId === consultor.id && p.status === "pendente").length;
          return (
            <Button
              key={consultor.id}
              variant={consultorSelecionado === consultor.id ? "default" : "outline"}
              className={consultorSelecionado === consultor.id ? "bg-red-600 hover:bg-red-700" : "border-gray-600 text-gray-400 hover:text-white"}
              onClick={() => setConsultorSelecionado(consultor.id)}
            >
              <Users className="h-4 w-4 mr-2" />
              {consultor.nome}
              {qtdPendencias > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {qtdPendencias}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Lista de Pendências */}
      <div className="space-y-4">
        {pendenciasDoConsultor.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">Nenhuma pendência encontrada</p>
            </CardContent>
          </Card>
        ) : (
          pendenciasDoConsultor.map((pendencia) => (
            <Card key={pendencia.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(pendencia.status)}
                    <div>
                      <p className="text-white font-medium">{pendencia.nomePendencia}</p>
                      <p className="text-gray-400 text-sm">
                        Responsável: {getNomeColaborador(pendencia.responsavelId)} • 
                        Criado por: {getNomeColaborador(pendencia.criadorId)} • 
                        {pendencia.dataCriacao}
                      </p>
                      {pendencia.observacoes && (
                        <p className="text-gray-500 text-sm mt-1">{pendencia.observacoes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(pendencia.status)}`}>
                      {getStatusLabel(pendencia.status)}
                    </span>
                    {pendencia.status === "pendente" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:bg-green-500/20"
                          onClick={() => handleAtualizarStatus(pendencia.id, "feita")}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-yellow-400 hover:bg-yellow-500/20"
                          onClick={() => handleAtualizarStatus(pendencia.id, "feita_ressalvas")}
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/20"
                          onClick={() => handleAtualizarStatus(pendencia.id, "nao_feita")}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
