
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConsultationModule as ModuleType } from "@/types/client";
import { User, CreditCard, Home, Briefcase, DollarSign, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConsult = () => {
    if (creditsAvailable < module.creditCost) {
      toast({
        title: "Créditos insuficientes",
        description: "Você não possui créditos suficientes para esta consulta.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onUseCredits(module.creditCost);
      setIsLoading(false);
      
      toast({
        title: "Consulta realizada",
        description: `Consulta de ${module.name} realizada com sucesso.`
      });
    }, 1500);
  };

  const isDisabled = !module.enabled || creditsAvailable < module.creditCost;

  return (
    <Card className={`${!module.enabled ? "opacity-70" : ""} dark:bg-slate-800/90`}>
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className={`flex h-24 w-24 items-center justify-center rounded-full ${module.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"} mb-4 relative`}>
          <ModuleIcon type={module.type} />
          <div className="absolute right-0 bottom-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{module.name}</h3>
        <p className="text-sm text-muted-foreground mb-6">{module.description}</p>
        
        <div className="bg-slate-900/20 text-sm py-1 px-4 rounded-full mb-4">
          {`${0} / ${0}`}
        </div>
        
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600" 
          disabled={isDisabled}
          onClick={handleConsult}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              <span>Consultando...</span>
            </div>
          ) : "Acessar"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsultationModule;
