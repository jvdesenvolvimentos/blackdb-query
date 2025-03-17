
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

interface ConsultationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
  creditCost: number;
  onConsultation: () => void;
}

const ConsultationForm = ({
  open,
  onOpenChange,
  moduleName,
  creditCost,
  onConsultation,
}: ConsultationFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConsultation = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite um termo para consulta",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    // Simulate API call
    try {
      // This is a mock API call - replace with your actual API
      const response = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(`Resultados da consulta para "${searchTerm}" no módulo ${moduleName}`);
        }, 1500);
      });

      setResults(response);
      onConsultation(); // Trigger credit usage
      
      toast({
        title: "Consulta realizada",
        description: `Consulta realizada com sucesso. ${creditCost} créditos foram utilizados.`,
      });
    } catch (error) {
      toast({
        title: "Erro na consulta",
        description: "Não foi possível realizar a consulta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Consulta de {moduleName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="searchTerm" className="text-sm font-medium">
              Digite o termo para consulta:
            </label>
            <Input
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite aqui..."
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Esta consulta consumirá {creditCost} créditos da sua conta.
            </p>
          </div>
          
          {results && (
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium">Resultados:</label>
              <Textarea
                readOnly
                value={results}
                className="min-h-[150px]"
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConsultation}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Consultar</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationForm;
