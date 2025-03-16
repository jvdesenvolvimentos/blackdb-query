
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Client } from "@/types/client";
import { formatDate } from "@/lib/utils";

interface ClientCardProps {
  client: Client;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ClientCard = ({ client, onView, onEdit, onDelete }: ClientCardProps) => {
  return (
    <Card className="hover:border-primary/50 transition-colors overflow-hidden group">
      <CardHeader className="p-4 bg-secondary/50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{client.name}</h3>
            <p className="text-muted-foreground text-sm">{client.email}</p>
          </div>
          <Badge variant={client.status === "active" ? "default" : "outline"}>
            {client.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Telefone</p>
              <p className="text-sm">{client.phone || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Data de Nascimento</p>
              <p className="text-sm">{formatDate(client.birthDate)}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">Endereço</p>
            <p className="text-sm truncate">{client.address || "—"}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="ghost" onClick={() => onView(client.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(client.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => onDelete(client.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
