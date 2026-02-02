import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon, Save, RefreshCw, X,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { mecanicosMock } from "@/lib/mockData";
import { ptBR } from "date-fns/locale";

interface ScheduleSlot {
  id?: string;
  mechanic_id: number;
  hora: string;
  vehicle_plate?: string;
  vehicle_model?: string;
  tipo: 'normal' | 'encaixe';
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  isNew?: boolean;
}

interface DaySchedule {
  [mechanicId: number]: {
    [hora: string]: ScheduleSlot;
  };
}

const HORARIOS_SEMANA = ['08:00', '09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30'];
const HORARIOS_SABADO = ['08:00', '09:00', '10:00', '11:00'];
const HORARIOS_ENCAIXE = ['E1', 'E2', 'E3'];

export default function AdminAgendaMecanicos() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mechanics, setMechanics] = useState(mecanicosMock.filter(m => m.empresaId === 1));
  const [schedule, setSchedule] = useState<DaySchedule>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingCell, setEditingCell] = useState<{ mechanicId: number; hora: string } | null>(null);
  const [inputValue, setInputValue] = useState("");

  const isSaturday = selectedDate.getDay() === 6;
  const horarios = isSaturday ? HORARIOS_SABADO : HORARIOS_SEMANA;

  const fetchData = () => {
    // Inicializar schedule vazio para cada mecânico
    const scheduleMap: DaySchedule = {};
    mechanics.forEach(m => {
      scheduleMap[m.id] = {};
    });

    // Adicionar alguns agendamentos mock
    if (mechanics.length > 0) {
      scheduleMap[mechanics[0].id]['08:00'] = {
        mechanic_id: mechanics[0].id,
        hora: '08:00',
        vehicle_plate: 'ERR1B44',
        vehicle_model: 'VW Passat',
        tipo: 'normal',
        status: 'em_andamento',
      };
      scheduleMap[mechanics[0].id]['10:00'] = {
        mechanic_id: mechanics[0].id,
        hora: '10:00',
        vehicle_plate: 'ABC1D23',
        vehicle_model: 'BMW 320i',
        tipo: 'normal',
        status: 'agendado',
      };
    }
    if (mechanics.length > 1) {
      scheduleMap[mechanics[1].id]['09:00'] = {
        mechanic_id: mechanics[1].id,
        hora: '09:00',
        vehicle_plate: 'XYZ9K87',
        vehicle_model: 'Mercedes C180',
        tipo: 'normal',
        status: 'agendado',
      };
    }

    setSchedule(scheduleMap);
    setHasChanges(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleCellClick = (mechanicId: number, hora: string) => {
    const slot = schedule[mechanicId]?.[hora];
    if (!slot) {
      setEditingCell({ mechanicId, hora });
      setInputValue("");
    }
  };

  const handleInputSubmit = () => {
    if (!editingCell || !inputValue.trim()) {
      setEditingCell(null);
      return;
    }

    const plate = inputValue.trim().toUpperCase();
    const isEncaixe = editingCell.hora.startsWith('E');
    
    setSchedule(prev => ({
      ...prev,
      [editingCell.mechanicId]: {
        ...prev[editingCell.mechanicId],
        [editingCell.hora]: {
          mechanic_id: editingCell.mechanicId,
          hora: editingCell.hora,
          vehicle_plate: plate,
          vehicle_model: '',
          tipo: isEncaixe ? 'encaixe' : 'normal',
          status: 'agendado',
          isNew: true,
        },
      },
    }));

    setHasChanges(true);
    setEditingCell(null);
    setInputValue("");
  };

  const handleRemoveSlot = (mechanicId: number, hora: string) => {
    setSchedule(prev => {
      const newSchedule = { ...prev };
      if (newSchedule[mechanicId]) {
        delete newSchedule[mechanicId][hora];
      }
      return newSchedule;
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      toast.success("Agenda salva com sucesso!");
      setHasChanges(false);
      setSaving(false);
    }, 500);
  };

  const getSlotStatusColor = (status: string, tipo: string) => {
    if (tipo === 'encaixe') return 'bg-yellow-500/80 hover:bg-yellow-500';
    switch (status) {
      case 'agendado': return 'bg-primary/80 hover:bg-primary';
      case 'em_andamento': return 'bg-purple-500/80 hover:bg-purple-500';
      case 'concluido': return 'bg-green-500/80 hover:bg-green-500';
      case 'cancelado': return 'bg-red-500/50';
      default: return 'bg-primary/80';
    }
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatDate = (date: Date) => {
    const dias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    return `${dias[date.getDay()]}, ${date.toLocaleDateString('pt-BR')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agenda dos Mecânicos</h1>
            <p className="text-muted-foreground">
              Gerencie os agendamentos diários
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate(prev => addDays(prev, -1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[200px]">
                  <CalendarIcon className="w-4 h-4" />
                  {formatDate(selectedDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate(prev => addDays(prev, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              onClick={fetchData}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span>Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500" />
            <span>Em Andamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span>Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span>Encaixe</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left font-medium text-muted-foreground min-w-[150px]">
                    Mecânico
                  </th>
                  {horarios.map(hora => (
                    <th key={hora} className="p-3 text-center font-medium text-muted-foreground min-w-[100px]">
                      {hora}
                    </th>
                  ))}
                  {HORARIOS_ENCAIXE.map(hora => (
                    <th key={hora} className="p-3 text-center font-medium text-yellow-500 min-w-[100px]">
                      {hora}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mechanics.map(mechanic => (
                  <tr key={mechanic.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{mechanic.nome}</td>
                    {[...horarios, ...HORARIOS_ENCAIXE].map(hora => {
                      const slot = schedule[mechanic.id]?.[hora];
                      const isEditing = editingCell?.mechanicId === mechanic.id && editingCell?.hora === hora;

                      return (
                        <td 
                          key={hora} 
                          className="p-2 text-center"
                          onClick={() => !slot && handleCellClick(mechanic.id, hora)}
                        >
                          {isEditing ? (
                            <Input
                              autoFocus
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onBlur={handleInputSubmit}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleInputSubmit();
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                              placeholder="Placa"
                              className="h-8 text-xs"
                            />
                          ) : slot ? (
                            <div 
                              className={`relative p-2 rounded text-white text-xs cursor-pointer group ${getSlotStatusColor(slot.status, slot.tipo)}`}
                            >
                              <div className="font-bold">{slot.vehicle_plate}</div>
                              {slot.vehicle_model && (
                                <div className="text-[10px] opacity-80">{slot.vehicle_model}</div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveSlot(mechanic.id, hora);
                                }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="h-12 rounded border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 cursor-pointer transition-colors" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
