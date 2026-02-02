import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ThumbsUp, ThumbsDown, Calendar } from "lucide-react";
import { toast } from "sonner";
import { mecanicosMock } from "@/lib/mockData";

interface Feedback {
  id: number;
  mecanicoId: number;
  tipo: 'positivo' | 'negativo';
  comentario: string;
  data: Date;
}

export default function AdminMechanicFeedback() {
  const [selectedMechanic, setSelectedMechanic] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [comentario, setComentario] = useState("");
  const mechanics = mecanicosMock.filter(m => m.empresaId === 1);

  const today = new Date();
  const diasSemana = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  
  const dataFormatada = `${diasSemana[today.getDay()]}, ${today.getDate()} de ${meses[today.getMonth()]}`;

  const todayFeedbacks = feedbacks.filter(f => {
    const feedbackDate = new Date(f.data);
    return feedbackDate.toDateString() === today.toDateString();
  });

  const handleFeedback = (tipo: 'positivo' | 'negativo') => {
    if (!selectedMechanic) {
      toast.error("Selecione um mecânico primeiro");
      return;
    }

    const newFeedback: Feedback = {
      id: Date.now(),
      mecanicoId: selectedMechanic,
      tipo,
      comentario,
      data: new Date(),
    };

    setFeedbacks([...feedbacks, newFeedback]);
    setComentario("");
    toast.success(`Feedback ${tipo} registrado!`);
  };

  const getMechanicName = (id: number) => {
    return mechanics.find(m => m.id === id)?.nome || '';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback Mecânicos</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Calendar className="w-4 h-4" />
            <span>{dataFormatada}</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selecione o Mecânico */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selecione o Mecânico</CardTitle>
            </CardHeader>
            <CardContent>
              {mechanics.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum mecânico cadastrado
                </p>
              ) : (
                <div className="space-y-2">
                  {mechanics.map(mechanic => (
                    <Button
                      key={mechanic.id}
                      variant={selectedMechanic === mechanic.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedMechanic(mechanic.id)}
                    >
                      {mechanic.nome}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Avaliação do Dia */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Avaliação do Dia</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedMechanic ? (
                <p className="text-muted-foreground text-center py-8">
                  Selecione um mecânico para avaliar
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-center font-medium">
                    Avaliando: {getMechanicName(selectedMechanic)}
                  </p>
                  <Textarea
                    placeholder="Escreva o motivo do feedback..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="mb-4"
                    rows={3}
                  />
                  <div className="flex justify-center gap-4">
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 h-20 flex-col gap-2 hover:bg-green-500/10 hover:border-green-500"
                      onClick={() => handleFeedback('positivo')}
                    >
                      <ThumbsUp className="w-8 h-8 text-green-500" />
                      <span>Positivo</span>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 h-20 flex-col gap-2 hover:bg-red-500/10 hover:border-red-500"
                      onClick={() => handleFeedback('negativo')}
                    >
                      <ThumbsDown className="w-8 h-8 text-red-500" />
                      <span>Negativo</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo do Dia */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Feedbacks registrados</span>
              </div>
              <div className="flex items-center gap-4">
                <Progress value={todayFeedbacks.length > 0 ? 100 : 0} className="w-48" />
                <span className="font-bold text-lg">
                  {todayFeedbacks.length}/{mechanics.length}
                </span>
              </div>
            </div>

            {todayFeedbacks.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">Feedbacks de hoje:</p>
                {todayFeedbacks.map(f => (
                  <div key={f.id} className="p-3 bg-muted/50 rounded space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{getMechanicName(f.mecanicoId)}</span>
                      {f.tipo === 'positivo' ? (
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    {f.comentario && (
                      <p className="text-sm text-muted-foreground">{f.comentario}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
