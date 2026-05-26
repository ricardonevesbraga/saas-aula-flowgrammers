-- ============================================
-- RLS POLICIES: users
-- ============================================
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING ((SELECT auth.uid()) = id);

-- ============================================
-- RLS POLICIES: businesses
-- ============================================
CREATE POLICY "Users manage own business"
ON businesses FOR ALL
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- RLS POLICIES: evaluation_points
-- ============================================
CREATE POLICY "Users manage own evaluation points"
ON evaluation_points FOR ALL
USING (
    business_id IN (
        SELECT id FROM businesses WHERE user_id = (SELECT auth.uid())
    )
);

-- Permite leitura pública de pontos ativos (para página de avaliação via slug)
CREATE POLICY "Public can read active points"
ON evaluation_points FOR SELECT
USING (is_active = true);

-- ============================================
-- RLS POLICIES: feedbacks
-- ============================================

-- Donos leem feedbacks dos seus próprios pontos
CREATE POLICY "Owners can read own feedbacks"
ON feedbacks FOR SELECT
USING (
    evaluation_point_id IN (
        SELECT ep.id
        FROM evaluation_points ep
        JOIN businesses b ON ep.business_id = b.id
        WHERE b.user_id = (SELECT auth.uid())
    )
);

-- Donos podem marcar feedbacks como lido/resolvido
CREATE POLICY "Owners can update own feedbacks"
ON feedbacks FOR UPDATE
USING (
    evaluation_point_id IN (
        SELECT ep.id
        FROM evaluation_points ep
        JOIN businesses b ON ep.business_id = b.id
        WHERE b.user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    evaluation_point_id IN (
        SELECT ep.id
        FROM evaluation_points ep
        JOIN businesses b ON ep.business_id = b.id
        WHERE b.user_id = (SELECT auth.uid())
    )
);

-- Qualquer pessoa pode inserir feedback em ponto ativo (avaliação anônima)
CREATE POLICY "Anyone can submit feedback to active points"
ON feedbacks FOR INSERT
WITH CHECK (
    evaluation_point_id IN (
        SELECT id FROM evaluation_points WHERE is_active = true
    )
);

-- ============================================
-- RLS POLICIES: alert_configs
-- ============================================
CREATE POLICY "Users manage own alert config"
ON alert_configs FOR ALL
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- RLS POLICIES: exports_history
-- ============================================
CREATE POLICY "Users view own exports"
ON exports_history FOR ALL
USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- RLS POLICIES: audit_logs
-- ============================================
-- Apenas o sistema insere (via service role), usuários não leem
-- (sem policies SELECT/UPDATE para usuários comuns)
