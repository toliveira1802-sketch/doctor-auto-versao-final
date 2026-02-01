import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Book, Video, HelpCircle } from "lucide-react";

export default function AdminDocumentacao() {
  const docs = [
    { id: 1, titulo: "Manual do Sistema", descricao: "Guia completo de uso do sistema", icon: Book },
    { id: 2, titulo: "Vídeos Tutoriais", descricao: "Aprenda com vídeos passo a passo", icon: Video },
    { id: 3, titulo: "FAQ", descricao: "Perguntas frequentes", icon: HelpCircle },
    { id: 4, titulo: "Procedimentos", descricao: "Procedimentos operacionais padrão", icon: FileText },
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
            <FileText className="w-6 h-6 text-red-500" />
            Documentação
          </h1>
          <p className="text-gray-400">Manuais e tutoriais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.map((doc) => {
          const Icon = doc.icon;
          return (
            <Card key={doc.id} className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 rounded-lg bg-red-500/20">
                  <Icon className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">{doc.titulo}</p>
                  <p className="text-gray-400">{doc.descricao}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
