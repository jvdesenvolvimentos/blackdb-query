
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Lock, Search, ShieldCheck, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-slate-900">
      {/* Navbar */}
      <header className="container mx-auto py-4 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">BlackDB</span>
        </div>
        <div className="flex space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-primary hover:bg-primary/90">Registrar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Consultas de Dados Simplificadas
        </h1>
        <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-300">
          Acesse informações completas de forma rápida e segura através de nossos módulos de consulta especializados.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Já tenho uma conta
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Módulos de Consulta</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border">
            <div className="bg-blue-500/10 p-3 rounded-full w-fit mb-4">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Consulta de CPF</h3>
            <p className="text-muted-foreground">
              Descubra informações pessoais detalhadas utilizando o CPF.
            </p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border">
            <div className="bg-blue-500/10 p-3 rounded-full w-fit mb-4">
              <Search className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Consulta de Nome</h3>
            <p className="text-muted-foreground">
              Encontre pessoas em todo o Brasil utilizando apenas o Nome Completo.
            </p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border">
            <div className="bg-blue-500/10 p-3 rounded-full w-fit mb-4">
              <Lock className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Consulta de CNH</h3>
            <p className="text-muted-foreground">
              Acesse informações detalhadas do condutor utilizando apenas o CPF.
            </p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border">
            <div className="bg-blue-500/10 p-3 rounded-full w-fit mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dados Financeiros</h3>
            <p className="text-muted-foreground">
              Consulta de dados financeiros como renda, histórico bancário e muito mais.
            </p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border">
            <div className="bg-blue-500/10 p-3 rounded-full w-fit mb-4">
              <Database className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dados Profissionais</h3>
            <p className="text-muted-foreground">
              Consulta de histórico profissional, empregos e qualificações.
            </p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border">
            <div className="bg-blue-500/10 p-3 rounded-full w-fit mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dados de Crédito</h3>
            <p className="text-muted-foreground">
              Consulta de score de crédito, histórico de pagamentos e dívidas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="bg-blue-900/30 border border-blue-900/50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-gray-300">
            Registre-se agora e tenha acesso a todos os nossos módulos de consulta.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              Criar Conta
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-border">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>© 2023 BlackDB. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
