#!/bin/bash
# Script de teste local da API

BASE_URL="http://localhost:3000"

echo "🧪 Testando Backend JISC"
echo "========================"
echo ""

# Health Check
echo "1️⃣ Health Check"
curl -s "$BASE_URL/health" | jq .
echo ""
echo ""

# Status
echo "2️⃣ Status da Aplicação"
curl -s "$BASE_URL/status" | jq .
echo ""
echo ""

# Criar usuário
echo "3️⃣ Criar Usuário"
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com"
  }')
echo "$USER_RESPONSE" | jq .

# Extrair ID do usuário criado
USER_ID=$(echo "$USER_RESPONSE" | jq -r '.data.id')
echo "ID do usuário criado: $USER_ID"
echo ""
echo ""

# Listar usuários
echo "4️⃣ Listar Todos os Usuários"
curl -s "$BASE_URL/api/users" | jq .
echo ""
echo ""

# Obter usuário específico
echo "5️⃣ Obter Usuário Específico"
if [ ! -z "$USER_ID" ] && [ "$USER_ID" != "null" ]; then
  curl -s "$BASE_URL/api/users/$USER_ID" | jq .
else
  echo "Erro: ID de usuário não obtido"
fi
echo ""
echo ""

# Deletar usuário
echo "6️⃣ Deletar Usuário"
if [ ! -z "$USER_ID" ] && [ "$USER_ID" != "null" ]; then
  curl -s -X DELETE "$BASE_URL/api/users/$USER_ID" | jq .
else
  echo "Erro: ID de usuário não obtido"
fi
echo ""

echo "✅ Testes concluídos!"
