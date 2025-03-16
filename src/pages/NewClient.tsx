
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import ClientForm from "@/components/ClientForm";
import { z } from "zod";
import { Client } from "@/types/client";
import { v4 as uuidv4 } from "uuid";

const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

const NewClient = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: z.infer<typeof clientSchema>) => {
    // In a real app, you would send this data to your backend
    console.log("Creating new client:", data);
    
    // For demo purposes, we'll just navigate back to the client list
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <MainLayout className="flex items-start justify-center py-8">
      <ClientForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </MainLayout>
  );
};

export default NewClient;
