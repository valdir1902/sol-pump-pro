import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, Play, Square, RefreshCw } from "lucide-react";

export const TradingPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [buyAmount, setBuyAmount] = useState("0.1");
  const [sellPercentage, setSellPercentage] = useState("20");
  const [maxSlippage, setMaxSlippage] = useState("5");
  const [autoTrade, setAutoTrade] = useState(false);
  const { toast } = useToast();

  const mockTokens = [
    {
      symbol: "PUMP",
      name: "PumpFun Token",
      price: "$0.000034",
      change: "+245.5%",
      volume: "$1.2M",
      marketCap: "$45K",
      isNew: true
    },
    {
      symbol: "MOON",
      name: "MoonShot",
      price: "$0.000089",
      change: "+89.2%",
      volume: "$850K",
      marketCap: "$120K",
      isNew: true
    },
    {
      symbol: "DEGEN",
      name: "Degen Coin",
      price: "$0.000156",
      change: "-12.3%",
      volume: "$2.1M",
      marketCap: "$890K",
      isNew: false
    }
  ];

  const handleStartBot = () => {
    setIsRunning(true);
    toast({
      title: "Bot iniciado!",
      description: "Spinner Bot está operando automaticamente",
    });
  };

  const handleStopBot = () => {
    setIsRunning(false);
    toast({
      title: "Bot parado",
      description: "Operações automáticas foram interrompidas",
    });
  };

  const handleManualTrade = (action: "buy" | "sell", token: string) => {
    toast({
      title: `${action === "buy" ? "Compra" : "Venda"} executada`,
      description: `${action === "buy" ? "Comprou" : "Vendeu"} ${token} com sucesso`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Bot Control */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Controle do Bot</span>
            <Badge 
              variant={isRunning ? "default" : "outline"}
              className={isRunning ? "bg-crypto-profit text-white" : ""}
            >
              {isRunning ? "● Operando" : "○ Parado"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Configure e controle as operações automáticas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Valor por Compra (SOL)</Label>
              <Input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Venda em Lucro (%)</Label>
              <Input
                type="number"
                value={sellPercentage}
                onChange={(e) => setSellPercentage(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Slippage Máximo (%)</Label>
              <Input
                type="number"
                value={maxSlippage}
                onChange={(e) => setMaxSlippage(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={autoTrade}
              onCheckedChange={setAutoTrade}
            />
            <Label>Trading Automático em Novos Tokens</Label>
          </div>

          <div className="flex space-x-4">
            {!isRunning ? (
              <Button 
                onClick={handleStartBot}
                className="bg-crypto-profit hover:bg-crypto-profit/80"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Bot
              </Button>
            ) : (
              <Button 
                onClick={handleStopBot}
                variant="destructive"
              >
                <Square className="h-4 w-4 mr-2" />
                Parar Bot
              </Button>
            )}
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Tokens
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PumpFun Tokens */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle>Tokens PumpFun Recentes</CardTitle>
          <CardDescription>
            Tokens recém-listados disponíveis para trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/30"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {token.symbol[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{token.symbol}</h3>
                      {token.isNew && (
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-xs">
                          NOVO
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{token.name}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-medium">{token.price}</p>
                  <p className={`text-sm ${
                    token.change.startsWith("+") ? "text-crypto-profit" : "text-crypto-loss"
                  }`}>
                    {token.change}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Vol: {token.volume}</p>
                  <p className="text-sm text-muted-foreground">MC: {token.marketCap}</p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleManualTrade("buy", token.symbol)}
                    className="bg-crypto-profit hover:bg-crypto-profit/80"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Comprar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleManualTrade("sell", token.symbol)}
                    className="hover:bg-crypto-loss/10 hover:border-crypto-loss/20"
                  >
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Vender
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};