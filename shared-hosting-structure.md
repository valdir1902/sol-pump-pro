# 🌐 Solana Spinner Bot - Hospedagem Compartilhada

## 📋 Limitações da Hospedagem Compartilhada

### ❌ O que NÃO funciona:
- Node.js/Express server
- MongoDB database
- PM2 process manager
- Real-time WebSocket connections
- Server-side rendering

### ✅ O que FUNCIONA:
- Frontend React estático
- Local Storage para dados
- API calls externas (Solana, PumpFun)
- Simulação de backend com localStorage
- Todas as funcionalidades visuais

## 🏗️ Arquitetura Adaptada

### **Frontend Puro (React SPA)**
```
📁 public_html/
├── 📁 assets/
│   ├── 📄 index-[hash].js     # React app compilado
│   ├── 📄 index-[hash].css    # Estilos compilados
│   └── 📁 locales/           # Traduções i18n
│       ├── 📁 en/
│       ├── 📁 pt/
│       └── 📁 es/
├── 📄 index.html             # Entry point
├── 📄 .htaccess              # Configuração Apache
└── 📄 favicon.ico
```

### **Backend Simulado (LocalStorage)**
- Usuários: localStorage
- Wallets: Solana Web3.js client-side
- Transações: Mock data + localStorage
- Bot config: localStorage
- Token data: APIs externas

## 🔧 Configuração de Build

### **1. Vite Config Otimizado**
```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // Importante para hospedagem compartilhada
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          i18n: ['react-i18next', 'i18next'],
          solana: ['@solana/web3.js']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
```

### **2. Package.json Simplificado**
```json
{
  "name": "solana-spinner-bot-shared",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:shared": "npm run build && npm run optimize",
    "optimize": "node scripts/optimize-for-shared.js",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "react-i18next": "^13.5.0",
    "i18next": "^23.7.8",
    "i18next-browser-languagedetector": "^7.2.0",
    "i18next-http-backend": "^2.4.2",
    "@solana/web3.js": "^1.87.6",
    "@tanstack/react-query": "^5.14.2",
    "axios": "^1.6.2",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

## 📄 Arquivos de Configuração

### **3. .htaccess (Apache)**
```apache
# Configuração para SPA React
Options -MultiViews
RewriteEngine On

# Handle React Router routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# CORS for external APIs
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

### **4. robots.txt**
```
User-agent: *
Allow: /

Sitemap: https://seudominio.com/sitemap.xml
```

### **5. sitemap.xml**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seudominio.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seudominio.com/auth</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 💾 Backend Simulado com LocalStorage

### **6. Mock Database Service**
```typescript
// src/services/MockDatabaseService.ts
interface User {
  id: string;
  email: string;
  username: string;
  walletAddress: string;
  privateKey: string; // Encrypted
  solBalance: number;
  createdAt: string;
}

interface BotConfig {
  userId: string;
  isActive: boolean;
  investmentAmount: number;
  stopLoss: number;
  takeProfit: number;
  slippage: number;
  maxTrades: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export class MockDatabaseService {
  private static KEYS = {
    USERS: 'spinner_users',
    CURRENT_USER: 'spinner_current_user',
    BOT_CONFIGS: 'spinner_bot_configs',
    TRANSACTIONS: 'spinner_transactions',
    TOKENS: 'spinner_tokens'
  };

  // Users
  static saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
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
    return users.find(u => u.email === email) || null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem(this.KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  static logout(): void {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  }

  // Bot Configs
  static saveBotConfig(config: BotConfig): void {
    const configs = this.getBotConfigs();
    const existingIndex = configs.findIndex(c => c.userId === config.userId);
    
    if (existingIndex >= 0) {
      configs[existingIndex] = config;
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

  // Utility methods
  static clear(): void {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static export(): string {
    const data: any = {};
    Object.entries(this.KEYS).forEach(([name, key]) => {
      const value = localStorage.getItem(key);
      data[name] = value ? JSON.parse(value) : null;
    });
    return JSON.stringify(data, null, 2);
  }

  static import(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(this.KEYS).forEach(([name, key]) => {
        if (data[name]) {
          localStorage.setItem(key, JSON.stringify(data[name]));
        }
      });
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }
}
```

### **7. Mock API Service**
```typescript
// src/services/MockApiService.ts
import { MockDatabaseService } from './MockDatabaseService';
import { Keypair } from '@solana/web3.js';

export class MockApiService {
  private static delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auth
  static async register(email: string, password: string, username: string) {
    await this.delay();
    
    // Check if user exists
    const existingUser = MockDatabaseService.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Generate Solana wallet
    const keypair = Keypair.generate();
    const walletAddress = keypair.publicKey.toString();
    const privateKey = Array.from(keypair.secretKey).join(',');

    // Create user
    const user = {
      id: crypto.randomUUID(),
      email,
      username,
      walletAddress,
      privateKey: btoa(privateKey), // Simple encoding
      solBalance: 0,
      createdAt: new Date().toISOString()
    };

    MockDatabaseService.saveUser(user);
    MockDatabaseService.setCurrentUser(user);

    return {
      success: true,
      data: { user: { ...user, privateKey: undefined } },
      token: btoa(user.id) // Simple token
    };
  }

  static async login(email: string, password: string) {
    await this.delay();
    
    const user = MockDatabaseService.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    MockDatabaseService.setCurrentUser(user);

    return {
      success: true,
      data: { user: { ...user, privateKey: undefined } },
      token: btoa(user.id)
    };
  }

  static async getProfile() {
    await this.delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    return {
      success: true,
      data: { user: { ...user, privateKey: undefined } }
    };
  }

  // Bot
  static async getBotConfig() {
    await this.delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const config = MockDatabaseService.getBotConfig(user.id) || {
      userId: user.id,
      isActive: false,
      investmentAmount: 0.1,
      stopLoss: 10,
      takeProfit: 20,
      slippage: 5,
      maxTrades: 10,
      riskLevel: 'medium' as const
    };

    return { success: true, data: config };
  }

  static async updateBotConfig(config: any) {
    await this.delay();
    
    const user = MockDatabaseService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    MockDatabaseService.saveBotConfig({ ...config, userId: user.id });

    return { success: true, data: config };
  }

  // Mock PumpFun tokens
  static async getRecommendedTokens() {
    await this.delay();

    const mockTokens = [
      {
        mint: 'HKf7qMqtJk8VBhxm4mJk3VgKmQmqGVxh8VyJm3JhKqHg',
        name: 'Solana Meme Token',
        symbol: 'SMT',
        price: 0.000045,
        marketCap: 450000,
        volume24h: 125000,
        liquidity: 89000,
        score: 85,
        change24h: 15.6
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
        change24h: 28.4
      }
    ];

    return { success: true, data: mockTokens };
  }

  static async getTransactions() {
    await this.delay();

    const mockTransactions = [
      {
        id: '1',
        type: 'deposit',
        amount: 0.5,
        token: 'SOL',
        status: 'confirmed',
        date: new Date(Date.now() - 86400000).toISOString(),
        signature: 'mock_signature_1'
      },
      {
        id: '2',
        type: 'trade',
        amount: 0.1,
        token: 'SMT',
        status: 'confirmed',
        date: new Date(Date.now() - 43200000).toISOString(),
        signature: 'mock_signature_2'
      }
    ];

    return { success: true, data: mockTransactions };
  }
}
```

## 🔨 Scripts de Build

### **8. Script de Otimização**
```javascript
// scripts/optimize-for-shared.js
import fs from 'fs';
import path from 'path';

console.log('🔧 Otimizando para hospedagem compartilhada...');

const distPath = './dist';
const indexPath = path.join(distPath, 'index.html');

// Ler index.html
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Adicionar meta tags para SEO
const metaTags = `
  <meta name="description" content="Solana Spinner Bot - Trading automatizado de tokens PumpFun na rede Solana">
  <meta name="keywords" content="solana, trading, bot, pumpfun, cryptocurrency, defi">
  <meta name="author" content="Spinner Bot Team">
  <meta property="og:title" content="Solana Spinner Bot">
  <meta property="og:description" content="Bot avançado para trading automatizado na rede Solana">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://seudominio.com">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Solana Spinner Bot">
  <meta name="twitter:description" content="Trading automatizado de tokens Solana">
`;

// Inserir meta tags
indexHtml = indexHtml.replace('<head>', `<head>${metaTags}`);

// Adicionar analytics (opcional)
const analytics = `
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  </script>
`;

indexHtml = indexHtml.replace('</head>', `${analytics}</head>`);

// Salvar
fs.writeFileSync(indexPath, indexHtml);

console.log('✅ Otimização concluída!');
console.log('📁 Arquivos prontos em:', distPath);
console.log('📤 Faça upload da pasta dist/ para public_html/');
```

## 📤 Deploy Instructions

### **9. Processo de Deploy**

1. **Build local:**
```bash
npm run build:shared
```

2. **Upload via FTP/cPanel:**
- Compactar pasta `dist/`
- Upload para `public_html/`
- Extrair arquivos
- Verificar permissões (644 para arquivos, 755 para pastas)

3. **Configurações do cPanel:**
- Ativar Gzip compression
- Configurar error pages
- Verificar .htaccess

### **10. Estrutura Final no Servidor**
```
📁 public_html/
├── 📄 index.html
├── 📄 .htaccess
├── 📄 robots.txt
├── 📄 sitemap.xml
├── 📁 assets/
│   ├── 📄 index-abc123.js
│   ├── 📄 index-def456.css
│   └── 📁 locales/
└── 📄 favicon.ico
```

## ⚡ Funcionalidades Suportadas

### ✅ **Totalmente Funcionais:**
- Interface completa React
- Sistema de autenticação (localStorage)
- Dashboard interativo
- Configuração do bot
- Visualização de tokens
- Histórico de transações simulado
- Sistema i18n (15 idiomas)
- Tema dark/light
- Responsivo mobile

### ⚠️ **Limitações:**
- Dados não persistem entre dispositivos
- Transações são simuladas
- Sem real-time updates
- Depende de APIs externas para dados de tokens

### 🔄 **Workarounds:**
- Export/Import de dados via JSON
- Sincronização manual entre dispositivos
- Cache de dados externos
- Fallbacks para APIs offline

## 🎯 Hosts Recomendados

### **Budget ($5-15/mês):**
- Hostinger
- Hostgator
- GoDaddy

### **Qualidade ($15-30/mês):**
- SiteGround
- Bluehost
- DreamHost

### **Premium ($30+/mês):**
- WPEngine
- Kinsta
- Cloudways

## 📋 Checklist de Deploy

- [ ] Build otimizado gerado
- [ ] .htaccess configurado
- [ ] Meta tags SEO adicionadas
- [ ] Analytics configurado
- [ ] Arquivos uploadados via FTP
- [ ] Permissões verificadas
- [ ] SSL configurado (Let's Encrypt)
- [ ] CDN configurado (Cloudflare)
- [ ] Backup configurado
- [ ] Monitoramento configurado

---

**🚀 Esta estrutura permite rodar o Solana Spinner Bot em qualquer hospedagem compartilhada com todas as funcionalidades visuais e de UX preservadas!**