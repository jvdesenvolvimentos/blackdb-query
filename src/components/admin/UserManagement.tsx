
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, User, UserX, Edit, ShieldCheck, Mail, Key, Check, X } from "lucide-react";
import UserService from "@/services/UserService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  status: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user", credits: 0, status: true });
  const { toast } = useToast();
  const userService = UserService.getInstance();

  // Carregar usuários ao montar o componente
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const loadedUsers = await userService.getAllUsers();
        setUsers(loadedUsers);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os usuários.",
          variant: "destructive",
        });
        
        // Em caso de erro, usar dados de exemplo
        setUsers([
          { id: "1", name: "João Silva", email: "joao@example.com", role: "user", credits: 15, status: true },
          { id: "2", name: "Maria Oliveira", email: "maria@example.com", role: "admin", credits: 100, status: true },
          { id: "3", name: "Pedro Santos", email: "pedro@example.com", role: "user", credits: 0, status: false },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    try {
      // Adicionar o novo usuário via serviço
      const success = await userService.createUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        credits: newUser.credits,
        status: newUser.status
      });
      
      if (success) {
        // Para fins de demonstração, adicionamos manualmente ao estado
        const newUserId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString();
        const userToAdd = { ...newUser, id: newUserId } as User;
        setUsers([...users, userToAdd]);
        
        setNewUser({ name: "", email: "", password: "", role: "user", credits: 0, status: true });
        setIsAddDialogOpen(false);
        
        toast({
          title: "Usuário adicionado",
          description: `${newUser.name} foi adicionado com sucesso.`
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o usuário.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o usuário.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async () => {
    if (currentUser) {
      try {
        // Atualizar o usuário via serviço
        const success = await userService.updateUser(currentUser);
        
        if (success) {
          // Atualizar o estado local
          setUsers(users.map(user => 
            user.id === currentUser.id ? currentUser : user
          ));
          
          setIsEditDialogOpen(false);
          
          toast({
            title: "Usuário atualizado",
            description: `${currentUser.name} foi atualizado com sucesso.`
          });
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível atualizar o usuário.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao atualizar o usuário.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      // Alternar o status do usuário via serviço
      const success = await userService.toggleUserStatus(userId);
      
      if (success) {
        // Atualizar o estado local
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: !user.status } : user
        ));
        
        const user = users.find(u => u.id === userId);
        const status = user?.status ? "desativado" : "ativado";
        
        toast({
          title: `Usuário ${status}`,
          description: `${user?.name} foi ${status} com sucesso.`
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível alterar o status do usuário.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao alterar status do usuário:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar o status do usuário.",
        variant: "destructive",
      });
    }
  };

  const addCredits = async (userId: string, amount: number) => {
    try {
      // Adicionar créditos ao usuário via serviço
      const success = await userService.addUserCredits(userId, amount);
      
      if (success) {
        // Atualizar o estado local
        setUsers(users.map(user => 
          user.id === userId ? { ...user, credits: user.credits + amount } : user
        ));
        
        const user = users.find(u => u.id === userId);
        
        toast({
          title: "Créditos adicionados",
          description: `${amount} créditos foram adicionados para ${user?.name}.`
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível adicionar créditos ao usuário.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar créditos:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar créditos ao usuário.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Gerenciamento de Usuários</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24">
                      <div className="flex justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {user.role === "admin" ? (
                              <ShieldCheck className="h-4 w-4 text-blue-500" />
                            ) : (
                              <User className="h-4 w-4 text-gray-500" />
                            )}
                            {user.role === "admin" ? "Administrador" : "Usuário"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.credits}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={() => addCredits(user.id, 10)}
                            >
                              +10
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={user.status} 
                              onCheckedChange={() => toggleUserStatus(user.id)}
                            />
                            <span className={user.status ? "text-green-500" : "text-red-500"}>
                              {user.status ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nenhum usuário encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo usuário abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome
              </label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Função
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="credits" className="text-sm font-medium">
                Créditos Iniciais
              </label>
              <Input
                id="credits"
                type="number"
                value={newUser.credits}
                onChange={(e) => setNewUser({ ...newUser, credits: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={newUser.status}
                onCheckedChange={(value) => setNewUser({ ...newUser, status: value })}
              />
              <label htmlFor="status" className="text-sm font-medium">
                Usuário Ativo
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email || !newUser.password}>
              Adicionar Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Modifique os detalhes do usuário abaixo.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="edit-name"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-role" className="text-sm font-medium">
                  Função
                </label>
                <select
                  id="edit-role"
                  value={currentUser.role}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-credits" className="text-sm font-medium">
                  Créditos
                </label>
                <Input
                  id="edit-credits"
                  type="number"
                  value={currentUser.credits}
                  onChange={(e) => setCurrentUser({ ...currentUser, credits: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-status"
                  checked={currentUser.status}
                  onCheckedChange={(value) => setCurrentUser({ ...currentUser, status: value })}
                />
                <label htmlFor="edit-status" className="text-sm font-medium">
                  Usuário Ativo
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
