-- ============================================
-- TRIGGER 1: Atualizar média e contagem do ponto
-- ============================================
CREATE OR REPLACE FUNCTION update_point_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE evaluation_points
    SET
        total_feedbacks = (
            SELECT COUNT(*)
            FROM feedbacks
            WHERE evaluation_point_id = NEW.evaluation_point_id
        ),
        current_average = (
            SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0.00)
            FROM feedbacks
            WHERE evaluation_point_id = NEW.evaluation_point_id
        ),
        updated_at = NOW()
    WHERE id = NEW.evaluation_point_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_point_stats
AFTER INSERT ON feedbacks
FOR EACH ROW EXECUTE FUNCTION update_point_stats();

-- ============================================
-- TRIGGER 2: Marcar feedback como alerta (in-app)
-- ============================================
CREATE OR REPLACE FUNCTION mark_feedback_as_alert()
RETURNS TRIGGER AS $$
DECLARE
    v_threshold INTEGER;
    v_enabled BOOLEAN;
BEGIN
    SELECT
        COALESCE(ac.threshold_rating, 2),
        COALESCE(ac.enabled, true)
    INTO v_threshold, v_enabled
    FROM evaluation_points ep
    JOIN businesses b ON ep.business_id = b.id
    LEFT JOIN alert_configs ac ON ac.user_id = b.user_id
    WHERE ep.id = NEW.evaluation_point_id;

    IF v_enabled AND NEW.rating <= v_threshold THEN
        NEW.is_alert := true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- BEFORE INSERT para poder modificar o NEW record
CREATE TRIGGER trigger_mark_feedback_as_alert
BEFORE INSERT ON feedbacks
FOR EACH ROW EXECUTE FUNCTION mark_feedback_as_alert();

-- ============================================
-- TRIGGER 3: Enforce plano gratuito (1 ponto ativo)
-- ============================================
CREATE OR REPLACE FUNCTION enforce_free_plan_limit()
RETURNS TRIGGER AS $$
DECLARE
    v_user_plan VARCHAR(30);
    v_point_count INTEGER;
BEGIN
    SELECT u.plan_type INTO v_user_plan
    FROM users u
    JOIN businesses b ON b.user_id = u.id
    WHERE b.id = NEW.business_id;

    IF v_user_plan = 'free' THEN
        SELECT COUNT(*) INTO v_point_count
        FROM evaluation_points
        WHERE business_id = NEW.business_id AND is_active = true;

        IF v_point_count >= 1 THEN
            RAISE EXCEPTION 'Plano gratuito permite apenas 1 ponto de avaliação ativo. Faça upgrade para criar mais.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_enforce_free_plan
BEFORE INSERT ON evaluation_points
FOR EACH ROW EXECUTE FUNCTION enforce_free_plan_limit();

-- ============================================
-- TRIGGER 4: Gerar slug público único
-- ============================================
CREATE OR REPLACE FUNCTION generate_public_slug()
RETURNS TRIGGER AS $$
DECLARE
    v_slug VARCHAR(20);
    v_attempts INTEGER := 0;
BEGIN
    IF NEW.public_slug IS NOT NULL AND NEW.public_slug != '' THEN
        RETURN NEW;
    END IF;

    LOOP
        v_slug := substr(md5(random()::text || clock_timestamp()::text), 1, 10);
        v_attempts := v_attempts + 1;

        EXIT WHEN NOT EXISTS (
            SELECT 1 FROM evaluation_points WHERE public_slug = v_slug
        );

        IF v_attempts >= 5 THEN
            RAISE EXCEPTION 'Não foi possível gerar um slug único após 5 tentativas.';
        END IF;
    END LOOP;

    NEW.public_slug := v_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_generate_slug
BEFORE INSERT ON evaluation_points
FOR EACH ROW EXECUTE FUNCTION generate_public_slug();

-- ============================================
-- FUNÇÃO: auto-criar alert_config e user após signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO alert_configs (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
