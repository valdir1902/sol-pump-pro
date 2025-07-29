#!/bin/bash

echo "🚀 Iniciando Solana Spinner Bot..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar se MongoDB está rodando
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB não está rodando. Tentando iniciar..."
    
    # Tentar iniciar MongoDB (funciona no Ubuntu/Debian)
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
    else
        echo "❌ Não foi possível iniciar o MongoDB automaticamente."
        echo "   Por favor, inicie o MongoDB manualmente antes de continuar."
        exit 1
    fi
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Instalando dependências do servidor..."
    cd server && npm install && cd ..
fi

# Verificar se o arquivo .env existe
if [ ! -f "server/.env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando arquivo de exemplo..."
    cat > server/.env << EOL
# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
PUMPFUN_API_URL=https://frontend-api.pump.fun

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/solana-spinner-bot
DB_NAME=solana_spinner_bot

# Security
JWT_SECRET=spinner-bot-super-secret-jwt-key-$(date +%s)
BCRYPT_SALT_ROUNDS=12

# Server Configuration
PORT=3001
NODE_ENV=development

# Bot Configuration
ADMIN_WALLET_ADDRESS=
FEE_PERCENTAGE=10
MIN_WITHDRAWAL_AMOUNT=0.1

# Trading Configuration
DEFAULT_SLIPPAGE=5
MAX_POSITION_SIZE=10
MIN_POSITION_SIZE=0.01
EOL
    echo "✅ Arquivo .env criado em server/.env"
    echo "⚠️  IMPORTANTE: Configure ADMIN_WALLET_ADDRESS no arquivo .env"
fi

# Verificar se o MongoDB está acessível
echo "🔍 Verificando conexão com MongoDB..."
if ! timeout 5 mongosh --eval "print('MongoDB conectado com sucesso')" &>/dev/null; then
    echo "❌ Não foi possível conectar ao MongoDB."
    echo "   Verifique se o serviço está rodando:"
    echo "   - Ubuntu/Debian: sudo systemctl start mongod"
    echo "   - macOS: brew services start mongodb-community"
    echo "   - Windows: net start MongoDB"
    exit 1
fi

echo "✅ MongoDB está rodando"

# Construir o servidor TypeScript
echo "🔨 Construindo servidor TypeScript..."
cd server && npm run build && cd ..

# Iniciar o projeto
echo "🎉 Iniciando frontend e backend..."
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/api"

npm run dev:full