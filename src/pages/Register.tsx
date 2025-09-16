
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Mail, User, UserPlus, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Criar Conta</h1>
          <p className="text-muted-foreground">Preencha os dados abaixo para começar</p>
        </div>

        {/* Register Card */}
        <Card className="border-0 shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nome completo</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="text"
                      placeholder="Seu nome completo"
                      className="pl-10 h-12 transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-primary/20"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirmar senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 transition-all duration-200 group-focus-within:ring-2 group-focus-within:ring-primary/20"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Criar conta</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </form>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link 
              to="/login" 
              className="font-medium text-primary hover:text-primary/80 transition-colors hover:underline"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
