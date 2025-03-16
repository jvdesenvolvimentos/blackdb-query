
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="h-screen w-full flex overflow-hidden">
      <Sidebar />
      <main className={cn("flex-1 overflow-auto p-4 md:p-6", className)}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
