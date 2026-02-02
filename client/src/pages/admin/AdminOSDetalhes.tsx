import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { 
  ArrowLeft, Save, Plus, Trash2, Phone, Car, User, 
  Calendar, DollarSign, FileText, Wrench, CheckCircle,
  XCircle, AlertTriangle, Clock, Loader2, Edit2,
  ClipboardCheck, Camera, ChevronDown, ChevronUp, Gauge, ShieldCheck, Activity, Image,
  TrendingUp, Sparkles, Calculator, Gift, Video, Zap, Send, Download,
  MessageSquare, Crown, Award, Medal, Star, Scan, RefreshCw, Lightbulb, Copy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface OrdemServicoItem {
  id: string;
  descricao: string;
  tipo: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  status: string;
  motivo_recusa: string | null;
  valor_custo: number | null;
  margem_aplicada: number | null;
  prioridade: 'verde' | 'amarelo' | 'vermelho' | null;
}

interface OrdemServico {
  id: string;
  numero_os: string;
  plate: string;
  vehicle: string;
  client_name: string | null;
  client_phone: string | null;
  status: string;
  data_entrada: string | null;
  data_orcamento: string | null;
  data_aprovacao: string | null;
  data_conclusao: string | null;
  data_entrega: string | null;
  valor_orcado: number | null;
  valor_aprovado: number | null;
  valor_final: number | null;
  descricao_problema: string | null;
  diagnostico: string | null;
  observacoes: string | null;
  motivo_recusa: string | null;
  mechanic_id: string | null;
  km_atual: string | null;
  google_drive_link?: string | null;
}

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

// Mock data
const mockOS: OrdemServico = {
  id: "1",
  numero_os: "OS-2026-0042",
  plate: "ABC-1D34",
  vehicle: "Honda Civic EXL 2.0",
  client_name: "João Silva Santos",
  client_phone: "(11) 98765-4321",
  status: "em_execucao",
  data_entrada: "2026-01-28T09:00:00",
  data_orcamento: "2026-01-28T14:00:00",
  data_aprovacao: "2026-01-29T10:00:00",
  data_conclusao: null,
  data_entrega: null,
  valor_orcado: 4050.00,
  valor_aprovado: 3850.00,
  valor_final: null,
  descricao_problema: "Cliente relata ruído no motor ao acelerar e perda de potência em subidas.",
  diagnostico: "Após análise, identificado problema no sistema de injeção e necessidade de limpeza dos bicos injetores. Sensor MAP apresentando leituras incorretas.",
  observacoes: "Cliente prefere peças originais",
  motivo_recusa: null,
  mechanic_id: "1",
  km_atual: "85.420",
  google_drive_link: null
};

const mockItens: OrdemServicoItem[] = [
  { id: "1", descricao: "Limpeza de bicos injetores", tipo: "mao_de_obra", quantidade: 1, valor_unitario: 350.00, valor_total: 350.00, status: "aprovado", motivo_recusa: null, valor_custo: null, margem_aplicada: null, prioridade: "amarelo" },
  { id: "2", descricao: "Troca do sensor MAP", tipo: "peca", quantidade: 1, valor_unitario: 480.00, valor_total: 480.00, status: "aprovado", motivo_recusa: null, valor_custo: 280.00, margem_aplicada: 71, prioridade: "vermelho" },
  { id: "3", descricao: "Troca de velas NGK", tipo: "peca", quantidade: 4, valor_unitario: 70.00, valor_total: 280.00, status: "aprovado", motivo_recusa: null, valor_custo: 40.00, margem_aplicada: 75, prioridade: "verde" },
  { id: "4", descricao: "Revisão sistema de ignição", tipo: "mao_de_obra", quantidade: 1, valor_unitario: 420.00, valor_total: 420.00, status: "pendente", motivo_recusa: null, valor_custo: null, margem_aplicada: null, prioridade: "amarelo" },
  { id: "5", descricao: "Teste em dinamômetro", tipo: "mao_de_obra", quantidade: 1, valor_unitario: 180.00, valor_total: 180.00, status: "pendente", motivo_recusa: null, valor_custo: null, margem_aplicada: null, prioridade: "verde" },
  { id: "6", descricao: "Troca óleo motor sintético", tipo: "peca", quantidade: 1, valor_unitario: 340.00, valor_total: 340.00, status: "recusado", motivo_recusa: "Cliente vai trocar em outro lugar", valor_custo: 180.00, margem_aplicada: 89, prioridade: "verde" },
];

export default function AdminOSDetalhes() {
  const params = useParams<{ id: string }>();
  const osId = params.id;
  const [, setLocation] = useLocation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedOS, setEditedOS] = useState<Partial<OrdemServico>>({});
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [itens, setItens] = useState<OrdemServicoItem[]>(mockItens);
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
  const [fotosOpen, setFotosOpen] = useState(false);
  const [servicosOpen, setServicosOpen] = useState(true);
  
  // Client loyalty level
  const [clientLoyaltyLevel] = useState<'bronze' | 'prata' | 'ouro' | 'diamante'>('ouro');
  
  // Checklist states
  const [checklistEntrada, setChecklistEntrada] = useState<Record<string, boolean>>({
    nivelOleo: true,
    nivelAgua: true,
    freios: true,
    pneus: false,
    luzes: true,
    bateria: true,
  });

  // Using mock data
  const os = mockOS;

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string | null) => {
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
    toast.success("OS atualizada com sucesso!");
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: string) => {
    toast.success(`Status alterado para: ${statusConfig[newStatus]?.label || newStatus}`);
  };

  const handleAddItem = () => {
    const valorTotal = newItem.quantidade * newItem.valor_unitario;
    const novoItem: OrdemServicoItem = {
      id: String(Date.now()),
      descricao: newItem.descricao,
      tipo: newItem.tipo,
      quantidade: newItem.quantidade,
      valor_unitario: newItem.valor_unitario,
      valor_total: valorTotal,
      status: "pendente",
      motivo_recusa: null,
      valor_custo: newItem.valor_custo,
      margem_aplicada: newItem.margem,
      prioridade: newItem.prioridade,
    };
    setItens([...itens, novoItem]);
    setShowAddItemDialog(false);
    setNewItem({
      descricao: "",
      tipo: "peca",
      quantidade: 1,
      valor_custo: 0,
      margem: 40,
      valor_unitario: 0,
      prioridade: "amarelo",
    });
    toast.success("Item adicionado!");
  };

  const handleDeleteItem = (itemId: string) => {
    setItens(itens.filter(i => i.id !== itemId));
    toast.success("Item removido!");
  };

  const handleItemStatusChange = (itemId: string, newStatus: string) => {
    setItens(itens.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));
    toast.success(`Status do item alterado para: ${itemStatusConfig[newStatus]?.label || newStatus}`);
  };

  const currentStatus = statusConfig[os.status] || statusConfig.orcamento;
  const StatusIcon = currentStatus.icon;

  // Calculate totals from items
  const totalOrcado = itens.reduce((acc, item) => acc + (item.valor_total || 0), 0);
  const totalAprovado = itens
    .filter(item => item.status === "aprovado")
    .reduce((acc, item) => acc + (item.valor_total || 0), 0);
  const totalRecusado = itens
    .filter(item => item.status === "recusado")
    .reduce((acc, item) => acc + (item.valor_total || 0), 0);
  const totalPendente = itens
    .filter(item => item.status === "pendente")
    .reduce((acc, item) => acc + (item.valor_total || 0), 0);

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
                <h1 className="text-2xl font-bold font-mono text-white">{os.numero_os}</h1>
                <Badge variant="outline" className={cn("gap-1", currentStatus.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {currentStatus.label}
                </Badge>
              </div>
              <p className="text-slate-400 text-sm">
                Entrada: {formatDate(os.data_entrada)}
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
                const phone = os.client_phone?.replace(/\D/g, '');
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
                <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
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
                  {/* Loyalty Badge */}
                  {(() => {
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
                    {isEditing ? (
                      <Input 
                        value={editedOS.client_name ?? os.client_name ?? ""} 
                        onChange={(e) => setEditedOS({...editedOS, client_name: e.target.value})}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    ) : (
                      <p className="font-medium text-white">{os.client_name || "-"}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">Telefone</Label>
                    {isEditing ? (
                      <Input 
                        value={editedOS.client_phone ?? os.client_phone ?? ""} 
                        onChange={(e) => setEditedOS({...editedOS, client_phone: e.target.value})}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{os.client_phone || "-"}</p>
                        {os.client_phone && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-green-500 hover:bg-green-500/10"
                            onClick={() => window.open(`https://wa.me/55${os.client_phone?.replace(/\D/g, '')}`, '_blank')}
                          >
                            <Phone className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs">KM Atual</Label>
                    {isEditing ? (
                      <Input 
                        value={editedOS.km_atual ?? os.km_atual ?? ""} 
                        onChange={(e) => setEditedOS({...editedOS, km_atual: e.target.value})}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    ) : (
                      <p className="font-medium text-white">{os.km_atual ? `${os.km_atual} km` : "-"}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{os.vehicle}</p>
                      <p className="text-sm text-slate-400 font-mono">{os.plate}</p>
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
                      value={editedOS.descricao_problema ?? os.descricao_problema ?? ""} 
                      onChange={(e) => setEditedOS({...editedOS, descricao_problema: e.target.value})}
                      className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                    />
                  ) : (
                    <p className="text-white mt-1">{os.descricao_problema || "Não informado"}</p>
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
                        const itemStatus = itemStatusConfig[item.status] || itemStatusConfig.pendente;
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
                                {item.motivo_recusa && (
                                  <p className="text-sm text-red-400 mt-1">Motivo: {item.motivo_recusa}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                  <span>{item.quantidade}x {formatCurrency(item.valor_unitario)}</span>
                                  {item.valor_custo && (
                                    <span className="text-xs">Custo: {formatCurrency(item.valor_custo)} | Margem: {item.margem_aplicada}%</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-white">{formatCurrency(item.valor_total)}</p>
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
                <Select value={os.status} onValueChange={handleStatusChange}>
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
                  <span className="text-white text-sm">{formatDate(os.data_entrada)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Orçamento</span>
                  <span className="text-white text-sm">{formatDate(os.data_orcamento)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Aprovação</span>
                  <span className="text-white text-sm">{formatDate(os.data_aprovacao)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Conclusão</span>
                  <span className="text-white text-sm">{formatDate(os.data_conclusao)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Entrega</span>
                  <span className="text-white text-sm">{formatDate(os.data_entrega)}</span>
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
                    const phone = os.client_phone?.replace(/\D/g, '');
                    const message = encodeURIComponent(`Olá ${os.client_name}! Seu orçamento para o veículo ${os.vehicle} (${os.plate}) está pronto. Acesse: ${window.location.origin}/cliente/orcamento/${osId}`);
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
            <Button onClick={handleAddItem} className="bg-red-600 hover:bg-red-700" disabled={!newItem.descricao}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
