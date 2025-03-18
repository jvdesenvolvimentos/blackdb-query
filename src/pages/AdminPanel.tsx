
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import PageTitle from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/admin/UserManagement";
import ModuleManagement from "@/components/admin/ModuleManagement";
import ApiConfiguration from "@/components/admin/ApiConfiguration";
import AdminStats from "@/components/admin/AdminStats";
import PaymentManagement from "@/components/admin/PaymentManagement";
import InitialSetupDialog from "@/components/admin/InitialSetupDialog";
import { usePlatformConfig } from "@/hooks/usePlatformConfig";
import { Shield, Users, BarChart3, Layers, Settings, CreditCard } from "lucide-react";

const AdminPanel = () => {
  const { platformName } = usePlatformConfig();

  return (
    <MainLayout>
      <PageTitle 
        title={`Painel Administrativo - ${platformName}`} 
        description="Gerencie usuários, módulos, configurações de API e visualize estatísticas"
        className="mb-6"
      />
      
      <InitialSetupDialog />
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="w-full md:w-auto mb-6 overflow-x-auto flex-nowrap">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Módulos</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Pagamentos</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Estatísticas</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-0">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="modules" className="mt-0">
          <ModuleManagement />
        </TabsContent>
        
        <TabsContent value="api" className="mt-0">
          <ApiConfiguration />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-0">
          <PaymentManagement />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          <AdminStats />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default AdminPanel;
