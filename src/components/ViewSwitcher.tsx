
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

interface ViewSwitcherProps {
  view: "grid" | "table";
  onViewChange: (view: "grid" | "table") => void;
}

const ViewSwitcher = ({ view, onViewChange }: ViewSwitcherProps) => {
  return (
    <div className="flex items-center bg-secondary rounded-md p-1">
      <Button
        variant={view === "grid" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 px-2"
        onClick={() => onViewChange("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "table" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 px-2"
        onClick={() => onViewChange("table")}
      >
        <LayoutList className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewSwitcher;
