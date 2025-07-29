import { Request, Response } from 'express';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { WalletService } from '../services/WalletService';
import { BOT_CONFIG } from '../config/solana';

export class WalletController {
  // Obter saldo da carteira
  static async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      const balance = await WalletService.getBalance(user.walletAddress);
      
      // Atualizar saldo no banco
      user.solBalance = balance;
      await user.save();

      res.json({
        walletAddress: user.walletAddress,
        balance,
        balanceFormatted: `${balance.toFixed(4)} SOL`,
      });
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Sacar SOL com taxa de 10%
  static async withdraw(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { toAddress, amount } = req.body;

      // Validações
      if (!toAddress || !amount) {
        res.status(400).json({ error: 'Endereço de destino e valor são obrigatórios' });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({ error: 'Valor deve ser maior que zero' });
        return;
      }

      if (amount < BOT_CONFIG.minWithdrawalAmount) {
        res.status(400).json({ 
          error: `Valor mínimo de saque: ${BOT_CONFIG.minWithdrawalAmount} SOL` 
        });
        return;
      }

      if (!WalletService.isValidSolanaAddress(toAddress)) {
        res.status(400).json({ error: 'Endereço Solana inválido' });
        return;
      }

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      // Executar saque com taxa
      const result = await WalletService.withdrawWithFee(
        user.privateKey,
        user.walletAddress,
        toAddress,
        amount
      );

      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }

      // Registrar transação de saque
      const withdrawTransaction = new Transaction({
        userId: user._id,
        type: 'withdrawal',
        amount: amount - result.feeAmount,
        signature: result.signature,
        status: 'confirmed',
        feeAmount: result.feeAmount,
        fromAddress: user.walletAddress,
        toAddress,
        metadata: {
          originalAmount: amount,
          feePercentage: BOT_CONFIG.feePercentage,
        },
      });

      await withdrawTransaction.save();

      // Registrar transação de taxa
      if (result.feeAmount > 0) {
        const feeTransaction = new Transaction({
          userId: user._id,
          type: 'fee',
          amount: result.feeAmount,
          signature: result.signature + '_fee',
          status: 'confirmed',
          fromAddress: user.walletAddress,
          toAddress: BOT_CONFIG.adminWalletAddress,
          metadata: {
            feePercentage: BOT_CONFIG.feePercentage,
            originalWithdrawal: amount,
          },
        });

        await feeTransaction.save();
      }

      // Atualizar saldo
      const newBalance = await WalletService.getBalance(user.walletAddress);
      user.solBalance = newBalance;
      await user.save();

      res.json({
        message: 'Saque realizado com sucesso',
        transaction: {
          signature: result.signature,
          amount: amount - result.feeAmount,
          feeAmount: result.feeAmount,
          toAddress,
          timestamp: new Date(),
        },
        newBalance,
      });
    } catch (error) {
      console.error('Erro no saque:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter histórico de transações
  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { page = 1, limit = 20, type } = req.query;

      const query: any = { userId };
      if (type) {
        query.type = type;
      }

      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

      const total = await Transaction.countDocuments(query);

      const formattedTransactions = transactions.map(tx => ({
        id: tx._id,
        type: tx.type,
        amount: tx.amount,
        token: tx.token,
        signature: tx.signature,
        status: tx.status,
        feeAmount: tx.feeAmount,
        fromAddress: tx.fromAddress,
        toAddress: tx.toAddress,
        createdAt: tx.createdAt,
        metadata: tx.metadata,
      }));

      res.json({
        transactions: formattedTransactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Erro ao obter transações:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter detalhes de uma transação
  static async getTransaction(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { signature } = req.params;

      const transaction = await Transaction.findOne({ 
        userId, 
        signature 
      });

      if (!transaction) {
        res.status(404).json({ error: 'Transação não encontrada' });
        return;
      }

      res.json({
        transaction: {
          id: transaction._id,
          type: transaction.type,
          amount: transaction.amount,
          token: transaction.token,
          signature: transaction.signature,
          status: transaction.status,
          feeAmount: transaction.feeAmount,
          fromAddress: transaction.fromAddress,
          toAddress: transaction.toAddress,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          metadata: transaction.metadata,
        },
      });
    } catch (error) {
      console.error('Erro ao obter transação:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Gerar endereço de depósito (retorna o endereço da carteira do usuário)
  static async getDepositAddress(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json({
        depositAddress: user.walletAddress,
        message: 'Envie SOL para este endereço para fazer depósitos',
        network: 'Solana',
        minimumDeposit: '0.001 SOL',
      });
    } catch (error) {
      console.error('Erro ao obter endereço de depósito:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Validar endereço Solana
  static async validateAddress(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.body;

      if (!address) {
        res.status(400).json({ error: 'Endereço é obrigatório' });
        return;
      }

      const isValid = WalletService.isValidSolanaAddress(address);

      res.json({
        address,
        isValid,
        message: isValid ? 'Endereço válido' : 'Endereço inválido',
      });
    } catch (error) {
      console.error('Erro ao validar endereço:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}