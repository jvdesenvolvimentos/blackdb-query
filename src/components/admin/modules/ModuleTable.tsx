
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import ModuleIcon from "./ModuleIcon";
import { Module } from "@/types/admin";

interface ModuleTableProps {
  modules: Module[];
  onEditModule: (module: Module) => void;
  onToggleStatus: (moduleId: string) => void;
}

const ModuleTable: React.FC<ModuleTableProps> = ({ 
  modules, 
  onEditModule, 
  onToggleStatus 
}) => {
  return (
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
                  <ModuleIcon iconName={module.icon} />
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
                    onCheckedChange={() => onToggleStatus(module.id)}
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
                  onClick={() => onEditModule(module)}
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
  );
};

export default ModuleTable;
