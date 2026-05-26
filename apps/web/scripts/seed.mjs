import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Lê .env.local
const envPath = join(__dirname, '../.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Variáveis de ambiente não encontradas no .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const ADMIN_EMAIL = 'admin@avaliemeuatendimento.com.br'
const ADMIN_PASSWORD = 'Admin@123456'
const TESTER_EMAIL = 'teste@avaliemeuatendimento.com.br'
const TESTER_PASSWORD = 'Teste@123456'

async function createUser(email, password, name) {
  const { data: existing } = await supabase.auth.admin.listUsers()
  const found = existing?.users?.find(u => u.email === email)
  if (found) {
    await supabase.auth.admin.deleteUser(found.id)
    console.log(`  ♻️  Usuário auth removido: ${email}`)
  }
  // Remove linha órfã em public.users (sem cascade do auth)
  await supabase.from('users').delete().eq('email', email)
  await supabase.from('businesses').delete().eq('user_id', found?.id ?? '00000000-0000-0000-0000-000000000000')

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  })

  if (error) throw new Error(`Erro ao criar ${email}: ${error.message}`)
  console.log(`  ✅  Usuário criado: ${email}`)
  return data.user
}

async function seed() {
  console.log('\n🌱  Iniciando seed...\n')

  // 1. Usuários
  console.log('👤  Criando usuários...')
  const admin = await createUser(ADMIN_EMAIL, ADMIN_PASSWORD, 'Admin Avalie')
  const tester = await createUser(TESTER_EMAIL, TESTER_PASSWORD, 'Usuário Teste')

  // 2. Garante registros na tabela users com plan correto
  const { error: upsertErr } = await supabase.from('users').upsert([
    { id: admin.id, email: ADMIN_EMAIL, name: 'Admin Avalie', plan_type: 'premium' },
    { id: tester.id, email: TESTER_EMAIL, name: 'Usuário Teste', plan_type: 'free' },
  ], { onConflict: 'id' })
  if (upsertErr) throw new Error(`Users upsert: ${upsertErr.message}`)

  // 3. Negócios
  console.log('🏢  Criando negócios...')
  const { data: businesses, error: bizErr } = await supabase.from('businesses').insert([
    {
      user_id: admin.id,
      name: 'Lanchonete do Zé',
      category: 'alimentacao',
      address: 'Rua das Flores, 123 - Centro',
      thank_you_message: 'Obrigado pela sua avaliação! Volte sempre 😊',
    },
    {
      user_id: tester.id,
      name: 'Salão Beleza Total',
      category: 'beleza',
      address: 'Av. Principal, 456 - Bairro Novo',
      thank_you_message: 'Sua opinião é muito importante para nós!',
    },
  ]).select()

  if (bizErr) throw new Error(`Negócios: ${bizErr.message}`)
  const [adminBiz, testerBiz] = businesses
  console.log(`  ✅  ${adminBiz.name} (admin)`)
  console.log(`  ✅  ${testerBiz.name} (teste)`)

  // 4. Pontos de avaliação
  console.log('📍  Criando pontos de avaliação...')
  const { data: points, error: ptErr } = await supabase.from('evaluation_points').insert([
    { business_id: adminBiz.id, name: 'Caixa', public_slug: 'lanchonete-caixa', is_active: true },
    { business_id: adminBiz.id, name: 'Atendimento Geral', public_slug: 'lanch-atendimento', is_active: true },
    { business_id: testerBiz.id, name: 'Recepção', public_slug: 'salao-recepcao', is_active: true },
  ]).select()

  if (ptErr) throw new Error(`Pontos: ${ptErr.message}`)
  const [ptCaixa, ptAtend, ptRecepcao] = points
  console.log(`  ✅  ${points.length} pontos criados`)

  // 5. Feedbacks
  console.log('💬  Criando feedbacks...')
  const daysAgo = d => new Date(Date.now() - d * 86400000).toISOString()

  const feedbacks = [
    { evaluation_point_id: ptCaixa.id, rating: 5, comment: 'Atendimento excelente! Super rápido.', created_at: daysAgo(0) },
    { evaluation_point_id: ptCaixa.id, rating: 5, comment: 'Adorei o sorriso da atendente!', created_at: daysAgo(1) },
    { evaluation_point_id: ptCaixa.id, rating: 4, comment: 'Muito bom, só um pouco de fila.', created_at: daysAgo(1) },
    { evaluation_point_id: ptCaixa.id, rating: 4, created_at: daysAgo(2) },
    { evaluation_point_id: ptCaixa.id, rating: 3, comment: 'Normal, nada especial.', created_at: daysAgo(3) },
    { evaluation_point_id: ptCaixa.id, rating: 2, comment: 'Demora enorme na fila, quase desisti.', created_at: daysAgo(4) },
    { evaluation_point_id: ptCaixa.id, rating: 1, comment: 'Péssimo! Funcionário mal-educado.', created_at: daysAgo(5) },
    { evaluation_point_id: ptCaixa.id, rating: 5, created_at: daysAgo(6) },
    { evaluation_point_id: ptCaixa.id, rating: 4, created_at: daysAgo(7) },
    { evaluation_point_id: ptCaixa.id, rating: 5, comment: 'Melhor lanchonete do bairro!', created_at: daysAgo(8) },
    { evaluation_point_id: ptAtend.id, rating: 5, comment: 'Comida deliciosa e atendimento top!', created_at: daysAgo(0) },
    { evaluation_point_id: ptAtend.id, rating: 4, created_at: daysAgo(1) },
    { evaluation_point_id: ptAtend.id, rating: 3, comment: 'Ok, mas pode melhorar.', created_at: daysAgo(2) },
    { evaluation_point_id: ptAtend.id, rating: 2, comment: 'Pedido errado duas vezes.', created_at: daysAgo(3) },
    { evaluation_point_id: ptAtend.id, rating: 5, created_at: daysAgo(4) },
    { evaluation_point_id: ptRecepcao.id, rating: 5, comment: 'Adorei o salão!', created_at: daysAgo(0) },
    { evaluation_point_id: ptRecepcao.id, rating: 4, created_at: daysAgo(1) },
    { evaluation_point_id: ptRecepcao.id, rating: 1, comment: 'Péssima experiência, não volto mais.', created_at: daysAgo(2) },
    { evaluation_point_id: ptRecepcao.id, rating: 3, created_at: daysAgo(3) },
    { evaluation_point_id: ptRecepcao.id, rating: 5, comment: 'Profissional incrível!', created_at: daysAgo(4) },
  ]

  const { error: fbErr } = await supabase.from('feedbacks').insert(feedbacks)
  if (fbErr) throw new Error(`Feedbacks: ${fbErr.message}`)
  console.log(`  ✅  ${feedbacks.length} feedbacks criados`)

  // 6. Alert configs
  console.log('🔔  Configurando alertas...')
  await supabase.from('alert_configs').upsert([
    { user_id: admin.id, threshold_rating: 2, enabled: true },
    { user_id: tester.id, threshold_rating: 2, enabled: true },
  ], { onConflict: 'user_id' })
  console.log('  ✅  Alertas configurados (threshold ≤ 2 estrelas)')

  console.log('\n🎉  Seed concluído!\n')
  console.log('┌─────────────────────────────────────────────────────────────┐')
  console.log('│  CREDENCIAIS DE TESTE                                       │')
  console.log('├─────────────────────────────────────────────────────────────┤')
  console.log(`│  Admin  → ${ADMIN_EMAIL}  │`)
  console.log(`│  Senha  → ${ADMIN_PASSWORD}                                 │`)
  console.log('├─────────────────────────────────────────────────────────────┤')
  console.log(`│  Teste  → ${TESTER_EMAIL}  │`)
  console.log(`│  Senha  → ${TESTER_PASSWORD}                                │`)
  console.log('├─────────────────────────────────────────────────────────────┤')
  console.log('│  Páginas públicas:                                          │')
  console.log('│  /a/lanchonete-caixa          /a/lanch-atendimento           │')
  console.log('│  /a/salao-recepcao                                          │')
  console.log('└─────────────────────────────────────────────────────────────┘\n')
}

seed().catch(err => {
  console.error('\n❌  Erro no seed:', err.message)
  process.exit(1)
})
