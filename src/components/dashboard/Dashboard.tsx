import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletCard } from "./WalletCard";
import { TradingPanel } from "./TradingPanel";
import { TransactionsHistory } from "./TransactionsHistory";
import { AdminPanel } from "./AdminPanel";
import { useToast } from "@/hooks/use-toast";
import spinnerLogo from "@/assets/spinner-logo.jpg";

interface User {
  id: string;
  email: string;
  wallet_address?: string;
  balance?: number;
  is_admin?: boolean;
}

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("wallet");
  const { toast } = useToast();

  useEffect(() => {
    // Simulando dados do usuário
    setUser({
      id: "user-123",
      email: "usuario@exemplo.com",
      wallet_address: "7XaVkjNGZ8R5vKmQ2H8Gf3pL1WdXnM4Y9rBcS6tE2qAz",
      balance: 0.5,
      is_admin: false
    });
  }, []);

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  if (!user) {
    return null;
  }

  const navigationTabs = [
    { id: "wallet", label: "Carteira", icon: "💳" },
    { id: "trading", label: "Trading", icon: "📈" },
    { id: "history", label: "Histórico", icon: "📋" },
    ...(user.is_admin ? [{ id: "admin", label: "Admin", icon: "⚙️" }] : [])
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={spinnerLogo} alt="Spinner Bot" className="h-10 w-10 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Spinner Bot
              </h1>
              <p className="text-sm text-muted-foreground">Solana Trading Bot</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              ● Online
            </Badge>
            <div className="text-right">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.balance?.toFixed(4)} SOL
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Navegação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {navigationTabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activeTab === tab.id 
                        ? "bg-gradient-primary shadow-glow" 
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6 bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Trades Hoje:</span>
                  <span className="font-medium text-accent">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lucro 24h:</span>
                  <span className="font-medium text-crypto-profit">+2.34%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taxa Sucesso:</span>
                  <span className="font-medium text-accent">87%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {activeTab === "wallet" && <WalletCard user={user} />}
            {activeTab === "trading" && <TradingPanel />}
            {activeTab === "history" && <TransactionsHistory />}
            {activeTab === "admin" && user.is_admin && <AdminPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};