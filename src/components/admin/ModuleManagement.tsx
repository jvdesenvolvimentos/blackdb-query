
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Module, ModuleFormValues } from "@/types/admin";
import { ModuleType } from "@/types/client";
import ModuleTable from "./modules/ModuleTable";
import ModuleDialogs from "./modules/ModuleDialogs";
import ModuleService from "@/services/ModuleService";

const ModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [newModule, setNewModule] = useState<ModuleFormValues>({
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
  const moduleService = ModuleService.getInstance();

  // Carregar módulos ao montar o componente
  useEffect(() => {
    const loadModules = async () => {
      setIsLoading(true);
      try {
        const loadedModules = await moduleService.getAllModules();
        setModules(loadedModules);
      } catch (error) {
        console.error("Erro ao carregar módulos:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os módulos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadModules();
  }, []);

  const handleAddModule = async () => {
    const moduleId = `module-${newModule.type}-${Date.now()}`;
    const moduleToAdd = { ...newModule, id: moduleId } as Module;
    
    try {
      // Adicionar o novo módulo via serviço
      const success = await moduleService.createModule(moduleToAdd);
      
      if (success) {
        // Atualizar o estado local
        setModules([...modules, moduleToAdd]);
        
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
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o módulo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar módulo:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o módulo.",
        variant: "destructive",
      });
    }
  };

  const handleEditModule = async () => {
    if (currentModule) {
      try {
        // Atualizar o módulo via serviço
        const success = await moduleService.updateModule(currentModule);
        
        if (success) {
          // Atualizar o estado local
          const updatedModules = modules.map(module => 
            module.id === currentModule.id ? currentModule : module
          );
          
          setModules(updatedModules);
          setIsEditDialogOpen(false);
          
          toast({
            title: "Módulo atualizado",
            description: `${currentModule.name} foi atualizado com sucesso.`
          });
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível atualizar o módulo.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao atualizar módulo:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao atualizar o módulo.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleModuleStatus = async (moduleId: string) => {
    try {
      // Alternar o status do módulo via serviço
      const success = await moduleService.toggleModuleStatus(moduleId);
      
      if (success) {
        // Atualizar o estado local
        const updatedModules = modules.map(module => 
          module.id === moduleId ? { ...module, enabled: !module.enabled } : module
        );
        
        setModules(updatedModules);
        
        const module = modules.find(m => m.id === moduleId);
        
        toast({
          title: module?.enabled ? "Módulo desativado" : "Módulo ativado",
          description: `${module?.name} foi ${module?.enabled ? "desativado" : "ativado"} com sucesso.`
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível alterar o status do módulo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao alterar status do módulo:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar o status do módulo.",
        variant: "destructive",
      });
    }
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
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <ModuleTable 
              modules={modules} 
              onEditModule={(module) => {
                setCurrentModule(module);
                setIsEditDialogOpen(true);
              }}
              onToggleStatus={toggleModuleStatus}
            />
          )}
        </CardContent>
      </Card>

      <ModuleDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        newModule={newModule}
        setNewModule={setNewModule}
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
        handleAddModule={handleAddModule}
        handleEditModule={handleEditModule}
      />
    </div>
  );
};

export default ModuleManagement;
