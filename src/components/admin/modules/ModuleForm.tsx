
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ModuleFormValues } from "@/types/admin";
import { ModuleType } from "@/types/client";

interface ModuleFormProps {
  moduleData: ModuleFormValues;
  setModuleData: React.Dispatch<React.SetStateAction<ModuleFormValues>>;
  isNewModule?: boolean;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ 
  moduleData, 
  setModuleData, 
  isNewModule = false 
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome do Módulo
        </label>
        <Input
          id="name"
          value={moduleData.name}
          onChange={(e) => setModuleData({ ...moduleData, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição
        </label>
        <Textarea
          id="description"
          value={moduleData.description}
          onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="type" className="text-sm font-medium">
          Tipo
        </label>
        <select
          id="type"
          value={moduleData.type}
          onChange={(e) => setModuleData({ ...moduleData, type: e.target.value as ModuleType })}
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
          value={moduleData.icon}
          onChange={(e) => setModuleData({ ...moduleData, icon: e.target.value })}
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
          value={moduleData.creditCost}
          onChange={(e) => setModuleData({ ...moduleData, creditCost: parseInt(e.target.value) || 1 })}
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
          value={moduleData.apiUrl}
          onChange={(e) => setModuleData({ ...moduleData, apiUrl: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={moduleData.enabled}
          onCheckedChange={(value) => setModuleData({ ...moduleData, enabled: value })}
        />
        <label htmlFor="status" className="text-sm font-medium">
          Módulo Ativo
        </label>
      </div>
    </div>
  );
};

export default ModuleForm;
