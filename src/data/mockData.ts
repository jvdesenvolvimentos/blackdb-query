
import { Client } from "@/types/client";
import { v4 as uuidv4 } from "uuid";

// Mock client data for demonstration purposes
export const mockClients: Client[] = [
  {
    id: uuidv4(),
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    phone: "(11) 98765-4321",
    birthDate: "1985-03-15",
    address: "Av. Paulista, 1000, São Paulo, SP",
    status: "active",
  },
  {
    id: uuidv4(),
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    phone: "(21) 91234-5678",
    birthDate: "1990-07-22",
    address: "Rua Leblon, 123, Rio de Janeiro, RJ",
    status: "active",
  },
  {
    id: uuidv4(),
    name: "Carlos Santos",
    email: "carlos.santos@exemplo.com",
    phone: "(31) 99876-5432",
    birthDate: "1978-11-05",
    address: "Av. Amazonas, 500, Belo Horizonte, MG",
    status: "inactive",
  },
  {
    id: uuidv4(),
    name: "Ana Rodrigues",
    email: "ana.rodrigues@exemplo.com",
    phone: "(41) 98765-1234",
    birthDate: "1995-09-30",
    address: "Rua das Flores, 300, Curitiba, PR",
    status: "active",
  },
  {
    id: uuidv4(),
    name: "Pedro Costa",
    email: "pedro.costa@exemplo.com",
    phone: "(51) 97654-3210",
    birthDate: "1982-05-12",
    address: "Av. Ipiranga, 700, Porto Alegre, RS",
    status: "inactive",
  },
];
