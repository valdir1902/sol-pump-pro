// Mock API Service para hospedagem compartilhada
// Simula todas as chamadas de API usando localStorage

import { MockDatabaseService } from './MockDatabaseService';
import { Keypair } from '@solana/web3.js';

// Simular delay de rede
const delay = (ms: number = 300 + Math.random() * 700): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Encrypt/Decrypt simple para chaves privadas
const simpleEncrypt = (text: string): string => btoa(text);
const simpleDecrypt = (encrypted: string): string => atob(encrypted);

export class MockApiService {
  // === AUTH ENDPOINTS ===
  
  static async register(email: string, password: string, username: string) {
    await delay();
    
    try {
      // Validar dados
      if (!email || !password || !username) {
        throw new Error('Todos os campos são obrigatórios');
      }
      
      if (password.length < 6) {
        throw new Error('Senha deve ter pelo menos 6 caracteres');
      }
      
      // Verificar se usuário já existe
      const existingUser = MockDatabaseService.findUserByEmail(email);
      if (existingUser) {
        throw new Error('Usuário já existe com este email');
      }
      
      // Gerar carteira Solana
      const keypair = Keypair.generate();
      const walletAddress = keypair.publicKey.toString();
      const privateKey = Array.from(keypair.secretKey).join(',');
      
      // Criar usuário
      const user = {
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        username,
        walletAddress,
        privateKey: simpleEncrypt(privateKey),
        solBalance: 0,
        createdAt: new Date().toISOString()
      };
      
      MockDatabaseService.saveUser(user);
      MockDatabaseService.setCurrentUser(user);
      
      // Criar configuração inicial do bot
      MockDatabaseService.getOrCreateBotConfig(user.id);
      
      // Simular token JWT
      const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + (24 * 60 * 60 * 1000) }));
      
      return {
        success: true,
        message: 'Conta criada com sucesso!',
        data: { 
          user: { ...user, privateKey: undefined },
          token
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar conta');
    }
  }
  
  static async login(email: string, password: string) {
    await delay();
    
    try {
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      const user = MockDatabaseService.findUserByEmail(email);
      if (!user) {
        throw new Error('Credenciais inválidas');
      }
      
      // Em um sistema real, verificaríamos a senha hasheada
      // Por simplicidade, aceitamos qualquer senha para usuários existentes
      
      MockDatabaseService.setCurrentUser(user);
      
      // Simular token JWT
      const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + (24 * 60 * 60 * 1000) }));
      
      return {
        success: true,
        message: 'Login realizado com sucesso!',
        data: { 
          user: { ...user, privateKey: undefined },
          token
        }
      };
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }
  
  static async getProfile() {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    return {
      success: true,
      data: { user: { ...user, privateKey: undefined } }
    };
  }
  
  static async updateProfile(userData: any) {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const updatedUser = { ...user, ...userData };
    MockDatabaseService.saveUser(updatedUser);
    MockDatabaseService.setCurrentUser(updatedUser);
    
    return {
      success: true,
      message: 'Perfil atualizado com sucesso!',
      data: { user: { ...updatedUser, privateKey: undefined } }
    };
  }
  
  static async verifyToken() {
    await delay(100);
    
    const user = MockDatabaseService.getCurrentUser();
    return {
      success: true,
      data: { valid: !!user }
    };
  }
  
  // === WALLET ENDPOINTS ===
  
  static async getBalance() {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    // Simular consulta real de saldo na blockchain
    const realBalance = user.solBalance + (Math.random() * 0.001); // Pequena variação
    
    return {
      success: true,
      data: { 
        balance: realBalance,
        walletAddress: user.walletAddress
      }
    };
  }
  
  static async withdraw(toAddress: string, amount: number) {
    await delay(2000); // Simular transação mais lenta
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const feePercentage = 10;
    const feeAmount = (amount * feePercentage) / 100;
    const totalAmount = amount + feeAmount;
    
    if (user.solBalance < totalAmount) {
      throw new Error('Saldo insuficiente');
    }
    
    // Simular transação
    const signature = 'mock_signature_' + crypto.randomUUID().substring(0, 8);
    
    // Atualizar saldo
    const newBalance = user.solBalance - totalAmount;
    MockDatabaseService.updateUserBalance(user.id, newBalance);
    
    // Registrar transação
    MockDatabaseService.addTransaction({
      userId: user.id,
      type: 'withdrawal',
      amount: amount,
      token: 'SOL',
      status: 'confirmed',
      signature,
      toAddress,
      feeAmount
    });
    
    return {
      success: true,
      message: 'Saque realizado com sucesso!',
      data: {
        signature,
        amount,
        feeAmount,
        received: amount - feeAmount,
        newBalance
      }
    };
  }
  
  static async getDepositAddress() {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    return {
      success: true,
      data: { address: user.walletAddress }
    };
  }
  
  static async getTransactions() {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const transactions = MockDatabaseService.getUserTransactions(user.id);
    
    return {
      success: true,
      data: { transactions }
    };
  }
  
  // === BOT ENDPOINTS ===
  
  static async getBotConfig() {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const config = MockDatabaseService.getOrCreateBotConfig(user.id);
    
    return {
      success: true,
      data: { config }
    };
  }
  
  static async updateBotConfig(configData: any) {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const currentConfig = MockDatabaseService.getOrCreateBotConfig(user.id);
    const updatedConfig = { ...currentConfig, ...configData };
    
    MockDatabaseService.saveBotConfig(updatedConfig);
    
    return {
      success: true,
      message: 'Configuração do bot atualizada!',
      data: { config: updatedConfig }
    };
  }
  
  static async startBot() {
    await delay(1000);
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const config = MockDatabaseService.getOrCreateBotConfig(user.id);
    
    if (user.solBalance < config.investmentAmount) {
      throw new Error('Saldo insuficiente para iniciar o bot');
    }
    
    config.isActive = true;
    MockDatabaseService.saveBotConfig(config);
    
    // Simular início de trades
    this.simulateBotActivity(user.id);
    
    return {
      success: true,
      message: 'Bot iniciado com sucesso!',
      data: { config }
    };
  }
  
  static async stopBot() {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const config = MockDatabaseService.getOrCreateBotConfig(user.id);
    config.isActive = false;
    MockDatabaseService.saveBotConfig(config);
    
    return {
      success: true,
      message: 'Bot parado com sucesso!',
      data: { config }
    };
  }
  
  static async getBotStats() {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const config = MockDatabaseService.getOrCreateBotConfig(user.id);
    const transactions = MockDatabaseService.getUserTransactions(user.id);
    
    const trades = transactions.filter(t => t.type === 'trade');
    const profits = trades.filter(t => t.amount > 0);
    const losses = trades.filter(t => t.amount < 0);
    
    return {
      success: true,
      data: {
        totalTrades: trades.length,
        totalProfit: profits.reduce((sum, t) => sum + t.amount, 0),
        totalLoss: Math.abs(losses.reduce((sum, t) => sum + t.amount, 0)),
        successRate: trades.length > 0 ? (profits.length / trades.length) * 100 : 0,
        currentTrades: config.currentTrades,
        isActive: config.isActive
      }
    };
  }
  
  // === TOKEN ENDPOINTS ===
  
  static async getRecommendedTokens() {
    await delay();
    
    const tokens = MockDatabaseService.getTokens();
    
    // Ordenar por score
    const recommendedTokens = tokens
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    return {
      success: true,
      data: { tokens: recommendedTokens }
    };
  }
  
  static async getNewTokens() {
    await delay();
    
    const tokens = MockDatabaseService.getTokens();
    
    // Simular novos tokens (últimas 24h)
    const newTokens = tokens
      .filter(token => {
        const tokenDate = new Date(token.lastUpdated);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return tokenDate > dayAgo;
      })
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    
    return {
      success: true,
      data: { tokens: newTokens }
    };
  }
  
  static async getHotTokens() {
    await delay();
    
    const tokens = MockDatabaseService.getTokens();
    
    // Ordenar por mudança de preço 24h
    const hotTokens = tokens
      .sort((a, b) => b.change24h - a.change24h)
      .slice(0, 10);
    
    return {
      success: true,
      data: { tokens: hotTokens }
    };
  }
  
  // === UTILITY METHODS ===
  
  private static simulateBotActivity(userId: string) {
    // Simular atividade do bot em background
    const interval = setInterval(() => {
      const config = MockDatabaseService.getBotConfig(userId);
      if (!config || !config.isActive) {
        clearInterval(interval);
        return;
      }
      
      // Simular trade ocasional
      if (Math.random() < 0.3 && config.currentTrades < config.maxTrades) {
        const tokens = MockDatabaseService.getTokens();
        const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
        
        const isProfit = Math.random() > 0.4; // 60% chance de lucro
        const amount = config.investmentAmount * (isProfit ? 1.1 : 0.9); // ±10%
        
        MockDatabaseService.addTransaction({
          userId,
          type: 'trade',
          amount: isProfit ? amount : -amount,
          token: randomToken.symbol,
          status: 'confirmed',
          signature: 'mock_trade_' + crypto.randomUUID().substring(0, 8),
          metadata: {
            tokenMint: randomToken.mint,
            tradeType: isProfit ? 'profit' : 'loss',
            botTrade: true
          }
        });
        
        // Atualizar configuração do bot
        config.currentTrades += 1;
        if (isProfit) {
          config.totalProfit += (amount - config.investmentAmount);
        } else {
          config.totalLoss += (config.investmentAmount - amount);
        }
        config.lastTradeAt = new Date().toISOString();
        
        MockDatabaseService.saveBotConfig(config);
        
        // Atualizar saldo do usuário
        const user = MockDatabaseService.findUserById(userId);
        if (user) {
          const newBalance = user.solBalance + (amount - config.investmentAmount);
          MockDatabaseService.updateUserBalance(userId, Math.max(0, newBalance));
        }
      }
    }, 10000 + Math.random() * 20000); // Entre 10-30 segundos
    
    // Parar após 5 minutos (para demo)
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
  }
  
  static async validateAddress(address: string) {
    await delay(200);
    
    // Validação simples de endereço Solana
    const isValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    
    return {
      success: true,
      data: { valid: isValid }
    };
  }
  
  // === DATA MANAGEMENT ===
  
  static async exportData() {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const data = MockDatabaseService.export();
    
    return {
      success: true,
      data: { exportData: data }
    };
  }
  
  static async importData(jsonData: string) {
    await delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    const success = MockDatabaseService.import(jsonData);
    
    if (!success) {
      throw new Error('Falha ao importar dados');
    }
    
    return {
      success: true,
      message: 'Dados importados com sucesso!'
    };
  }
  
  static async getStorageInfo() {
    await delay(100);
    
    const storageInfo = MockDatabaseService.getStorageInfo();
    
    return {
      success: true,
      data: storageInfo
    };
  }
  
  // === ADMIN/DEBUG ===
  
  static async clearAllData() {
    await delay();
    
    MockDatabaseService.clear();
    
    return {
      success: true,
      message: 'Todos os dados foram limpos'
    };
  }
  
  static async createSampleUser() {
    await delay();
    
    try {
      const result = await this.register(
        'demo@spinnerbot.com',
        'demo123',
        'DemoUser'
      );
      
      // Adicionar saldo de demonstração
      const user = MockDatabaseService.getCurrentUser();
      if (user) {
        MockDatabaseService.updateUserBalance(user.id, 1.0); // 1 SOL
        
        // Criar algumas transações de exemplo
        MockDatabaseService.addTransaction({
          userId: user.id,
          type: 'deposit',
          amount: 1.0,
          token: 'SOL',
          status: 'confirmed',
          signature: 'demo_deposit_' + Date.now()
        });
      }
      
      return {
        success: true,
        message: 'Usuário de demonstração criado!',
        data: result.data
      };
    } catch (error: any) {
      throw new Error('Falha ao criar usuário demo: ' + error.message);
    }
  }
}

export default MockApiService;