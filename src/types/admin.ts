
import { ModuleType } from "./client";

export interface Module {
  id: string;
  type: ModuleType;
  name: string;
  description: string;
  creditCost: number;
  enabled: boolean;
  icon: string;
  apiUrl: string;
}

export interface ModuleFormValues {
  id: string;
  type: ModuleType;
  name: string;
  description: string;
  creditCost: number;
  enabled: boolean;
  icon: string;
  apiUrl: string;
}

export interface AdminUser {
  id?: number;
  name: string;
  email: string;
  role: string;
}

export interface SidebarProps {
  platformName?: string;
}
