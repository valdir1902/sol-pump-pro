import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';

// Configuração do i18next para o backend
i18n
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    // Configuração de idiomas
    lng: 'pt', // idioma padrão
    fallbackLng: 'en',
    supportedLngs: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ru', 'ar', 'hi', 'tr', 'nl', 'sv'],
    
    // Detecção de idioma
    detection: {
      order: ['header', 'querystring', 'cookie'],
      lookupHeader: 'accept-language',
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      caches: ['cookie'],
    },
    
    // Backend para carregar traduções
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
    },
    
    // Configurações gerais
    debug: process.env.NODE_ENV === 'development',
    
    // Namespaces
    defaultNS: 'translation',
    ns: ['translation', 'api', 'errors'],
    
    // Interpolação
    interpolation: {
      escapeValue: false, // não é necessário escapar no backend
      formatSeparator: ',',
      format: (value: any, format: string, lng: string) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'USD'
          }).format(value);
        }
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        if (format === 'date') {
          return new Intl.DateTimeFormat(lng).format(new Date(value));
        }
        return value;
      }
    },
    
    // Configurações específicas do servidor
    initImmediate: false,
    
    // Recursos padrão (fallback)
    resources: {
      en: {
        translation: {
          // Mensagens da API
          'api.success': 'Operation completed successfully',
          'api.error': 'An error occurred',
          'api.unauthorized': 'Unauthorized access',
          'api.forbidden': 'Access forbidden',
          'api.notFound': 'Resource not found',
          'api.validationError': 'Validation error',
          'api.serverError': 'Internal server error',
          
          // Autenticação
          'auth.invalidCredentials': 'Invalid email or password',
          'auth.userExists': 'User already exists',
          'auth.userNotFound': 'User not found',
          'auth.tokenExpired': 'Token has expired',
          'auth.tokenInvalid': 'Invalid token',
          'auth.loginSuccess': 'Login successful',
          'auth.registerSuccess': 'Account created successfully',
          'auth.logoutSuccess': 'Logout successful',
          
          // Wallet
          'wallet.insufficientBalance': 'Insufficient balance',
          'wallet.invalidAddress': 'Invalid Solana address',
          'wallet.transactionFailed': 'Transaction failed',
          'wallet.withdrawalSuccess': 'Withdrawal completed successfully',
          'wallet.depositSuccess': 'Deposit completed successfully',
          'wallet.feeApplied': 'Fee of {{fee}}% applied',
          
          // Bot
          'bot.started': 'Bot started successfully',
          'bot.stopped': 'Bot stopped successfully',
          'bot.configUpdated': 'Bot configuration updated',
          'bot.invalidConfig': 'Invalid bot configuration',
          'bot.alreadyRunning': 'Bot is already running',
          'bot.notRunning': 'Bot is not running',
          'bot.tradeExecuted': 'Trade executed successfully',
          'bot.tradeFailed': 'Trade execution failed',
          
          // Tokens
          'tokens.notFound': 'Token not found',
          'tokens.fetchError': 'Error fetching token data',
          'tokens.scoreCalculated': 'Token score calculated',
          
          // Validação
          'validation.required': 'This field is required',
          'validation.email': 'Invalid email format',
          'validation.minLength': 'Minimum length is {{min}} characters',
          'validation.maxLength': 'Maximum length is {{max}} characters',
          'validation.numeric': 'Must be a number',
          'validation.positive': 'Must be a positive number',
          'validation.range': 'Must be between {{min}} and {{max}}',
          
          // Notificações
          'notification.newToken': 'New token detected: {{name}}',
          'notification.tradeCompleted': 'Trade completed for {{token}}',
          'notification.profitRealized': 'Profit realized: {{amount}} SOL',
          'notification.lossRealized': 'Loss realized: {{amount}} SOL',
          'notification.serverMaintenance': 'Server maintenance scheduled',
          
          // Token SPIN
          'spin.tokenInfo': 'SPIN token information',
          'spin.serverCosts': 'Server costs coverage',
          'spin.benefitsActive': 'SPIN holder benefits active',
          'spin.feeReduction': 'Trading fee reduced by {{discount}}%',
          'spin.prioritySupport': 'Priority support activated',
        }
      },
      pt: {
        translation: {
          // Mensagens da API
          'api.success': 'Operação realizada com sucesso',
          'api.error': 'Ocorreu um erro',
          'api.unauthorized': 'Acesso não autorizado',
          'api.forbidden': 'Acesso proibido',
          'api.notFound': 'Recurso não encontrado',
          'api.validationError': 'Erro de validação',
          'api.serverError': 'Erro interno do servidor',
          
          // Autenticação
          'auth.invalidCredentials': 'Email ou senha inválidos',
          'auth.userExists': 'Usuário já existe',
          'auth.userNotFound': 'Usuário não encontrado',
          'auth.tokenExpired': 'Token expirado',
          'auth.tokenInvalid': 'Token inválido',
          'auth.loginSuccess': 'Login realizado com sucesso',
          'auth.registerSuccess': 'Conta criada com sucesso',
          'auth.logoutSuccess': 'Logout realizado com sucesso',
          
          // Wallet
          'wallet.insufficientBalance': 'Saldo insuficiente',
          'wallet.invalidAddress': 'Endereço Solana inválido',
          'wallet.transactionFailed': 'Transação falhou',
          'wallet.withdrawalSuccess': 'Saque realizado com sucesso',
          'wallet.depositSuccess': 'Depósito realizado com sucesso',
          'wallet.feeApplied': 'Taxa de {{fee}}% aplicada',
          
          // Bot
          'bot.started': 'Bot iniciado com sucesso',
          'bot.stopped': 'Bot parado com sucesso',
          'bot.configUpdated': 'Configuração do bot atualizada',
          'bot.invalidConfig': 'Configuração do bot inválida',
          'bot.alreadyRunning': 'Bot já está rodando',
          'bot.notRunning': 'Bot não está rodando',
          'bot.tradeExecuted': 'Trade executado com sucesso',
          'bot.tradeFailed': 'Execução do trade falhou',
          
          // Tokens
          'tokens.notFound': 'Token não encontrado',
          'tokens.fetchError': 'Erro ao buscar dados do token',
          'tokens.scoreCalculated': 'Pontuação do token calculada',
          
          // Validação
          'validation.required': 'Este campo é obrigatório',
          'validation.email': 'Formato de email inválido',
          'validation.minLength': 'Comprimento mínimo é {{min}} caracteres',
          'validation.maxLength': 'Comprimento máximo é {{max}} caracteres',
          'validation.numeric': 'Deve ser um número',
          'validation.positive': 'Deve ser um número positivo',
          'validation.range': 'Deve estar entre {{min}} e {{max}}',
          
          // Notificações
          'notification.newToken': 'Novo token detectado: {{name}}',
          'notification.tradeCompleted': 'Trade concluído para {{token}}',
          'notification.profitRealized': 'Lucro realizado: {{amount}} SOL',
          'notification.lossRealized': 'Perda realizada: {{amount}} SOL',
          'notification.serverMaintenance': 'Manutenção do servidor agendada',
          
          // Token SPIN
          'spin.tokenInfo': 'Informações do token SPIN',
          'spin.serverCosts': 'Cobertura de custos do servidor',
          'spin.benefitsActive': 'Benefícios do holder SPIN ativos',
          'spin.feeReduction': 'Taxa de trading reduzida em {{discount}}%',
          'spin.prioritySupport': 'Suporte prioritário ativado',
        }
      },
      es: {
        translation: {
          // Mensagens da API
          'api.success': 'Operación completada exitosamente',
          'api.error': 'Ocurrió un error',
          'api.unauthorized': 'Acceso no autorizado',
          'api.forbidden': 'Acceso prohibido',
          'api.notFound': 'Recurso no encontrado',
          'api.validationError': 'Error de validación',
          'api.serverError': 'Error interno del servidor',
          
          // Autenticação
          'auth.invalidCredentials': 'Email o contraseña inválidos',
          'auth.userExists': 'El usuario ya existe',
          'auth.userNotFound': 'Usuario no encontrado',
          'auth.tokenExpired': 'Token expirado',
          'auth.tokenInvalid': 'Token inválido',
          'auth.loginSuccess': 'Inicio de sesión exitoso',
          'auth.registerSuccess': 'Cuenta creada exitosamente',
          'auth.logoutSuccess': 'Cierre de sesión exitoso',
          
          // Resto das traduções em espanhol...
          'wallet.insufficientBalance': 'Saldo insuficiente',
          'bot.started': 'Bot iniciado exitosamente',
          'validation.required': 'Este campo es requerido',
        }
      }
    }
  });

export default i18n;

// Middleware para Express
export const i18nMiddleware = middleware.handle(i18n);

// Helper para usar nas controllers
export const t = (key: string, options?: any) => {
  return i18n.t(key, options);
};

// Helper para detectar idioma da request
export const getLanguageFromRequest = (req: any): string => {
  return req.language || req.lng || 'pt';
};

// Helper para resposta localizada
export const createLocalizedResponse = (req: any, key: string, data?: any, options?: any) => {
  const message = req.t ? req.t(key, options) : i18n.t(key, options);
  return {
    message,
    data,
    language: getLanguageFromRequest(req),
    timestamp: new Date().toISOString()
  };
};