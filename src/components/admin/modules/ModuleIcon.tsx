
import React from "react";
import { User, DollarSign, Home, Briefcase, CreditCard, Search } from "lucide-react";

interface ModuleIconProps {
  iconName: string;
  className?: string;
}

const ModuleIcon: React.FC<ModuleIconProps> = ({ iconName, className = "h-5 w-5" }) => {
  switch (iconName) {
    case "user":
      return <User className={className} />;
    case "dollar-sign":
      return <DollarSign className={className} />;
    case "home":
      return <Home className={className} />;
    case "briefcase":
      return <Briefcase className={className} />;
    case "credit-card":
      return <CreditCard className={className} />;
    default:
      return <Search className={className} />;
  }
};

export default ModuleIcon;
