-- CYBERGUARD AI Seed Data Script

INSERT INTO users (id, full_name, email, password_hash, role, department, risk_score, avatar_url)
VALUES 
('usr-001', 'Robert Vance', 'user@company.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'USER', 'Finance & Ops', 25, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('usr-admin', 'Sarah Jenkins', 'admin@cyberguard.internal', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'ADMIN', 'SecOps Admin', 5, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('usr-soc', 'David Miller', 'soc@cyberguard.internal', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890', 'SOC_ANALYST', 'Threat Forensics', 10, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO devices (id, user_id, device_name, mac_address, ip_address, os_version, risk_level, status)
VALUES
('dev-01', 'usr-001', 'Workstation WS-8812', '00:1A:2B:3C:4D:5E', '192.168.1.104', 'Windows 11 Enterprise', 'LOW', 'TRUSTED'),
('dev-02', 'usr-001', 'Unknown Android Device', 'AA:BB:CC:DD:EE:FF', '185.220.101.5', 'Android 14', 'CRITICAL', 'UNTRUSTED')
ON CONFLICT (id) DO NOTHING;

INSERT INTO incidents (id, title, threat_type, severity, risk_score, affected_user_id, affected_device_id, status, assigned_analyst, summary, recommended_countermeasure)
VALUES
('INC-1024', 'Credential Harvesting Phishing Campaign via Look-Alike Domain', 'PHISHING', 'CRITICAL', 92, 'usr-001', 'dev-01', 'INVESTIGATING', 'Sarah Jenkins', 'Suspicious email received claiming urgent password reset from sovereign-vault-login.internal with embedded credential harvesting URL.', 'Quarantine email, block domain sovereign-vault-login.internal, revoke active session, require MFA reset.'),
('INC-1025', 'Anomalous Account Takeover Attempt from Foreign IP Range', 'ACCOUNT_TAKEOVER', 'HIGH', 88, 'usr-001', 'dev-02', 'TRIAGED', 'David Miller', '17 failed login attempts followed by successful authentication from unknown Android device in Moscow, Russia.', 'Revoke session token, enforce IP firewall block on 185.220.101.5, prompt password reset.'),
('INC-1026', 'Obfuscated Double Extension Executable in ZIP Upload', 'MALWARE', 'HIGH', 85, 'usr-001', 'dev-01', 'CONTAINED', 'Sarah Jenkins', 'User uploaded invoice_2026.pdf.exe inside invoice.zip containing executable headers and high entropy.', 'Quarantine file invoice.zip, flag SHA-256 hash in Threat Intelligence database.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO incident_evidence (id, incident_id, evidence_type, label, detail, risk_impact)
VALUES
('ev-101', 'INC-1024', 'SENDER_DOMAIN', 'Look-Alike Domain Mismatch', 'Claimed identity: Security Team, Actual Domain: @sovereign-vault-login.internal', 25),
('ev-102', 'INC-1024', 'NLP_URGENCY', 'High Urgency / Threat Language', 'Phrase detected: "Account will be permanently suspended within 15 minutes unless verified"', 20),
('ev-103', 'INC-1024', 'URL_HARVEST', 'Credential Request Form', 'Destination URL contains password harvesting HTML form fields', 30),
('ev-104', 'INC-1024', 'BRAND_IMPERSONATION', 'Visual Brand Impersonation', 'Email template matches Microsoft 365 login screen assets with 98% visual similarity', 17)
ON CONFLICT (id) DO NOTHING;

INSERT INTO incident_timeline (id, incident_id, stage_order, stage_name, timestamp_str, description, node_type)
VALUES
('tl-201', 'INC-1024', 1, 'Phishing Email Received', '10:14:02', 'Phishing email delivered to user@company.com inbox from operator@sovereign-vault-login.internal', 'EMAIL'),
('tl-202', 'INC-1024', 2, 'User Submitted for Analysis', '10:15:10', 'User clicked "Check Email" in CyberGuard Threat Analyzer portal', 'USER_ACTION'),
('tl-203', 'INC-1024', 3, 'AI Threat Classification', '10:15:12', 'AI Engine classified content as CRITICAL PHISHING (Risk: 92/100, Confidence: 94%)', 'AI_ENGINE'),
('tl-204', 'INC-1024', 4, 'Incident INC-1024 Created', '10:15:13', 'Automatic incident creation triggered and assigned to SecOps Admin', 'INCIDENT'),
('tl-205', 'INC-1024', 5, 'SecOps Alert Dispatched', '10:15:15', 'Critical alert routed to Live Security Monitor and Analyst Sarah Jenkins', 'ALERT'),
('tl-206', 'INC-1024', 6, 'Countermeasures Enforced', '10:16:00', 'Quarantined email, blocked malicious domain, and forced session revocation', 'RESPONSE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO threat_intelligence (id, ioc_type, ioc_value, threat_family, severity, risk_score, first_seen, last_seen, description)
VALUES
('ioc-01', 'DOMAIN', 'sovereign-vault-login.internal', 'Emotet / Credential Harvester', 'CRITICAL', 95, '2026-09-15', '2026-10-02', 'Known active phishing domain impersonating enterprise OAuth portals.'),
('ioc-02', 'IP', '185.220.101.5', 'TOR Exit Node / BruteForce Botnet', 'HIGH', 88, '2026-08-20', '2026-10-02', 'Reputable malicious exit node associated with password spraying campaigns.'),
('ioc-03', 'HASH', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'Trojan.Win32.Agent.exe', 'HIGH', 90, '2026-09-01', '2026-10-02', 'Obfuscated Windows executable payload embedded in compressed archives.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO files (id, user_id, folder_id, file_name, file_type, size_bytes, hash_sha256, scan_status, risk_score, is_quarantined)
VALUES
('fl-01', 'usr-001', NULL, 'financial_report_Q3.pdf', 'PDF', 1450000, 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0', 'SAFE', 5, FALSE),
('fl-02', 'usr-001', NULL, 'invoice_2026.pdf.exe', 'EXE', 840000, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'MALICIOUS', 97, TRUE),
('fl-03', 'usr-001', NULL, 'employee_roster.xlsx', 'XLSX', 420000, 'f0e9d8c7b6a55432109876543210fedcba9876543210fedcba9876543210fedc', 'SAFE', 12, FALSE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs (id, actor_id, actor_name, action, target, detail, ip_address)
VALUES
('log-01', 'usr-001', 'Robert Vance', 'ANALYSIS_SUBMITTED', 'EMAIL_PHISHING', 'Submitted suspicious message from operator@sovereign-vault-login.internal', '192.168.1.104'),
('log-[#1024]', 'usr-admin', 'Sarah Jenkins', 'INCIDENT_TRIAGED', 'INC-1024', 'Set status to INVESTIGATING and confirmed credential harvesting evidence.', '10.0.4.12')
ON CONFLICT (id) DO NOTHING;
