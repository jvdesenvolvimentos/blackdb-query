
export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate: string;
  address?: string;
  status: ClientStatus;
}
