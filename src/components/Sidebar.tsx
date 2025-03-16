
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Database, Settings, LogOut, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { icon: Search, label: "Consultas", path: "/modules" },
    { icon: BarChart3, label: "Estatísticas", path: "/statistics" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  return (
    <div className="h-full w-16 md:w-64 bg-sidebar flex flex-col border-r border-border">
      <div className="p-4">
        <h1 className="text-xl font-bold hidden md:block">BlackDB</h1>
        <span className="text-xl font-bold md:hidden">BD</span>
      </div>
      
      <div className="mt-6 flex-1">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <TooltipProvider key={item.path} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={item.path}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-10 px-2 md:px-4",
                        isActive(item.path) 
                          ? "bg-secondary text-primary" 
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-0 md:mr-3" />
                      <span className="hidden md:inline">{item.label}</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="md:hidden">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>
      
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start h-10 px-2 md:px-4 hover:bg-secondary/50">
          <LogOut className="h-5 w-5 mr-0 md:mr-3" />
          <span className="hidden md:inline">Sair</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
