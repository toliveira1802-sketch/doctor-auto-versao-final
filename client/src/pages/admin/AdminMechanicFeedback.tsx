import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Star } from "lucide-react";
import { mecanicosMock } from "@/lib/mockData";

export default function AdminMechanicFeedback() {
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
            <MessageSquare className="w-6 h-6 text-red-500" />
            Feedback dos Mecânicos
          </h1>
          <p className="text-gray-400">Avaliações dos clientes</p>
        </div>
      </div>

      <div className="space-y-4">
        {mecanicosMock.map((mec) => {
          const total = mec.qtdePositivos + mec.qtdeNegativos;
          const rating = total > 0 ? (mec.qtdePositivos / total) * 5 : 0;
          return (
            <Card key={mec.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{mec.nome}</p>
                  <p className="text-gray-400 text-sm">{mec.especialidade}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-medium">{rating.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
