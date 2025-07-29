import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Copy, Eye, EyeOff, Send, Download } from "lucide-react";

interface User {
  id: string;
  email: string;
  wallet_address?: string;
  balance?: number;
}

interface WalletCardProps {
  user: User;
}

export const WalletCard = ({ user }: WalletCardProps) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const { toast } = useToast();

  const handleCopyAddress = () => {
    if (user.wallet_address) {
      navigator.clipboard.writeText(user.wallet_address);
      toast({
        title: "Endereço copiado!",
        description: "Endereço da carteira copiado para a área de transferência",
      });
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido para saque",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawAddress) {
      toast({
        title: "Erro",
        description: "Digite o endereço de destino",
        variant: "destructive",
      });
      return;
    }

    // Calcula taxa de 10%
    const fee = amount * 0.1;
    const netAmount = amount - fee;

    toast({
      title: "Saque processado!",
      description: `${netAmount.toFixed(4)} SOL enviados (taxa: ${fee.toFixed(4)} SOL)`,
    });

    setWithdrawAmount("");
    setWithdrawAddress("");
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Minha Carteira</span>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              Ativa
            </Badge>
          </CardTitle>
          <CardDescription>
            Carteira única gerada automaticamente para sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Balance */}
          <div className="text-center p-6 bg-secondary/50 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground mb-2">Saldo Disponível</p>
            <p className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {user.balance?.toFixed(4)} SOL
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ≈ $42.50 USD
            </p>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label>Endereço da Carteira</Label>
            <div className="flex space-x-2">
              <Input
                value={user.wallet_address || ""}
                readOnly
                className="bg-secondary border-border font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyAddress}
                className="hover:bg-accent/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Private Key (Hidden by default) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Chave Privada</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="text-xs"
              >
                {showPrivateKey ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Mostrar
                  </>
                )}
              </Button>
            </div>
            <Input
              type={showPrivateKey ? "text" : "password"}
              value={showPrivateKey ? "5KjZ8rNmF2XqY9vL1WdXnM4Y9rBcS6tE2qAz7XaVkjNG" : "••••••••••••••••••••••••••••••••••••••••••••••••"}
              readOnly
              className="bg-secondary border-border font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Deposit/Withdraw */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2 text-crypto-profit" />
              Depositar
            </CardTitle>
            <CardDescription>
              Envie SOL para sua carteira
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Valor (SOL)</Label>
              <Input
                type="number"
                placeholder="0.0000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <Button 
              className="w-full bg-crypto-profit hover:bg-crypto-profit/80"
              disabled={!depositAmount}
            >
              Gerar QR Code
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Ou envie diretamente para o endereço da carteira acima
            </p>
          </CardContent>
        </Card>

        {/* Withdraw */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2 text-warning" />
              Sacar
            </CardTitle>
            <CardDescription>
              Enviar SOL para outra carteira (taxa de 10%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Valor (SOL)</Label>
              <Input
                type="number"
                placeholder="0.0000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Endereço de Destino</Label>
              <Input
                placeholder="Endereço da carteira de destino"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="bg-secondary border-border font-mono text-sm"
              />
            </div>
            {withdrawAmount && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm">
                  <strong>Taxa de saque:</strong> {(parseFloat(withdrawAmount) * 0.1).toFixed(4)} SOL (10%)
                </p>
                <p className="text-sm">
                  <strong>Valor líquido:</strong> {(parseFloat(withdrawAmount) * 0.9).toFixed(4)} SOL
                </p>
              </div>
            )}
            <Button 
              onClick={handleWithdraw}
              className="w-full bg-warning hover:bg-warning/80 text-warning-foreground"
              disabled={!withdrawAmount || !withdrawAddress}
            >
              Confirmar Saque
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};