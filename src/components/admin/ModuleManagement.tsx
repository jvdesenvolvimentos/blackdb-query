
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Module, ModuleFormValues } from "@/types/admin";
import { ModuleType } from "@/types/client";
import ModuleTable from "./modules/ModuleTable";
import ModuleDialogs from "./modules/ModuleDialogs";
import { getMockModules, saveModulesToLocalStorage } from "./modules/ModuleLocalStorageService";

const ModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>(getMockModules());
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

  const handleAddModule = () => {
    const moduleId = `module-${newModule.type}-${Date.now()}`;
    const moduleToAdd = { ...newModule, id: moduleId } as Module;
    
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
          <ModuleTable 
            modules={modules} 
            onEditModule={(module) => {
              setCurrentModule(module);
              setIsEditDialogOpen(true);
            }}
            onToggleStatus={toggleModuleStatus}
          />
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
