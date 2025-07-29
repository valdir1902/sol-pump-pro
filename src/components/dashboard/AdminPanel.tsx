import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Users, DollarSign, Activity } from "lucide-react";

export const AdminPanel = () => {
  const [feePercentage, setFeePercentage] = useState("10");
  const [feeWallet, setFeeWallet] = useState("7XaVkjNGZ8R5vKmQ2H8Gf3pL1WdXnM4Y9rBcS6tE2qAz");
  const [botEnabled, setBotEnabled] = useState(true);
  const { toast } = useToast();

  const mockUsers = [
    {
      id: "1",
      email: "user1@exemplo.com",
      walletAddress: "7XaV...2qAz",
      balance: "1.234",
      totalTrades: 45,
      profit: "+$234.50",
      status: "active"
    },
    {
      id: "2", 
      email: "user2@exemplo.com",
      walletAddress: "9kLm...5tBn",
      balance: "0.567",
      totalTrades: 23,
      profit: "-$12.30",
      status: "active"
    }
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas!",
      description: "As configurações do sistema foram atualizadas",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Painel Administrativo
          </CardTitle>
          <CardDescription>
            Gerencie configurações globais do sistema
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-secondary">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="fees">Taxas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure o comportamento global do bot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Taxa de Saque (%)</Label>
                  <Input
                    type="number"
                    value={feePercentage}
                    onChange={(e) => setFeePercentage(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Carteira de Taxas</Label>
                  <Input
                    value={feeWallet}
                    onChange={(e) => setFeeWallet(e.target.value)}
                    className="bg-secondary border-border font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={botEnabled}
                  onCheckedChange={setBotEnabled}
                />
                <Label>Bot Global Ativo</Label>
              </div>

              <Button onClick={handleSaveSettings} className="bg-gradient-primary">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gestão de Usuários
              </CardTitle>
              <CardDescription>
                Visualize e gerencie contas de usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30">
                    <TableHead>Email</TableHead>
                    <TableHead>Carteira</TableHead>
                    <TableHead>Saldo (SOL)</TableHead>
                    <TableHead>Trades</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id} className="border-border/30">
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="font-mono text-sm">{user.walletAddress}</TableCell>
                      <TableCell className="font-mono">{user.balance}</TableCell>
                      <TableCell>{user.totalTrades}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          user.profit.startsWith("+") ? "text-crypto-profit" : "text-crypto-loss"
                        }`}>
                          {user.profit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-crypto-profit/20 text-crypto-profit border-crypto-profit/30">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Gerenciar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-crypto-profit" />
                  Taxas Coletadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-crypto-profit">2.45 SOL</p>
                  <p className="text-sm text-muted-foreground">Hoje</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-accent" />
                  Total Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">18.92 SOL</p>
                  <p className="text-sm text-muted-foreground">7 dias</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-warning" />
                  Total Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-warning">67.33 SOL</p>
                  <p className="text-sm text-muted-foreground">30 dias</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Analytics do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-foreground">1,234</p>
                  <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-accent">5,678</p>
                  <p className="text-sm text-muted-foreground">Trades Hoje</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-crypto-profit">89.5%</p>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-warning">156.7 SOL</p>
                  <p className="text-sm text-muted-foreground">Volume 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};