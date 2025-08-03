// Mock Database Service para hospedagem compartilhada
// Simula um banco de dados usando localStorage

interface User {
  id: string;
  email: string;
  username: string;
  walletAddress: string;
  privateKey: string; // Encrypted
  solBalance: number;
  createdAt: string;
  lastLogin?: string;
}

interface BotConfig {
  userId: string;
  isActive: boolean;
  investmentAmount: number;
  stopLoss: number;
  takeProfit: number;
  slippage: number;
  maxTrades: number;
  currentTrades: number;
  riskLevel: 'low' | 'medium' | 'high';
  autoReinvest: boolean;
  targetToken?: string;
  totalProfit: number;
  totalLoss: number;
  lastTradeAt?: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee';
  amount: number;
  token: string;
  status: 'pending' | 'confirmed' | 'failed';
  signature: string;
  fromAddress?: string;
  toAddress?: string;
  feeAmount?: number;
  date: string;
  metadata?: any;
}

interface Token {
  mint: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  score: number;
  change24h: number;
  description?: string;
  image?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  lastUpdated: string;
}

export class MockDatabaseService {
  private static KEYS = {
    USERS: 'spinner_users',
    CURRENT_USER: 'spinner_current_user',
    BOT_CONFIGS: 'spinner_bot_configs',
    TRANSACTIONS: 'spinner_transactions',
    TOKENS: 'spinner_tokens',
    APP_SETTINGS: 'spinner_app_settings'
  };

  // Versioning para migrações
  private static VERSION = '1.0.0';

  // Inicializar dados padrão
  static initialize(): void {
    const version = localStorage.getItem('spinner_version');
    if (version !== this.VERSION) {
      this.migrate();
      localStorage.setItem('spinner_version', this.VERSION);
    }

    // Criar dados de exemplo se não existirem
    if (!this.getUsers().length) {
      this.createSampleData();
    }
  }

  private static migrate(): void {
    // Limpar dados antigos em caso de mudança de estrutura
    console.log('🔄 Migrando dados para versão', this.VERSION);
  }

  private static createSampleData(): void {
    console.log('📝 Criando dados de exemplo...');
    
    // Sample tokens
    const sampleTokens: Token[] = [
      {
        mint: 'HKf7qMqtJk8VBhxm4mJk3VgKmQmqGVxh8VyJm3JhKqHg',
        name: 'Solana Meme Token',
        symbol: 'SMT',
        price: 0.000045,
        marketCap: 450000,
        volume24h: 125000,
        liquidity: 89000,
        score: 85,
        change24h: 15.6,
        description: 'A popular meme token on Solana',
        lastUpdated: new Date().toISOString()
      },
      {
        mint: 'BKf8pMqtJk9VChxm5mJk4VgKmQmqGVxh9VyJm4JhKqIg',
        name: 'Pump Fun Star',
        symbol: 'PFS',
        price: 0.000123,
        marketCap: 1230000,
        volume24h: 245000,
        liquidity: 156000,
        score: 92,
        change24h: 28.4,
        description: 'Rising star on PumpFun platform',
        lastUpdated: new Date().toISOString()
      },
      {
        mint: 'CKf9qNrsJk0VDhxm6mJl5VhKnRnrGWxi0WyKn5KiLrJh',
        name: 'Moon Shot',
        symbol: 'MOON',
        price: 0.000089,
        marketCap: 890000,
        volume24h: 178000,
        liquidity: 67000,
        score: 78,
        change24h: -5.2,
        description: 'Aiming for the moon',
        lastUpdated: new Date().toISOString()
      }
    ];

    this.saveTokens(sampleTokens);
  }

  // === USER MANAGEMENT ===
  static saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
  }

  static getUsers(): User[] {
    const users = localStorage.getItem(this.KEYS.USERS);
    return users ? JSON.parse(users) : [];
  }

  static findUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static findUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  static setCurrentUser(user: User): void {
    // Atualizar last login
    user.lastLogin = new Date().toISOString();
    this.saveUser(user);
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem(this.KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  static updateUserBalance(userId: string, newBalance: number): void {
    const user = this.findUserById(userId);
    if (user) {
      user.solBalance = newBalance;
      this.saveUser(user);
      
      // Atualizar usuário atual se for o mesmo
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setCurrentUser(user);
      }
    }
  }

  static logout(): void {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  }

  // === BOT CONFIGURATION ===
  static saveBotConfig(config: BotConfig): void {
    const configs = this.getBotConfigs();
    const existingIndex = configs.findIndex(c => c.userId === config.userId);
    
    if (existingIndex >= 0) {
      configs[existingIndex] = { ...configs[existingIndex], ...config };
    } else {
      configs.push(config);
    }
    
    localStorage.setItem(this.KEYS.BOT_CONFIGS, JSON.stringify(configs));
  }

  static getBotConfigs(): BotConfig[] {
    const configs = localStorage.getItem(this.KEYS.BOT_CONFIGS);
    return configs ? JSON.parse(configs) : [];
  }

  static getBotConfig(userId: string): BotConfig | null {
    const configs = this.getBotConfigs();
    return configs.find(c => c.userId === userId) || null;
  }

  static getOrCreateBotConfig(userId: string): BotConfig {
    let config = this.getBotConfig(userId);
    
    if (!config) {
      config = {
        userId,
        isActive: false,
        investmentAmount: 0.1,
        stopLoss: 10,
        takeProfit: 20,
        slippage: 5,
        maxTrades: 10,
        currentTrades: 0,
        riskLevel: 'medium',
        autoReinvest: false,
        totalProfit: 0,
        totalLoss: 0
      };
      this.saveBotConfig(config);
    }
    
    return config;
  }

  // === TRANSACTIONS ===
  static saveTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    const existingIndex = transactions.findIndex(t => t.id === transaction.id);
    
    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.push(transaction);
    }
    
    // Manter apenas os últimos 1000 registros
    if (transactions.length > 1000) {
      transactions.splice(0, transactions.length - 1000);
    }
    
    localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static getTransactions(): Transaction[] {
    const transactions = localStorage.getItem(this.KEYS.TRANSACTIONS);
    return transactions ? JSON.parse(transactions) : [];
  }

  static getUserTransactions(userId: string): Transaction[] {
    const transactions = this.getTransactions();
    return transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static addTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    
    this.saveTransaction(newTransaction);
    return newTransaction;
  }

  // === TOKENS ===
  static saveTokens(tokens: Token[]): void {
    localStorage.setItem(this.KEYS.TOKENS, JSON.stringify(tokens));
  }

  static getTokens(): Token[] {
    const tokens = localStorage.getItem(this.KEYS.TOKENS);
    return tokens ? JSON.parse(tokens) : [];
  }

  static findTokenByMint(mint: string): Token | null {
    const tokens = this.getTokens();
    return tokens.find(t => t.mint === mint) || null;
  }

  static updateTokenPrice(mint: string, newPrice: number): void {
    const tokens = this.getTokens();
    const tokenIndex = tokens.findIndex(t => t.mint === mint);
    
    if (tokenIndex >= 0) {
      const oldPrice = tokens[tokenIndex].price;
      tokens[tokenIndex].price = newPrice;
      tokens[tokenIndex].change24h = ((newPrice - oldPrice) / oldPrice) * 100;
      tokens[tokenIndex].lastUpdated = new Date().toISOString();
      this.saveTokens(tokens);
    }
  }

  // === APP SETTINGS ===
  static saveAppSettings(settings: any): void {
    localStorage.setItem(this.KEYS.APP_SETTINGS, JSON.stringify(settings));
  }

  static getAppSettings(): any {
    const settings = localStorage.getItem(this.KEYS.APP_SETTINGS);
    return settings ? JSON.parse(settings) : {
      theme: 'dark',
      language: 'pt',
      notifications: true,
      autoRefresh: true,
      refreshInterval: 30000
    };
  }

  // === UTILITY METHODS ===
  static clear(): void {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem('spinner_version');
  }

  static export(): string {
    const data: any = {
      version: this.VERSION,
      exportDate: new Date().toISOString()
    };
    
    Object.entries(this.KEYS).forEach(([name, key]) => {
      const value = localStorage.getItem(key);
      data[name] = value ? JSON.parse(value) : null;
    });
    
    return JSON.stringify(data, null, 2);
  }

  static import(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      // Verificar versão (opcional)
      if (data.version && data.version !== this.VERSION) {
        console.warn('⚠️ Importing data from different version:', data.version);
      }
      
      Object.entries(this.KEYS).forEach(([name, key]) => {
        if (data[name]) {
          localStorage.setItem(key, JSON.stringify(data[name]));
        }
      });
      
      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return false;
    }
  }

  static getStorageInfo(): {
    used: number;
    total: number;
    percentage: number;
    itemCount: number;
  } {
    let totalSize = 0;
    let itemCount = 0;
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
        itemCount++;
      }
    }
    
    // Estimativa do limite do localStorage (5MB na maioria dos browsers)
    const estimatedLimit = 5 * 1024 * 1024; // 5MB
    
    return {
      used: totalSize,
      total: estimatedLimit,
      percentage: (totalSize / estimatedLimit) * 100,
      itemCount
    };
  }

  // Simular atualizações em tempo real
  static startMockUpdates(): NodeJS.Timeout {
    return setInterval(() => {
      const tokens = this.getTokens();
      
      // Atualizar preços aleatoriamente
      tokens.forEach(token => {
        const change = (Math.random() - 0.5) * 0.1; // ±5%
        const newPrice = token.price * (1 + change);
        this.updateTokenPrice(token.mint, newPrice);
      });
    }, 10000); // A cada 10 segundos
  }

  static stopMockUpdates(intervalId: NodeJS.Timeout): void {
    clearInterval(intervalId);
  }
}

// Inicializar dados ao carregar
if (typeof window !== 'undefined') {
  MockDatabaseService.initialize();
}

export default MockDatabaseService;