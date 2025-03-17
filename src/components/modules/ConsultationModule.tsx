
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConsultationModule as ModuleType } from "@/types/client";
import { User, CreditCard, Home, Briefcase, DollarSign, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ConsultationForm from "./ConsultationForm";

interface ConsultationModuleProps {
  module: ModuleType;
  creditsAvailable: number;
  onUseCredits: (amount: number) => void;
}

const ModuleIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "personal":
      return <User className="h-8 w-8" />;
    case "financial":
      return <DollarSign className="h-8 w-8" />;
    case "address":
      return <Home className="h-8 w-8" />;
    case "work":
      return <Briefcase className="h-8 w-8" />;
    case "credit":
      return <CreditCard className="h-8 w-8" />;
    default:
      return <Search className="h-8 w-8" />;
  }
};

const ConsultationModule = ({ module, creditsAvailable, onUseCredits }: ConsultationModuleProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [maxUsage] = useState(100);
  const { toast } = useToast();

  const handleButtonClick = () => {
    if (creditsAvailable < module.creditCost) {
      toast({
        title: "Créditos insuficientes",
        description: "Você não possui créditos suficientes para esta consulta.",
        variant: "destructive"
      });
      return;
    }

    if (!module.enabled) {
      toast({
        title: "Módulo desativado",
        description: "Este módulo está desativado no momento.",
        variant: "destructive"
      });
      return;
    }

    if (!module.apiUrl) {
      toast({
        title: "API não configurada",
        description: "Este módulo não possui uma URL de API configurada.",
        variant: "destructive"
      });
      return;
    }

    setIsDialogOpen(true);
  };

  const handleConsultation = () => {
    onUseCredits(module.creditCost);
    setUsageCount(prev => prev + 1);
    
    // Exibir informação sobre qual API está sendo consultada (apenas para feedback)
    console.log(`Consultando API: ${module.apiUrl}`);
  };

  const isDisabled = !module.enabled || creditsAvailable < module.creditCost || !module.apiUrl;

  return (
    <>
      <Card className={`${!module.enabled ? "opacity-70" : ""} dark:bg-slate-800/90`}>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full ${module.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"} mb-4 relative`}>
            <ModuleIcon type={module.type} />
            <div className={`absolute right-0 bottom-0 w-4 h-4 ${module.apiUrl ? "bg-green-500" : "bg-red-500"} rounded-full border-2 border-white dark:border-slate-800`}></div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
          <p className="text-sm text-muted-foreground mb-6">{module.description}</p>
          
          <div className="bg-slate-900/20 text-sm py-1 px-4 rounded-full mb-4">
            {`${usageCount} / ${maxUsage}`}
          </div>
          
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600" 
            disabled={isDisabled}
            onClick={handleButtonClick}
          >
            Acessar
          </Button>
          
          {!module.apiUrl && (
            <p className="text-xs text-red-500 mt-2">API não configurada</p>
          )}
        </CardContent>
      </Card>

      <ConsultationForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        moduleName={module.name}
        creditCost={module.creditCost}
        onConsultation={handleConsultation}
        apiUrl={module.apiUrl}
      />
    </>
  );
};

export default ConsultationModule;
