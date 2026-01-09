# 🚀 Guia de Deploy no Vercel

## Pré-requisitos

- ✅ Conta no Vercel (https://vercel.com)
- ✅ Conta no Supabase (https://supabase.com)
- ✅ Repositório no GitHub

## Passo 1: Preparar Supabase

1. Acesse sua dashboard do Supabase
2. Crie um novo projeto ou selecione um existente
3. Vá para **Settings** > **Database**
4. Copie a connection string (Connection pooling recomendado)
5. Guarde a `DATABASE_URL`

## Passo 2: Conectar GitHub ao Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em **"Add New..."** > **"Project"**
3. Clique em **"Import Git Repository"**
4. Selecione seu repositório GitHub com este backend
5. Clique em **"Import"**

## Passo 3: Configurar Variáveis de Ambiente

Na página de configuração do projeto no Vercel:

1. Vá para **Environment Variables**
2. Adicione as seguintes variáveis:

| Nome | Valor | Exemplo |
|------|-------|---------|
| `DATABASE_URL` | Connection string do Supabase | `postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require` |
| `NODE_ENV` | production | `production` |

3. Clique em **"Save"**

## Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde a compilação e o deploy ser finalizado
3. Você receberá uma URL como: `https://seu-projeto.vercel.app`

## Passo 5: Testar o Deploy

Acesse os endpoints de teste:

```bash
# Health check
curl https://seu-projeto.vercel.app/health

# Status
curl https://seu-projeto.vercel.app/status

# Criar usuário
curl -X POST https://seu-projeto.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "test@example.com"
  }'

# Listar usuários
curl https://seu-projeto.vercel.app/api/users
```

## Troubleshooting

### Erro: "DATABASE_URL is missing"
- Verifique se a variável está configurada no Vercel
- Redeploy após adicionar a variável

### Erro: "Connection refused"
- Verifique a DATABASE_URL
- Certifique-se que o IP da Vercel está whitelisted no Supabase

### Erro: "Function execution timeout"
- Verifique os logs do Vercel
- Aumente o timeout se necessário (Vercel Pro)

## Monitorar Deploy

1. Vá para **"Deployments"** na dashboard do Vercel
2. Selecione um deployment para ver os logs
3. Verifique erros de build ou runtime

## Atualizações Automáticas

Cada push para a branch `main` no GitHub triggará automaticamente um novo deploy no Vercel.

## Recursos

- 📚 Docs Vercel: https://vercel.com/docs
- 📚 Docs Supabase: https://supabase.com/docs
- 📚 Docs Drizzle: https://orm.drizzle.team/docs
