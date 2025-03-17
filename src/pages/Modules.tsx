
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleDollarSign, Bell } from "lucide-react";
import { ConsultationModule as ModuleType } from "@/types/client";
import ConsultationModule from "@/components/modules/ConsultationModule";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import CreditPurchaseDialog from "@/components/modules/CreditPurchaseDialog";
import { useNotifications } from "@/components/NotificationSystem";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "@/components/NotificationSystem";
import { Badge } from "@/components/ui/badge";

const Modules = () => {
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [creditsAvailable, setCreditsAvailable] = useState(15);
  const [totalCredits] = useState(300);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const { 
    notifications, 
    addNotification, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications,
    unreadCount 
  } = useNotifications();

  // Load API endpoints and modules from localStorage
  useEffect(() => {
    const apiEndpointsJson = localStorage.getItem('apiEndpoints');
    if (apiEndpointsJson) {
      try {
        const apiEndpoints = JSON.parse(apiEndpointsJson);
        
        // Use API endpoints to create modules
        const apiModules = apiEndpoints.map((endpoint: any) => ({
          id: `module-${endpoint.id}`,
          type: endpoint.id,
          name: endpoint.name.replace('API de ', ''),
          description: endpoint.description,
          creditCost: endpoint.id === 'credit' ? 10 : 
                    endpoint.id === 'financial' ? 5 : 
                    endpoint.id === 'work' ? 3 : 
                    endpoint.id === 'address' ? 2 : 1,
          enabled: endpoint.enabled,
          icon: endpoint.id
        }));
        
        setModules(apiModules);
        
        // Create a notification
        addNotification({
          title: 'Módulos carregados',
          message: `${apiModules.length} módulos foram carregados com sucesso.`,
          type: 'info'
        });
      } catch (error) {
        console.error('Error parsing API endpoints:', error);
        
        // Fallback to mock modules data
        loadMockModules();
      }
    } else {
      // No API endpoints in localStorage, load mock data
      loadMockModules();
    }
  }, []);

  const loadMockModules = () => {
    // Mock modules data (same as before)
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
    
    setModules(mockModules);
  };

  const handleUseCredits = (amount: number) => {
    setCreditsAvailable((prev) => {
      const newCredits = Math.max(0, prev - amount);
      
      // Alert user when credits are low
      if (newCredits < 5) {
        addNotification({
          title: "Créditos baixos",
          message: `Você possui apenas ${newCredits} créditos. Considere comprar mais.`,
          type: 'warning'
        });
      }
      
      return newCredits;
    });
  };

  const handleBuyCredits = () => {
    setIsPurchaseDialogOpen(true);
  };

  const handleCreditPurchaseSuccess = (credits: number) => {
    setCreditsAvailable(prev => prev + credits);
    
    addNotification({
      title: "Créditos adicionados",
      message: `${credits} créditos foram adicionados à sua conta.`,
      type: 'success'
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
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500" 
                    variant="destructive"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="font-medium mb-2">Notificações</div>
              <NotificationList 
                notifications={notifications} 
                onMarkAsRead={markAsRead}
                onRemove={removeNotification}
                onMarkAllAsRead={markAllAsRead}
                onClearAll={clearAllNotifications}
              />
            </PopoverContent>
          </Popover>
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
      
      <CreditPurchaseDialog
        open={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
        onSuccess={handleCreditPurchaseSuccess}
      />
    </MainLayout>
  );
};

export default Modules;
