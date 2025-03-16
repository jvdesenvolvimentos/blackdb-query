
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { ResponsiveBar, BarTooltipProps } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ModuleType, ConsultationStats } from "@/types/client";
import { Users, Search, Calendar, Clock } from "lucide-react";

// Mock data for demonstration
const mockStats: ConsultationStats = {
  totalConsultations: 342,
  moduleBreakdown: {
    personal: 120,
    financial: 87,
    address: 65,
    work: 45,
    credit: 25
  },
  dailyUsage: [
    { date: "2023-09-01", count: 10 },
    { date: "2023-09-02", count: 15 },
    { date: "2023-09-03", count: 8 },
    { date: "2023-09-04", count: 12 },
    { date: "2023-09-05", count: 20 },
    { date: "2023-09-06", count: 18 },
    { date: "2023-09-07", count: 14 }
  ]
};

const moduleColors: Record<ModuleType, string> = {
  personal: "#2563eb",
  financial: "#16a34a",
  address: "#d97706",
  work: "#9333ea",
  credit: "#dc2626"
};

const moduleNames: Record<ModuleType, string> = {
  personal: "Pessoal",
  financial: "Financeiro",
  address: "Endereço",
  work: "Trabalho",
  credit: "Crédito"
};

const StatsOverview = () => {
  const [stats, setStats] = useState<ConsultationStats>(mockStats);

  useEffect(() => {
    // In a real app, you would fetch stats from your API
    // For now, we'll use the mock data
  }, []);

  const barData = Object.entries(stats.moduleBreakdown).map(([key, value]) => ({
    module: moduleNames[key as ModuleType],
    count: value,
    color: moduleColors[key as ModuleType]
  }));

  const lineData = [
    {
      id: "consultations",
      data: stats.dailyUsage.map((item) => ({
        x: item.date,
        y: item.count
      }))
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Consultas
          </CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalConsultations}</div>
          <p className="text-xs text-muted-foreground">
            +20.1% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Consultas Hoje
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+24</div>
          <p className="text-xs text-muted-foreground">
            +10% em relação a ontem
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Usuários Ativos
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            +2 novos usuários hoje
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tempo Médio
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2m 45s</div>
          <p className="text-xs text-muted-foreground">
            -12s em relação à semana anterior
          </p>
        </CardContent>
      </Card>
      
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Consultas por Módulo</CardTitle>
          <CardDescription>
            Distribuição de consultas entre os módulos do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-80 w-full">
            <ResponsiveBar
              data={barData}
              keys={["count"]}
              indexBy="module"
              margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              colors={({ data }) => data.color}
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              animate={true}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: "#888888"
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: "#333333"
                  }
                },
                legends: {
                  text: {
                    fill: "#888888"
                  }
                },
                tooltip: {
                  container: {
                    background: "#1a1a1a",
                    color: "#ffffff",
                    fontSize: 12
                  }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Histórico de Uso</CardTitle>
          <CardDescription>
            Número de consultas ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-80 w-full">
            <ResponsiveLine
              data={lineData}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false
              }}
              curve="cardinal"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Data",
                legendOffset: 36,
                legendPosition: "middle"
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Consultas",
                legendOffset: -40,
                legendPosition: "middle"
              }}
              colors={{ scheme: "category10" }}
              pointSize={10}
              pointColor={{ theme: "background" }}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointLabel="y"
              pointLabelYOffset={-12}
              useMesh={true}
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: "#888888"
                    }
                  },
                  legend: {
                    text: {
                      fill: "#888888"
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: "#333333"
                  }
                },
                tooltip: {
                  container: {
                    background: "#1a1a1a",
                    color: "#ffffff",
                    fontSize: 12
                  }
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
