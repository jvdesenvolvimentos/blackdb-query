
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Mail, User, UserPlus, Loader2, Database, Search, Shield, Zap, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AuthService from "@/services/AuthService";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const authService = AuthService.getInstance();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await authService.register({
        name,
        email,
        password
      });
      
      if (result.success) {
        toast({
          title: "Registro bem-sucedido",
          description: "Sua conta foi criada com sucesso.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Erro no registro",
          description: result.message || "Não foi possível criar sua conta.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro durante registro:", error);
      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro ao processar seu registro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-background to-primary/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_75%,theme(colors.secondary/0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,theme(colors.primary/0.1),transparent_50%)]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-16 right-12 opacity-20 animate-pulse">
        <Database className="w-8 h-8 text-secondary" />
      </div>
      <div className="absolute top-40 left-16 opacity-20 animate-pulse delay-1000">
        <Search className="w-6 h-6 text-primary" />
      </div>
      <div className="absolute bottom-40 right-16 opacity-20 animate-pulse delay-2000">
        <Shield className="w-7 h-7 text-secondary" />
      </div>
      <div className="absolute bottom-16 left-12 opacity-20 animate-pulse delay-500">
        <Zap className="w-5 h-5 text-primary" />
      </div>

      <div className="w-full max-w-lg space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-secondary via-secondary/80 to-primary rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-secondary/25">
              <div className="w-16 h-16 bg-gradient-to-br from-background/90 to-background/70 rounded-xl flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-secondary" />
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent tracking-tight">
              Junte-se ao ConsultaPro
            </h1>
            <p className="text-lg font-medium text-foreground/90">Crie sua conta gratuita</p>
            <p className="text-muted-foreground">Acesso completo à plataforma de consultas inteligentes</p>
          </div>
        </div>

        {/* Register Card */}
        <Card className="border-0 shadow-2xl shadow-secondary/10 bg-background/95 backdrop-blur-sm animate-scale-in">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <User className="w-4 h-4 text-secondary" />
                    <span>Nome completo</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Input
                      type="text"
                      placeholder="Como você gostaria de ser chamado"
                      className="relative h-14 pl-6 pr-4 bg-background/80 border-2 border-muted hover:border-secondary/50 focus:border-secondary text-base transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-secondary/10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-secondary" />
                    <span>Email profissional</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Input
                      type="email"
                      placeholder="exemplo@suaempresa.com"
                      className="relative h-14 pl-6 pr-4 bg-background/80 border-2 border-muted hover:border-secondary/50 focus:border-secondary text-base transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-secondary/10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-secondary" />
                    <span>Senha segura</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      className="relative h-14 pl-6 pr-4 bg-background/80 border-2 border-muted hover:border-secondary/50 focus:border-secondary text-base transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-secondary/10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    <span>Confirmar senha</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      className="relative h-14 pl-6 pr-4 bg-background/80 border-2 border-muted hover:border-secondary/50 focus:border-secondary text-base transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-secondary/10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-secondary via-secondary/90 to-primary hover:from-secondary/90 hover:via-secondary hover:to-primary/90 text-secondary-foreground font-semibold text-base transition-all duration-300 hover:shadow-xl hover:shadow-secondary/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Criando sua conta...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <UserPlus className="h-5 w-5" />
                      <span>Criar Conta Gratuita</span>
                      <div className="ml-2 w-2 h-2 bg-background/30 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    🛡️ Seus dados estão protegidos por criptografia avançada
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
              <span>Acesso Completo</span>
            </div>
            <div className="flex items-center space-x-1">
              <Search className="w-3 h-3" />
              <span>Consultas Ilimitadas</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>100% Seguro</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-transparent via-muted to-transparent h-px w-full"></div>
          
          <p className="text-sm text-muted-foreground">
            Já possui uma conta?{" "}
            <Link 
              to="/login" 
              className="font-semibold text-secondary hover:text-primary transition-all duration-200 hover:underline underline-offset-4 decoration-2 decoration-secondary/30 hover:decoration-primary/50"
            >
              Fazer login agora →
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

export default Register;
