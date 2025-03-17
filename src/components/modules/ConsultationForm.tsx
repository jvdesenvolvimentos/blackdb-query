
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export interface ConsultationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
  creditCost: number;
  onConsultation: () => void;
  apiUrl?: string; // Adicionado apiUrl como parâmetro opcional
}

const ConsultationForm = ({
  open,
  onOpenChange,
  moduleName,
  creditCost,
  onConsultation,
  apiUrl
}: ConsultationFormProps) => {
  const [cpf, setCpf] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cpf.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe o CPF para consulta",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Aqui seria feita uma requisição real para a API com os dados do formulário
      // Usando o apiUrl que agora está disponível como parâmetro
      console.log(`Consultando API: ${apiUrl} com CPF: ${cpf}`);
      
      // Simular uma requisição
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Chamada de callback para atualizar créditos e estatísticas
      onConsultation();
      
      toast({
        title: "Consulta realizada",
        description: `Consulta de ${moduleName} realizada com sucesso.`
      });
      
      onOpenChange(false);
      setCpf("");
      setAdditionalInfo("");
    } catch (error) {
      toast({
        title: "Erro na consulta",
        description: "Não foi possível realizar a consulta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Consulta de {moduleName}</DialogTitle>
          <DialogDescription>
            Esta consulta utilizará {creditCost} {creditCost === 1 ? "crédito" : "créditos"} da sua conta.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF para consulta</Label>
              <Input
                id="cpf"
                placeholder="Digite o CPF (somente números)"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Informações adicionais (opcional)</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Digite informações complementares para a consulta..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Consultando..." : "Consultar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationForm;
