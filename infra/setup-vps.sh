#!/usr/bin/env bash
# Setup script for Ubuntu 22.04 VPS — installs Docker, Compose, UFW, and prepares directory structure.
# Run as root or with sudo: bash setup-vps.sh
set -euo pipefail

DEPLOY_DIR="$HOME/avalie"

echo "==> Atualizando pacotes..."
apt-get update -y && apt-get upgrade -y

echo "==> Instalando dependências do Docker..."
apt-get install -y ca-certificates curl gnupg lsb-release

echo "==> Adicionando chave GPG e repositório oficial do Docker..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "==> Instalando Docker Engine + Compose plugin..."
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "==> Habilitando Docker no boot..."
systemctl enable --now docker

echo "==> Configurando UFW (firewall)..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   comment 'SSH'
ufw allow 80/tcp   comment 'HTTP'
ufw allow 443/tcp  comment 'HTTPS'
ufw --force enable
ufw status verbose

echo "==> Criando estrutura de diretórios..."
mkdir -p "$DEPLOY_DIR/infra/traefik/letsencrypt"
mkdir -p "$DEPLOY_DIR/infra/traefik/dynamic"

# acme.json precisa de permissão 600 para o Traefik aceitar
touch "$DEPLOY_DIR/infra/traefik/letsencrypt/acme.json"
chmod 600 "$DEPLOY_DIR/infra/traefik/letsencrypt/acme.json"

echo ""
echo "============================================================"
echo " VPS pronta! Próximos passos:"
echo "============================================================"
echo ""
echo "1. No seu computador local, copie os arquivos de infra:"
echo "   scp -r infra/ root@168.231.98.181:$DEPLOY_DIR/"
echo ""
echo "2. Crie o arquivo .env na VPS:"
echo "   ssh root@168.231.98.181"
echo "   cp $DEPLOY_DIR/infra/.env.example $DEPLOY_DIR/infra/.env"
echo "   nano $DEPLOY_DIR/infra/.env   # preencha os valores reais"
echo ""
echo "3. Faça login no GHCR (GitHub Container Registry):"
echo "   echo SEU_GITHUB_TOKEN | docker login ghcr.io -u SEU_USUARIO --password-stdin"
echo ""
echo "4. Suba os containers:"
echo "   docker compose -f $DEPLOY_DIR/infra/docker-compose.prod.yml up -d"
echo ""
echo "5. Verifique os logs:"
echo "   docker compose -f $DEPLOY_DIR/infra/docker-compose.prod.yml logs -f"
echo "============================================================"
