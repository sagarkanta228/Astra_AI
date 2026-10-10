-- CYBERGUARD AI Schema Definition

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(128) NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'USER', -- 'USER', 'ADMIN', 'SOC_ANALYST'
    department VARCHAR(64) DEFAULT 'General',
    risk_score INT DEFAULT 15,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    device_name VARCHAR(128) NOT NULL,
    mac_address VARCHAR(64),
    ip_address VARCHAR(64),
    os_version VARCHAR(64),
    risk_level VARCHAR(32) DEFAULT 'LOW',
    status VARCHAR(32) DEFAULT 'TRUSTED',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS threat_events (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    category VARCHAR(64) NOT NULL, -- 'PHISHING', 'MALWARE', 'IMPERSONATION', 'DEEPFAKE', 'ACCOUNT_TAKEOVER', 'SPAM', 'NETWORK_ANOMALY'
    severity VARCHAR(32) NOT NULL, -- 'SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    risk_score INT NOT NULL,
    confidence INT NOT NULL,
    input_type VARCHAR(32) NOT NULL, -- 'email', 'url', 'file', 'image', 'audio', 'video', 'message', 'log'
    raw_input TEXT,
    sender VARCHAR(128),
    url VARCHAR(256),
    file_name VARCHAR(128),
    file_hash VARCHAR(128),
    explanation TEXT,
    evidence_json JSONB,
    indicators_json JSONB,
    recommended_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    threat_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    risk_score INT NOT NULL,
    affected_user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    affected_device_id VARCHAR(64) REFERENCES devices(id) ON DELETE SET NULL,
    status VARCHAR(32) DEFAULT 'NEW', -- 'NEW', 'TRIAGED', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED'
    assigned_analyst VARCHAR(128) DEFAULT 'Unassigned',
    summary TEXT,
    recommended_countermeasure TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incident_evidence (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE CASCADE,
    evidence_type VARCHAR(64) NOT NULL,
    label VARCHAR(128) NOT NULL,
    detail TEXT NOT NULL,
    risk_impact INT DEFAULT 10
);

CREATE TABLE IF NOT EXISTS incident_timeline (
    id VARCHAR(64) PRIMARY KEY,
    incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE CASCADE,
    stage_order INT NOT NULL,
    stage_name VARCHAR(128) NOT NULL,
    timestamp_str VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    node_type VARCHAR(64) DEFAULT 'EVENT'
);

CREATE TABLE IF NOT EXISTS folders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    folder_name VARCHAR(128) NOT NULL,
    parent_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS files (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    folder_id VARCHAR(64) REFERENCES folders(id) ON DELETE SET NULL,
    file_name VARCHAR(256) NOT NULL,
    file_type VARCHAR(32) NOT NULL,
    size_bytes BIGINT NOT NULL,
    hash_sha256 VARCHAR(64) NOT NULL,
    scan_status VARCHAR(32) DEFAULT 'SAFE', -- 'SAFE', 'SUSPICIOUS', 'MALICIOUS', 'QUARANTINED'
    risk_score INT DEFAULT 0,
    is_quarantined BOOLEAN DEFAULT FALSE,
    indicators_json JSONB,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS threat_intelligence (
    id VARCHAR(64) PRIMARY KEY,
    ioc_type VARCHAR(32) NOT NULL, -- 'IP', 'DOMAIN', 'URL', 'HASH', 'EMAIL', 'MALWARE_FAMILY'
    ioc_value VARCHAR(256) NOT NULL,
    threat_family VARCHAR(128),
    severity VARCHAR(32) DEFAULT 'HIGH',
    risk_score INT DEFAULT 85,
    first_seen VARCHAR(64),
    last_seen VARCHAR(64),
    description TEXT
);

CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(32) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    actor_id VARCHAR(64) NOT NULL,
    actor_name VARCHAR(128) NOT NULL,
    action VARCHAR(128) NOT NULL,
    target VARCHAR(128) NOT NULL,
    detail TEXT,
    ip_address VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
