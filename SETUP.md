# 📋 SETUP - Guia de Configuração do Backend

Este documento fornece instruções passo a passo para configurar e rodar o backend localmente antes de fazer deploy.

## 1️⃣ Clonar/Abrir o Projeto

```bash
cd c:\dev\jisc-2026\backend
```

## 2️⃣ Configurar Banco de Dados

### Opção A: Usar Supabase (Recomendado)

1. Crie uma conta em https://supabase.com
2. Crie um novo projeto
3. Aguarde o banco ser criado
4. Vá em **Settings** > **Database** > **Connection string**
5. Copie a connection string (com `sslmode=require`)

### Opção B: Usar PostgreSQL Local

1. Instale PostgreSQL em sua máquina
2. Crie um banco de dados:

```sql
CREATE DATABASE jisc_dev;
```

3. A connection string será algo como:

```
postgresql://postgres:password@localhost:5432/jisc_dev
```

## 3️⃣ Configurar Variáveis de Ambiente

Edite o arquivo `.env.local`:

```bash
# Arquivo: .env.local
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/database
LOG_LEVEL=info
```

## 4️⃣ Instalar Dependências

As dependências já foram instaladas, mas se precisar:

```bash
npm install
```

## 5️⃣ Executar Migrations (Criar Tabelas)

```bash
npm run db:push
```

Isso sincronizará o schema com seu banco de dados.

## 6️⃣ Iniciar Servidor em Desenvolvimento

```bash
npm run dev
```

Você deverá ver:

```
🚀 Server running on http://localhost:3000
📝 Environment: development
```

## 7️⃣ Testar as Rotas

Em outro terminal, execute:

```bash
# Health check
curl http://localhost:3000/health

# Status
curl http://localhost:3000/status

# Criar usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Listar usuários
curl http://localhost:3000/api/users

# Obter usuário específico
curl http://localhost:3000/api/users/{id}

# Deletar usuário
curl -X DELETE http://localhost:3000/api/users/{id}
```

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar em modo desenvolvimento com hot reload |
| `npm run build` | Compilar TypeScript |
| `npm run start` | Rodar versão compilada |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run lint` | Rodar ESLint |
| `npm run format` | Formatar com Prettier |
| `npm run db:generate` | Gerar migrations |
| `npm run db:migrate` | Executar migrations |
| `npm run db:push` | Sincronizar schema com DB |

## 📁 Estrutura de Diretórios

```
backend/
├── src/                    # Código-fonte
│   ├── config/            # Configurações
│   ├── db/                # Banco de dados (Drizzle)
│   ├── middleware/        # Middlewares Express
│   ├── routes/            # Rotas da API
│   ├── types/             # Tipos TypeScript
│   ├── utils/             # Utilitários
│   └── index.ts           # Entrada principal
├── api/                   # Função serverless para Vercel
├── dist/                  # Código compilado
├── drizzle/               # Migrations
├── package.json           # Dependências
├── tsconfig.json          # Configuração TypeScript
├── vercel.json            # Configuração Vercel
├── drizzle.config.ts      # Configuração Drizzle
└── README.md              # Documentação
```

## ✅ Checklist de Setup

- [ ] Clonei/abri o projeto
- [ ] Configurei as variáveis de ambiente em `.env.local`
- [ ] Executei `npm run db:push` para criar as tabelas
- [ ] Iniciei o servidor com `npm run dev`
- [ ] Testei os endpoints com sucesso
- [ ] Revisei a estrutura do projeto

## 🐛 Troubleshooting

### "DATABASE_URL is required"
- Verifique se `.env.local` está configurado
- Certifique-se de que a variável está definida corretamente

### "Connection refused"
- Verifique se o PostgreSQL está rodando
- Confirme a connection string (host, port, credenciais)

### "Port 3000 already in use"
- Mude a porta em `.env.local`: `PORT=3001`
- Ou feche a aplicação que está usando porta 3000

### "Type errors no build"
```bash
npm run type-check
```

## 🚀 Próximos Passos

1. ✅ Setup local completo
2. Implementar mais rotas da API
3. Adicionar autenticação (JWT)
4. Criar testes (Jest)
5. Deploy no Vercel (veja `DEPLOY.md`)

## 📚 Documentação Útil

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Vercel](https://vercel.com/docs)
- [Supabase](https://supabase.com/docs)

---

Para dúvidas, consulte o `README.md` ou abra uma issue no repositório.
