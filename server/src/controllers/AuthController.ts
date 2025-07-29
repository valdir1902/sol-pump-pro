import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { SpinnerBot } from '../models/SpinnerBot';
import { WalletService } from '../services/WalletService';

export class AuthController {
  // Registrar novo usuário
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username } = req.body;

      // Validações básicas
      if (!email || !password || !username) {
        res.status(400).json({ error: 'Email, senha e nome de usuário são obrigatórios' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
        return;
      }

      // Verificar se usuário já existe
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        res.status(400).json({ error: 'Email ou nome de usuário já existe' });
        return;
      }

      // Gerar carteira única
      const wallet = WalletService.generateWallet();

      // Criar usuário
      const user = new User({
        email,
        password, // Será hasheada automaticamente pelo modelo
        username,
        walletAddress: wallet.publicKey,
        privateKey: wallet.encryptedPrivateKey,
      });

      await user.save();

      // Criar configuração do bot padrão
      const spinnerBot = new SpinnerBot({
        userId: user._id,
        investmentAmount: 0.1,
        stopLoss: 10,
        takeProfit: 20,
        slippage: 5,
        maxTrades: 10,
        configuration: {
          autoReinvest: false,
          riskLevel: 'medium',
          minLiquidity: 1000,
          maxPositionSize: 5,
        },
      });

      await spinnerBot.save();

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          solBalance: user.solBalance,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Login
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email e senha são obrigatórios' });
        return;
      }

      // Buscar usuário
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Verificar senha
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Credenciais inválidas' });
        return;
      }

      // Atualizar último login
      user.lastLogin = new Date();
      await user.save();

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          solBalance: user.solBalance,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter perfil do usuário
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      
      const user = await User.findById(userId).select('-password -privateKey');
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      // Atualizar saldo da carteira
      const currentBalance = await WalletService.getBalance(user.walletAddress);
      user.solBalance = currentBalance;
      await user.save();

      res.json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          solBalance: user.solBalance,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Atualizar perfil
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      const { username } = req.body;

      if (!username) {
        res.status(400).json({ error: 'Nome de usuário é obrigatório' });
        return;
      }

      // Verificar se o username já existe
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });

      if (existingUser) {
        res.status(400).json({ error: 'Nome de usuário já existe' });
        return;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { username },
        { new: true }
      ).select('-password -privateKey');

      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json({
        message: 'Perfil atualizado com sucesso',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
          solBalance: user.solBalance,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Verificar token
  static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId;
      
      const user = await User.findById(userId).select('-password -privateKey');
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json({
        valid: true,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          walletAddress: user.walletAddress,
        },
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}