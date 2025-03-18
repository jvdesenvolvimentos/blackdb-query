
export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate: string;
  address?: string;
  status: ClientStatus;
}

export type PlanType = "starter" | "business" | "enterprise";

export interface Plan {
  id: string;
  type: PlanType;
  name: string;
  price: number;
  credits: number;
  durationDays: number;
  features: string[];
}

export type ModuleType = "personal" | "financial" | "address" | "work" | "credit";

export interface ConsultationModule {
  id: string;
  type: ModuleType;
  name: string;
  description: string;
  creditCost: number;
  enabled: boolean;
  icon: string;
  apiUrl?: string;
}

export interface UserPlan {
  planId: string;
  startDate: string;
  endDate: string;
  creditsRemaining: number;
}

export interface ConsultationStats {
  totalConsultations: number;
  moduleBreakdown: Record<ModuleType, number>;
  dailyUsage: Array<{date: string, count: number}>;
}
