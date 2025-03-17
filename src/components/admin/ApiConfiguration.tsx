
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Globe, Server, CheckCircle2, Save, Bell, RotateCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  description: string;
  enabled: boolean;
}

const ApiConfiguration = () => {
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>([
    {
      id: "personal",
      name: "API de Dados Pessoais",
      url: "https://api.blackdb.com/v1/personal",
      description: "Endpoint para consulta de dados pessoais de indivíduos",
      enabled: true
    },
    {
      id: "financial",
      name: "API de Dados Financeiros",
      url: "https://api.blackdb.com/v1/financial",
      description: "Endpoint para consulta de dados financeiros e bancários",
      enabled: true
    },
    {
      id: "address",
      name: "API de Endereços",
      url: "https://api.blackdb.com/v1/address",
      description: "Endpoint para consulta de dados de endereço e localização",
      enabled: true
    },
    {
      id: "work",
      name: "API de Dados Profissionais",
      url: "https://api.blackdb.com/v1/work",
      description: "Endpoint para consulta de histórico profissional",
      enabled: true
    },
    {
      id: "credit",
      name: "API de Crédito",
      url: "https://api.blackdb.com/v1/credit",
      description: "Endpoint para consulta de score de crédito e histórico",
      enabled: true
    }
  ]);

  const [apiKey, setApiKey] = useState("*******************************");
  const [showApiKey, setShowApiKey] = useState(false);
  const [notificationToken, setNotificationToken] = useState("*******************************");
  const [showNotificationToken, setShowNotificationToken] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();

  const handleUpdateEndpoint = (id: string, url: string) => {
    setApiEndpoints(
      apiEndpoints.map(endpoint => 
        endpoint.id === id ? { ...endpoint, url } : endpoint
      )
    );
  };

  const handleToggleEndpoint = (id: string) => {
    setApiEndpoints(
      apiEndpoints.map(endpoint => 
        endpoint.id === id ? { ...endpoint, enabled: !endpoint.enabled } : endpoint
      )
    );
  };

  const handleSaveChanges = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de API foram atualizadas com sucesso.",
      duration: 3000,
    });
    
    // In a real app, you would save to a database and update other components
    localStorage.setItem('apiEndpoints', JSON.stringify(apiEndpoints));
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  };

  const handleTestEndpoint = (url: string) => {
    // Simulate API testing
    setTimeout(() => {
      toast({
        title: "Teste bem-sucedido",
        description: "O endpoint está acessível e respondendo corretamente.",
        duration: 3000,
      });
    }, 1000);
  };

  const handleRegenerateApiKey = () => {
    // Simulate API key regeneration
    setApiKey(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    toast({
      title: "Chave de API regenerada",
      description: "Uma nova chave de API foi gerada com sucesso.",
      duration: 3000,
    });
  };

  const handleRegenerateNotificationToken = () => {
    // Simulate notification token regeneration
    setNotificationToken(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    toast({
      title: "Token de Notificação regenerado",
      description: "Um novo token de notificação foi gerado com sucesso.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Chave de API
          </CardTitle>
          <CardDescription>
            Gerencie sua chave de API para acesso aos serviços de consulta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Chave de API</Label>
              <div className="flex">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? "Ocultar" : "Mostrar"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleRegenerateApiKey}>
            <RotateCw className="h-4 w-4 mr-2" />
            Regenerar Chave
          </Button>
          <Button onClick={() => {
            navigator.clipboard.writeText(apiKey);
            toast({
              title: "Chave copiada",
              description: "Chave de API copiada para a área de transferência",
              duration: 2000,
            });
          }}>
            Copiar Chave
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configuração de Notificações
          </CardTitle>
          <CardDescription>
            Gerencie as configurações de notificações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificações do Sistema</Label>
                <p className="text-xs text-muted-foreground">
                  Ativar ou desativar notificações para eventos importantes
                </p>
              </div>
              <Switch 
                id="notifications" 
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notification-token">Token de Notificação</Label>
              <div className="flex">
                <Input
                  id="notification-token"
                  type={showNotificationToken ? "text" : "password"}
                  value={notificationToken}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={() => setShowNotificationToken(!showNotificationToken)}
                >
                  {showNotificationToken ? "Ocultar" : "Mostrar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Token utilizado para autenticar serviços de notificação
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleRegenerateNotificationToken}>
            <RotateCw className="h-4 w-4 mr-2" />
            Regenerar Token
          </Button>
          <Button onClick={() => {
            navigator.clipboard.writeText(notificationToken);
            toast({
              title: "Token copiado",
              description: "Token de notificação copiado para a área de transferência",
              duration: 2000,
            });
          }}>
            Copiar Token
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Endpoints de API
          </CardTitle>
          <CardDescription>
            Configure as URLs dos endpoints de API para cada módulo de consulta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`endpoint-${endpoint.id}`} className="font-medium">
                    {endpoint.name}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id={`switch-${endpoint.id}`}
                      checked={endpoint.enabled}
                      onCheckedChange={() => handleToggleEndpoint(endpoint.id)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleTestEndpoint(endpoint.url)}
                      className="h-8 px-2 text-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Testar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{endpoint.description}</p>
                <Input
                  id={`endpoint-${endpoint.id}`}
                  value={endpoint.url}
                  onChange={(e) => handleUpdateEndpoint(endpoint.id, e.target.value)}
                  className={endpoint.enabled ? "" : "bg-muted"}
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" onClick={handleSaveChanges}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiConfiguration;
