import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Traduções inline para desenvolvimento
const resources = {
  en: {
    translation: {
      // Geral
      'app.title': 'Spinner Bot',
      'app.subtitle': 'Solana Trading Bot',
      'app.loading': 'Loading...',
      'app.error': 'Error',
      'app.success': 'Success',
      'app.warning': 'Warning',
      'app.info': 'Information',
      
      // Navegação
      'nav.overview': 'Overview',
      'nav.bot': 'Spinner Bot',
      'nav.wallet': 'Wallet',
      'nav.tokens': 'Tokens',
      'nav.transactions': 'Transactions',
      'nav.settings': 'Settings',
      'nav.logout': 'Logout',
      
      // Autenticação
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.username': 'Username',
      'auth.confirmPassword': 'Confirm Password',
      'auth.forgotPassword': 'Forgot Password?',
      'auth.noAccount': "Don't have an account?",
      'auth.hasAccount': 'Already have an account?',
      'auth.loginSuccess': 'Login successful!',
      'auth.registerSuccess': 'Account created successfully!',
      'auth.welcomeBack': 'Welcome back to Spinner Bot',
      'auth.createAccount': 'Create your account',
      
      // Dashboard
      'dashboard.welcome': 'Welcome back, {{username}}!',
      'dashboard.totalBalance': 'Total Balance',
      'dashboard.botStatus': 'Bot Status',
      'dashboard.todayTrades': 'Today\'s Trades',
      'dashboard.walletAddress': 'Wallet Address',
      'dashboard.quickStart': 'Quick Start',
      'dashboard.features': 'Features',
      'dashboard.mainWallet': 'Main wallet',
      'dashboard.inactive': 'Inactive',
      'dashboard.configureBot': 'Click "Spinner Bot" to configure',
      'dashboard.noTrades': 'No trades executed',
      'dashboard.solanaAddress': 'Solana Address',
      
      // Bot Configuration
      'bot.configure': 'Configure Bot',
      'bot.start': 'Start Bot',
      'bot.stop': 'Stop Bot',
      'bot.status': 'Bot Status',
      'bot.active': 'Active',
      'bot.inactive': 'Inactive',
      'bot.investmentAmount': 'Investment Amount (SOL)',
      'bot.stopLoss': 'Stop Loss (%)',
      'bot.takeProfit': 'Take Profit (%)',
      'bot.slippage': 'Slippage (%)',
      'bot.maxTrades': 'Max Trades per Day',
      'bot.riskLevel': 'Risk Level',
      'bot.autoReinvest': 'Auto Reinvest',
      'bot.riskLow': 'Low',
      'bot.riskMedium': 'Medium',
      'bot.riskHigh': 'High',
      
      // Carteira
      'wallet.balance': 'Balance',
      'wallet.deposit': 'Deposit',
      'wallet.withdraw': 'Withdraw',
      'wallet.address': 'Wallet Address',
      'wallet.depositAddress': 'Deposit Address',
      'wallet.withdrawAmount': 'Withdrawal Amount',
      'wallet.withdrawAddress': 'Withdrawal Address',
      'wallet.fee': 'Fee ({{fee}}%)',
      'wallet.youReceive': 'You will receive',
      'wallet.minAmount': 'Minimum: {{amount}} SOL',
      
      // Tokens
      'tokens.recommended': 'Recommended Tokens',
      'tokens.new': 'New Tokens',
      'tokens.hot': 'Hot Tokens',
      'tokens.marketCap': 'Market Cap',
      'tokens.price': 'Price',
      'tokens.volume': 'Volume 24h',
      'tokens.liquidity': 'Liquidity',
      'tokens.score': 'Score',
      
      // Transações
      'transactions.history': 'Transaction History',
      'transactions.type': 'Type',
      'transactions.amount': 'Amount',
      'transactions.status': 'Status',
      'transactions.date': 'Date',
      'transactions.signature': 'Signature',
      'transactions.deposit': 'Deposit',
      'transactions.withdrawal': 'Withdrawal',
      'transactions.trade': 'Trade',
      'transactions.fee': 'Fee',
      'transactions.pending': 'Pending',
      'transactions.confirmed': 'Confirmed',
      'transactions.failed': 'Failed',
      
      // Configurações
      'settings.profile': 'Profile',
      'settings.language': 'Language',
      'settings.notifications': 'Notifications',
      'settings.security': 'Security',
      'settings.api': 'API Settings',
      'settings.admin': 'Admin Panel',
      'settings.save': 'Save',
      'settings.cancel': 'Cancel',
      
      // Guia rápido
      'quickStart.title': 'Configure your bot in a few steps',
      'quickStart.step1': '1. Configure the Bot',
      'quickStart.step1Desc': 'Define investment amount, stop loss and take profit',
      'quickStart.step2': '2. Make a Deposit',
      'quickStart.step2Desc': 'Transfer SOL to your bot wallet',
      'quickStart.step3': '3. Start Trading',
      'quickStart.step3Desc': 'Activate the bot and start trading automatically',
      
      // Recursos
      'features.title': 'Main system features',
      'features.autoTrading': 'Automated Trading',
      'features.autoTradingDesc': 'Smart bot for PumpFun tokens',
      'features.integratedWallet': 'Integrated Wallet',
      'features.integratedWalletDesc': 'Exclusive SOL wallet with 10% fee',
      'features.smartAnalysis': 'Smart Analysis',
      'features.smartAnalysisDesc': 'Advanced detection algorithms',
      
      // Formulários
      'form.required': 'This field is required',
      'form.invalidEmail': 'Invalid email format',
      'form.passwordTooShort': 'Password must be at least 6 characters',
      'form.passwordsDontMatch': 'Passwords do not match',
      'form.invalidAmount': 'Invalid amount',
      'form.submit': 'Submit',
      'form.reset': 'Reset',
      
      // Botões
      'button.save': 'Save',
      'button.cancel': 'Cancel',
      'button.delete': 'Delete',
      'button.edit': 'Edit',
      'button.view': 'View',
      'button.copy': 'Copy',
      'button.close': 'Close',
      'button.confirm': 'Confirm',
      
      // Status
      'status.online': 'Online',
      'status.offline': 'Offline',
      'status.connecting': 'Connecting',
      'status.connected': 'Connected',
      'status.disconnected': 'Disconnected',
      
      // Mensagens de erro
      'error.networkError': 'Network error. Please try again.',
      'error.serverError': 'Server error. Please try again later.',
      'error.unauthorized': 'Unauthorized access.',
      'error.invalidCredentials': 'Invalid credentials.',
      'error.userExists': 'User already exists.',
      'error.insufficientBalance': 'Insufficient balance.',
      'error.invalidAddress': 'Invalid Solana address.',
      'error.transactionFailed': 'Transaction failed.',
      
      // Token para custos de servidor
      'token.serverCosts': 'Server Costs Token',
      'token.description': 'Help us maintain the servers and improve the bot',
      'token.symbol': 'SPIN',
      'token.totalSupply': 'Total Supply',
      'token.holders': 'Holders',
      'token.buy': 'Buy SPIN Token',
      'token.benefits': 'Benefits',
      'token.benefit1': 'Reduced trading fees',
      'token.benefit2': 'Priority support',
      'token.benefit3': 'Advanced features',
      'token.benefit4': 'Server cost sharing'
    }
  },
  pt: {
    translation: {
      // Geral
      'app.title': 'Spinner Bot',
      'app.subtitle': 'Bot de Trading Solana',
      'app.loading': 'Carregando...',
      'app.error': 'Erro',
      'app.success': 'Sucesso',
      'app.warning': 'Aviso',
      'app.info': 'Informação',
      
      // Navegação
      'nav.overview': 'Visão Geral',
      'nav.bot': 'Spinner Bot',
      'nav.wallet': 'Carteira',
      'nav.tokens': 'Tokens',
      'nav.transactions': 'Transações',
      'nav.settings': 'Configurações',
      'nav.logout': 'Sair',
      
      // Autenticação
      'auth.login': 'Entrar',
      'auth.register': 'Registrar',
      'auth.email': 'Email',
      'auth.password': 'Senha',
      'auth.username': 'Nome de usuário',
      'auth.confirmPassword': 'Confirmar Senha',
      'auth.forgotPassword': 'Esqueceu a senha?',
      'auth.noAccount': 'Não tem uma conta?',
      'auth.hasAccount': 'Já tem uma conta?',
      'auth.loginSuccess': 'Login realizado com sucesso!',
      'auth.registerSuccess': 'Conta criada com sucesso!',
      'auth.welcomeBack': 'Bem-vindo de volta ao Spinner Bot',
      'auth.createAccount': 'Crie sua conta',
      
      // Dashboard
      'dashboard.welcome': 'Bem-vindo de volta, {{username}}!',
      'dashboard.totalBalance': 'Saldo Total',
      'dashboard.botStatus': 'Status do Bot',
      'dashboard.todayTrades': 'Trades de Hoje',
      'dashboard.walletAddress': 'Endereço da Carteira',
      'dashboard.quickStart': 'Início Rápido',
      'dashboard.features': 'Recursos',
      'dashboard.mainWallet': 'Carteira principal',
      'dashboard.inactive': 'Inativo',
      'dashboard.configureBot': 'Clique em "Spinner Bot" para configurar',
      'dashboard.noTrades': 'Nenhum trade executado',
      'dashboard.solanaAddress': 'Endereço Solana',
      
      // Bot Configuration
      'bot.configure': 'Configurar Bot',
      'bot.start': 'Iniciar Bot',
      'bot.stop': 'Parar Bot',
      'bot.status': 'Status do Bot',
      'bot.active': 'Ativo',
      'bot.inactive': 'Inativo',
      'bot.investmentAmount': 'Valor de Investimento (SOL)',
      'bot.stopLoss': 'Stop Loss (%)',
      'bot.takeProfit': 'Take Profit (%)',
      'bot.slippage': 'Slippage (%)',
      'bot.maxTrades': 'Máx. Trades por Dia',
      'bot.riskLevel': 'Nível de Risco',
      'bot.autoReinvest': 'Reinvestir Automaticamente',
      'bot.riskLow': 'Baixo',
      'bot.riskMedium': 'Médio',
      'bot.riskHigh': 'Alto',
      
      // Carteira
      'wallet.balance': 'Saldo',
      'wallet.deposit': 'Depositar',
      'wallet.withdraw': 'Sacar',
      'wallet.address': 'Endereço da Carteira',
      'wallet.depositAddress': 'Endereço para Depósito',
      'wallet.withdrawAmount': 'Valor do Saque',
      'wallet.withdrawAddress': 'Endereço de Destino',
      'wallet.fee': 'Taxa ({{fee}}%)',
      'wallet.youReceive': 'Você receberá',
      'wallet.minAmount': 'Mínimo: {{amount}} SOL',
      
      // Tokens
      'tokens.recommended': 'Tokens Recomendados',
      'tokens.new': 'Novos Tokens',
      'tokens.hot': 'Tokens em Alta',
      'tokens.marketCap': 'Market Cap',
      'tokens.price': 'Preço',
      'tokens.volume': 'Volume 24h',
      'tokens.liquidity': 'Liquidez',
      'tokens.score': 'Pontuação',
      
      // Transações
      'transactions.history': 'Histórico de Transações',
      'transactions.type': 'Tipo',
      'transactions.amount': 'Valor',
      'transactions.status': 'Status',
      'transactions.date': 'Data',
      'transactions.signature': 'Assinatura',
      'transactions.deposit': 'Depósito',
      'transactions.withdrawal': 'Saque',
      'transactions.trade': 'Trade',
      'transactions.fee': 'Taxa',
      'transactions.pending': 'Pendente',
      'transactions.confirmed': 'Confirmado',
      'transactions.failed': 'Falhou',
      
      // Configurações
      'settings.profile': 'Perfil',
      'settings.language': 'Idioma',
      'settings.notifications': 'Notificações',
      'settings.security': 'Segurança',
      'settings.api': 'Configurações da API',
      'settings.admin': 'Painel Admin',
      'settings.save': 'Salvar',
      'settings.cancel': 'Cancelar',
      
      // Guia rápido
      'quickStart.title': 'Configure seu bot em poucos passos',
      'quickStart.step1': '1. Configure o Bot',
      'quickStart.step1Desc': 'Defina valor de investimento, stop loss e take profit',
      'quickStart.step2': '2. Faça um Depósito',
      'quickStart.step2Desc': 'Transfira SOL para sua carteira do bot',
      'quickStart.step3': '3. Inicie o Trading',
      'quickStart.step3Desc': 'Ative o bot e comece a operar automaticamente',
      
      // Recursos
      'features.title': 'Funcionalidades principais do sistema',
      'features.autoTrading': 'Trading Automatizado',
      'features.autoTradingDesc': 'Bot inteligente para tokens PumpFun',
      'features.integratedWallet': 'Carteira Integrada',
      'features.integratedWalletDesc': 'Carteira SOL exclusiva com taxa de 10%',
      'features.smartAnalysis': 'Análise Inteligente',
      'features.smartAnalysisDesc': 'Algoritmos avançados de detecção',
      
      // Formulários
      'form.required': 'Este campo é obrigatório',
      'form.invalidEmail': 'Formato de email inválido',
      'form.passwordTooShort': 'A senha deve ter pelo menos 6 caracteres',
      'form.passwordsDontMatch': 'As senhas não coincidem',
      'form.invalidAmount': 'Valor inválido',
      'form.submit': 'Enviar',
      'form.reset': 'Limpar',
      
      // Botões
      'button.save': 'Salvar',
      'button.cancel': 'Cancelar',
      'button.delete': 'Excluir',
      'button.edit': 'Editar',
      'button.view': 'Visualizar',
      'button.copy': 'Copiar',
      'button.close': 'Fechar',
      'button.confirm': 'Confirmar',
      
      // Status
      'status.online': 'Online',
      'status.offline': 'Offline',
      'status.connecting': 'Conectando',
      'status.connected': 'Conectado',
      'status.disconnected': 'Desconectado',
      
      // Mensagens de erro
      'error.networkError': 'Erro de rede. Tente novamente.',
      'error.serverError': 'Erro do servidor. Tente novamente mais tarde.',
      'error.unauthorized': 'Acesso não autorizado.',
      'error.invalidCredentials': 'Credenciais inválidas.',
      'error.userExists': 'Usuário já existe.',
      'error.insufficientBalance': 'Saldo insuficiente.',
      'error.invalidAddress': 'Endereço Solana inválido.',
      'error.transactionFailed': 'Transação falhou.',
      
      // Token para custos de servidor
      'token.serverCosts': 'Token de Custos do Servidor',
      'token.description': 'Ajude-nos a manter os servidores e melhorar o bot',
      'token.symbol': 'SPIN',
      'token.totalSupply': 'Supply Total',
      'token.holders': 'Holders',
      'token.buy': 'Comprar Token SPIN',
      'token.benefits': 'Benefícios',
      'token.benefit1': 'Taxas de trading reduzidas',
      'token.benefit2': 'Suporte prioritário',
      'token.benefit3': 'Funcionalidades avançadas',
      'token.benefit4': 'Compartilhamento de custos do servidor'
    }
  },
  es: {
    translation: {
      // Geral
      'app.title': 'Spinner Bot',
      'app.subtitle': 'Bot de Trading Solana',
      'app.loading': 'Cargando...',
      'app.error': 'Error',
      'app.success': 'Éxito',
      'app.warning': 'Advertencia',
      'app.info': 'Información',
      
      // Navegación
      'nav.overview': 'Resumen',
      'nav.bot': 'Spinner Bot',
      'nav.wallet': 'Cartera',
      'nav.tokens': 'Tokens',
      'nav.transactions': 'Transacciones',
      'nav.settings': 'Configuración',
      'nav.logout': 'Salir',
      
      // Autenticación
      'auth.login': 'Iniciar Sesión',
      'auth.register': 'Registrarse',
      'auth.email': 'Email',
      'auth.password': 'Contraseña',
      'auth.username': 'Nombre de usuario',
      'auth.confirmPassword': 'Confirmar Contraseña',
      'auth.forgotPassword': '¿Olvidaste tu contraseña?',
      'auth.noAccount': '¿No tienes cuenta?',
      'auth.hasAccount': '¿Ya tienes cuenta?',
      'auth.loginSuccess': '¡Inicio de sesión exitoso!',
      'auth.registerSuccess': '¡Cuenta creada exitosamente!',
      'auth.welcomeBack': 'Bienvenido de vuelta a Spinner Bot',
      'auth.createAccount': 'Crea tu cuenta',
      
      // Dashboard
      'dashboard.welcome': '¡Bienvenido de vuelta, {{username}}!',
      'dashboard.totalBalance': 'Saldo Total',
      'dashboard.botStatus': 'Estado del Bot',
      'dashboard.todayTrades': 'Trades de Hoy',
      'dashboard.walletAddress': 'Dirección de Cartera',
      'dashboard.quickStart': 'Inicio Rápido',
      'dashboard.features': 'Características',
      'dashboard.mainWallet': 'Cartera principal',
      'dashboard.inactive': 'Inactivo',
      'dashboard.configureBot': 'Haz clic en "Spinner Bot" para configurar',
      'dashboard.noTrades': 'No hay trades ejecutados',
      'dashboard.solanaAddress': 'Dirección Solana',
      
      // Bot Configuration
      'bot.configure': 'Configurar Bot',
      'bot.start': 'Iniciar Bot',
      'bot.stop': 'Detener Bot',
      'bot.status': 'Estado del Bot',
      'bot.active': 'Activo',
      'bot.inactive': 'Inactivo',
      'bot.investmentAmount': 'Monto de Inversión (SOL)',
      'bot.stopLoss': 'Stop Loss (%)',
      'bot.takeProfit': 'Take Profit (%)',
      'bot.slippage': 'Slippage (%)',
      'bot.maxTrades': 'Máx. Trades por Día',
      'bot.riskLevel': 'Nivel de Riesgo',
      'bot.autoReinvest': 'Reinvertir Automáticamente',
      'bot.riskLow': 'Bajo',
      'bot.riskMedium': 'Medio',
      'bot.riskHigh': 'Alto',
      
      // Token para custos de servidor
      'token.serverCosts': 'Token de Costos del Servidor',
      'token.description': 'Ayúdanos a mantener los servidores y mejorar el bot',
      'token.symbol': 'SPIN',
      'token.totalSupply': 'Supply Total',
      'token.holders': 'Holders',
      'token.buy': 'Comprar Token SPIN',
      'token.benefits': 'Beneficios',
      'token.benefit1': 'Tarifas de trading reducidas',
      'token.benefit2': 'Soporte prioritario',
      'token.benefit3': 'Funcionalidades avanzadas',
      'token.benefit4': 'Compartir costos del servidor'
      // ... continuar con resto das traduções
    }
  }
};

// Lista de idiomas suportados
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
];

const i18nConfig = {
  // Configuração de fallback
  fallbackLng: 'en',
  lng: 'pt', // idioma padrão
  
  // Namespaces
  defaultNS: 'translation',
  ns: ['translation'],
  
  // Detecção de idioma
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage'],
  },
  
  // Backend para carregamento de traduções
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  
  // Interpolação
  interpolation: {
    escapeValue: false, // React já escapa
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
      return value;
    }
  },
  
  // Desenvolvimento
  debug: process.env.NODE_ENV === 'development',
  
  // Recursos inline para fallback
  resources,
  
  // React específico
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
  }
};

// Inicializar i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig);

export default i18n;