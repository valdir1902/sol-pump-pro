import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Bot, 
  Wallet, 
  TrendingUp, 
  Settings, 
  BarChart3, 
  LogOut,
  User,
  Coins,
  Activity,
  DollarSign,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { WalletCard } from './WalletCard';
import { TradingPanel } from './TradingPanel';
import { TransactionsHistory } from './TransactionsHistory';
import { AdminPanel } from './AdminPanel';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Visão geral da conta'
  },
  {
    title: 'Spinner Bot',
    href: '/dashboard/bot',
    icon: Bot,
    description: 'Configurar e controlar bot'
  },
  {
    title: 'Carteira',
    href: '/dashboard/wallet',
    icon: Wallet,
    description: 'Gerenciar carteira SOL'
  },
  {
    title: 'Tokens',
    href: '/dashboard/tokens',
    icon: Coins,
    description: 'Tokens recomendados'
  },
  {
    title: 'Transações',
    href: '/dashboard/transactions',
    icon: Activity,
    description: 'Histórico de transações'
  },
  {
    title: 'Configurações',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Configurações da conta'
  }
];

function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    window.history.pushState(null, '', path);
    window.location.reload();
  };

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Spinner Bot</h1>
            <p className="text-sm text-muted-foreground">Solana Trading</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            
            return (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs opacity-75 truncate">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
}

function DashboardOverview() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {user?.username}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.solBalance?.toFixed(4) || '0.0000'} SOL</div>
            <p className="text-xs text-muted-foreground">
              Carteira principal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="secondary">Inativo</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Clique em "Spinner Bot" para configurar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trades Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhum trade executado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carteira</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate text-sm">
              {user?.walletAddress?.slice(0, 8)}...{user?.walletAddress?.slice(-4)}
            </div>
            <p className="text-xs text-muted-foreground">
              Endereço Solana
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Início Rápido</CardTitle>
            <CardDescription>
              Configure seu bot em poucos passos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">1. Configure o Bot</h4>
              <p className="text-sm text-muted-foreground">
                Defina valor de investimento, stop loss e take profit
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">2. Faça um Depósito</h4>
              <p className="text-sm text-muted-foreground">
                Transfira SOL para sua carteira do bot
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">3. Inicie o Trading</h4>
              <p className="text-sm text-muted-foreground">
                Ative o bot e comece a operar automaticamente
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recursos</CardTitle>
            <CardDescription>
              Funcionalidades principais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Bot className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Trading Automatizado</p>
                  <p className="text-xs text-muted-foreground">Bot inteligente para tokens PumpFun</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Carteira Integrada</p>
                  <p className="text-xs text-muted-foreground">Carteira SOL exclusiva com taxa de 10%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Análise Inteligente</p>
                  <p className="text-xs text-muted-foreground">Algoritmos avançados de detecção</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/bot" element={<TradingPanel />} />
            <Route path="/wallet" element={<WalletCard user={user} />} />
            <Route path="/transactions" element={<TransactionsHistory />} />
            <Route path="/settings" element={<AdminPanel />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;