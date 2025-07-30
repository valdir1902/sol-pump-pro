# 🚀 Deploy do Solana Spinner Bot na AWS

## 📋 Pré-requisitos
- Conta AWS ativa
- AWS CLI instalado
- Par de chaves SSH
- Domínio (opcional)

## 🏗️ Configuração da Infraestrutura

### 1. Criar Instância EC2

#### No Console AWS:
1. **EC2 Dashboard** → Launch Instance
2. **AMI**: Ubuntu Server 22.04 LTS
3. **Instance Type**: 
   - Desenvolvimento: `t3.micro` (1GB RAM)
   - Produção: `t3.small` (2GB RAM)
4. **Key Pair**: Criar ou usar existente
5. **Security Group**:
   ```
   SSH (22): Seu IP
   HTTP (80): 0.0.0.0/0
   HTTPS (443): 0.0.0.0/0
   Custom (3001): 0.0.0.0/0 (API)
   Custom (5173): 0.0.0.0/0 (Dev)
   ```

### 2. Conectar à Instância

```bash
# Conectar via SSH
ssh -i "sua-chave.pem" ubuntu@sua-instancia-ip

# Atualizar sistema
sudo apt update && sudo apt upgrade -y
```

### 3. Instalar Dependências

```bash
# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# PM2 (Process Manager)
sudo npm install -g pm2

# Nginx (Proxy Reverso)
sudo apt install -y nginx

# Git
sudo apt install -y git
```

### 4. Configurar MongoDB

```bash
# Iniciar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Configurar usuário admin
mongosh
> use admin
> db.createUser({
    user: "admin",
    pwd: "sua-senha-super-segura",
    roles: ["userAdminAnyDatabase", "readWriteAnyDatabase"]
  })
> exit

# Habilitar autenticação
sudo nano /etc/mongod.conf
```

Adicionar no arquivo:
```yaml
security:
  authorization: enabled
```

```bash
sudo systemctl restart mongod
```

### 5. Deploy da Aplicação

```bash
# Clonar repositório
cd /home/ubuntu
git clone https://github.com/seu-usuario/solana-spinner-bot.git
cd solana-spinner-bot

# Instalar dependências
npm install
cd server && npm install && cd ..

# Configurar variáveis de ambiente
sudo nano server/.env
```

Configuração `.env` para produção:
```env
# Solana Configuration
SOLANA_NETWORK=mainnet-beta
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PUMPFUN_API_URL=https://frontend-api.pump.fun

# Database Configuration
MONGODB_URI=mongodb://admin:sua-senha@localhost:27017/solana_spinner_bot?authSource=admin
DB_NAME=solana_spinner_bot

# Security
JWT_SECRET=sua-jwt-secret-super-segura-aqui
BCRYPT_SALT_ROUNDS=12

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com

# Bot Configuration
ADMIN_WALLET_ADDRESS=sua-carteira-admin-solana
FEE_PERCENTAGE=10
MIN_WITHDRAWAL_AMOUNT=0.1

# Trading Configuration
DEFAULT_SLIPPAGE=5
MAX_POSITION_SIZE=10
MIN_POSITION_SIZE=0.01
```

### 6. Build da Aplicação

```bash
# Build do servidor
cd server && npm run build && cd ..

# Build do frontend
npm run build
```

### 7. Configurar PM2

```bash
# Criar arquivo ecosystem
nano ecosystem.config.js
```

```javascript
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
```

```bash
# Criar pasta de logs
mkdir logs

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração PM2
pm2 save
pm2 startup
```

### 8. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/solana-spinner-bot
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Frontend (React build)
    location / {
        root /home/ubuntu/solana-spinner-bot/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/solana-spinner-bot /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 9. SSL/HTTPS com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Renovação automática
sudo crontab -e
```

Adicionar linha:
```
0 12 * * * /usr/bin/certbot renew --quiet
```

### 10. Configurar Firewall

```bash
# UFW (Ubuntu Firewall)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## 🎯 Scripts de Automação

### Script de Deploy Automático

```bash
# criar deploy.sh
nano deploy.sh
```

```bash
#!/bin/bash

echo "🚀 Iniciando deploy..."

# Backup do banco
mongodump --uri="mongodb://admin:senha@localhost:27017/solana_spinner_bot?authSource=admin" --out="./backup/$(date +%Y%m%d_%H%M%S)"

# Pull das mudanças
git pull origin main

# Instalar dependências
npm install
cd server && npm install && cd ..

# Build
cd server && npm run build && cd ..
npm run build

# Restart da aplicação
pm2 restart solana-spinner-bot

echo "✅ Deploy concluído!"
```

```bash
chmod +x deploy.sh
```

### Script de Monitoramento

```bash
nano monitor.sh
```

```bash
#!/bin/bash

# Verificar status da aplicação
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
```

## 🔧 Configurações de Produção

### 1. Elastic IP (IP Fixo)

```bash
# No Console AWS:
# VPC → Elastic IPs → Allocate Elastic IP
# Associate with your EC2 instance
```

### 2. Route 53 (DNS)

```bash
# No Console AWS:
# Route 53 → Hosted Zones → Create
# Add A record pointing to Elastic IP
```

### 3. CloudWatch (Monitoramento)

```bash
# Instalar CloudWatch Agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### 4. Backup Automático

```bash
# Script de backup
nano backup.sh
```

```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"

# Criar diretório
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --uri="mongodb://admin:senha@localhost:27017/solana_spinner_bot?authSource=admin" --out="$BACKUP_DIR/mongo_$DATE"

# Backup código
tar -czf "$BACKUP_DIR/code_$DATE.tar.gz" /home/ubuntu/solana-spinner-bot

# Upload para S3 (opcional)
aws s3 cp "$BACKUP_DIR/" s3://seu-bucket-backup/ --recursive

# Limpar backups antigos (manter 7 dias)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "mongo_*" -mtime +7 -exec rm -rf {} \;
```

```bash
# Agendar backup diário
crontab -e
```

```
0 2 * * * /home/ubuntu/backup.sh
```

## 🚨 Monitoramento e Alertas

### PM2 Web Interface

```bash
# Instalar PM2 Plus
pm2 install pm2-server-monit
```

### Logs Centralizados

```bash
# Configurar logrotate
sudo nano /etc/logrotate.d/solana-spinner-bot
```

```
/home/ubuntu/solana-spinner-bot/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 🔍 Troubleshooting

### Comandos Úteis

```bash
# Ver status da aplicação
pm2 status
pm2 logs

# Verificar portas em uso
sudo netstat -tlnp | grep :3001

# Verificar MongoDB
sudo systemctl status mongod
mongosh "mongodb://admin:senha@localhost:27017/admin"

# Verificar Nginx
sudo systemctl status nginx
sudo nginx -t

# Ver uso de recursos
top
htop
df -h
free -h
```

### Logs Importantes

```bash
# Logs da aplicação
tail -f /home/ubuntu/solana-spinner-bot/logs/combined.log

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do MongoDB
sudo tail -f /var/log/mongodb/mongod.log
```

## 💰 Estimativa de Custos

### Desenvolvimento/Teste
- EC2 t3.micro: $8/mês
- EBS 20GB: $2/mês
- **Total: ~$10/mês**

### Produção
- EC2 t3.small: $16/mês
- EBS 50GB: $5/mês
- Elastic IP: $3.6/mês
- Route 53: $0.5/mês
- CloudWatch: $3/mês
- **Total: ~$28/mês**

### High Availability
- 2x EC2 t3.small: $32/mês
- Load Balancer: $20/mês
- RDS MongoDB: $15/mês
- S3 + CloudFront: $10/mês
- **Total: ~$77/mês**

---

**🎉 Seu Solana Spinner Bot estará rodando 24/7 na AWS!**