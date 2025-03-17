
import { Module } from "@/types/admin";

export const saveModulesToLocalStorage = (modulesToSave: Module[]) => {
  // Converter os módulos para o formato de apiEndpoints
  const apiEndpoints = modulesToSave.map(module => ({
    id: module.type,
    name: module.name,
    description: module.description,
    enabled: module.enabled,
    apiUrl: module.apiUrl
  }));
  
  localStorage.setItem('apiEndpoints', JSON.stringify(apiEndpoints));
  
  return apiEndpoints;
};

export const getMockModules = (): Module[] => {
  return [
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
};
