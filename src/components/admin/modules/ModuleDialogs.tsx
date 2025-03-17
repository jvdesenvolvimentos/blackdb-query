
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ModuleForm from "./ModuleForm";
import { Module, ModuleFormValues } from "@/types/admin";

interface ModuleDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newModule: ModuleFormValues;
  setNewModule: React.Dispatch<React.SetStateAction<ModuleFormValues>>;
  currentModule: Module | null;
  setCurrentModule: React.Dispatch<React.SetStateAction<Module | null>>;
  handleAddModule: () => void;
  handleEditModule: () => void;
}

const ModuleDialogs: React.FC<ModuleDialogsProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  newModule,
  setNewModule,
  currentModule,
  setCurrentModule,
  handleAddModule,
  handleEditModule
}) => {
  return (
    <>
      {/* Add Module Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Módulo</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo módulo de consulta.
            </DialogDescription>
          </DialogHeader>
          <ModuleForm 
            moduleData={newModule} 
            setModuleData={setNewModule}
            isNewModule={true}
          />
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
            <>
              <ModuleForm 
                moduleData={currentModule as ModuleFormValues} 
                setModuleData={setCurrentModule as any}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditModule} disabled={!currentModule.name || !currentModule.description || !currentModule.apiUrl}>
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModuleDialogs;
