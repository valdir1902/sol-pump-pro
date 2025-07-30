import { Request, Response } from 'express';
import { SpinnerBot } from '../models/SpinnerBot';
import { SpinnerBotService } from '../services/SpinnerBotService';
import { PumpFunService } from '../services/PumpFunService';

export class SpinnerBotController {
  // Obter configurações do bot
  static async getBotConfig(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      
      const bot = await SpinnerBot.findOne({ userId });
      if (!bot) {
        res.status(404).json({ error: 'Configuração do bot não encontrada' });
        return;
      }

      res.json({
        bot: {
          id: bot._id,
          isActive: bot.isActive,
          targetToken: bot.targetToken,
          investmentAmount: bot.investmentAmount,
          stopLoss: bot.stopLoss,
          takeProfit: bot.takeProfit,
          slippage: bot.slippage,
          maxTrades: bot.maxTrades,
          currentTrades: bot.currentTrades,
          totalProfit: bot.totalProfit,
          totalLoss: bot.totalLoss,
          lastTradeAt: bot.lastTradeAt,
          configuration: bot.configuration,
          createdAt: bot.createdAt,
          updatedAt: bot.updatedAt,
        },
      });
    } catch (error) {
      console.error('Erro ao obter configuração do bot:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Atualizar configurações do bot
  static async updateBotConfig(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const {
        investmentAmount,
        stopLoss,
        takeProfit,
        slippage,
        maxTrades,
        configuration,
      } = req.body;

      // Validações
      if (investmentAmount !== undefined && (investmentAmount <= 0 || investmentAmount > 100)) {
        res.status(400).json({ error: 'Valor de investimento deve estar entre 0.01 e 100 SOL' });
        return;
      }

      if (stopLoss !== undefined && (stopLoss < 0 || stopLoss > 100)) {
        res.status(400).json({ error: 'Stop loss deve estar entre 0% e 100%' });
        return;
      }

      if (takeProfit !== undefined && takeProfit <= 0) {
        res.status(400).json({ error: 'Take profit deve ser maior que 0%' });
        return;
      }

      if (slippage !== undefined && (slippage < 0.1 || slippage > 50)) {
        res.status(400).json({ error: 'Slippage deve estar entre 0.1% e 50%' });
        return;
      }

      if (maxTrades !== undefined && (maxTrades < 1 || maxTrades > 100)) {
        res.status(400).json({ error: 'Máximo de trades deve estar entre 1 e 100' });
        return;
      }

      const updateData: any = {};
      if (investmentAmount !== undefined) updateData.investmentAmount = investmentAmount;
      if (stopLoss !== undefined) updateData.stopLoss = stopLoss;
      if (takeProfit !== undefined) updateData.takeProfit = takeProfit;
      if (slippage !== undefined) updateData.slippage = slippage;
      if (maxTrades !== undefined) updateData.maxTrades = maxTrades;
      if (configuration !== undefined) updateData.configuration = configuration;

      const bot = await SpinnerBot.findOneAndUpdate(
        { userId },
        updateData,
        { new: true }
      );

      if (!bot) {
        res.status(404).json({ error: 'Bot não encontrado' });
        return;
      }

      res.json({
        message: 'Configurações atualizadas com sucesso',
        bot: {
          id: bot._id,
          isActive: bot.isActive,
          investmentAmount: bot.investmentAmount,
          stopLoss: bot.stopLoss,
          takeProfit: bot.takeProfit,
          slippage: bot.slippage,
          maxTrades: bot.maxTrades,
          configuration: bot.configuration,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar configuração do bot:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Iniciar bot
  static async startBot(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      
      const result = await SpinnerBotService.startBot(userId);
      
      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.json({
        message: result.message,
        botStarted: true,
      });
    } catch (error) {
      console.error('Erro ao iniciar bot:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Parar bot
  static async stopBot(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      
      const result = await SpinnerBotService.stopBot(userId);
      
      if (!result.success) {
        res.status(400).json({ error: result.message });
        return;
      }

      res.json({
        message: result.message,
        botStopped: true,
      });
    } catch (error) {
      console.error('Erro ao parar bot:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter estatísticas do bot
  static async getBotStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      
      const stats = await SpinnerBotService.getBotStats(userId);
      
      if (!stats) {
        res.status(404).json({ error: 'Estatísticas do bot não encontradas' });
        return;
      }

      res.json({ stats });
    } catch (error) {
      console.error('Erro ao obter estatísticas do bot:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter tokens recomendados
  static async getRecommendedTokens(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;
      
      const tokens = await PumpFunService.getRecommendedTokens(Number(limit));
      
      const formattedTokens = tokens.map(token => ({
        mint: token.mint,
        name: token.name,
        symbol: token.symbol,
        description: token.description,
        image: token.image,
        marketCap: token.marketCap,
        price: token.price,
        liquidity: token.liquidity,
        volume24h: token.volume24h,
        holders: token.holders,
        isLaunched: token.isLaunched,
        launchedAt: token.launchedAt,
        creator: token.creator,
        score: PumpFunService.calculateTokenScore(token),
        createdAt: token.createdAt,
      }));

      res.json({
        tokens: formattedTokens,
        count: formattedTokens.length,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Erro ao obter tokens recomendados:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter novos tokens
  static async getNewTokens(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 20 } = req.query;
      
      const tokens = await PumpFunService.getNewTokens(Number(limit));
      
      const formattedTokens = tokens.map(token => ({
        mint: token.mint,
        name: token.name,
        symbol: token.symbol,
        description: token.description,
        image: token.image,
        marketCap: token.marketCap,
        price: token.price,
        liquidity: token.liquidity,
        isLaunched: token.isLaunched,
        creator: token.creator,
        score: PumpFunService.calculateTokenScore(token),
        createdAt: token.createdAt,
      }));

      res.json({
        tokens: formattedTokens,
        count: formattedTokens.length,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Erro ao obter novos tokens:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter tokens em alta
  static async getHotTokens(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 20 } = req.query;
      
      const tokens = await PumpFunService.getHotTokens(Number(limit));
      
      const formattedTokens = tokens.map(token => ({
        mint: token.mint,
        name: token.name,
        symbol: token.symbol,
        description: token.description,
        image: token.image,
        marketCap: token.marketCap,
        price: token.price,
        liquidity: token.liquidity,
        volume24h: token.volume24h,
        isLaunched: token.isLaunched,
        creator: token.creator,
        score: PumpFunService.calculateTokenScore(token),
        createdAt: token.createdAt,
      }));

      res.json({
        tokens: formattedTokens,
        count: formattedTokens.length,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Erro ao obter tokens em alta:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Resetar trades do bot
  static async resetBotTrades(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      
      const bot = await SpinnerBot.findOne({ userId });
      if (!bot) {
        res.status(404).json({ error: 'Bot não encontrado' });
        return;
      }

      // Não permitir reset se o bot estiver ativo
      if (bot.isActive) {
        res.status(400).json({ error: 'Pare o bot antes de resetar os trades' });
        return;
      }

      bot.currentTrades = 0;
      bot.totalProfit = 0;
      bot.totalLoss = 0;
      bot.lastTradeAt = undefined;
      
      await bot.save();

      res.json({
        message: 'Trades resetados com sucesso',
        bot: {
          currentTrades: bot.currentTrades,
          totalProfit: bot.totalProfit,
          totalLoss: bot.totalLoss,
        },
      });
    } catch (error) {
      console.error('Erro ao resetar trades do bot:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}