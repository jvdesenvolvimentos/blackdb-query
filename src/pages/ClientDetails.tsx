
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, Calendar, MapPin, RefreshCcw } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Client } from "@/types/client";
import { mockClients } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would fetch the client data from your API
    // For this demo, we'll use the mock data
    const foundClient = mockClients.find(c => c.id === id);
    setClient(foundClient);
    setLoading(false);
    
    if (!foundClient) {
      // If client not found, navigate back to client list
      navigate("/");
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (!client) return;
    
    // In a real app, you would send a delete request to your API
    console.log("Deleting client:", client.id);
    
    toast({
      title: "Cliente removido",
      description: `${client.name} foi removido com sucesso.`,
    });
    
    navigate("/");
  };

  if (loading) {
    return (
      <MainLayout className="flex items-center justify-center">
        <p>Carregando...</p>
      </MainLayout>
    );
  }

  if (!client) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-2xl font-bold flex-1">Detalhes do Cliente</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/edit/${client.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="flex-shrink-0 h-24 w-24 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-1">{client.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={client.status === "active" ? "default" : "outline"}>
                    {client.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Cliente desde {formatDate("2023-05-15")}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p>{client.phone || "—"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p>{formatDate(client.birthDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p>{client.address || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <RefreshCcw className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm">Informações atualizadas</p>
                  <p className="text-xs text-muted-foreground">2 dias atrás</p>
                </div>
              </div>
              
              {/* You can add more activity items here */}
              <div className="pt-2 text-center text-sm text-muted-foreground">
                Sem mais atividades recentes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente e todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default ClientDetails;
