import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

export const TransactionsHistory = () => {
  const [filter, setFilter] = useState("all");

  const mockTransactions = [
    {
      id: "tx-001",
      type: "buy",
      token: "PUMP",
      amount: "1,000,000",
      solAmount: "0.1",
      price: "$0.000034",
      profit: "+$45.20",
      status: "completed",
      timestamp: "2024-01-15 14:32:15",
      hash: "5K7X...2mF9"
    },
    {
      id: "tx-002",
      type: "sell",
      token: "MOON",
      amount: "500,000",
      solAmount: "0.089",
      price: "$0.000089",
      profit: "+$12.50",
      status: "completed",
      timestamp: "2024-01-15 14:28:42",
      hash: "9L3B...8wR2"
    },
    {
      id: "tx-003",
      type: "buy",
      token: "DEGEN",
      amount: "750,000",
      solAmount: "0.15",
      price: "$0.000156",
      profit: "-$5.80",
      status: "completed",
      timestamp: "2024-01-15 14:15:33",
      hash: "2N8M...5kQ7"
    },
    {
      id: "tx-004",
      type: "withdraw",
      token: "SOL",
      amount: "0.5",
      solAmount: "0.5",
      price: "$85.00",
      profit: "-$4.25",
      status: "pending",
      timestamp: "2024-01-15 14:05:21",
      hash: "6T9R...3hW1"
    }
  ];

  const filteredTransactions = filter === "all" 
    ? mockTransactions 
    : mockTransactions.filter(tx => tx.type === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-crypto-profit/20 text-crypto-profit border-crypto-profit/30">Concluído</Badge>;
      case "pending":
        return <Badge className="bg-warning/20 text-warning border-warning/30">Pendente</Badge>;
      case "failed":
        return <Badge className="bg-crypto-loss/20 text-crypto-loss border-crypto-loss/30">Falhou</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "buy":
        return <TrendingUp className="h-4 w-4 text-crypto-profit" />;
      case "sell":
        return <TrendingDown className="h-4 w-4 text-crypto-loss" />;
      default:
        return <ExternalLink className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "buy":
        return "Compra";
      case "sell":
        return "Venda";
      case "withdraw":
        return "Saque";
      case "deposit":
        return "Depósito";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-crypto-profit">+$127.45</p>
              <p className="text-sm text-muted-foreground">Lucro Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">87%</p>
              <p className="text-sm text-muted-foreground">Taxa Sucesso</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">156</p>
              <p className="text-sm text-muted-foreground">Trades Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">1.85 SOL</p>
              <p className="text-sm text-muted-foreground">Volume 24h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>
                Todas as suas operações e movimentações
              </CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-secondary border-border">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="buy">Compras</SelectItem>
                <SelectItem value="sell">Vendas</SelectItem>
                <SelectItem value="withdraw">Saques</SelectItem>
                <SelectItem value="deposit">Depósitos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead>Tipo</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Valor (SOL)</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-border/30">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(tx.type)}
                      <span className="font-medium">{getTypeLabel(tx.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-semibold">{tx.token}</span>
                  </TableCell>
                  <TableCell className="font-mono">{tx.amount}</TableCell>
                  <TableCell className="font-mono">{tx.solAmount}</TableCell>
                  <TableCell className="font-mono">{tx.price}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      tx.profit.startsWith("+") ? "text-crypto-profit" : "text-crypto-loss"
                    }`}>
                      {tx.profit}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tx.timestamp}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-mono text-xs hover:bg-accent/10"
                      onClick={() => window.open(`https://solscan.io/tx/${tx.hash}`, "_blank")}
                    >
                      {tx.hash}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};