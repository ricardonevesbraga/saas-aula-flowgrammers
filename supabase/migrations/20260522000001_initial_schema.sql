-- ============================================
-- AVALIE MEU ATENDIMENTO — Initial Schema
-- ============================================

-- ============================================
-- TABELA: users (donos dos negócios)
-- ============================================
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    plan_type VARCHAR(30) NOT NULL DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABELA: businesses (1 por usuário no MVP)
-- ============================================
CREATE TABLE businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    logo_url TEXT,
    thank_you_message TEXT DEFAULT 'Obrigado pela sua avaliação! Volte sempre 💛',
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_businesses_user ON businesses(user_id);
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABELA: evaluation_points
-- ============================================
CREATE TABLE evaluation_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    public_slug VARCHAR(20) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    total_feedbacks INTEGER DEFAULT 0,
    current_average DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_eval_points_business ON evaluation_points(business_id);
CREATE INDEX idx_eval_points_slug ON evaluation_points(public_slug);
CREATE INDEX idx_eval_points_active ON evaluation_points(is_active) WHERE is_active = true;
ALTER TABLE evaluation_points ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABELA: feedbacks (avaliações anônimas)
-- ============================================
CREATE TABLE feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    evaluation_point_id UUID NOT NULL REFERENCES evaluation_points(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_read BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    is_alert BOOLEAN DEFAULT false,
    user_agent TEXT,
    ip_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_feedbacks_point ON feedbacks(evaluation_point_id);
CREATE INDEX idx_feedbacks_created ON feedbacks(created_at DESC);
CREATE INDEX idx_feedbacks_rating ON feedbacks(rating);
CREATE INDEX idx_feedbacks_unread ON feedbacks(is_read) WHERE is_read = false;
CREATE INDEX idx_feedbacks_alert_unread ON feedbacks(is_alert, is_read) WHERE is_alert = true AND is_read = false;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABELA: alert_configs (sem WhatsApp — alertas in-app)
-- ============================================
CREATE TABLE alert_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    threshold_rating INTEGER DEFAULT 2 CHECK (threshold_rating BETWEEN 1 AND 5),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alert_configs_user ON alert_configs(user_id);
ALTER TABLE alert_configs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABELA: exports_history
-- ============================================
CREATE TABLE exports_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_records INTEGER DEFAULT 0,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_exports_user ON exports_history(user_id);
ALTER TABLE exports_history ENABLE ROW LEVEL SECURITY;

-- ============================================
-- TABELA: audit_logs
-- ============================================
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
