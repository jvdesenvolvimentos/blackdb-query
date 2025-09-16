
import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, LogIn, Loader2, Database, Search, Shield, Zap } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,theme(colors.primary/0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,theme(colors.secondary/0.1),transparent_50%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-20 animate-pulse">
        <Database className="w-8 h-8 text-primary" />
      </div>
      <div className="absolute top-32 right-16 opacity-20 animate-pulse delay-1000">
        <Search className="w-6 h-6 text-secondary" />
      </div>
      <div className="absolute bottom-32 left-20 opacity-20 animate-pulse delay-2000">
        <Shield className="w-7 h-7 text-primary" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-20 animate-pulse delay-500">
        <Zap className="w-5 h-5 text-secondary" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary via-primary/80 to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/25">
              <div className="w-16 h-16 bg-gradient-to-br from-background/90 to-background/70 rounded-xl flex items-center justify-center">
                <Database className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-secondary to-primary rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent tracking-tight">
              ConsultaPro
            </h1>
            <p className="text-lg font-medium text-foreground/90">Bem-vindo de volta</p>
            <p className="text-muted-foreground">Acesse sua plataforma de consultas inteligentes</p>
          </div>
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
        <Card className="border-0 shadow-2xl shadow-primary/10 bg-background/95 backdrop-blur-sm animate-scale-in">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Email de acesso</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Input
                      type="email"
                      placeholder="exemplo@consultapro.com"
                      className="relative h-14 pl-6 pr-4 bg-background/80 border-2 border-muted hover:border-primary/50 focus:border-primary text-base transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-primary/10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Senha segura</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      className="relative h-14 pl-6 pr-4 bg-background/80 border-2 border-muted hover:border-primary/50 focus:border-primary text-base transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-primary/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:via-primary hover:to-secondary/90 text-primary-foreground font-semibold text-base transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                  disabled={isLoading || !dbConnected}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Acessando plataforma...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5" />
                      <span>Acessar ConsultaPro</span>
                      <div className="ml-2 w-2 h-2 bg-background/30 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    🔒 Conexão segura e criptografada
                  </p>
                </div>
              </div>
            </CardContent>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4 animate-fade-in delay-300">
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Database className="w-3 h-3" />
              <span>Dados Seguros</span>
            </div>
            <div className="flex items-center space-x-1">
              <Search className="w-3 h-3" />
              <span>Consultas Rápidas</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Alta Performance</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-transparent via-muted to-transparent h-px w-full"></div>
          
          <p className="text-sm text-muted-foreground">
            Não possui acesso ainda?{" "}
            <Link 
              to="/register" 
              className="font-semibold text-primary hover:text-secondary transition-all duration-200 hover:underline underline-offset-4 decoration-2 decoration-primary/30 hover:decoration-secondary/50"
            >
              Solicitar conta gratuita →
            </Link>
          </p>
          
          <p className="text-xs text-muted-foreground/70">
            © 2024 ConsultaPro - Plataforma de Consultas Inteligentes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

