import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { PumpFunService } from './services/PumpFunService';
import { i18nMiddleware } from './config/i18n';

// Importar rotas
import authRoutes from './routes/auth';
import walletRoutes from './routes/wallet';
import botRoutes from './routes/bot';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware de internacionalização
app.use(i18nMiddleware);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Lang: ${req.language || 'default'}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    language: req.language || 'pt',
    message: req.t ? req.t('api.success') : 'Server is running'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Solana Spinner Bot API',
    version: '1.0.0',
    description: req.t ? req.t('api.description', { defaultValue: 'API for Solana trading bot with PumpFun integration' }) : 'API for Solana trading bot with PumpFun integration',
    language: req.language || 'pt',
    supportedLanguages: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ru', 'ar', 'hi', 'tr', 'nl', 'sv'],
    endpoints: {
      auth: '/api/auth',
      wallet: '/api/wallet',
      bot: '/api/bot',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Registrar rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bot', botRoutes);

// Middleware de erro global com suporte a i18n
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Erro global:', err);
  
  const errorMessage = req.t ? req.t('api.serverError') : 'Internal server error';
  const language = req.language || 'pt';
  
  res.status(500).json({
    error: errorMessage,
    language,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// 404 handler com suporte a i18n
app.use((req, res) => {
  const notFoundMessage = req.t ? req.t('api.notFound') : 'Endpoint not found';
  const language = req.language || 'pt';
  
  res.status(404).json({
    error: notFoundMessage,
    path: req.path,
    method: req.method,
    language,
    timestamp: new Date().toISOString()
  });
});

// Função para iniciar o servidor
const startServer = async (): Promise<void> => {
  try {
    // Conectar ao banco de dados
    await connectDatabase();
    
    // Iniciar monitoramento de tokens PumpFun
    PumpFunService.startTokenMonitoring((newTokens) => {
      console.log(`📈 ${newTokens.length} novos tokens detectados no PumpFun`);
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 API disponível em: http://localhost:${PORT}/api`);
      console.log(`🌍 Idiomas suportados: pt, en, es, fr, de, it, ja, ko, zh, ru, ar, hi, tr, nl, sv`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de sinais de processo
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM recebido, fechando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT recebido, fechando servidor...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

export { app, startServer };