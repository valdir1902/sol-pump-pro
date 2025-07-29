import { SpinnerBot, ISpinnerBot } from '../models/SpinnerBot';
import { Transaction, ITransaction } from '../models/Transaction';
import { User, IUser } from '../models/User';
import { PumpFunService } from './PumpFunService';
import { WalletService } from './WalletService';
import { IPumpFunToken } from '../models/PumpFunToken';
import { BOT_CONFIG } from '../config/solana';

interface TradeSignal {
  action: 'buy' | 'sell';
  token: IPumpFunToken;
  amount: number;
  reason: string;
  confidence: number;
}

interface TradeResult {
  success: boolean;
  signature?: string;
  error?: string;
  amount: number;
  price: number;
}

export class SpinnerBotService {
  private static activeMonitors = new Map<string, NodeJS.Timeout>();

  // Iniciar bot para um usuário
  static async startBot(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const bot = await SpinnerBot.findOne({ userId });
      if (!bot) {
        return { success: false, message: 'Bot não encontrado' };
      }

      const user = await User.findById(userId);
      if (!user) {
        return { success: false, message: 'Usuário não encontrado' };
      }

      // Verificar saldo mínimo
      const balance = await WalletService.getBalance(user.walletAddress);
      if (balance < bot.investmentAmount) {
        return { 
          success: false, 
          message: `Saldo insuficiente. Necessário: ${bot.investmentAmount} SOL, Disponível: ${balance} SOL` 
        };
      }

      bot.isActive = true;
      await bot.save();

      // Iniciar monitoramento
      this.startBotMonitoring(bot, user);

      return { success: true, message: 'Bot iniciado com sucesso' };
    } catch (error) {
      console.error('Erro ao iniciar bot:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  // Parar bot
  static async stopBot(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const bot = await SpinnerBot.findOne({ userId });
      if (!bot) {
        return { success: false, message: 'Bot não encontrado' };
      }

      bot.isActive = false;
      await bot.save();

      // Parar monitoramento
      const monitor = this.activeMonitors.get(userId);
      if (monitor) {
        clearInterval(monitor);
        this.activeMonitors.delete(userId);
      }

      return { success: true, message: 'Bot parado com sucesso' };
    } catch (error) {
      console.error('Erro ao parar bot:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  // Iniciar monitoramento de um bot
  private static startBotMonitoring(bot: ISpinnerBot, user: IUser): void {
    const monitoringInterval = setInterval(async () => {
      try {
        await this.executeBotCycle(bot, user);
      } catch (error) {
        console.error(`Erro no ciclo do bot ${bot._id}:`, error);
      }
    }, 60000); // Executa a cada minuto

    this.activeMonitors.set(bot.userId.toString(), monitoringInterval);
    console.log(`🤖 Bot iniciado para usuário ${user.username}`);
  }

  // Executar ciclo de decisão do bot
  private static async executeBotCycle(bot: ISpinnerBot, user: IUser): Promise<void> {
    // Verificar se o bot ainda está ativo
    const currentBot = await SpinnerBot.findById(bot._id);
    if (!currentBot?.isActive) {
      this.stopBot(bot.userId.toString());
      return;
    }

    // Verificar limites de trades
    if (currentBot.currentTrades >= currentBot.maxTrades) {
      console.log(`Bot ${bot._id} atingiu limite máximo de trades`);
      return;
    }

    // Obter tokens recomendados
    const recommendedTokens = await PumpFunService.getRecommendedTokens(5);
    
    if (recommendedTokens.length === 0) {
      console.log('Nenhum token recomendado encontrado');
      return;
    }

    // Analisar sinais de trading
    const signals = await this.analyzeTradeSignals(recommendedTokens, currentBot);
    
    for (const signal of signals) {
      if (signal.confidence >= this.getMinConfidenceForRisk(currentBot.configuration.riskLevel)) {
        await this.executeTradeSignal(signal, currentBot, user);
        break; // Executar apenas um trade por ciclo
      }
    }
  }

  // Analisar sinais de trading
  private static async analyzeTradeSignals(tokens: IPumpFunToken[], bot: ISpinnerBot): Promise<TradeSignal[]> {
    const signals: TradeSignal[] = [];

    for (const token of tokens) {
      const score = PumpFunService.calculateTokenScore(token);
      const signal = this.generateTradeSignal(token, bot, score);
      
      if (signal) {
        signals.push(signal);
      }
    }

    // Ordenar por confiança
    signals.sort((a, b) => b.confidence - a.confidence);
    
    return signals;
  }

  // Gerar sinal de trading
  private static generateTradeSignal(token: IPumpFunToken, bot: ISpinnerBot, score: number): TradeSignal | null {
    let confidence = 0;
    let action: 'buy' | 'sell' = 'buy';
    let reason = '';

    // Análise baseada no score do token
    if (score >= 80) {
      confidence = 90;
      reason = 'Token com score muito alto';
    } else if (score >= 60) {
      confidence = 70;
      reason = 'Token com score alto';
    } else if (score >= 40) {
      confidence = 50;
      reason = 'Token com score médio';
    } else {
      return null; // Score muito baixo
    }

    // Ajustes baseados no nível de risco
    switch (bot.configuration.riskLevel) {
      case 'low':
        confidence -= 20;
        break;
      case 'high':
        confidence += 10;
        break;
    }

    // Verificar liquidez mínima
    if (token.liquidity < bot.configuration.minLiquidity) {
      confidence -= 30;
      reason += ' (liquidez baixa)';
    }

    // Verificar idade do token
    const ageInHours = (Date.now() - token.createdAt.getTime()) / (1000 * 60 * 60);
    if (ageInHours < 1) {
      confidence -= 40; // Token muito novo é arriscado
      reason += ' (token muito novo)';
    }

    if (confidence < 30) {
      return null;
    }

    return {
      action,
      token,
      amount: bot.investmentAmount,
      reason,
      confidence: Math.min(confidence, 100),
    };
  }

  // Executar sinal de trading
  private static async executeTradeSignal(signal: TradeSignal, bot: ISpinnerBot, user: IUser): Promise<void> {
    try {
      console.log(`🎯 Executando ${signal.action} para ${signal.token.symbol} - Confiança: ${signal.confidence}%`);

      if (signal.action === 'buy') {
        await this.executeBuyOrder(signal, bot, user);
      } else {
        await this.executeSellOrder(signal, bot, user);
      }
    } catch (error) {
      console.error('Erro ao executar sinal de trading:', error);
    }
  }

  // Executar ordem de compra
  private static async executeBuyOrder(signal: TradeSignal, bot: ISpinnerBot, user: IUser): Promise<void> {
    try {
      // Simular compra (implementação real dependeria de DEX integration)
      const simulatedResult = this.simulateTrade('buy', signal);

      if (simulatedResult.success) {
        // Registrar transação
        const transaction = new Transaction({
          userId: user._id,
          type: 'trade',
          amount: signal.amount,
          token: signal.token.symbol,
          signature: simulatedResult.signature || 'simulated_' + Date.now(),
          status: 'confirmed',
          metadata: {
            action: 'buy',
            tokenMint: signal.token.mint,
            price: simulatedResult.price,
            confidence: signal.confidence,
            reason: signal.reason,
          },
        });

        await transaction.save();

        // Atualizar bot
        bot.currentTrades += 1;
        bot.lastTradeAt = new Date();
        await bot.save();

        console.log(`✅ Compra executada: ${signal.token.symbol} por ${signal.amount} SOL`);
      }
    } catch (error) {
      console.error('Erro na ordem de compra:', error);
    }
  }

  // Executar ordem de venda
  private static async executeSellOrder(signal: TradeSignal, bot: ISpinnerBot, user: IUser): Promise<void> {
    try {
      // Simular venda
      const simulatedResult = this.simulateTrade('sell', signal);

      if (simulatedResult.success) {
        // Registrar transação
        const transaction = new Transaction({
          userId: user._id,
          type: 'trade',
          amount: signal.amount,
          token: signal.token.symbol,
          signature: simulatedResult.signature || 'simulated_' + Date.now(),
          status: 'confirmed',
          metadata: {
            action: 'sell',
            tokenMint: signal.token.mint,
            price: simulatedResult.price,
            confidence: signal.confidence,
            reason: signal.reason,
          },
        });

        await transaction.save();

        // Calcular profit/loss
        const profit = simulatedResult.amount - signal.amount;
        if (profit > 0) {
          bot.totalProfit += profit;
        } else {
          bot.totalLoss += Math.abs(profit);
        }

        bot.lastTradeAt = new Date();
        await bot.save();

        console.log(`💰 Venda executada: ${signal.token.symbol} - Profit: ${profit} SOL`);
      }
    } catch (error) {
      console.error('Erro na ordem de venda:', error);
    }
  }

  // Simular trade (para desenvolvimento - substitua por integração real com DEX)
  private static simulateTrade(action: 'buy' | 'sell', signal: TradeSignal): TradeResult {
    // Simulação básica com variação de preço aleatória
    const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% de variação
    const price = signal.token.price * (1 + priceVariation);
    const slippage = signal.token.liquidity > 5000 ? 0.01 : 0.05; // 1% ou 5% de slippage
    
    const finalPrice = price * (1 + (action === 'buy' ? slippage : -slippage));
    const finalAmount = action === 'sell' ? signal.amount * (1 + priceVariation) : signal.amount;

    return {
      success: true,
      signature: `simulated_${action}_${Date.now()}`,
      amount: finalAmount,
      price: finalPrice,
    };
  }

  // Obter confiança mínima baseada no nível de risco
  private static getMinConfidenceForRisk(riskLevel: 'low' | 'medium' | 'high'): number {
    switch (riskLevel) {
      case 'low': return 80;
      case 'medium': return 60;
      case 'high': return 40;
      default: return 60;
    }
  }

  // Obter estatísticas do bot
  static async getBotStats(userId: string): Promise<any> {
    try {
      const bot = await SpinnerBot.findOne({ userId });
      if (!bot) {
        return null;
      }

      const transactions = await Transaction.find({ 
        userId, 
        type: 'trade' 
      }).sort({ createdAt: -1 });

      const totalTrades = transactions.length;
      const winningTrades = transactions.filter(t => {
        const metadata = t.metadata;
        return metadata && metadata.action === 'sell' && metadata.profit > 0;
      }).length;

      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
      const totalProfit = bot.totalProfit - bot.totalLoss;

      return {
        isActive: bot.isActive,
        totalTrades,
        currentTrades: bot.currentTrades,
        maxTrades: bot.maxTrades,
        winRate: winRate.toFixed(2),
        totalProfit: totalProfit.toFixed(4),
        totalProfitValue: bot.totalProfit,
        totalLossValue: bot.totalLoss,
        lastTradeAt: bot.lastTradeAt,
        configuration: bot.configuration,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas do bot:', error);
      return null;
    }
  }

  // Parar todos os bots ativos
  static stopAllBots(): void {
    for (const [userId, monitor] of this.activeMonitors) {
      clearInterval(monitor);
    }
    this.activeMonitors.clear();
    console.log('🛑 Todos os bots foram parados');
  }
}