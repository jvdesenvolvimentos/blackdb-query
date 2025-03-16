
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CircleDollarSign } from "lucide-react";
import { ConsultationModule as ModuleType } from "@/types/client";
import ConsultationModule from "@/components/modules/ConsultationModule";

// Mock modules data
const mockModules: ModuleType[] = [
  {
    id: "module-personal",
    type: "personal",
    name: "Dados Pessoais",
    description: "Consulta de informações pessoais básicas: nome, idade, documentos, etc.",
    creditCost: 1,
    enabled: true,
    icon: "user"
  },
  {
    id: "module-financial",
    type: "financial",
    name: "Dados Financeiros",
    description: "Consulta de dados financeiros como renda, histórico bancário, etc.",
    creditCost: 5,
    enabled: true,
    icon: "dollar-sign"
  },
  {
    id: "module-address",
    type: "address",
    name: "Dados de Endereço",
    description: "Consulta de informações de endereço e geolocalização.",
    creditCost: 2,
    enabled: true,
    icon: "home"
  },
  {
    id: "module-work",
    type: "work",
    name: "Dados Profissionais",
    description: "Consulta de histórico profissional, empregos e qualificações.",
    creditCost: 3,
    enabled: true,
    icon: "briefcase"
  },
  {
    id: "module-credit",
    type: "credit",
    name: "Dados de Crédito",
    description: "Consulta de score de crédito, histórico de pagamentos e dívidas.",
    creditCost: 10,
    enabled: false,
    icon: "credit-card"
  }
];

const Modules = () => {
  const [modules, setModules] = useState<ModuleType[]>(mockModules);
  const [creditsAvailable, setCreditsAvailable] = useState(164);
  const [totalCredits, setTotalCredits] = useState(300);
  const [activeTab, setActiveTab] = useState("all");

  const handleUseCredits = (amount: number) => {
    setCreditsAvailable((prev) => Math.max(0, prev - amount));
  };

  const filteredModules = modules.filter((module) => {
    if (activeTab === "all") return true;
    if (activeTab === "enabled") return module.enabled;
    return module.type === activeTab;
  });

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Módulos de Consulta</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline">
            <CircleDollarSign className="mr-2 h-4 w-4" />
            Comprar créditos
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova consulta
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="col-span-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Créditos disponíveis</span>
                <span className="font-medium">{creditsAvailable} de {totalCredits}</span>
              </div>
              <Progress value={(creditsAvailable / totalCredits) * 100} />
            </div>
            
            <div className="flex flex-col justify-center space-y-1">
              <div className="text-sm text-muted-foreground">Plano atual: <span className="font-medium text-foreground">Padrão</span></div>
              <div className="text-sm text-muted-foreground">Próxima renovação: <span className="font-medium text-foreground">14 dias</span></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="enabled">Ativos</TabsTrigger>
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
        </TabsList>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module) => (
            <ConsultationModule
              key={module.id}
              module={module}
              creditsAvailable={creditsAvailable}
              onUseCredits={handleUseCredits}
            />
          ))}
        </div>
        
        {filteredModules.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-2">Nenhum módulo encontrado para esta categoria</p>
            <Button variant="outline" onClick={() => setActiveTab("all")}>
              Mostrar todos os módulos
            </Button>
          </div>
        )}
      </Tabs>
    </MainLayout>
  );
};

export default Modules;
