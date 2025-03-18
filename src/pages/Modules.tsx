
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
import ModuleService from "@/services/ModuleService";
import MySQLService from "@/services/MySQLService";

const Modules = () => {
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creditsAvailable, setCreditsAvailable] = useState(15);
  const [totalCredits] = useState(300);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: false, checking: true });
  const { 
    notifications, 
    addNotification, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAllNotifications,
    unreadCount 
  } = useNotifications();
  const moduleService = ModuleService.getInstance();
  const mysqlService = MySQLService.getInstance();
  
  // Verificar status da conexão com o banco de dados
  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const connected = await mysqlService.testConnection();
        setDbStatus({ connected, checking: false });
        
        if (connected) {
          addNotification({
            title: 'Conexão MySQL',
            message: 'Conexão com o banco de dados estabelecida com sucesso.',
            type: 'info'
          });
        } else {
          addNotification({
            title: 'MySQL indisponível',
            message: 'Usando dados locais para demonstração.',
            type: 'warning'
          });
        }
      } catch (error) {
        console.error("Erro ao verificar conexão:", error);
        setDbStatus({ connected: false, checking: false });
      }
    };
    
    checkDbConnection();
  }, []);

  // Carregar módulos
  useEffect(() => {
    const loadModules = async () => {
      setIsLoading(true);
      try {
        // Buscar módulos via serviço
        const enabledModules = await moduleService.getEnabledModules();
        
        if (enabledModules.length > 0) {
          // Converter para o formato ModuleType
          const clientModules: ModuleType[] = enabledModules.map(module => ({
            id: module.id,
            type: module.type,
            name: module.name,
            description: module.description,
            creditCost: module.creditCost,
            enabled: module.enabled,
            icon: module.icon
          }));
          
          setModules(clientModules);
          
          addNotification({
            title: 'Módulos carregados',
            message: `${clientModules.length} módulos foram carregados com sucesso.`,
            type: 'info'
          });
        } else {
          // Se não encontrou módulos, cai no fallback para dados locais
          loadMockModules();
        }
      } catch (error) {
        console.error('Erro ao carregar módulos:', error);
        // Em caso de erro, carrega dados locais
        loadMockModules();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadModules();
  }, []);

  const loadMockModules = () => {
    // Mock modules data como fallback
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
    
    addNotification({
      title: 'Dados de demonstração',
      message: 'Usando dados locais para demonstração (sem conexão MySQL).',
      type: 'warning'
    });
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
          {dbStatus.checking ? (
            <div className="text-sm font-medium flex items-center">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mr-2" />
              Conectando...
            </div>
          ) : dbStatus.connected ? (
            <div className="text-sm font-medium text-green-500 flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
              MySQL: Conectado
            </div>
          ) : (
            <div className="text-sm font-medium text-amber-500 flex items-center">
              <div className="h-2 w-2 bg-amber-500 rounded-full mr-2" />
              Modo local
            </div>
          )}
          
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
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ConsultationModule
              key={module.id}
              module={module}
              creditsAvailable={creditsAvailable}
              onUseCredits={handleUseCredits}
            />
          ))}
          
          {modules.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum módulo disponível no momento.</p>
            </div>
          )}
        </div>
      )}
      
      <CreditPurchaseDialog
        open={isPurchaseDialogOpen}
        onOpenChange={setIsPurchaseDialogOpen}
        onSuccess={handleCreditPurchaseSuccess}
      />
    </MainLayout>
  );
};

export default Modules;
