
import { useState } from "react";
import { Check, Zap, Shield, Rocket, Gem } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan, PlanType } from "@/types/client";

// Enhanced plans data with better names and features
const mockPlans: Plan[] = [
  {
    id: "plan-starter",
    type: "starter",
    name: "Starter",
    price: 49.90,
    credits: 100,
    durationDays: 30,
    features: [
      "100 créditos mensais",
      "Consultas básicas de CPF",
      "Validação de dados pessoais",
      "Suporte por email (24h)",
      "1 usuário"
    ]
  },
  {
    id: "plan-business",
    type: "business",
    name: "Business",
    price: 99.90,
    credits: 300,
    durationDays: 30,
    features: [
      "300 créditos mensais",
      "Todas as consultas do plano Starter",
      "Verificação de endereço",
      "Histórico financeiro simplificado",
      "Suporte prioritário",
      "Até 3 usuários",
      "Exportação de relatórios em PDF"
    ]
  },
  {
    id: "plan-enterprise",
    type: "enterprise",
    name: "Enterprise",
    price: 199.90,
    credits: 1000,
    durationDays: 30,
    features: [
      "1000 créditos mensais",
      "Todas as consultas do plano Business",
      "Score de crédito completo",
      "Análise de risco avançada",
      "Verificação de PEP e sanções",
      "API de integração",
      "Usuários ilimitados",
      "Suporte 24/7 com gerente dedicado",
      "Dashboard personalizado"
    ]
  }
];

interface PlanCardProps {
  plan: Plan;
  isActive: boolean;
  onSelect: () => void;
}

const PlanCard = ({ plan, isActive, onSelect }: PlanCardProps) => {
  // Function to get the appropriate icon based on plan type
  const getPlanIcon = (type: PlanType) => {
    switch (type) {
      case "starter":
        return <Shield className="h-5 w-5 text-blue-500" />;
      case "business":
        return <Rocket className="h-5 w-5 text-purple-500" />;
      case "enterprise":
        return <Gem className="h-5 w-5 text-amber-500" />;
      default:
        return <Zap className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className={`w-full transition-all duration-200 ${isActive ? 'border-primary bg-primary/5' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getPlanIcon(plan.type as PlanType)}
            <span>{plan.name}</span>
          </div>
          {isActive && <Check className="h-5 w-5 text-primary" />}
        </CardTitle>
        <CardDescription>
          <div className="text-2xl font-bold mt-2">
            R$ {plan.price.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">/mês</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{plan.credits} créditos</span>
          </div>
          <ul className="space-y-2 text-sm">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            variant={isActive ? "outline" : "default"} 
            className="w-full mt-4"
            onClick={onSelect}
          >
            {isActive ? "Plano atual" : "Selecionar plano"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PlanSelector = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(mockPlans[1]);
  const [billingCycle, setBillingCycle] = useState<string>("monthly");

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-2">Ciclo de Cobrança</h3>
        <Select value={billingCycle} onValueChange={setBillingCycle}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Selecione o ciclo de cobrança" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="quarterly">Trimestral (10% de desconto)</SelectItem>
            <SelectItem value="yearly">Anual (20% de desconto)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {mockPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isActive={selectedPlan.id === plan.id}
            onSelect={() => setSelectedPlan(plan)}
          />
        ))}
      </div>
    </div>
  );
};

export default PlanSelector;
