import axios, { AxiosResponse } from 'axios';
import { PUMPFUN_API_URL } from '../config/solana';
import { PumpFunToken, IPumpFunToken } from '../models/PumpFunToken';

interface PumpFunTokenData {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  market_cap: number;
  usd_market_cap?: number;
  price?: number;
  virtual_sol_reserves?: number;
  virtual_token_reserves?: number;
  total_supply?: number;
  creator?: string;
  created_timestamp?: number;
  last_trade_timestamp?: number;
  king_of_the_hill_timestamp?: number;
  raydium_pool?: string;
}

interface PumpFunApiResponse {
  success: boolean;
  data: PumpFunTokenData[];
  pagination?: {
    limit: number;
    offset: number;
    total: number;
  };
}

export class PumpFunService {
  private static readonly BASE_URL = PUMPFUN_API_URL;
  private static readonly ENDPOINTS = {
    COINS: '/coins',
    TRADES: '/trades',
    NEW_COINS: '/coins/new',
    HOT_COINS: '/coins/hot',
  };

  // Buscar tokens recém-criados
  static async getNewTokens(limit: number = 50): Promise<IPumpFunToken[]> {
    try {
      const response: AxiosResponse<PumpFunApiResponse> = await axios.get(
        `${this.BASE_URL}${this.ENDPOINTS.NEW_COINS}`,
        {
          params: {
            limit,
            sort: 'created_timestamp',
            order: 'desc',
          },
          timeout: 10000,
        }
      );

      if (response.data.success && response.data.data) {
        const tokens = await this.processTokensData(response.data.data);
        return tokens;
      }

      return [];
    } catch (error) {
      console.error('Erro ao buscar novos tokens:', error);
      return [];
    }
  }

  // Buscar tokens em alta (hot)
  static async getHotTokens(limit: number = 50): Promise<IPumpFunToken[]> {
    try {
      const response: AxiosResponse<PumpFunApiResponse> = await axios.get(
        `${this.BASE_URL}${this.ENDPOINTS.HOT_COINS}`,
        {
          params: {
            limit,
            sort: 'volume_24h',
            order: 'desc',
          },
          timeout: 10000,
        }
      );

      if (response.data.success && response.data.data) {
        const tokens = await this.processTokensData(response.data.data);
        return tokens;
      }

      return [];
    } catch (error) {
      console.error('Erro ao buscar tokens em alta:', error);
      return [];
    }
  }

  // Buscar informações de um token específico
  static async getTokenInfo(mint: string): Promise<IPumpFunToken | null> {
    try {
      const response = await axios.get(
        `${this.BASE_URL}${this.ENDPOINTS.COINS}/${mint}`,
        { timeout: 5000 }
      );

      if (response.data) {
        const tokens = await this.processTokensData([response.data]);
        return tokens[0] || null;
      }

      return null;
    } catch (error) {
      console.error(`Erro ao buscar token ${mint}:`, error);
      return null;
    }
  }

  // Processar dados dos tokens e salvar no banco
  private static async processTokensData(tokensData: PumpFunTokenData[]): Promise<IPumpFunToken[]> {
    const processedTokens: IPumpFunToken[] = [];

    for (const tokenData of tokensData) {
      try {
        const existingToken = await PumpFunToken.findOne({ mint: tokenData.mint });

        const tokenDoc = {
          mint: tokenData.mint,
          name: tokenData.name,
          symbol: tokenData.symbol,
          description: tokenData.description || '',
          image: tokenData.image || '',
          website: tokenData.website || '',
          telegram: tokenData.telegram || '',
          twitter: tokenData.twitter || '',
          marketCap: tokenData.market_cap || 0,
          price: tokenData.price || 0,
          liquidity: tokenData.virtual_sol_reserves || 0,
          volume24h: 0, // Calcular com base nas trades
          holders: 0, // Será calculado posteriormente
          isLaunched: !!tokenData.raydium_pool,
          launchedAt: tokenData.king_of_the_hill_timestamp 
            ? new Date(tokenData.king_of_the_hill_timestamp * 1000) 
            : undefined,
          creator: tokenData.creator || '',
          metadata: {
            totalSupply: tokenData.total_supply,
            virtualSolReserves: tokenData.virtual_sol_reserves,
            virtualTokenReserves: tokenData.virtual_token_reserves,
            raydiumPool: tokenData.raydium_pool,
            lastTradeTimestamp: tokenData.last_trade_timestamp,
          },
          lastUpdated: new Date(),
        };

        let token: IPumpFunToken;

        if (existingToken) {
          // Atualizar token existente
          Object.assign(existingToken, tokenDoc);
          token = await existingToken.save();
        } else {
          // Criar novo token
          token = new PumpFunToken(tokenDoc);
          token = await token.save();
        }

        processedTokens.push(token);
      } catch (error) {
        console.error(`Erro ao processar token ${tokenData.mint}:`, error);
      }
    }

    return processedTokens;
  }

  // Monitorar novos tokens em tempo real
  static startTokenMonitoring(callback: (newTokens: IPumpFunToken[]) => void): NodeJS.Timeout {
    console.log('🚀 Iniciando monitoramento de novos tokens...');

    return setInterval(async () => {
      try {
        const newTokens = await this.getNewTokens(20);
        
        if (newTokens.length > 0) {
          console.log(`📈 ${newTokens.length} novos tokens encontrados`);
          callback(newTokens);
        }
      } catch (error) {
        console.error('Erro no monitoramento de tokens:', error);
      }
    }, 30000); // Verificar a cada 30 segundos
  }

  // Filtrar tokens por critérios de qualidade
  static filterQualityTokens(tokens: IPumpFunToken[]): IPumpFunToken[] {
    return tokens.filter(token => {
      // Critérios básicos de qualidade
      const hasBasicInfo = token.name && token.symbol && token.description;
      const hasMinimumLiquidity = token.liquidity >= 1000; // Mínimo de liquidez
      const hasRecentActivity = token.lastUpdated && 
        (Date.now() - token.lastUpdated.getTime()) < 24 * 60 * 60 * 1000; // Últimas 24h

      return hasBasicInfo && hasMinimumLiquidity && hasRecentActivity;
    });
  }

  // Calcular score de um token para trading
  static calculateTokenScore(token: IPumpFunToken): number {
    let score = 0;

    // Pontuação baseada em liquidez
    if (token.liquidity > 10000) score += 30;
    else if (token.liquidity > 5000) score += 20;
    else if (token.liquidity > 1000) score += 10;

    // Pontuação baseada em market cap
    if (token.marketCap > 100000) score += 25;
    else if (token.marketCap > 50000) score += 15;
    else if (token.marketCap > 10000) score += 5;

    // Pontuação baseada em informações completas
    if (token.description && token.description.length > 50) score += 10;
    if (token.website) score += 5;
    if (token.telegram) score += 5;
    if (token.twitter) score += 5;
    if (token.image) score += 5;

    // Pontuação baseada na idade (tokens muito novos são arriscados)
    const ageInHours = (Date.now() - token.createdAt.getTime()) / (1000 * 60 * 60);
    if (ageInHours > 24) score += 10;
    else if (ageInHours > 12) score += 5;

    return Math.min(score, 100); // Máximo de 100 pontos
  }

  // Obter tokens recomendados para trading
  static async getRecommendedTokens(limit: number = 10): Promise<IPumpFunToken[]> {
    try {
      const [newTokens, hotTokens] = await Promise.all([
        this.getNewTokens(50),
        this.getHotTokens(50),
      ]);

      const allTokens = [...newTokens, ...hotTokens];
      const uniqueTokens = allTokens.filter((token, index, self) => 
        index === self.findIndex(t => t.mint === token.mint)
      );

      const qualityTokens = this.filterQualityTokens(uniqueTokens);
      
      // Calcular score e ordenar
      const scoredTokens = qualityTokens.map(token => ({
        token,
        score: this.calculateTokenScore(token),
      }));

      scoredTokens.sort((a, b) => b.score - a.score);

      return scoredTokens.slice(0, limit).map(item => item.token);
    } catch (error) {
      console.error('Erro ao obter tokens recomendados:', error);
      return [];
    }
  }
}