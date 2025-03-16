
import { Client } from "@/types/client";
import { v4 as uuidv4 } from "uuid";

export const mockClients: Client[] = [
  {
    id: uuidv4(),
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "(11) 99999-1234",
    birthDate: "1990-05-15",
    address: "Av. Paulista, 1000, São Paulo, SP",
    status: "active"
  },
  {
    id: uuidv4(),
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    phone: "(21) 98888-5678",
    birthDate: "1985-10-20",
    address: "Rua Copacabana, 500, Rio de Janeiro, RJ",
    status: "active"
  },
  {
    id: uuidv4(),
    name: "Mariana Santos",
    email: "mariana.santos@email.com",
    phone: "(31) 97777-9012",
    birthDate: "1992-03-25",
    status: "inactive"
  },
  {
    id: uuidv4(),
    name: "Roberto Almeida",
    email: "roberto.almeida@email.com",
    phone: "(41) 96666-3456",
    birthDate: "1978-12-10",
    address: "Rua das Flores, 200, Curitiba, PR",
    status: "active"
  },
  {
    id: uuidv4(),
    name: "Fernanda Costa",
    email: "fernanda.costa@email.com",
    phone: "(51) 95555-7890",
    birthDate: "1995-07-08",
    address: "Av. Independência, 300, Porto Alegre, RS",
    status: "active"
  },
  {
    id: uuidv4(),
    name: "Lucas Mendes",
    email: "lucas.mendes@email.com",
    birthDate: "1988-09-14",
    status: "inactive"
  }
];
