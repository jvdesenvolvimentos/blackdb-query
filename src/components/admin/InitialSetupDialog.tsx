import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Building, User, Database, CheckCircle2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SQLiteService from "@/services/SQLiteService";
import DatabaseSetupService from "@/services/DatabaseSetupService";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  platformName: z.string().min(3, "Nome da plataforma deve ter pelo menos 3 caracteres"),
  adminName: z.string().min(3, "Nome do administrador deve ter pelo menos 3 caracteres"),
  adminEmail: z.string().email("Email inválido"),
  adminPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  dbName: z.string().min(1, "Nome do banco de dados é obrigatório"),
  createTables: z.boolean().default(true),
  insertSampleData: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

const InitialSetupDialog = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("platform");
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [isCreatingTables, setIsCreatingTables] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const sqliteService = SQLiteService.getInstance();
  const dbSetupService = DatabaseSetupService.getInstance();
  
  useEffect(() => {
    const checkInitialSetupStatus = async () => {
      const hasCompletedSetup = localStorage.getItem("hasCompletedInitialSetup");
      
      if (hasCompletedSetup !== "true") {
        await sqliteService.connect();
        
        const isDbConfigured = await dbSetupService.isDatabaseConfigured();
        
        if (isDbConfigured) {
          localStorage.setItem("hasCompletedInitialSetup", "true");
          toast({
            title: "Sistema pronto",
            description: "O banco de dados já está configurado e pronto para uso."
          });
        } else {
          setIsOpen(true);
        }
      }
    };
    
    checkInitialSetupStatus();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformName: "ConsultaPro",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      dbName: "consultapro.db",
      createTables: true,
      insertSampleData: true
    },
  });

  const testDatabaseConnection = async () => {
    setIsTestingDb(true);
    setDbConnectionStatus('idle');
    
    try {
      const formValues = form.getValues();
      
      sqliteService.setConfig({
        database: formValues.dbName
      });
      
      const isConnected = await sqliteService.connect();
      
      if (isConnected) {
        setDbConnectionStatus('success');
        toast({
          title: "Conexão bem-sucedida",
          description: "A conexão com o banco de dados foi estabelecida com sucesso.",
        });
      } else {
        setDbConnectionStatus('error');
        toast({
          title: "Falha na conexão",
          description: "Não foi possível conectar ao banco de dados. Verifique as configurações.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      setDbConnectionStatus('error');
      toast({
        title: "Erro de conexão",
        description: "Ocorreu um erro ao tentar conectar ao banco de dados.",
        variant: "destructive",
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  const setupDatabaseTables = async () => {
    setIsCreatingTables(true);
    
    try {
      const isConnected = await sqliteService.connect();
      
      if (!isConnected) {
        toast({
          title: "Sem conexão",
          description: "É necessário estabelecer conexão com o banco antes de criar tabelas.",
          variant: "destructive",
        });
        setIsCreatingTables(false);
        return;
      }
      
      const createTables = form.getValues("createTables");
      const insertSampleData = form.getValues("insertSampleData");
      
      if (createTables) {
        const success = await dbSetupService.setupDatabase();
        
        if (success) {
          toast({
            title: "Sucesso",
            description: "As tabelas foram criadas com sucesso no banco de dados.",
          });
          
          if (insertSampleData) {
            const dataSuccess = await dbSetupService.insertSampleData();
            
            if (dataSuccess) {
              toast({
                title: "Dados inseridos",
                description: "Os dados de exemplo foram inseridos com sucesso.",
              });
            } else {
              toast({
                title: "Aviso",
                description: "Não foi possível inserir os dados de exemplo.",
                variant: "default",
              });
            }
          }
        } else {
          toast({
            title: "Erro",
            description: "Houve um problema ao criar as tabelas no banco de dados.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao configurar banco de dados:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao configurar o banco de dados.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingTables(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    sqliteService.setConfig({
      database: data.dbName
    });
    
    const isConnected = await sqliteService.connect();
    
    if (!isConnected) {
      toast({
        title: "Aviso de conexão",
        description: "Não foi possível conectar ao banco de dados. O sistema usará dados locais.",
        variant: "default",
      });
    } else if (data.createTables) {
      await setupDatabaseTables();
    }
    
    localStorage.setItem("platformName", data.platformName);
    localStorage.setItem("adminUser", JSON.stringify({
      name: data.adminName,
      email: data.adminEmail,
      role: "admin",
    }));
    
    localStorage.setItem("dbConfig", JSON.stringify({
      database: data.dbName
    }));
    
    localStorage.setItem("hasCompletedInitialSetup", "true");
    
    setIsOpen(false);
    
    toast({
      title: "Configuração inicial concluída",
      description: "As configurações da plataforma foram salvas com sucesso.",
    });
    
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bem-vindo à plataforma</DialogTitle>
          <DialogDescription>
            Configure as informações iniciais para começar a usar o sistema.
            Esta configuração só estará disponível uma vez.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Tabs defaultValue="platform" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="platform">Plataforma</TabsTrigger>
                <TabsTrigger value="database">Banco de Dados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="platform">
                <div className="space-y-4 mt-4">
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
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setActiveTab("database")}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="database">
                <div className="space-y-4 mt-4">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Database className="mr-2 h-5 w-5" />
                      Configuração do Banco de Dados SQLite
                    </h3>
                    
                    <FormDescription className="mb-4">
                      Configure o banco de dados SQLite local. O banco será armazenado no navegador e persistido entre sessões.
                    </FormDescription>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="dbName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Banco</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="consultapro.db" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={testDatabaseConnection}
                          disabled={isTestingDb}
                          className="relative"
                        >
                          {isTestingDb ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                              Testando...
                            </>
                          ) : (
                            <>
                              {dbConnectionStatus === 'success' && (
                                <CheckCircle2 className="w-4 h-4 text-green-500 absolute -top-1 -right-1" />
                              )}
                              {dbConnectionStatus === 'error' && (
                                <AlertCircle className="w-4 h-4 text-red-500 absolute -top-1 -right-1" />
                              )}
                              Testar Conexão
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <FormField
                        control={form.control}
                        name="createTables"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Criar tabelas automaticamente
                              </FormLabel>
                              <FormDescription>
                                Cria as tabelas necessárias para o funcionamento do sistema.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="insertSampleData"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!form.getValues("createTables")}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Inserir dados de exemplo
                              </FormLabel>
                              <FormDescription>
                                Popula o banco com dados de exemplo para facilitar os testes.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={setupDatabaseTables}
                          disabled={isCreatingTables || dbConnectionStatus !== 'success' || !form.getValues("createTables")}
                        >
                          {isCreatingTables ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                              Configurando...
                            </>
                          ) : "Configurar Banco Agora"}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab("platform")}
                    >
                      Voltar
                    </Button>
                    
                    <Button type="submit">
                      Concluir configuração
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialSetupDialog;
