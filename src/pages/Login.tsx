
import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
          {isDbConnecting && (
            <div className="flex items-center justify-center space-x-2 text-sm text-blue-500">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Inicializando o banco de dados SQLite...</span>
            </div>
          )}
          {!isDbConnecting && !dbConnected && (
            <div className="text-sm text-yellow-500">
              Erro: Não foi possível inicializar o banco de dados SQLite
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Senha"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  <span>Entrando...</span>
                </div>
              ) : "Entrar"}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Registre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;

