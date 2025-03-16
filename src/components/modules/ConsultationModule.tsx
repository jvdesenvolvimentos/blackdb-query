
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConsultationModule as ModuleType } from "@/types/client";
import { User, CreditCard, Home, Briefcase, DollarSign, Lock, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ConsultationModuleProps {
  module: ModuleType;
  creditsAvailable: number;
  onUseCredits: (amount: number) => void;
}

const ModuleIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "personal":
      return <User className="h-5 w-5" />;
    case "financial":
      return <DollarSign className="h-5 w-5" />;
    case "address":
      return <Home className="h-5 w-5" />;
    case "work":
      return <Briefcase className="h-5 w-5" />;
    case "credit":
      return <CreditCard className="h-5 w-5" />;
    default:
      return <Search className="h-5 w-5" />;
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
    <Card className={!module.enabled ? "opacity-70" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${module.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              <ModuleIcon type={module.type} />
            </div>
            <div>
              <CardTitle className="text-base font-medium">{module.name}</CardTitle>
              <CardDescription className="text-xs">{module.description}</CardDescription>
            </div>
          </div>
          <Badge variant={module.enabled ? "outline" : "secondary"} className="py-1">
            {module.creditCost} {module.creditCost === 1 ? "crédito" : "créditos"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full" 
          disabled={isDisabled}
          variant={isDisabled ? "outline" : "default"}
          onClick={handleConsult}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              <span>Consultando...</span>
            </div>
          ) : isDisabled && !module.enabled ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Módulo desativado
            </>
          ) : isDisabled ? (
            "Créditos insuficientes"
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Realizar consulta
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsultationModule;
