
import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AuthService from "@/services/AuthService";
import SQLiteService from "@/services/SQLiteService";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDbConnecting, setIsDbConnecting] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const authService = AuthService.getInstance();
  const sqliteService = SQLiteService.getInstance();

  // Try to connect to the database on component load
  useEffect(() => {
    const connectToDatabase = async () => {
      setIsDbConnecting(true);
      try {
        const connected = await sqliteService.connect();
        setDbConnected(connected);
        
        if (connected) {
          toast({
            title: "Conexão estabelecida",
            description: "Conexão com o banco de dados realizada com sucesso.",
          });
        } else {
          toast({
            title: "Erro de conexão",
            description: "Não foi possível inicializar o banco de dados SQLite.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        setDbConnected(false);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível inicializar o banco de dados SQLite.",
          variant: "destructive",
        });
      } finally {
        setIsDbConnecting(false);
      }
    };

    connectToDatabase();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await authService.login({ email, password });
      
      if (result.success && result.user) {
        authService.saveCurrentUser(result.user);
        onLogin();
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso.",
        });
        navigate('/modules');
      } else {
        toast({
          title: "Erro de autenticação",
          description: result.message || "Por favor, verifique suas credenciais.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro durante login:", error);
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro durante a tentativa de login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">Entre com suas credenciais para continuar</p>
        </div>

        {/* Database Status */}
        {isDbConnecting && (
          <div className="flex items-center justify-center space-x-2 text-sm text-primary bg-primary/5 rounded-lg p-3 border">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Inicializando o banco de dados...</span>
          </div>
        )}
        {!isDbConnecting && !dbConnected && (
          <div className="flex items-center justify-center space-x-2 text-sm text-destructive bg-destructive/5 rounded-lg p-3 border border-destructive/20">
            <span>⚠️ Erro na inicialização do banco de dados</span>
          </div>
        )}

        {/* Login Card */}
        <Card className="border-0 shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 h-12 transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-primary/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-primary/20"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                disabled={isLoading || !dbConnected}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Entrar</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link 
              to="/register" 
              className="font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
            >
              Criar conta gratuita
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

