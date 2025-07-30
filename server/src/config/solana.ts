import { Connection, clusterApiUrl, Commitment } from '@solana/web3.js';

export const SOLANA_NETWORK = (process.env.SOLANA_NETWORK as 'devnet' | 'mainnet-beta' | 'testnet') || 'devnet';
export const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK);
export const COMMITMENT: Commitment = 'confirmed';

export const solanaConnection = new Connection(SOLANA_RPC_URL, COMMITMENT);

export const PUMPFUN_API_URL = process.env.PUMPFUN_API_URL || 'https://frontend-api.pump.fun';

// Configurações do bot
export const BOT_CONFIG = {
  feePercentage: Number(process.env.FEE_PERCENTAGE) || 10,
  minWithdrawalAmount: Number(process.env.MIN_WITHDRAWAL_AMOUNT) || 0.1,
  adminWalletAddress: process.env.ADMIN_WALLET_ADDRESS || '',
  defaultSlippage: Number(process.env.DEFAULT_SLIPPAGE) || 5,
  maxPositionSize: Number(process.env.MAX_POSITION_SIZE) || 10,
  minPositionSize: Number(process.env.MIN_POSITION_SIZE) || 0.01,
};

console.log(`🌐 Conectando à rede Solana: ${SOLANA_NETWORK}`);
console.log(`🔗 RPC URL: ${SOLANA_RPC_URL}`);