# JISC Backend API

API backend desenvolvida com Node.js, TypeScript, Drizzle ORM e PostgreSQL (Supabase).

## 🚀 Stack Utilizado

- **Node.js** - Runtime JavaScript
- **TypeScript** - Type safety
- **Express.js** - Framework web
- **Drizzle ORM** - ORM leve e tipo-seguro
- **PostgreSQL (Supabase)** - Banco de dados
- **Zod** - Validação de dados
- **Vercel** - Hosting

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm ou yarn
- Conta no Supabase

## 🛠️ Setup Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local` e configure:

```bash
cp .env.example .env.local
```

Adicione sua `DATABASE_URL` do Supabase:

```
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3000
NODE_ENV=development
```

### 3. Executar migrations

```bash
npm run db:push
```

### 4. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📖 Documentação Swagger/OpenAPI

A API possui documentação interativa através do Swagger UI:

```
http://localhost:3000/swagger
```

### Recursos
- **Try it out** - Teste endpoints diretamente na interface
- **Schemas** - Explore modelos de dados
- **Exemplos** - Veja exemplos de requisição/resposta
- **Download** - Exporte especificação OpenAPI

### Documentação de Implementação
Para detalhes sobre a configuração do Swagger, consulte:
- `SWAGGER_QUICK_START.md` - Guia rápido
- `SWAGGER_SETUP.md` - Setup completo
- `SWAGGER_EXAMPLES.md` - Exemplos para novos endpoints
- `SWAGGER_ESTRUTURA.md` - Diagrama da estrutura

## 📚 Rotas Disponíveis

### Health Check
- `GET /health` - Verifica se o servidor está rodando
- `GET /status` - Status da aplicação

### Usuários
- `POST /api/users` - Criar novo usuário
- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Obter usuário específico
- `DELETE /api/users/:id` - Deletar usuário

## 🏗️ Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações globais
│   ├── db/              # Drizzle ORM e schema
│   ├── middleware/      # Middlewares Express
│   ├── routes/          # Rotas da API
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Funções utilitárias
│   └── index.ts         # Entrada da aplicação
├── api/                 # Funções serverless para Vercel
├── drizzle/             # Migrations geradas
├── dist/                # Build compilado
└── package.json         # Dependências e scripts
```

## 📦 Scripts Disponíveis

```bash
npm run dev          # Iniciar em modo desenvolvimento
npm run build        # Compilar TypeScript
npm run start        # Iniciar servidor em produção
npm run db:generate  # Gerar migrations
npm run db:migrate   # Executar migrations
npm run db:push      # Sincronizar schema com DB
npm run lint         # Rodar ESLint
npm run format       # Formatar com Prettier
npm run type-check   # Verificar tipos TypeScript
```

## 🔄 Padrões de Desenvolvimento

### Respostas da API

Todas as respostas seguem um padrão consistente:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": { /* dados */ },
  "timestamp": "2024-01-08T10:30:00.000Z"
}
```

### Validação

Utiliza Zod para validação de schemas:

```typescript
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
```

### Tratamento de Erros

Middleware centralizado de erro com respostas padronizadas.

### Logging

Logger automático de requisições com timestamp e duração.

## 🚀 Deploy no Vercel

### 1. Preparar repositório Git

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Push para GitHub

```bash
git remote add origin <seu-repositorio>
git branch -M main
git push -u origin main
```

### 3. Conectar no Vercel

1. Acesse https://vercel.com
2. Clique em "Add New..." > "Project"
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `DATABASE_URL` - URL do PostgreSQL (Supabase)
   - `NODE_ENV` - production

5. Deploy!

## 🔐 Variáveis de Ambiente (Vercel)

Na dashboard do Vercel, adicione as seguintes variáveis:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL do banco PostgreSQL | `postgresql://...` |
| `NODE_ENV` | Ambiente | `production` |
| `PORT` | Porta (gerenciada pela Vercel) | - |

## 📝 Boas Práticas Implementadas

✅ **Type Safety** - TypeScript strict mode  
✅ **Validação** - Zod para runtime validation  
✅ **Tratamento de Erros** - Middleware centralizado  
✅ **Logging** - Requisições rastreadas automaticamente  
✅ **CORS** - Habilitado para todos os origins  
✅ **Estrutura Escalável** - Separação clara de responsabilidades  
✅ **Linting** - ESLint e Prettier  
✅ **Migrations** - Drizzle Kit para versionamento do schema  

## 🐛 Troubleshooting

### Erro de conexão com banco de dados
- Verifique a `DATABASE_URL`
- Teste a conexão: `psql <DATABASE_URL>`
- Verifique firewall/network policies

### Erros de tipos
```bash
npm run type-check
```

### Rebuild local
```bash
npm run build
npm run start
```

## 📞 Suporte

Para dúvidas ou issues, abra um issue no repositório.

## 📄 Licença

ISC
