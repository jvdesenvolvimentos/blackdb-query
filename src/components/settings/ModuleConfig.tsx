
import { useState } from "react";
import { ConsultationModule, ModuleType } from "@/types/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Info, User, Home, Briefcase, CreditCard, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock modules data
const mockModules: ConsultationModule[] = [
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
    enabled: true,
    icon: "credit-card"
  }
];

// Function to get the icon component based on icon name
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "user":
      return <User className="h-5 w-5" />;
    case "dollar-sign":
      return <DollarSign className="h-5 w-5" />;
    case "home":
      return <Home className="h-5 w-5" />;
    case "briefcase":
      return <Briefcase className="h-5 w-5" />;
    case "credit-card":
      return <CreditCard className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

const ModuleConfig = () => {
  const [modules, setModules] = useState<ConsultationModule[]>(mockModules);

  const toggleModuleStatus = (moduleId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? { ...module, enabled: !module.enabled }
          : module
      )
    );
  };

  return (
    <Tabs defaultValue="enabled" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="enabled">Módulos Ativos</TabsTrigger>
        <TabsTrigger value="all">Todos os Módulos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="enabled" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2">
          {modules
            .filter((module) => module.enabled)
            .map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onToggle={() => toggleModuleStatus(module.id)}
              />
            ))}
        </div>
        
        {modules.filter((module) => module.enabled).length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhum módulo ativo no momento</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="all" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onToggle={() => toggleModuleStatus(module.id)}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

interface ModuleCardProps {
  module: ConsultationModule;
  onToggle: () => void;
}

const ModuleCard = ({ module, onToggle }: ModuleCardProps) => {
  return (
    <Card className={module.enabled ? "" : "opacity-70"}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {getIconComponent(module.icon)}
          </div>
          <div>
            <CardTitle className="text-base font-medium">{module.name}</CardTitle>
            <CardDescription className="text-xs">
              {module.description}
            </CardDescription>
          </div>
        </div>
        <Switch
          checked={module.enabled}
          onCheckedChange={onToggle}
          aria-label={`Toggle ${module.name}`}
        />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="py-1">
            {module.creditCost} {module.creditCost === 1 ? "crédito" : "créditos"} por consulta
          </Badge>
          <span className="text-xs text-muted-foreground">
            {module.enabled ? "Módulo ativo" : "Módulo inativo"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleConfig;
