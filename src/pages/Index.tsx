
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Users } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import ClientCard from "@/components/ClientCard";
import ClientTable from "@/components/ClientTable";
import ViewSwitcher from "@/components/ViewSwitcher";
import PageTitle from "@/components/PageTitle";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";
import { useToast } from "@/components/ui/use-toast";
import { mockClients } from "@/data/mockData";
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

const Index = () => {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [filteredClients, setFilteredClients] = useState<Client[]>(mockClients);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredClients(clients);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = clients.filter(client => 
      client.name.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery) ||
      (client.phone && client.phone.includes(query))
    );
    
    setFilteredClients(filtered);
  };

  const handleViewClient = (id: string) => {
    navigate(`/client/${id}`);
  };

  const handleEditClient = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const confirmDelete = (id: string) => {
    setClientToDelete(id);
  };

  const handleDeleteClient = () => {
    if (!clientToDelete) return;
    
    const client = clients.find(c => c.id === clientToDelete);
    const updatedClients = clients.filter(c => c.id !== clientToDelete);
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setClientToDelete(null);
    
    if (client) {
      toast({
        title: "Cliente removido",
        description: `${client.name} foi removido com sucesso.`,
      });
    }
  };

  const cancelDelete = () => {
    setClientToDelete(null);
  };

  return (
    <MainLayout>
      <PageTitle 
        title="Clientes" 
        description="Gerencie as informações dos seus clientes"
        actions={
          <Button onClick={() => navigate("/new")}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        }
      />
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80">
          <SearchBar onSearch={handleSearch} />
        </div>
        <ViewSwitcher view={view} onViewChange={setView} />
      </div>
      
      {filteredClients.length === 0 ? (
        <EmptyState 
          icon={<Users className="h-8 w-8 text-muted-foreground" />}
          title="Nenhum cliente encontrado"
          description="Você ainda não tem clientes cadastrados ou nenhum cliente corresponde à sua busca."
          action={{
            label: "Adicionar Cliente",
            onClick: () => navigate("/new")
          }}
          className="bg-card border rounded-lg py-16"
        />
      ) : (
        view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map(client => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onView={handleViewClient}
                onEdit={handleEditClient}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        ) : (
          <ClientTable 
            clients={filteredClients}
            onView={handleViewClient}
            onEdit={handleEditClient}
            onDelete={confirmDelete}
          />
        )
      )}
      
      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente e todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-destructive text-destructive-foreground">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Index;
