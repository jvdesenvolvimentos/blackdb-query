
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Download, BarChart3, PieChart, Users, Search, Calendar, TrendingUp, Cpu } from "lucide-react";
import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, Line, Tooltip, Legend, CartesianGrid } from "recharts";

// Mock data for charts
const usageData = [
  { name: "Segunda", consultas: 15, creditos: 45 },
  { name: "Terça", consultas: 20, creditos: 60 },
  { name: "Quarta", consultas: 35, creditos: 105 },
  { name: "Quinta", consultas: 25, creditos: 75 },
  { name: "Sexta", consultas: 30, creditos: 90 },
  { name: "Sábado", consultas: 10, creditos: 30 },
  { name: "Domingo", consultas: 5, creditos: 15 },
];

const moduleUsageData = [
  { name: "Dados Pessoais", consultas: 55, creditos: 55 },
  { name: "Dados Financeiros", consultas: 25, creditos: 125 },
  { name: "Endereço", consultas: 35, creditos: 70 },
  { name: "Profissional", consultas: 20, creditos: 60 },
  { name: "Crédito", consultas: 5, creditos: 50 },
];

// Mock data for recent activities
const recentActivities = [
  { id: 1, user: "João Silva", action: "Consulta de CPF", module: "Dados Pessoais", date: "2023-06-12 14:30", credits: 1 },
  { id: 2, user: "Maria Oliveira", action: "Consulta de Dados Financeiros", module: "Dados Financeiros", date: "2023-06-12 13:45", credits: 5 },
  { id: 3, user: "Pedro Santos", action: "Consulta de Endereço", module: "Endereço", date: "2023-06-12 12:20", credits: 2 },
  { id: 4, user: "Ana Pereira", action: "Consulta de Histórico Profissional", module: "Profissional", date: "2023-06-12 11:15", credits: 3 },
  { id: 5, user: "Carlos Rodrigues", action: "Consulta de Score de Crédito", module: "Crédito", date: "2023-06-11 16:40", credits: 10 },
  { id: 6, user: "João Silva", action: "Consulta de CPF", module: "Dados Pessoais", date: "2023-06-11 15:30", credits: 1 },
  { id: 7, user: "Maria Oliveira", action: "Consulta de Dados Financeiros", module: "Dados Financeiros", date: "2023-06-11 14:25", credits: 5 },
];

const AdminStats = () => {
  const [period, setPeriod] = useState("7d");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Select defaultValue={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full md:w-[180px]">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">140</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12%</span> este período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Consumidos</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">420</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+8%</span> este período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+2</span> novos este período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Módulos Ativos</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              De um total de 5 módulos
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Uso</span>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Módulos</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Atividades</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uso por Dia da Semana</CardTitle>
              <CardDescription>
                Resumo das consultas e créditos utilizados nos últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="consultas" name="Consultas" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="creditos" name="Créditos" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Uso por Módulo</CardTitle>
              <CardDescription>
                Distribuição de consultas e créditos por tipo de módulo
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moduleUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="consultas" name="Consultas" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="creditos" name="Créditos" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas atividades e consultas realizadas na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Créditos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.user}</TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.module}</TableCell>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>{activity.credits}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStats;
