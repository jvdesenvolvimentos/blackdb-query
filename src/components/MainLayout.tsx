
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { usePlatformConfig } from "@/hooks/usePlatformConfig";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  const { platformName } = usePlatformConfig();

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <Sidebar platformName={platformName} />
      <main className={cn("flex-1 overflow-auto p-4 md:p-6", className)}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
