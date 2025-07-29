import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratamento de respostas
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          localStorage.removeItem('authToken');
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  async register(userData: {
    email: string;
    password: string;
    username: string;
  }): Promise<AxiosResponse> {
    return this.client.post('/auth/register', userData);
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse> {
    return this.client.post('/auth/login', credentials);
  }

  async getProfile(): Promise<AxiosResponse> {
    return this.client.get('/auth/profile');
  }

  async updateProfile(data: { username: string }): Promise<AxiosResponse> {
    return this.client.put('/auth/profile', data);
  }

  async verifyToken(): Promise<AxiosResponse> {
    return this.client.get('/auth/verify');
  }

  // Métodos de carteira
  async getWalletBalance(): Promise<AxiosResponse> {
    return this.client.get('/wallet/balance');
  }

  async withdraw(data: {
    toAddress: string;
    amount: number;
  }): Promise<AxiosResponse> {
    return this.client.post('/wallet/withdraw', data);
  }

  async getDepositAddress(): Promise<AxiosResponse> {
    return this.client.get('/wallet/deposit-address');
  }

  async validateAddress(address: string): Promise<AxiosResponse> {
    return this.client.post('/wallet/validate-address', { address });
  }

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<AxiosResponse> {
    return this.client.get('/wallet/transactions', { params });
  }

  async getTransaction(signature: string): Promise<AxiosResponse> {
    return this.client.get(`/wallet/transactions/${signature}`);
  }

  // Métodos do bot
  async getBotConfig(): Promise<AxiosResponse> {
    return this.client.get('/bot/config');
  }

  async updateBotConfig(config: {
    investmentAmount?: number;
    stopLoss?: number;
    takeProfit?: number;
    slippage?: number;
    maxTrades?: number;
    configuration?: any;
  }): Promise<AxiosResponse> {
    return this.client.put('/bot/config', config);
  }

  async startBot(): Promise<AxiosResponse> {
    return this.client.post('/bot/start');
  }

  async stopBot(): Promise<AxiosResponse> {
    return this.client.post('/bot/stop');
  }

  async resetBotTrades(): Promise<AxiosResponse> {
    return this.client.post('/bot/reset');
  }

  async getBotStats(): Promise<AxiosResponse> {
    return this.client.get('/bot/stats');
  }

  async getRecommendedTokens(limit?: number): Promise<AxiosResponse> {
    return this.client.get('/bot/tokens/recommended', {
      params: { limit },
    });
  }

  async getNewTokens(limit?: number): Promise<AxiosResponse> {
    return this.client.get('/bot/tokens/new', {
      params: { limit },
    });
  }

  async getHotTokens(limit?: number): Promise<AxiosResponse> {
    return this.client.get('/bot/tokens/hot', {
      params: { limit },
    });
  }

  // Método genérico para requisições customizadas
  async request(config: any): Promise<AxiosResponse> {
    return this.client.request(config);
  }
}

export const apiClient = new ApiClient();
export default apiClient;