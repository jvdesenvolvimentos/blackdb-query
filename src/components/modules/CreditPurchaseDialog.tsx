
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, CopyIcon, ArrowRight } from "lucide-react";
import QRCode from "react-qr-code";

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
}

interface CreditPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (credits: number) => void;
}

const CreditPurchaseDialog = ({ open, onOpenChange, onSuccess }: CreditPurchaseDialogProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "payment" | "confirmation">("select");
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [pixCode, setPixCode] = useState<string>("");

  // Mock credit packages
  const creditPackages: CreditPackage[] = [
    { id: "package-1", credits: 50, price: 25.00 },
    { id: "package-2", credits: 100, price: 45.00 },
    { id: "package-3", credits: 200, price: 80.00 },
    { id: "package-4", credits: 500, price: 175.00 }
  ];

  const handleSelectPackage = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
  };

  const handleProceedToPayment = () => {
    if (!selectedPackage) {
      toast({
        title: "Erro",
        description: "Selecione um pacote de créditos para continuar.",
        variant: "destructive"
      });
      return;
    }

    // Generate a mock PIX code
    setPixCode("00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540510.005802BR5913Fulano de Tal6008Sao Paulo62070503***6304E2CA");
    setStep("payment");
  };

  const handleConfirmPayment = () => {
    // In a real app, you would verify payment here
    setStep("confirmation");
    
    // After 2 seconds, close the dialog and add credits
    setTimeout(() => {
      if (selectedPackage) {
        onSuccess(selectedPackage.credits);
        onOpenChange(false);
        setStep("select");
        setSelectedPackage(null);
      }
    }, 2000);
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "Código copiado",
      description: "Código PIX copiado para a área de transferência",
    });
  };

  const handleClose = () => {
    setStep("select");
    setSelectedPackage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>Comprar Créditos</DialogTitle>
              <DialogDescription>
                Escolha um pacote de créditos para adicionar à sua conta.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6">
              <RadioGroup className="grid grid-cols-1 gap-4">
                {creditPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center">
                    <RadioGroupItem
                      value={pkg.id}
                      id={pkg.id}
                      className="peer sr-only"
                      checked={selectedPackage?.id === pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                    />
                    <Label
                      htmlFor={pkg.id}
                      className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-medium">{pkg.credits} créditos</span>
                        <span className="text-sm text-muted-foreground">Melhor valor</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xl font-bold">R$ {pkg.price.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">
                          (R$ {(pkg.price / pkg.credits).toFixed(2)} por crédito)
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleProceedToPayment}>
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}
        
        {step === "payment" && selectedPackage && (
          <>
            <DialogHeader>
              <DialogTitle>Pagamento via PIX</DialogTitle>
              <DialogDescription>
                Escaneie o QR Code ou copie o código PIX para fazer o pagamento de R$ {selectedPackage.price.toFixed(2)}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 flex flex-col items-center gap-4">
              <Card className="p-4 flex justify-center">
                <QRCode value={pixCode} size={200} />
              </Card>
              
              <div className="bg-muted p-3 rounded-md w-full overflow-auto flex justify-between items-center">
                <code className="text-xs break-all mr-2">{pixCode}</code>
                <Button variant="ghost" size="icon" onClick={handleCopyPixCode}>
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground text-center mt-2">
                <p>Após o pagamento, clique em "Confirmar Pagamento" abaixo.</p>
                <p>O pagamento será processado em até 5 minutos.</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("select")}>
                Voltar
              </Button>
              <Button onClick={handleConfirmPayment}>
                Confirmar Pagamento
              </Button>
            </DialogFooter>
          </>
        )}
        
        {step === "confirmation" && (
          <>
            <DialogHeader>
              <DialogTitle>Processando Pagamento</DialogTitle>
              <DialogDescription>
                Estamos verificando seu pagamento.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-8 flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
              </div>
              <p className="text-center">Seu pagamento está sendo processado...</p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreditPurchaseDialog;
