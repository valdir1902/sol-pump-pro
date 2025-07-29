import { useState, useEffect } from "react";
import { AuthPage } from "@/components/auth/AuthPage";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Aqui você verificaria se o usuário está autenticado via Supabase
    // Por enquanto, simulando não autenticado
    setIsAuthenticated(false);
  }, []);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <Dashboard />;
};

export default Index;
