
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Plus, Search, CheckCircle, XCircle, Download, CopyIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  credits: number;
  status: "pending" | "completed" | "cancelled";
  paymentMethod: string;
  pixCode?: string;
  createdAt: Date;
}

const PaymentManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPixDialog, setShowPixDialog] = useState(false);
  const [currentPixCode, setCurrentPixCode] = useState("");
  
  // Mock payments data
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "pay-1",
      userId: "user-1",
      userName: "João Silva",
      amount: 50.00,
      credits: 100,
      status: "completed",
      paymentMethod: "pix",
      createdAt: new Date(2024, 4, 15)
    },
    {
      id: "pay-2",
      userId: "user-2",
      userName: "Maria Souza",
      amount: 25.00,
      credits: 50,
      status: "pending",
      paymentMethod: "pix",
      pixCode: "00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540510.005802BR5913Fulano de Tal6008Sao Paulo62070503***6304E2CA",
      createdAt: new Date(2024, 4, 17)
    },
    {
      id: "pay-3",
      userId: "user-3",
      userName: "Carlos Matos",
      amount: 100.00,
      credits: 200,
      status: "cancelled",
      paymentMethod: "pix",
      createdAt: new Date(2024, 4, 10)
    },
    {
      id: "pay-4",
      userId: "user-1",
      userName: "João Silva",
      amount: 75.00,
      credits: 150,
      status: "completed",
      paymentMethod: "pix",
      createdAt: new Date(2024, 4, 5)
    }
  ]);

  const [creditPackages, setCreditPackages] = useState([
    { id: "package-1", credits: 50, price: 25.00, active: true },
    { id: "package-2", credits: 100, price: 45.00, active: true },
    { id: "package-3", credits: 200, price: 80.00, active: true },
    { id: "package-4", credits: 500, price: 175.00, active: true }
  ]);

  const [newPackage, setNewPackage] = useState({
    credits: 0,
    price: 0
  });

  const [showAddPackageDialog, setShowAddPackageDialog] = useState(false);

  const filteredPayments = payments.filter(payment => 
    payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPackage = () => {
    if (newPackage.credits <= 0 || newPackage.price <= 0) {
      toast({
        title: "Erro",
        description: "Créditos e preço devem ser maiores que zero",
        variant: "destructive"
      });
      return;
    }

    setCreditPackages([
      ...creditPackages, 
      { 
        id: `package-${Date.now()}`, 
        credits: newPackage.credits, 
        price: newPackage.price,
        active: true 
      }
    ]);

    setNewPackage({ credits: 0, price: 0 });
    setShowAddPackageDialog(false);

    toast({
      title: "Pacote adicionado",
      description: `Pacote de ${newPackage.credits} créditos adicionado com sucesso.`
    });
  };

  const handleChangePackageStatus = (id: string, active: boolean) => {
    setCreditPackages(
      creditPackages.map(pkg => 
        pkg.id === id ? { ...pkg, active } : pkg
      )
    );

    toast({
      title: active ? "Pacote ativado" : "Pacote desativado",
      description: `O pacote foi ${active ? "ativado" : "desativado"} com sucesso.`
    });
  };

  const handleShowPixCode = (pixCode: string) => {
    setCurrentPixCode(pixCode);
    setShowPixDialog(true);
  };

  const handleUpdatePaymentStatus = (paymentId: string, status: "pending" | "completed" | "cancelled") => {
    setPayments(
      payments.map(payment => 
        payment.id === paymentId ? { ...payment, status } : payment
      )
    );

    const statusMessages = {
      pending: "pendente",
      completed: "confirmado",
      cancelled: "cancelado"
    };

    toast({
      title: "Status atualizado",
      description: `Pagamento marcado como ${statusMessages[status]}.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="packages">Pacotes de Crédito</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Histórico de Transações</CardTitle>
              <CardDescription>Gerencie e visualize pagamentos de créditos</CardDescription>
              <div className="flex w-full md:max-w-sm items-center space-x-2 mt-2">
                <Input 
                  placeholder="Buscar por nome ou ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="ghost" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Créditos</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.userName}</TableCell>
                        <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.credits}</TableCell>
                        <TableCell>{payment.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>{payment.paymentMethod === "pix" ? "PIX" : payment.paymentMethod}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {payment.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleUpdatePaymentStatus(payment.id, "completed")}>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleUpdatePaymentStatus(payment.id, "cancelled")}>
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                            {payment.status === "pending" && payment.pixCode && (
                              <Button variant="ghost" size="icon" onClick={() => handleShowPixCode(payment.pixCode || "")}>
                                <CopyIcon className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-bold">Pacotes de Crédito</CardTitle>
                <CardDescription>Configure os pacotes de crédito disponíveis para compra</CardDescription>
              </div>
              <Button onClick={() => setShowAddPackageDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pacote
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Créditos</TableHead>
                      <TableHead>Preço (R$)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.credits}</TableCell>
                        <TableCell>R$ {pkg.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {pkg.active ? (
                            <Badge className="bg-green-500">Ativo</Badge>
                          ) : (
                            <Badge className="bg-red-500">Inativo</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChangePackageStatus(pkg.id, !pkg.active)}
                          >
                            {pkg.active ? "Desativar" : "Ativar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for adding new credit package */}
      <Dialog open={showAddPackageDialog} onOpenChange={setShowAddPackageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Pacote de Créditos</DialogTitle>
            <DialogDescription>
              Configure os detalhes do novo pacote de créditos disponível para compra.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right">
                Créditos
              </Label>
              <Input
                id="credits"
                type="number"
                min="1"
                value={newPackage.credits}
                onChange={(e) => setNewPackage({ ...newPackage, credits: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Preço (R$)
              </Label>
              <Input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={newPackage.price}
                onChange={(e) => setNewPackage({ ...newPackage, price: parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPackageDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddPackage}>Adicionar Pacote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for PIX code */}
      <Dialog open={showPixDialog} onOpenChange={setShowPixDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Código PIX</DialogTitle>
            <DialogDescription>
              Copie o código PIX abaixo ou use o QR Code para pagamento.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md w-full overflow-auto">
              <code className="text-xs break-all">{currentPixCode}</code>
            </div>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(currentPixCode);
                toast({
                  title: "Código copiado",
                  description: "Código PIX copiado para a área de transferência",
                });
              }}
              className="w-full"
            >
              <CopyIcon className="h-4 w-4 mr-2" />
              Copiar código PIX
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentManagement;
