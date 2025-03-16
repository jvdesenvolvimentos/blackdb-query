
import MainLayout from "@/components/MainLayout";
import StatsOverview from "@/components/statistics/StatsOverview";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Download, Calendar } from "lucide-react";

const Statistics = () => {
  const [period, setPeriod] = useState("30d");

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Estatísticas</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select defaultValue={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="h-10">
            <Download className="mr-2 h-4 w-4" />
            Exportar relatório
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="modules">Por Módulo</TabsTrigger>
            <TabsTrigger value="usage">Uso de Créditos</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="mt-0">
          <StatsOverview />
        </TabsContent>
        
        <TabsContent value="modules" className="mt-0">
          <div className="flex-col md:flex-row flex items-center justify-center p-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Estatísticas detalhadas por módulo</h3>
              <p className="text-muted-foreground">Esta funcionalidade estará disponível em breve.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="mt-0">
          <div className="flex-col md:flex-row flex items-center justify-center p-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Estatísticas de uso de créditos</h3>
              <p className="text-muted-foreground">Esta funcionalidade estará disponível em breve.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Statistics;
