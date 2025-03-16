
import { useState } from "react";
import { Check, Zap } from "lucide-react";
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

// Mock plans data
const mockPlans: Plan[] = [
  {
    id: "plan-basic",
    type: "basic",
    name: "Básico",
    price: 49.90,
    credits: 100,
    durationDays: 30,
    features: [
      "100 créditos por mês",
      "Acesso ao módulo pessoal",
      "Acesso ao módulo de endereço",
      "Suporte por email"
    ]
  },
  {
    id: "plan-standard",
    type: "standard",
    name: "Padrão",
    price: 99.90,
    credits: 300,
    durationDays: 30,
    features: [
      "300 créditos por mês",
      "Todos os módulos do plano Básico",
      "Acesso ao módulo financeiro",
      "Acesso ao módulo de trabalho",
      "Suporte prioritário"
    ]
  },
  {
    id: "plan-premium",
    type: "premium",
    name: "Premium",
    price: 199.90,
    credits: 1000,
    durationDays: 30,
    features: [
      "1000 créditos por mês",
      "Todos os módulos do plano Padrão",
      "Acesso ao módulo de crédito",
      "Suporte 24/7",
      "API de integração",
      "Relatórios avançados"
    ]
  }
];

interface PlanCardProps {
  plan: Plan;
  isActive: boolean;
  onSelect: () => void;
}

const PlanCard = ({ plan, isActive, onSelect }: PlanCardProps) => {
  return (
    <Card className={`w-full transition-all duration-200 ${isActive ? 'border-primary bg-primary/5' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{plan.name}</span>
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
