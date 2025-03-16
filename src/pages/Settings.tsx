
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import PlanSelector from "@/components/settings/PlanSelector";
import ModuleConfig from "@/components/settings/ModuleConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard, CircleDollarSign, Package, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const [creditsRemaining, setCreditsRemaining] = useState(164);
  const [totalCredits, setTotalCredits] = useState(300);
  const [daysRemaining, setDaysRemaining] = useState(14);
  const [currentPlan, setCurrentPlan] = useState("Padrão");

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <Button variant="outline">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Preferências Gerais
        </Button>
      </div>

      <div className="mb-8">
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resumo do Plano</span>
              <Badge variant="outline" className="ml-2 py-1">
                Plano {currentPlan}
              </Badge>
            </CardTitle>
            <CardDescription>
              Seu plano renova em {daysRemaining} dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Créditos</span>
                  <span className="font-medium">{creditsRemaining} de {totalCredits}</span>
                </div>
                <Progress value={(creditsRemaining / totalCredits) * 100} />
              </div>
              
              <div className="flex flex-col justify-center space-y-2 md:items-end">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8">
                    <CircleDollarSign className="h-3.5 w-3.5 mr-1" />
                    Comprar créditos
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    <Package className="h-3.5 w-3.5 mr-1" />
                    Mudar plano
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Método de pagamento atual
            </div>
            <div className="flex items-center text-xs">
              <CreditCard className="h-3 w-3 mr-1" />
              •••• •••• •••• 4242
            </div>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="modules">Módulos de Consulta</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="mt-6">
          <ModuleConfig />
        </TabsContent>
        
        <TabsContent value="plans" className="mt-6">
          <PlanSelector />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
