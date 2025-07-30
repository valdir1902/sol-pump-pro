#!/bin/bash

# 🚀 Script de Deploy Rápido - Solana Spinner Bot na AWS
# Execute após conectar na instância EC2: wget -O - https://raw.githubusercontent.com/seu-repo/main/aws-deploy-quick.sh | bash

set -e

echo "🚀 Iniciando configuração do Solana Spinner Bot na AWS..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"
}

# Verificar se está rodando como ubuntu
if [ "$USER" != "ubuntu" ]; then
    error "Execute este script como usuário ubuntu"
    exit 1
fi

# Atualizar sistema
log "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
log "Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação do Node.js
node_version=$(node -v)
npm_version=$(npm -v)
log "Node.js instalado: $node_version"
log "NPM instalado: $npm_version"

# Instalar MongoDB
log "Instalando MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar MongoDB
log "Configurando MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod

# Configurar usuário admin do MongoDB
log "Criando usuário admin do MongoDB..."
MONGO_PASSWORD=$(openssl rand -base64 32)
mongosh --eval "
use admin;
db.createUser({
  user: 'admin',
  pwd: '$MONGO_PASSWORD',
  roles: ['userAdminAnyDatabase', 'readWriteAnyDatabase']
});
"

# Habilitar autenticação MongoDB
log "Habilitando autenticação MongoDB..."
sudo tee -a /etc/mongod.conf > /dev/null <<EOL

security:
  authorization: enabled
EOL

sudo systemctl restart mongod

# Instalar PM2
log "Instalando PM2..."
sudo npm install -g pm2

# Instalar Nginx
log "Instalando Nginx..."
sudo apt install -y nginx

# Instalar Git
log "Instalando Git..."
sudo apt install -y git

# Clonar repositório (você precisa ajustar a URL)
log "Clonando repositório..."
cd /home/ubuntu
if [ ! -d "solana-spinner-bot" ]; then
    warn "⚠️  IMPORTANTE: Ajuste a URL do repositório no script!"
    # git clone https://github.com/seu-usuario/solana-spinner-bot.git
    
    # Por enquanto, vamos criar a estrutura básica
    mkdir -p solana-spinner-bot
    cd solana-spinner-bot
    
    warn "Repositório não clonado. Você precisa:"
    warn "1. Fazer upload dos arquivos do projeto"
    warn "2. Ou ajustar a URL do git clone no script"
else
    cd solana-spinner-bot
    git pull origin main
fi

# Gerar JWT secret
JWT_SECRET=$(openssl rand -hex 64)

# Criar arquivo .env
log "Criando arquivo de configuração..."
cat > server/.env << EOL
# Solana Configuration
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
PUMPFUN_API_URL=https://frontend-api.pump.fun

# Database Configuration
MONGODB_URI=mongodb://admin:$MONGO_PASSWORD@localhost:27017/solana_spinner_bot?authSource=admin
DB_NAME=solana_spinner_bot

# Security
JWT_SECRET=$JWT_SECRET
BCRYPT_SALT_ROUNDS=12

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Bot Configuration
ADMIN_WALLET_ADDRESS=
FEE_PERCENTAGE=10
MIN_WITHDRAWAL_AMOUNT=0.1

# Trading Configuration
DEFAULT_SLIPPAGE=5
MAX_POSITION_SIZE=10
MIN_POSITION_SIZE=0.01
EOL

# Salvar credenciais para o usuário
cat > /home/ubuntu/credenciais.txt << EOL
=== CREDENCIAIS DO SISTEMA ===
MongoDB Admin User: admin
MongoDB Password: $MONGO_PASSWORD
JWT Secret: $JWT_SECRET

⚠️  IMPORTANTE: 
- Configure ADMIN_WALLET_ADDRESS no arquivo server/.env
- Mantenha essas credenciais seguras
- Exclua este arquivo após anotar as informações

Arquivo de configuração: /home/ubuntu/solana-spinner-bot/server/.env
EOL

log "Credenciais salvas em: /home/ubuntu/credenciais.txt"

# Instalar dependências (se o projeto existir)
if [ -f "package.json" ]; then
    log "Instalando dependências do frontend..."
    npm install
    
    if [ -f "server/package.json" ]; then
        log "Instalando dependências do servidor..."
        cd server && npm install && cd ..
        
        # Build do servidor
        log "Fazendo build do servidor..."
        cd server && npm run build && cd ..
    fi
    
    # Build do frontend
    log "Fazendo build do frontend..."
    npm run build
fi

# Criar arquivo ecosystem.config.js para PM2
log "Configurando PM2..."
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'solana-spinner-bot',
    script: './server/dist/index.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOL

# Criar pasta de logs
mkdir -p logs

# Configurar Nginx
log "Configurando Nginx..."
INSTANCE_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

sudo tee /etc/nginx/sites-available/solana-spinner-bot > /dev/null << EOL
server {
    listen 80;
    server_name $INSTANCE_IP;

    # Frontend (React build)
    location / {
        root /home/ubuntu/solana-spinner-bot/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Ativar site Nginx
sudo ln -s /etc/nginx/sites-available/solana-spinner-bot /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Testar e reiniciar Nginx
sudo nginx -t
sudo systemctl restart nginx

# Configurar firewall
log "Configurando firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Iniciar aplicação com PM2 (se o build existir)
if [ -f "server/dist/index.js" ]; then
    log "Iniciando aplicação..."
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup ubuntu -u ubuntu --hp /home/ubuntu
else
    warn "Build não encontrado. Aplicação não iniciada."
fi

# Criar scripts úteis
log "Criando scripts de gerenciamento..."

# Script de deploy
cat > deploy.sh << 'EOL'
#!/bin/bash
echo "🚀 Iniciando deploy..."
git pull origin main
npm install
cd server && npm install && npm run build && cd ..
npm run build
pm2 restart solana-spinner-bot
echo "✅ Deploy concluído!"
EOL

# Script de monitoramento
cat > monitor.sh << 'EOL'
#!/bin/bash
echo "📊 Status da Aplicação:"
pm2 status
echo ""
echo "💾 Uso de Memória:"
free -h
echo ""
echo "💽 Uso de Disco:"
df -h
echo ""
echo "🔄 Logs recentes:"
pm2 logs solana-spinner-bot --lines 20
EOL

# Script de backup
cat > backup.sh << 'EOL'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --uri="mongodb://admin:PASSWORD@localhost:27017/solana_spinner_bot?authSource=admin" --out="$BACKUP_DIR/mongo_$DATE"

# Backup código
tar -czf "$BACKUP_DIR/code_$DATE.tar.gz" /home/ubuntu/solana-spinner-bot

echo "✅ Backup criado em $BACKUP_DIR"
EOL

# Ajustar senha no script de backup
sed -i "s/PASSWORD/$MONGO_PASSWORD/g" backup.sh

chmod +x deploy.sh monitor.sh backup.sh

# Informações finais
echo ""
echo "=========================================="
echo "🎉 INSTALAÇÃO CONCLUÍDA!"
echo "=========================================="
echo ""
echo "📍 IP da Instância: $INSTANCE_IP"
echo "🌐 Frontend: http://$INSTANCE_IP"
echo "🔧 API: http://$INSTANCE_IP/api"
echo ""
echo "📁 Arquivos importantes:"
echo "- Credenciais: /home/ubuntu/credenciais.txt"
echo "- Configuração: /home/ubuntu/solana-spinner-bot/server/.env"
echo "- Scripts: deploy.sh, monitor.sh, backup.sh"
echo ""
echo "⚠️  PRÓXIMOS PASSOS:"
echo "1. Configure ADMIN_WALLET_ADDRESS no arquivo .env"
echo "2. Faça upload do código do projeto (se não foi clonado)"
echo "3. Execute: pm2 start ecosystem.config.js (se necessário)"
echo "4. Para domínio personalizado: configure Route 53 + SSL"
echo ""
echo "🔧 Comandos úteis:"
echo "- Ver logs: pm2 logs"
echo "- Status: pm2 status"
echo "- Reiniciar: pm2 restart solana-spinner-bot"
echo "- Deploy: ./deploy.sh"
echo "- Monitor: ./monitor.sh"
echo "- Backup: ./backup.sh"
echo ""
warn "IMPORTANTE: Leia e anote as credenciais em /home/ubuntu/credenciais.txt"
echo "=========================================="