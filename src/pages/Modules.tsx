
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleDollarSign } from "lucide-react";
import { ConsultationModule as ModuleType } from "@/types/client";
import ConsultationModule from "@/components/modules/ConsultationModule";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Mock modules data
const mockModules: ModuleType[] = [
  {
    id: "module-personal",
    type: "personal",
    name: "CPF",
    description: "Descubra informações pessoais detalhadas utilizando o CPF.",
    creditCost: 1,
    enabled: true,
    icon: "user"
  },
  {
    id: "module-name",
    type: "personal",
    name: "Nome",
    description: "Encontre pessoas em todo o Brasil utilizando o Nome Completo.",
    creditCost: 2,
    enabled: true,
    icon: "user"
  },
  {
    id: "module-address",
    type: "address",
    name: "CNH",
    description: "Acesse informações detalhadas do condutor utilizando apenas o CPF.",
    creditCost: 3,
    enabled: true,
    icon: "home"
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
  const [modules] = useState<ModuleType[]>(mockModules);
  const [creditsAvailable, setCreditsAvailable] = useState(15);
  const [totalCredits] = useState(300);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  const handleUseCredits = (amount: number) => {
    setCreditsAvailable((prev) => {
      const newCredits = Math.max(0, prev - amount);
      
      // Alert user when credits are low
      if (newCredits < 5) {
        toast({
          title: "Créditos baixos",
          description: `Você possui apenas ${newCredits} créditos. Considere comprar mais.`,
          variant: "destructive"
        });
      }
      
      return newCredits;
    });
  };

  const handleBuyCredits = () => {
    // Simulate buying credits
    setCreditsAvailable(prev => prev + 10);
    toast({
      title: "Créditos adicionados",
      description: "10 créditos foram adicionados à sua conta.",
    });
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Consultas</h1>
        
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">
            Créditos: <span className="text-primary">{creditsAvailable}</span> de {totalCredits}
          </div>
          
          <Button variant="outline" className="self-start" onClick={handleBuyCredits}>
            <CircleDollarSign className="mr-2 h-4 w-4" />
            Comprar créditos
          </Button>
        </div>
      </div>
      
      {!hasActivePlan && (
        <Alert variant="destructive" className="bg-blue-900/30 border-blue-900/50 text-white mb-8">
          <AlertDescription className="text-center py-2">
            <span className="font-bold text-lg">JVCARA!</span>
            <br />
            <span>Você não possui plano cadastrado. Contrate agora mesmo!</span>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <ConsultationModule
            key={module.id}
            module={module}
            creditsAvailable={creditsAvailable}
            onUseCredits={handleUseCredits}
          />
        ))}
      </div>
    </MainLayout>
  );
};

export default Modules;
