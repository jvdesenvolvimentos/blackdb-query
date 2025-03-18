
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Building, User } from "lucide-react";

// Definir esquema de validação
const formSchema = z.object({
  platformName: z.string().min(3, "Nome da plataforma deve ter pelo menos 3 caracteres"),
  adminName: z.string().min(3, "Nome do administrador deve ter pelo menos 3 caracteres"),
  adminEmail: z.string().email("Email inválido"),
  adminPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

const InitialSetupDialog = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Verificar se é a primeira vez que o usuário acessa
  useEffect(() => {
    const hasCompletedSetup = localStorage.getItem("hasCompletedInitialSetup");
    if (hasCompletedSetup !== "true") {
      setIsOpen(true);
    }
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformName: "ConsultaPro",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Salvar os dados na localStorage
    localStorage.setItem("platformName", data.platformName);
    localStorage.setItem("adminUser", JSON.stringify({
      name: data.adminName,
      email: data.adminEmail,
      role: "admin",
    }));
    
    // Marcar configuração como concluída
    localStorage.setItem("hasCompletedInitialSetup", "true");
    
    // Fechar o diálogo
    setIsOpen(false);
    
    // Mostrar mensagem de sucesso
    toast({
      title: "Configuração inicial concluída",
      description: "As configurações da plataforma foram salvas com sucesso.",
    });
    
    // Forçar um reload da página para aplicar as mudanças
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bem-vindo à plataforma</DialogTitle>
          <DialogDescription>
            Configure as informações iniciais para começar a usar o sistema.
            Esta configuração só estará disponível uma vez.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Informações da Plataforma
              </h3>
              
              <FormField
                control={form.control}
                name="platformName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da plataforma</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ConsultaPro" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Usuário Administrador
              </h3>
              
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do administrador</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="João Silva" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="admin@exemplo.com" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adminPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="******" type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Concluir configuração
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialSetupDialog;
