# Supabase Cloud — Guia de Setup

## 1. Criar projeto

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote: **Project URL** e **anon public key** (Settings → API)
3. Anote também: **service_role key** (Settings → API → Secret keys)

## 2. Configurar Authentication

### Google OAuth
1. Authentication → Providers → Google → Enable
2. Configure as credenciais OAuth em [Google Cloud Console](https://console.cloud.google.com)
3. Adicione a URL de callback do Supabase nas origens autorizadas do Google

### URLs de Redirect
Em Authentication → URL Configuration:
- Site URL: `https://app.avalieomeuatendimento.com.br`
- Redirect URLs (adicionar ambas):
  - `https://app.avalieomeuatendimento.com.br/auth/callback`
  - `http://localhost:3000/auth/callback` (para desenvolvimento)

### Templates de Email
Em Authentication → Email Templates, personalize os templates de:
- Confirm signup
- Reset password
- Magic Link (opcional)

## 3. Aplicar migrations

```bash
# Instalar Supabase CLI se necessário
npm install -g supabase

# Linkar ao projeto
supabase link --project-ref <seu-project-ref>

# Aplicar migrations
supabase db push
```

## 4. Gerar tipos TypeScript

```bash
supabase gen types typescript --linked > apps/web/types/database.types.ts
```

Execute sempre que alterar o schema.

## 5. Habilitar Realtime

No painel Supabase → Database → Replication:
- Ative Realtime para a tabela `feedbacks`

Isso é necessário para que o dashboard atualize ao vivo e o sino de notificações funcione.

## 6. Verificar Row Level Security

```sql
-- Execute no SQL Editor para confirmar que RLS está ativo
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

Todas as tabelas devem ter `rowsecurity = true`.

## 7. Variáveis de ambiente necessárias

Copie `infra/.env.example` para `infra/.env` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Estrutura das tabelas

| Tabela | Descrição |
|---|---|
| `users` | Donos dos negócios (sync com auth.users via trigger) |
| `businesses` | Estabelecimentos (1 por user no plano free) |
| `evaluation_points` | Pontos de avaliação com QR Code único |
| `feedbacks` | Avaliações anônimas (emoji 1-5 + comentário) |
| `alert_configs` | Configuração de threshold para alertas in-app |
| `exports_history` | Histórico de exportações CSV |
| `audit_logs` | Log de ações dos donos |

## Notas importantes

- **`is_alert`** em `feedbacks`: marcado automaticamente pelo trigger quando `rating <= threshold_rating`. Alimenta o sino de notificações no painel.
- **Plano free**: trigger `enforce_free_plan_limit` bloqueia criação de mais de 1 ponto ativo. Para liberar, atualizar `users.plan_type = 'pro'`.
- **Slug público**: gerado automaticamente pelo trigger. Formato: 10 chars alphanuméricos aleatórios.
