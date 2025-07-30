import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Coins, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Server, 
  Zap,
  Gift,
  Crown,
  Shield,
  Star,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

interface SpinTokenData {
  symbol: string;
  name: string;
  totalSupply: number;
  currentPrice: number;
  marketCap: number;
  holders: number;
  liquidityPool: number;
  burned: number;
  treasuryBalance: number;
  serverCosts: {
    monthly: number;
    covered: number;
    percentage: number;
  };
  benefits: {
    tradingFeeDiscount: number;
    prioritySupport: boolean;
    advancedFeatures: boolean;
    votingRights: boolean;
  };
}

// Dados simulados - em produção viriam da API
const mockTokenData: SpinTokenData = {
  symbol: 'SPIN',
  name: 'Spinner Bot Server Token',
  totalSupply: 100000000, // 100M tokens
  currentPrice: 0.05, // $0.05
  marketCap: 2500000, // $2.5M
  holders: 1847,
  liquidityPool: 150000, // $150k
  burned: 5000000, // 5M tokens queimados
  treasuryBalance: 75000, // $75k para custos de servidor
  serverCosts: {
    monthly: 2500, // $2500/mês
    covered: 1850, // $1850 coberto
    percentage: 74 // 74% coberto
  },
  benefits: {
    tradingFeeDiscount: 50, // 50% desconto
    prioritySupport: true,
    advancedFeatures: true,
    votingRights: true
  }
};

interface SpinTokenInfoProps {
  variant?: 'full' | 'compact' | 'widget';
  showBuyButton?: boolean;
  className?: string;
}

export const SpinTokenInfo: React.FC<SpinTokenInfoProps> = ({
  variant = 'full',
  showBuyButton = true,
  className
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [tokenData, setTokenData] = useState<SpinTokenData>(mockTokenData);
  const [copied, setCopied] = useState(false);

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenData(prev => ({
        ...prev,
        currentPrice: prev.currentPrice + (Math.random() - 0.5) * 0.001,
        holders: prev.holders + Math.floor(Math.random() * 3),
        serverCosts: {
          ...prev.serverCosts,
          covered: prev.serverCosts.covered + Math.random() * 10,
          percentage: Math.min(100, prev.serverCosts.percentage + Math.random() * 0.5)
        }
      }));
    }, 10000); // Atualizar a cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const copyTokenAddress = () => {
    // Em produção, seria o endereço real do token
    const tokenAddress = 'HKf7qMqtJk8VBhxm4mJk3VgKmQmqGVxh8VyJm3JhKqHg';
    navigator.clipboard.writeText(tokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: t('button.copy'),
      description: 'Token address copied to clipboard',
    });
  };

  const handleBuyToken = () => {
    // Em produção, redirecionaria para DEX ou exchange
    toast({
      title: t('token.buy'),
      description: 'Redirecionando para compra...',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (variant === 'widget') {
    return (
      <Card className={cn('bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Coins className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{tokenData.symbol}</h3>
                <p className="text-xs text-muted-foreground">{formatCurrency(tokenData.currentPrice)}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              +12.5%
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t('token.holders')}</span>
              <span className="font-medium">{formatNumber(tokenData.holders)}</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Server Costs</span>
                <span className="font-medium">{tokenData.serverCosts.percentage.toFixed(1)}%</span>
              </div>
              <Progress value={tokenData.serverCosts.percentage} className="h-1" />
            </div>
          </div>
          
          {showBuyButton && (
            <Button size="sm" className="w-full mt-3" onClick={handleBuyToken}>
              <Coins className="w-3 h-3 mr-1" />
              {t('token.buy')}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn('bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">{tokenData.name}</CardTitle>
                <CardDescription>{t('token.description')}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 border-primary/20">
              {tokenData.symbol}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-xl font-bold">{formatCurrency(tokenData.currentPrice)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t('token.holders')}</p>
              <p className="text-xl font-bold">{formatNumber(tokenData.holders)}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monthly Server Costs Coverage</span>
              <span className="font-medium">{tokenData.serverCosts.percentage.toFixed(1)}%</span>
            </div>
            <Progress value={tokenData.serverCosts.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {formatCurrency(tokenData.serverCosts.covered)} / {formatCurrency(tokenData.serverCosts.monthly)} covered
            </p>
          </div>
          
          {showBuyButton && (
            <Button className="w-full" onClick={handleBuyToken}>
              <Coins className="w-4 h-4 mr-2" />
              {t('token.buy')}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Principal */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Coins className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{tokenData.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {t('token.description')}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-lg px-3 py-1">
                {tokenData.symbol}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Current Price</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(tokenData.currentPrice)}</p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">{t('token.holders')}</span>
              </div>
              <p className="text-2xl font-bold">{formatNumber(tokenData.holders)}</p>
              <p className="text-xs text-muted-foreground">+24 nas últimas 24h</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Coins className="w-4 h-4" />
                <span className="text-sm">Market Cap</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(tokenData.marketCap)}</p>
              <p className="text-xs text-muted-foreground">Rank #847</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Server className="w-4 h-4" />
                <span className="text-sm">Treasury</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(tokenData.treasuryBalance)}</p>
              <p className="text-xs text-muted-foreground">Para custos do servidor</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Cobertura de Custos do Servidor */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Monthly Server Costs Coverage</h3>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Current Month</span>
                <span className="font-semibold">{tokenData.serverCosts.percentage.toFixed(1)}% covered</span>
              </div>
              <Progress value={tokenData.serverCosts.percentage} className="h-3 mb-3" />
              <div className="flex justify-between text-sm">
                <span>{formatCurrency(tokenData.serverCosts.covered)} raised</span>
                <span>Goal: {formatCurrency(tokenData.serverCosts.monthly)}</span>
              </div>
            </div>
          </div>
          
          {/* Ações */}
          <div className="flex space-x-3 mt-6">
            {showBuyButton && (
              <Button size="lg" className="flex-1" onClick={handleBuyToken}>
                <Coins className="w-4 h-4 mr-2" />
                {t('token.buy')}
              </Button>
            )}
            
            <Button variant="outline" size="lg" onClick={copyTokenAddress}>
              {copied ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy Address'}
            </Button>
            
            <Button variant="outline" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on DEX
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Benefícios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5 text-primary" />
            <span>{t('token.benefits')}</span>
          </CardTitle>
          <CardDescription>
            Vantagens exclusivas para holders do token SPIN
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{t('token.benefit1')}</h4>
                <p className="text-sm text-muted-foreground">
                  Até {tokenData.benefits.tradingFeeDiscount}% de desconto nas taxas de trading
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{t('token.benefit2')}</h4>
                <p className="text-sm text-muted-foreground">
                  Suporte técnico prioritário e resposta em até 2 horas
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{t('token.benefit3')}</h4>
                <p className="text-sm text-muted-foreground">
                  Acesso antecipado a novas funcionalidades e estratégias
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">{t('token.benefit4')}</h4>
                <p className="text-sm text-muted-foreground">
                  Participe das decisões sobre melhorias do bot
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tokenomics */}
      <Card>
        <CardHeader>
          <CardTitle>Tokenomics</CardTitle>
          <CardDescription>
            Distribuição e métricas do token SPIN
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Supply Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('token.totalSupply')}</span>
                  <span className="font-medium">{formatNumber(tokenData.totalSupply)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Circulating</span>
                  <span className="font-medium">{formatNumber(tokenData.totalSupply - tokenData.burned)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Burned</span>
                  <span className="font-medium text-red-600">{formatNumber(tokenData.burned)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Liquidity</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Liquidity Pool</span>
                  <span className="font-medium">{formatCurrency(tokenData.liquidityPool)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">24h Volume</span>
                  <span className="font-medium">{formatCurrency(45230)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Liquidity Locked</span>
                  <span className="font-medium text-green-600">100%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Server Funding</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Target</span>
                  <span className="font-medium">{formatCurrency(tokenData.serverCosts.monthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Coverage</span>
                  <span className="font-medium">{tokenData.serverCosts.percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Treasury Balance</span>
                  <span className="font-medium">{formatCurrency(tokenData.treasuryBalance)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinTokenInfo;