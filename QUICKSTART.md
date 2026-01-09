## 🎬 Quick Start - Comece em 5 Minutos

### 1. Configurar Banco de Dados

**Opção A - Supabase (Recomendado):**
- Crie uma conta em https://supabase.com
- Crie um novo projeto
- Copie a connection string em Settings > Database
- Cole em `.env.local` como `DATABASE_URL`

**Opção B - PostgreSQL Local:**
- Instale PostgreSQL
- Crie banco: `CREATE DATABASE jisc_dev;`
- Use: `postgresql://postgres:password@localhost:5432/jisc_dev`

### 2. Editar `.env.local`

```bash
# Seu arquivo deve ter (já vem preenchido com exemplo):
DATABASE_URL=postgresql://seu_usuario:sua_senha@seu_host:5432/jisc_dev
PORT=3000
NODE_ENV=development
```

### 3. Sincronizar Banco de Dados

```bash
npm run db:push
```

### 4. Iniciar Servidor

```bash
npm run dev
```

Você verá:
```
🚀 Server running on http://localhost:3000
```

### 5. Testar API

**No PowerShell:**
```powershell
.\test-api.ps1
```

**Ou com curl:**
```bash
curl http://localhost:3000/health
```

---

## 📁 Arquivos Importantes

| Arquivo | Propósito |
|---------|-----------|
| `README.md` | 📖 Documentação completa |
| `SETUP.md` | 🔧 Guia de configuração |
| `DEPLOY.md` | 🚀 Guia de deploy |
| `PROJECT_SUMMARY.md` | 📋 Resumo do projeto |
| `src/index.ts` | 🎯 Entrada da aplicação |
| `src/db/schema.ts` | 🗄️ Definição do banco |
| `src/routes/` | 🛣️ Endpoints da API |
| `vercel.json` | ☁️ Config Vercel |

---

## ✨ Padrões de Código

### Criar Nova Rota

```typescript
// src/routes/exemplo.ts
import { Router } from 'express';

const router = Router();

router.get('/exemplo', (req, res) => {
  res.json({
    success: true,
    message: 'Success',
    data: { /* seu dado */ },
    timestamp: new Date().toISOString()
  });
});

export default router;
```

### Usar Banco de Dados

```typescript
import { db } from '@/db';
import { usersTable } from '@/db/schema';

// Criar
const result = await db.insert(usersTable).values({
  name: 'John',
  email: 'john@example.com'
}).returning();

// Ler
const users = await db.select().from(usersTable);

// Deletar
await db.delete(usersTable).where(eq(usersTable.id, id));
```

### Validar Entrada

```typescript
import { z } from 'zod';
import { validateRequest } from '@/utils/response';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

const data = validateRequest(schema, req.body);
```

---

## 🔍 Checklist de Deploy

- [ ] `.env.local` configurado corretamente
- [ ] `npm run db:push` executado com sucesso
- [ ] `npm run dev` roda sem erros
- [ ] Endpoints testados com sucesso
- [ ] `git commit` feito
- [ ] Repositório no GitHub
- [ ] Vercel conectado ao GitHub
- [ ] `DATABASE_URL` configurada no Vercel
- [ ] Deploy realizado

---

## 🆘 Problemas Comuns

### "Cannot find module '@/...'"
Solução: Reinicie o VS Code e o terminal

### "Connection refused"
Solução: Verifique `DATABASE_URL` em `.env.local`

### "Port 3000 already in use"
Solução: Mude a porta em `.env.local` ou finalize o processo

### "Type error no build"
Solução: Execute `npm run type-check` para ver detalhes

---

## 🎓 Próximos Passos

1. ✅ Setup local OK
2. Adicionar mais rotas
3. Implementar autenticação (JWT)
4. Criar testes automatizados
5. Deploy no Vercel
6. Monitorar em produção

---

## 📞 Suporte

- Consultex `README.md` para documentação completa
- Execute `npm run lint` para verificar código
- Use `npm run type-check` para verificar tipos

**Projeto Criado em:** 08/01/2026  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para desenvolvimento
