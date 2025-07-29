# 🚀 Solana Spinner Bot

Bot avançado para trading automatizado de tokens recém-listados no PumpFun na rede Solana. O sistema gera uma carteira única para cada usuário, aplica uma taxa de 10% em saques e oferece configurações avançadas de trading.

## ✨ Características Principais

- 🎯 **Trading Automatizado**: Bot inteligente que opera tokens do PumpFun
- 💳 **Carteira Única**: Cada usuário recebe uma carteira Solana exclusiva
- 💰 **Sistema de Taxas**: Taxa de 10% em saques para carteira administrativa
- 📊 **Análise Inteligente**: Algoritmos avançados para detecção de oportunidades
- 🔒 **Segurança**: Chaves privadas criptografadas e JWT para autenticação
- 📈 **Dashboard Completo**: Interface moderna com estatísticas em tempo real

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **React Query** para gerenciamento de estado
- **React Router** para navegação

### Backend
- **Node.js** com Express e TypeScript
- **MongoDB** com Mongoose para banco de dados
- **@solana/web3.js** para integração Solana
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Axios** para API calls

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- MongoDB
- Git

### 1. Clone o repositório
```bash
git clone <repo-url>
cd solana-spinner-bot
```

### 2. Instale as dependências
```bash
# Dependências do frontend
npm install

# Dependências do servidor
cd server
npm install
cd ..
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `server/` com:

```env
# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
PUMPFUN_API_URL=https://frontend-api.pump.fun

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/solana-spinner-bot
DB_NAME=solana_spinner_bot

# Security
JWT_SECRET=seu-jwt-secret-super-seguro
BCRYPT_SALT_ROUNDS=12

# Server Configuration
PORT=3001
NODE_ENV=development

# Bot Configuration
ADMIN_WALLET_ADDRESS=sua-carteira-admin-aqui
FEE_PERCENTAGE=10
MIN_WITHDRAWAL_AMOUNT=0.1

# Trading Configuration
DEFAULT_SLIPPAGE=5
MAX_POSITION_SIZE=10
MIN_POSITION_SIZE=0.01
```

### 4. Inicie o MongoDB
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS com Homebrew
brew services start mongodb-community
```

### 5. Execute o projeto

#### Desenvolvimento (Frontend + Backend)
```bash
npm run dev:full
```

#### Apenas Frontend
```bash
npm run dev
```

#### Apenas Backend
```bash
npm run server:dev
```

## 📁 Estrutura do Projeto

```
├── src/                          # Frontend React
│   ├── components/              # Componentes React
│   │   ├── auth/               # Autenticação
│   │   ├── dashboard/          # Dashboard e painéis
│   │   └── ui/                 # Componentes base
│   ├── contexts/               # Contextos React
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilitários e API client
│   └── App.tsx                 # App principal
├── server/                       # Backend Node.js
│   ├── src/
│   │   ├── config/             # Configurações (DB, Solana)
│   │   ├── controllers/        # Controladores da API
│   │   ├── middleware/         # Middlewares
│   │   ├── models/             # Modelos MongoDB
│   │   ├── routes/             # Rotas da API
│   │   ├── services/           # Serviços (Wallet, PumpFun, Bot)
│   │   └── app.ts              # App Express
│   ├── package.json
│   └── tsconfig.json
└── package.json                  # Configuração principal
```

## 🎮 Como Usar

### 1. Criar Conta
- Acesse `/auth` e crie uma conta
- Uma carteira Solana será gerada automaticamente
- Faça login com suas credenciais

### 2. Configurar o Bot
- Vá para a seção "Spinner Bot"
- Configure:
  - Valor de investimento por trade
  - Stop loss (%)
  - Take profit (%)
  - Slippage tolerado
  - Máximo de trades simultâneos
  - Nível de risco (baixo/médio/alto)

### 3. Fazer Depósito
- Acesse "Carteira" para ver seu endereço Solana
- Transfira SOL para sua carteira do bot
- O saldo será atualizado automaticamente

### 4. Iniciar Trading
- Com saldo suficiente, clique em "Iniciar Bot"
- O bot irá:
  - Monitorar tokens do PumpFun
  - Analisar oportunidades
  - Executar trades automaticamente
  - Aplicar stop loss/take profit

### 5. Sacar Fundos
- Na seção "Carteira", clique em "Sacar"
- Insira o endereço de destino e valor
- Uma taxa de 10% será aplicada automaticamente

## 🔧 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário
- `PUT /api/auth/profile` - Atualizar perfil

### Carteira
- `GET /api/wallet/balance` - Saldo da carteira
- `POST /api/wallet/withdraw` - Sacar SOL
- `GET /api/wallet/transactions` - Histórico de transações
- `GET /api/wallet/deposit-address` - Endereço para depósito

### Bot
- `GET /api/bot/config` - Configurações do bot
- `PUT /api/bot/config` - Atualizar configurações
- `POST /api/bot/start` - Iniciar bot
- `POST /api/bot/stop` - Parar bot
- `GET /api/bot/stats` - Estatísticas
- `GET /api/bot/tokens/recommended` - Tokens recomendados

## 🔒 Segurança

- **Chaves Privadas**: Criptografadas com AES-256-CBC
- **Autenticação**: JWT com expiração de 7 dias
- **Senhas**: Hash com bcrypt (12 rounds)
- **Validação**: Todas as entradas são validadas
- **Rate Limiting**: Proteção contra ataques
- **CORS**: Configurado para frontend específico

## 🤖 Funcionamento do Bot

### Análise de Tokens
O bot analisa tokens baseado em:
- Market cap
- Liquidez disponível
- Volume de negociação
- Idade do token
- Informações do projeto (descrição, links sociais)
- Histórico do criador

### Sistema de Pontuação
Cada token recebe uma pontuação de 0-100 baseada em:
- **Liquidez** (30 pontos): >10k SOL = 30pts
- **Market Cap** (25 pontos): >100k = 25pts
- **Informações** (20 pontos): Descrição, links sociais
- **Idade** (10 pontos): Tokens muito novos são penalizados
- **Outros fatores** (15 pontos): Diversos critérios

### Execução de Trades
- Compra quando confiança > limite do nível de risco
- Venda baseada em stop loss/take profit
- Máximo de trades simultâneos respeitado
- Slippage configurável

## 📊 Monitoramento

### Logs do Sistema
- Conexão com MongoDB
- Monitoramento de tokens PumpFun
- Execução de trades
- Erros e exceções

### Métricas Disponíveis
- Total de trades
- Taxa de sucesso
- Profit/Loss total
- Saldo da carteira
- Status do bot

## 🛡️ Considerações de Produção

### Para usar em produção:
1. Altere `SOLANA_NETWORK` para `mainnet-beta`
2. Configure RPC endpoint confiável
3. Use MongoDB Atlas ou instância dedicada
4. Configure HTTPS/SSL
5. Implemente rate limiting
6. Configure backups automáticos
7. Monitore logs e métricas
8. Use secrets manager para variáveis sensíveis

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## ⚠️ Avisos Importantes

- **Risco Financeiro**: Trading de criptomoedas envolve riscos
- **Testnet**: Use testnet para testes antes da produção
- **Segurança**: Mantenha chaves privadas seguras
- **Compliance**: Verifique regulamentações locais
- **Backups**: Faça backups regulares do banco de dados

## 🚀 Roadmap

- [ ] Integração com DEX (Raydium, Jupiter)
- [ ] Sistema de notificações (Discord, Telegram)
- [ ] Dashboard administrativo avançado
- [ ] API webhooks para eventos
- [ ] Trading de múltiplos tokens simultâneos
- [ ] Estratégias customizáveis
- [ ] Backtesting de estratégias
- [ ] Mobile app (React Native)

---

**Desenvolvido com ❤️ para a comunidade Solana**
