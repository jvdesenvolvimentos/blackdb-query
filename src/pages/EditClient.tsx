
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import ClientForm from "@/components/ClientForm";
import { z } from "zod";
import { Client } from "@/types/client";
import { mockClients } from "@/data/mockData";

const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the client data from your API
    // For this demo, we'll use the mock data
    const foundClient = mockClients.find(c => c.id === id);
    setClient(foundClient);
    setLoading(false);
    
    if (!foundClient) {
      // If client not found, navigate back to client list
      navigate("/");
    }
  }, [id, navigate]);

  const handleSubmit = (data: z.infer<typeof clientSchema>) => {
    // In a real app, you would send this data to your backend
    console.log("Updating client:", data);
    
    // For demo purposes, we'll just navigate back to the client list
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <MainLayout className="flex items-center justify-center">
        <p>Carregando...</p>
      </MainLayout>
    );
  }

  if (!client) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout className="flex items-start justify-center py-8">
      <ClientForm client={client} onSubmit={handleSubmit} onCancel={handleCancel} />
    </MainLayout>
  );
};

export default EditClient;
