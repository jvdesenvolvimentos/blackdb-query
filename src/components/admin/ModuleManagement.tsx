
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, User, Home, Briefcase, CreditCard, DollarSign, Search } from "lucide-react";

// Mock modules data (copied from settings/ModuleConfig.tsx)
const mockModules = [
  {
    id: "module-personal",
    type: "personal",
    name: "Dados Pessoais",
    description: "Consulta de informações pessoais básicas: nome, idade, documentos, etc.",
    creditCost: 1,
    enabled: true,
    icon: "user",
    apiUrl: "https://api.example.com/v1/personal"
  },
  {
    id: "module-financial",
    type: "financial",
    name: "Dados Financeiros",
    description: "Consulta de dados financeiros como renda, histórico bancário, etc.",
    creditCost: 5,
    enabled: true,
    icon: "dollar-sign",
    apiUrl: "https://api.example.com/v1/financial"
  },
  {
    id: "module-address",
    type: "address",
    name: "Dados de Endereço",
    description: "Consulta de informações de endereço e geolocalização.",
    creditCost: 2,
    enabled: true,
    icon: "home",
    apiUrl: "https://api.example.com/v1/address"
  },
  {
    id: "module-work",
    type: "work",
    name: "Dados Profissionais",
    description: "Consulta de histórico profissional, empregos e qualificações.",
    creditCost: 3,
    enabled: true,
    icon: "briefcase",
    apiUrl: "https://api.example.com/v1/work"
  },
  {
    id: "module-credit",
    type: "credit",
    name: "Dados de Crédito",
    description: "Consulta de score de crédito, histórico de pagamentos e dívidas.",
    creditCost: 10,
    enabled: true,
    icon: "credit-card",
    apiUrl: "https://api.example.com/v1/credit"
  }
];

// Function to get the icon component based on icon name
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "user":
      return <User className="h-5 w-5" />;
    case "dollar-sign":
      return <DollarSign className="h-5 w-5" />;
    case "home":
      return <Home className="h-5 w-5" />;
    case "briefcase":
      return <Briefcase className="h-5 w-5" />;
    case "credit-card":
      return <CreditCard className="h-5 w-5" />;
    default:
      return <Search className="h-5 w-5" />;
  }
};

interface Module {
  id: string;
  type: string;
  name: string;
  description: string;
  creditCost: number;
  enabled: boolean;
  icon: string;
  apiUrl: string;
}

const ModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [newModule, setNewModule] = useState<Module>({
    id: "",
    type: "personal",
    name: "",
    description: "",
    creditCost: 1,
    enabled: true,
    icon: "search",
    apiUrl: ""
  });
  const { toast } = useToast();

  const handleAddModule = () => {
    const moduleId = `module-${newModule.type}-${Date.now()}`;
    const moduleToAdd = { ...newModule, id: moduleId };
    
    // Adicionar o novo módulo ao estado local
    setModules([...modules, moduleToAdd]);
    
    // Salvar no localStorage para refletir na página de módulos do usuário
    saveModulesToLocalStorage([...modules, moduleToAdd]);
    
    // Reset form
    setNewModule({
      id: "",
      type: "personal",
      name: "",
      description: "",
      creditCost: 1,
      enabled: true,
      icon: "search",
      apiUrl: ""
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Módulo adicionado",
      description: `${newModule.name} foi adicionado com sucesso.`
    });
  };

  const handleEditModule = () => {
    if (currentModule) {
      const updatedModules = modules.map(module => 
        module.id === currentModule.id ? currentModule : module
      );
      
      // Atualizar o estado local
      setModules(updatedModules);
      
      // Salvar no localStorage para refletir na página de módulos do usuário
      saveModulesToLocalStorage(updatedModules);
      
      setIsEditDialogOpen(false);
      
      toast({
        title: "Módulo atualizado",
        description: `${currentModule.name} foi atualizado com sucesso.`
      });
    }
  };

  const toggleModuleStatus = (moduleId: string) => {
    const updatedModules = modules.map(module => 
      module.id === moduleId ? { ...module, enabled: !module.enabled } : module
    );
    
    // Atualizar o estado local
    setModules(updatedModules);
    
    // Salvar no localStorage para refletir na página de módulos do usuário
    saveModulesToLocalStorage(updatedModules);
    
    const module = modules.find(m => m.id === moduleId);
    
    toast({
      title: module?.enabled ? "Módulo desativado" : "Módulo ativado",
      description: `${module?.name} foi ${module?.enabled ? "desativado" : "ativado"} com sucesso.`
    });
  };

  // Função para salvar os módulos no localStorage como apiEndpoints
  const saveModulesToLocalStorage = (modulesToSave: Module[]) => {
    // Converter os módulos para o formato de apiEndpoints
    const apiEndpoints = modulesToSave.map(module => ({
      id: module.type,
      name: module.name,
      description: module.description,
      enabled: module.enabled,
      apiUrl: module.apiUrl
    }));
    
    localStorage.setItem('apiEndpoints', JSON.stringify(apiEndpoints));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Gerenciamento de Módulos</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Módulo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Ícone</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Custo (Créditos)</TableHead>
                  <TableHead>API URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {getIconComponent(module.icon)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-medium">{module.name}</p>
                        <p className="text-xs text-muted-foreground">{module.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{module.type}</TableCell>
                    <TableCell>{module.creditCost}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={module.apiUrl}>
                      {module.apiUrl}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={module.enabled} 
                          onCheckedChange={() => toggleModuleStatus(module.id)}
                        />
                        <span className={module.enabled ? "text-green-500" : "text-red-500"}>
                          {module.enabled ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentModule(module);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Module Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Módulo</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo módulo de consulta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome do Módulo
              </label>
              <Input
                id="name"
                value={newModule.name}
                onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="description"
                value={newModule.description}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Tipo
              </label>
              <select
                id="type"
                value={newModule.type}
                onChange={(e) => setNewModule({ ...newModule, type: e.target.value })}
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="personal">Dados Pessoais</option>
                <option value="financial">Dados Financeiros</option>
                <option value="address">Endereço</option>
                <option value="work">Profissional</option>
                <option value="credit">Crédito</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="icon" className="text-sm font-medium">
                Ícone
              </label>
              <select
                id="icon"
                value={newModule.icon}
                onChange={(e) => setNewModule({ ...newModule, icon: e.target.value })}
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="user">Usuário</option>
                <option value="dollar-sign">Dinheiro</option>
                <option value="home">Casa</option>
                <option value="briefcase">Trabalho</option>
                <option value="credit-card">Cartão</option>
                <option value="search">Busca</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="creditCost" className="text-sm font-medium">
                Custo em Créditos
              </label>
              <Input
                id="creditCost"
                type="number"
                value={newModule.creditCost}
                onChange={(e) => setNewModule({ ...newModule, creditCost: parseInt(e.target.value) || 1 })}
                min={1}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="apiUrl" className="text-sm font-medium">
                URL da API
              </label>
              <Input
                id="apiUrl"
                type="url"
                placeholder="https://api.example.com/endpoint"
                value={newModule.apiUrl}
                onChange={(e) => setNewModule({ ...newModule, apiUrl: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={newModule.enabled}
                onCheckedChange={(value) => setNewModule({ ...newModule, enabled: value })}
              />
              <label htmlFor="status" className="text-sm font-medium">
                Módulo Ativo
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddModule} disabled={!newModule.name || !newModule.description || !newModule.apiUrl}>
              Adicionar Módulo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Módulo</DialogTitle>
            <DialogDescription>
              Modifique os detalhes do módulo de consulta.
            </DialogDescription>
          </DialogHeader>
          {currentModule && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nome do Módulo
                </label>
                <Input
                  id="edit-name"
                  value={currentModule.name}
                  onChange={(e) => setCurrentModule({ ...currentModule, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Descrição
                </label>
                <Textarea
                  id="edit-description"
                  value={currentModule.description}
                  onChange={(e) => setCurrentModule({ ...currentModule, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-type" className="text-sm font-medium">
                  Tipo
                </label>
                <select
                  id="edit-type"
                  value={currentModule.type}
                  onChange={(e) => setCurrentModule({ ...currentModule, type: e.target.value })}
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="personal">Dados Pessoais</option>
                  <option value="financial">Dados Financeiros</option>
                  <option value="address">Endereço</option>
                  <option value="work">Profissional</option>
                  <option value="credit">Crédito</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-icon" className="text-sm font-medium">
                  Ícone
                </label>
                <select
                  id="edit-icon"
                  value={currentModule.icon}
                  onChange={(e) => setCurrentModule({ ...currentModule, icon: e.target.value })}
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="user">Usuário</option>
                  <option value="dollar-sign">Dinheiro</option>
                  <option value="home">Casa</option>
                  <option value="briefcase">Trabalho</option>
                  <option value="credit-card">Cartão</option>
                  <option value="search">Busca</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-creditCost" className="text-sm font-medium">
                  Custo em Créditos
                </label>
                <Input
                  id="edit-creditCost"
                  type="number"
                  value={currentModule.creditCost}
                  onChange={(e) => setCurrentModule({ ...currentModule, creditCost: parseInt(e.target.value) || 1 })}
                  min={1}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-apiUrl" className="text-sm font-medium">
                  URL da API
                </label>
                <Input
                  id="edit-apiUrl"
                  type="url"
                  placeholder="https://api.example.com/endpoint"
                  value={currentModule.apiUrl}
                  onChange={(e) => setCurrentModule({ ...currentModule, apiUrl: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-status"
                  checked={currentModule.enabled}
                  onCheckedChange={(value) => setCurrentModule({ ...currentModule, enabled: value })}
                />
                <label htmlFor="edit-status" className="text-sm font-medium">
                  Módulo Ativo
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditModule} disabled={!currentModule?.name || !currentModule?.description || !currentModule?.apiUrl}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleManagement;
