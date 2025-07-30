import { Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { solanaConnection, BOT_CONFIG } from '../config/solana';
import crypto from 'crypto';

export class WalletService {
  // Criptografia para proteger chaves privadas
  private static encrypt(text: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'default-secret', 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  private static decrypt(encryptedText: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.JWT_SECRET || 'default-secret', 'salt', 32);
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encrypted = textParts.join(':');
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Gerar nova carteira
  static generateWallet(): { publicKey: string; privateKey: string; encryptedPrivateKey: string } {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    const privateKey = Array.from(keypair.secretKey).join(',');
    const encryptedPrivateKey = this.encrypt(privateKey);

    return {
      publicKey,
      privateKey,
      encryptedPrivateKey,
    };
  }

  // Recuperar keypair da chave privada criptografada
  static getKeypairFromEncryptedPrivate(encryptedPrivateKey: string): Keypair {
    const decryptedPrivateKey = this.decrypt(encryptedPrivateKey);
    const secretKeyArray = decryptedPrivateKey.split(',').map(num => parseInt(num));
    const secretKey = Uint8Array.from(secretKeyArray);
    
    return Keypair.fromSecretKey(secretKey);
  }

  // Obter saldo da carteira
  static async getBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await solanaConnection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
      return 0;
    }
  }

  // Transferir SOL
  static async transferSOL(
    fromEncryptedPrivateKey: string,
    toAddress: string,
    amount: number
  ): Promise<{ signature: string; success: boolean; error?: string }> {
    try {
      const fromKeypair = this.getKeypairFromEncryptedPrivate(fromEncryptedPrivateKey);
      const toPublicKey = new PublicKey(toAddress);
      const lamports = amount * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      const signature = await sendAndConfirmTransaction(
        solanaConnection,
        transaction,
        [fromKeypair]
      );

      return { signature, success: true };
    } catch (error) {
      console.error('Erro na transferência:', error);
      return { 
        signature: '', 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  // Sacar com taxa de 10%
  static async withdrawWithFee(
    userEncryptedPrivateKey: string,
    userWalletAddress: string,
    toAddress: string,
    amount: number
  ): Promise<{ signature: string; success: boolean; error?: string; feeAmount: number }> {
    try {
      // Verificar saldo disponível
      const balance = await this.getBalance(userWalletAddress);
      
      if (balance < amount) {
        return {
          signature: '',
          success: false,
          error: 'Saldo insuficiente',
          feeAmount: 0
        };
      }

      if (amount < BOT_CONFIG.minWithdrawalAmount) {
        return {
          signature: '',
          success: false,
          error: `Valor mínimo de saque: ${BOT_CONFIG.minWithdrawalAmount} SOL`,
          feeAmount: 0
        };
      }

      const feeAmount = (amount * BOT_CONFIG.feePercentage) / 100;
      const userReceives = amount - feeAmount;

      const fromKeypair = this.getKeypairFromEncryptedPrivate(userEncryptedPrivateKey);
      const toPublicKey = new PublicKey(toAddress);
      const adminPublicKey = new PublicKey(BOT_CONFIG.adminWalletAddress);

      const transaction = new Transaction();

      // Transferência para o usuário
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports: userReceives * LAMPORTS_PER_SOL,
        })
      );

      // Taxa para o admin
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: adminPublicKey,
          lamports: feeAmount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendAndConfirmTransaction(
        solanaConnection,
        transaction,
        [fromKeypair]
      );

      return { signature, success: true, feeAmount };
    } catch (error) {
      console.error('Erro no saque:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        feeAmount: 0
      };
    }
  }

  // Validar endereço Solana
  static isValidSolanaAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  // Monitorar transações de uma carteira
  static async monitorWallet(walletAddress: string, callback: (signature: string) => void): Promise<void> {
    const publicKey = new PublicKey(walletAddress);
    
    solanaConnection.onAccountChange(publicKey, (accountInfo, context) => {
      console.log(`Mudança detectada na carteira ${walletAddress}:`, accountInfo);
      // Aqui você pode implementar lógica adicional para processar mudanças
    });
  }
}