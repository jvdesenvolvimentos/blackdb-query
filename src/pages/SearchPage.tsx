
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, Users } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import PageTitle from "@/components/PageTitle";
import ClientCard from "@/components/ClientCard";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";
import { mockClients } from "@/data/mockData";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Client[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = mockClients.filter(client => 
      client.name.toLowerCase().includes(lowercaseQuery) ||
      client.email.toLowerCase().includes(lowercaseQuery) ||
      (client.phone && client.phone.includes(query)) ||
      (client.address && client.address.toLowerCase().includes(lowercaseQuery))
    );
    
    setResults(filtered);
    setHasSearched(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleViewClient = (id: string) => {
    navigate(`/client/${id}`);
  };

  const handleEditClient = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteClient = (id: string) => {
    // In a real app, you would open a delete confirmation dialog
    console.log(`Delete client: ${id}`);
  };

  return (
    <MainLayout>
      <PageTitle 
        title="Buscar" 
        description="Pesquise por clientes em toda a sua base de dados"
      />
      
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="relative">
          <Input
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por nome, email, telefone ou endereço..."
            className="pl-10 py-6 text-lg bg-secondary border-secondary"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2" 
            onClick={handleSearch}
          >
            Buscar
          </Button>
        </div>
      </div>
      
      {/* Empty states and results */}
      {!hasSearched ? (
        <EmptyState 
          icon={<SearchIcon className="h-8 w-8 text-muted-foreground" />}
          title="Pesquise por clientes"
          description="Digite um termo de busca e pressione Enter ou clique em Buscar para encontrar clientes."
          className="bg-card border rounded-lg py-16 mt-8"
        />
      ) : results.length === 0 ? (
        <EmptyState 
          icon={<Users className="h-8 w-8 text-muted-foreground" />}
          title="Nenhum resultado encontrado"
          description={`Não encontramos clientes correspondentes à sua busca por "${query}".`}
          action={{
            label: "Adicionar Cliente",
            onClick: () => navigate("/new")
          }}
          className="bg-card border rounded-lg py-16 mt-8"
        />
      ) : (
        <div>
          <p className="mb-4 text-muted-foreground">
            {results.length} {results.length === 1 ? "resultado" : "resultados"} encontrados para "{query}"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(client => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onView={handleViewClient}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
              />
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default SearchPage;
