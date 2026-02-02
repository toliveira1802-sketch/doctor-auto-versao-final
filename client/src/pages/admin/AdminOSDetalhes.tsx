import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { 
  ArrowLeft, Save, Plus, Trash2, Phone, Car, User, 
  Calendar, DollarSign, FileText, Wrench, CheckCircle,
  XCircle, AlertTriangle, Clock, Loader2, Edit2,
  ClipboardCheck, Camera, ChevronDown, ChevronUp,
  Send, Download, Crown, Award, Medal, Star, Copy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// Configuração de prioridade/criticidade
const prioridadeConfig: Record<string, { label: string; borderColor: string; bgColor: string }> = {
  verde: { label: "Tranquilo", borderColor: "border-green-500", bgColor: "bg-green-500/5" },
  amarelo: { label: "Médio", borderColor: "border-yellow-500", bgColor: "bg-yellow-500/5" },
  vermelho: { label: "Imediato", borderColor: "border-red-500", bgColor: "bg-red-500/5" },
};

const loyaltyBadgeConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  bronze: { label: "Bronze", color: "bg-amber-700/20 text-amber-700 border-amber-700/30", icon: Medal },
  prata: { label: "Prata", color: "bg-slate-400/20 text-slate-500 border-slate-400/30", icon: Award },
  ouro: { label: "Ouro", color: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30", icon: Crown },
  diamante: { label: "Diamante", color: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30", icon: Star },
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  diagnostico: { label: "Diagnóstico", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: Wrench },
  orcamento: { label: "Orçamento", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: FileText },
  aguardando_aprovacao: { label: "Aguardando Aprovação", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
  aprovado: { label: "Aprovado", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  parcial: { label: "Parcial", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: AlertTriangle },
  recusado: { label: "Recusado", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
  em_execucao: { label: "Em Execução", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: Wrench },
  concluido: { label: "Concluído", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: CheckCircle },
  entregue: { label: "Entregue", color: "bg-gray-500/10 text-gray-500 border-gray-500/20", icon: CheckCircle },
};

const itemStatusConfig: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  aprovado: { label: "Aprovado", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  recusado: { label: "Recusado", color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export default function AdminOSDetalhes() {
  const params = useParams<{ id: string }>();
  const osId = Number(params.id);
  const [, setLocation] = useLocation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedOS, setEditedOS] = useState<Record<string, any>>({});
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    descricao: "",
    tipo: "peca",
    quantidade: 1,
    valor_custo: 0,
    margem: 40,
    valor_unitario: 0,
    prioridade: "amarelo" as 'verde' | 'amarelo' | 'vermelho',
  });
  
  // Collapsible sections
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [servicosOpen, setServicosOpen] = useState(true);
  
  // Checklist states
  const [checklistEntrada, setChecklistEntrada] = useState<Record<string, boolean>>({
    nivelOleo: false,
    nivelAgua: false,
    freios: false,
    pneus: false,
    luzes: false,
    bateria: false,
  });

  // tRPC queries
  const { data: osData, isLoading, refetch } = trpc.ordensServico.getCompleta.useQuery(
    { id: osId },
    { enabled: !isNaN(osId) }
  );
  
  const { data: crmData } = trpc.crm.getByCliente.useQuery(
    { clienteId: osData?.cliente?.id || 0 },
    { enabled: !!osData?.cliente?.id }
  );

  // tRPC mutations
  const updateOSMutation = trpc.ordensServico.update.useMutation({
    onSuccess: () => {
      toast.success("OS atualizada com sucesso!");
      setIsEditing(false);
      refetch();
    },
    onError: () => toast.error("Erro ao atualizar OS"),
  });

  const updateStatusMutation = trpc.ordensServico.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status alterado!");
      refetch();
    },
    onError: () => toast.error("Erro ao alterar status"),
  });

  const createItemMutation = trpc.osItens.create.useMutation({
    onSuccess: () => {
      toast.success("Item adicionado!");
      setShowAddItemDialog(false);
      setNewItem({ descricao: "", tipo: "peca", quantidade: 1, valor_custo: 0, margem: 40, valor_unitario: 0, prioridade: "amarelo" });
      refetch();
    },
    onError: () => toast.error("Erro ao adicionar item"),
  });

  const updateItemStatusMutation = trpc.osItens.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status do item alterado!");
      refetch();
    },
    onError: () => toast.error("Erro ao alterar status do item"),
  });

  const deleteItemMutation = trpc.osItens.delete.useMutation({
    onSuccess: () => {
      toast.success("Item removido!");
      refetch();
    },
    onError: () => toast.error("Erro ao remover item"),
  });

  const formatCurrency = (value: number | string | null) => {
    if (value === null || value === undefined) return "R$ 0,00";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = () => {
    updateOSMutation.mutate({
      id: osId,
      ...editedOS,
    });
  };

  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate({ id: osId, status: newStatus });
  };

  const handleAddItem = () => {
    const valorTotal = newItem.quantidade * newItem.valor_unitario;
    createItemMutation.mutate({
      ordemServicoId: osId,
      descricao: newItem.descricao,
      tipo: newItem.tipo,
      quantidade: newItem.quantidade,
      valorCusto: String(newItem.valor_custo),
      margemAplicada: String(newItem.margem),
      valorUnitario: String(newItem.valor_unitario),
      valorTotal: String(valorTotal),
      prioridade: newItem.prioridade,
      status: "pendente",
    });
  };

  const handleDeleteItem = (itemId: number) => {
    deleteItemMutation.mutate({ id: itemId });
  };

  const handleItemStatusChange = (itemId: number, newStatus: string) => {
    updateItemStatusMutation.mutate({ id: itemId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (!osData?.os) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/ordens-servico")} className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">OS não encontrada</h1>
        </div>
      </div>
    );
  }

  const { os, cliente, veiculo, itens } = osData;
  const currentStatus = statusConfig[os.status || 'diagnostico'] || statusConfig.diagnostico;
  const StatusIcon = currentStatus.icon;
  const clientLoyaltyLevel = crmData?.nivelFidelidade || 'bronze';

  // Calculate totals from items
  const totalOrcado = itens.reduce((acc, item) => acc + parseFloat(String(item.valorTotal || 0)), 0);
  const totalAprovado = itens
    .filter(item => item.status === "aprovado")
    .reduce((acc, item) => acc + parseFloat(String(item.valorTotal || 0)), 0);
  const totalRecusado = itens
    .filter(item => item.status === "recusado")
    .reduce((acc, item) => acc + parseFloat(String(item.valorTotal || 0)), 0);
  const totalPendente = itens
    .filter(item => item.status === "pendente")
    .reduce((acc, item) => acc + parseFloat(String(item.valorTotal || 0)), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/ordens-servico")} className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-mono text-white">{os.numeroOs}</h1>
                <Badge variant="outline" className={cn("gap-1", currentStatus.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {currentStatus.label}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">
                Entrada: {formatDate(os.dataEntrada)}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              className="border-slate-700 text-white hover:bg-white/10"
              onClick={() => {
                const clientLink = `${window.location.origin}/cliente/orcamento/${osId}`;
                navigator.clipboard.writeText(clientLink);
                toast.success("Link Cliente copiado!");
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Link Cliente
            </Button>
            <Button 
              variant="outline"
              className="border-slate-700 text-white hover:bg-white/10"
              onClick={() => {
                const phone = cliente?.telefone?.replace(/\D/g, '');
                if (phone) {
                  window.open(`https://wa.me/55${phone}`, '_blank');
                }
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="border-slate-700 text-white hover:bg-white/10">
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700" disabled={updateOSMutation.isPending}>
                  {updateOSMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Salvar
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="border-slate-700 text-white hover:bg-white/10">
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Vehicle */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg text-white">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Cliente e Veículo
                  </div>
                  {loyaltyBadgeConfig[clientLoyaltyLevel] && (() => {
                    const loyalty = loyaltyBadgeConfig[clientLoyaltyLevel];
                    const LoyaltyIcon = loyalty.icon;
                    return (
                      <Badge variant="outline" className={cn("gap-1.5 px-3 py-1", loyalty.color)}>
                        <LoyaltyIcon className="w-4 h-4" />
                        {loyalty.label}
                      </Badge>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-400 text-xs">Cliente</Label>
                    <p className="font-medium text-white">{cliente?.nomeCompleto || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">Telefone</Label>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{cliente?.telefone || "-"}</p>
                      {cliente?.telefone && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-green-500 hover:bg-green-500/10"
                          onClick={() => window.open(`https://wa.me/55${cliente.telefone?.replace(/\D/g, '')}`, '_blank')}
                        >
                          <Phone className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">KM Atual</Label>
                    <p className="font-medium text-white">{os.km ? `${os.km.toLocaleString('pt-BR')} km` : "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{veiculo ? `${veiculo.marca} ${veiculo.modelo}` : os.placa}</p>
                      <p className="text-sm text-slate-400 font-mono">{veiculo?.placa || os.placa}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem & Diagnosis */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Problema e Diagnóstico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-400 text-xs">Problema Relatado</Label>
                  {isEditing ? (
                    <Textarea 
                      value={editedOS.descricaoProblema ?? os.descricaoProblema ?? ""} 
                      onChange={(e) => setEditedOS({...editedOS, descricaoProblema: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                    />
                  ) : (
                    <p className="text-white mt-1">{os.descricaoProblema || os.motivoVisita || "Não informado"}</p>
                  )}
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Diagnóstico Técnico</Label>
                  {isEditing ? (
                    <Textarea 
                      value={editedOS.diagnostico ?? os.diagnostico ?? ""} 
                      onChange={(e) => setEditedOS({...editedOS, diagnostico: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                    />
                  ) : (
                    <p className="text-white mt-1">{os.diagnostico || "Aguardando diagnóstico"}</p>
                  )}
                </div>
                <div>
                  <Label className="text-slate-400 text-xs">Observações</Label>
                  {isEditing ? (
                    <Textarea 
                      value={editedOS.observacoes ?? os.observacoes ?? ""} 
                      onChange={(e) => setEditedOS({...editedOS, observacoes: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white min-h-[60px]"
                    />
                  ) : (
                    <p className="text-slate-300 mt-1">{os.observacoes || "-"}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Checklist Section */}
            <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen}>
              <Card className="bg-slate-900/50 border-slate-800">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-lg text-white">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-blue-400" />
                        Checklist de Entrada
                      </div>
                      {checklistOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { key: "nivelOleo", label: "Nível do óleo" },
                        { key: "nivelAgua", label: "Nível da água" },
                        { key: "freios", label: "Freios" },
                        { key: "pneus", label: "Pneus" },
                        { key: "luzes", label: "Luzes" },
                        { key: "bateria", label: "Bateria" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.key}
                            checked={checklistEntrada[item.key] || false}
                            onCheckedChange={(checked) => {
                              setChecklistEntrada({ ...checklistEntrada, [item.key]: checked === true });
                            }}
                          />
                          <label htmlFor={item.key} className="text-sm cursor-pointer text-white">
                            {item.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Services/Items Section */}
            <Collapsible open={servicosOpen} onOpenChange={setServicosOpen}>
              <Card className="bg-slate-900/50 border-slate-800">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-slate-800/50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-lg text-white">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-purple-400" />
                        Peças e Serviços ({itens.length})
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAddItemDialog(true);
                          }}
                          className="border-slate-700 text-white hover:bg-white/10"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar
                        </Button>
                        {servicosOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    {itens.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">
                        <Wrench className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum item adicionado</p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-slate-700 text-white hover:bg-white/10"
                          onClick={() => setShowAddItemDialog(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Item
                        </Button>
                      </div>
                    ) : (
                      itens.map((item) => {
                        const prioridade = prioridadeConfig[item.prioridade || 'verde'];
                        const itemStatus = itemStatusConfig[item.status || 'pendente'] || itemStatusConfig.pendente;
                        return (
                          <div 
                            key={item.id} 
                            className={cn(
                              "p-4 rounded-lg border-2 transition-all",
                              prioridade.borderColor,
                              prioridade.bgColor
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className={cn("text-xs", 
                                    item.prioridade === 'vermelho' && "border-red-500 text-red-500",
                                    item.prioridade === 'amarelo' && "border-yellow-500 text-yellow-500",
                                    item.prioridade === 'verde' && "border-green-500 text-green-500"
                                  )}>
                                    {prioridade.label}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {item.tipo === 'peca' ? 'Peça' : 'Mão de Obra'}
                                  </Badge>
                                  <Badge variant="outline" className={itemStatus.color}>
                                    {itemStatus.label}
                                  </Badge>
                                </div>
                                <p className="font-medium text-white">{item.descricao}</p>
                                {item.motivoRecusa && (
                                  <p className="text-sm text-red-400 mt-1">Motivo: {item.motivoRecusa}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                  <span>{item.quantidade}x {formatCurrency(item.valorUnitario)}</span>
                                  {item.valorCusto && (
                                    <span className="text-xs">Custo: {formatCurrency(item.valorCusto)} | Margem: {item.margemAplicada}%</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-white">{formatCurrency(item.valorTotal)}</p>
                                <div className="flex gap-1 mt-2">
                                  {item.status === 'pendente' && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="h-7 text-green-500 hover:bg-green-500/10"
                                        onClick={() => handleItemStatusChange(item.id, 'aprovado')}
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="h-7 text-red-500 hover:bg-red-500/10"
                                        onClick={() => handleItemStatusChange(item.id, 'recusado')}
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 text-slate-400 hover:bg-red-500/10 hover:text-red-500"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Status Change */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Alterar Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={os.status || 'diagnostico'} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <config.icon className="w-4 h-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Resumo Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Orçado</span>
                    <span className="font-semibold text-white">{formatCurrency(totalOrcado)}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-500">
                    <span>Aprovado</span>
                    <span className="font-semibold">{formatCurrency(totalAprovado)}</span>
                  </div>
                  <div className="flex justify-between items-center text-yellow-500">
                    <span>Pendente</span>
                    <span className="font-semibold">{formatCurrency(totalPendente)}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-500">
                    <span>Recusado</span>
                    <span className="font-semibold">{formatCurrency(totalRecusado)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Valor Final</span>
                    <span className="text-2xl font-bold text-green-400">{formatCurrency(totalAprovado)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Datas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Entrada</span>
                  <span className="text-white text-sm">{formatDate(os.dataEntrada)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Orçamento</span>
                  <span className="text-white text-sm">{formatDate(os.dataOrcamento)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Aprovação</span>
                  <span className="text-white text-sm">{formatDate(os.dataAprovacao)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Conclusão</span>
                  <span className="text-white text-sm">{formatDate(os.dataConclusao)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Entrega</span>
                  <span className="text-white text-sm">{formatDate(os.dataSaida)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const phone = cliente?.telefone?.replace(/\D/g, '');
                    const veiName = veiculo ? `${veiculo.marca} ${veiculo.modelo}` : os.placa;
                    const message = encodeURIComponent(`Olá ${cliente?.nomeCompleto}! Seu orçamento para o veículo ${veiName} (${veiculo?.placa || os.placa}) está pronto. Acesse: ${window.location.origin}/cliente/orcamento/${osId}`);
                    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Orçamento WhatsApp
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-700 text-white hover:bg-white/10">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button variant="outline" className="w-full justify-start border-slate-700 text-white hover:bg-white/10">
                  <Camera className="w-4 h-4 mr-2" />
                  Adicionar Fotos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Adicionar Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Descrição</Label>
              <Input 
                value={newItem.descricao}
                onChange={(e) => setNewItem({...newItem, descricao: e.target.value})}
                placeholder="Ex: Troca de pastilhas de freio"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select value={newItem.tipo} onValueChange={(v) => setNewItem({...newItem, tipo: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peca">Peça</SelectItem>
                    <SelectItem value="mao_de_obra">Mão de Obra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prioridade</Label>
                <Select value={newItem.prioridade} onValueChange={(v: any) => setNewItem({...newItem, prioridade: v})}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verde">Tranquilo</SelectItem>
                    <SelectItem value="amarelo">Médio</SelectItem>
                    <SelectItem value="vermelho">Imediato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Quantidade</Label>
                <Input 
                  type="number"
                  value={newItem.quantidade}
                  onChange={(e) => setNewItem({...newItem, quantidade: parseInt(e.target.value) || 1})}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label>Valor Custo</Label>
                <Input 
                  type="number"
                  value={newItem.valor_custo}
                  onChange={(e) => {
                    const custo = parseFloat(e.target.value) || 0;
                    const venda = custo * (1 + newItem.margem / 100);
                    setNewItem({...newItem, valor_custo: custo, valor_unitario: venda});
                  }}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label>Margem %</Label>
                <Input 
                  type="number"
                  value={newItem.margem}
                  onChange={(e) => {
                    const margem = parseFloat(e.target.value) || 0;
                    const venda = newItem.valor_custo * (1 + margem / 100);
                    setNewItem({...newItem, margem: margem, valor_unitario: venda});
                  }}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
            <div>
              <Label>Valor Venda (calculado)</Label>
              <Input 
                type="number"
                value={newItem.valor_unitario}
                onChange={(e) => setNewItem({...newItem, valor_unitario: parseFloat(e.target.value) || 0})}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="pt-2 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                Total: <span className="text-white font-bold">{formatCurrency(newItem.quantidade * newItem.valor_unitario)}</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItemDialog(false)} className="border-slate-700 text-white hover:bg-white/10">
              Cancelar
            </Button>
            <Button onClick={handleAddItem} className="bg-red-600 hover:bg-red-700" disabled={!newItem.descricao || createItemMutation.isPending}>
              {createItemMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
