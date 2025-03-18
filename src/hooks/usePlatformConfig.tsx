
import { useState, useEffect } from "react";

export function usePlatformConfig() {
  const [platformName, setPlatformName] = useState("ConsultaPro");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Carregar o nome da plataforma do localStorage
    const storedName = localStorage.getItem("platformName");
    if (storedName) {
      setPlatformName(storedName);
    }

    // Verificar se o usuário é administrador
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      const admin = JSON.parse(adminUser);
      // Aqui assumimos que o usuário logado é o admin para fins de demonstração
      // Em uma aplicação real, você compararia com o usuário logado
      setIsAdmin(true);
    }
  }, []);

  return {
    platformName,
    isAdmin,
    hasCompletedSetup: localStorage.getItem("hasCompletedInitialSetup") === "true"
  };
}
