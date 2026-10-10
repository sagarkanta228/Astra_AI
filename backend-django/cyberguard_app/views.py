import hashlib
import time
import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

# -------------------------------------------------------------------
# IN-MEMORY DEMO STATE & HELPERS
# -------------------------------------------------------------------

INCIDENTS_DATA = [
    {
        "id": "INC-1024",
        "title": "Credential Harvesting Phishing Campaign via Look-Alike Domain",
        "threatType": "PHISHING",
        "severity": "CRITICAL",
        "riskScore": 92,
        "confidence": 94,
        "affectedUser": "Robert Vance (user@company.com)",
        "affectedDevice": "Workstation WS-8812 (192.168.1.104)",
        "status": "INVESTIGATING",
        "assignedAnalyst": "Sarah Jenkins",
        "detectedAt": "2026-10-02 10:14:02 UTC",
        "summary": "Suspicious email claiming urgent password reset received from operator@sovereign-vault-login.internal with embedded credential harvesting URL.",
        "attackTechnique": "T1566.002 - Phishing: Spearphishing Link",
        "indicators": [
            "Look-alike sender domain (@sovereign-vault-login.internal)",
            "High-urgency language & suspension threat",
            "Embedded OAuth credential harvesting link",
            "M365 visual brand impersonation"
        ],
        "evidence": [
            {"type": "SENDER_DOMAIN", "label": "Domain Mismatch", "detail": "Claimed: Sovereign Vault, Actual: sovereign-vault-login.internal", "impact": "+30"},
            {"type": "NLP_URGENCY", "label": "Urgent Coercion", "detail": "Detected phrase: 'Account permanently suspended within 15 minutes'", "impact": "+25"},
            {"type": "URL_HARVEST", "label": "Credential Form", "detail": "URL destination contains unencrypted login credential form", "impact": "+25"},
            {"type": "BRAND_IMPERSONATION", "label": "Asset Copy", "detail": "98% structural match to Microsoft 365 OAuth screen", "impact": "+17"}
        ],
        "timeline": [
            {"stageOrder": 1, "stageName": "Phishing Email Delivered", "timestamp": "10:14:02", "description": "Email landed in user@company.com inbox from operator@sovereign-vault-login.internal", "nodeType": "EMAIL"},
            {"stageOrder": 2, "stageName": "User Submitted Analysis", "timestamp": "10:15:10", "description": "User clicked Check Email in CyberGuard Threat Analyzer", "nodeType": "USER_ACTION"},
            {"stageOrder": 3, "stageName": "AI Engine Classification", "timestamp": "10:15:12", "description": "AI Engine classified content as CRITICAL PHISHING (Risk: 92/100)", "nodeType": "AI_ENGINE"},
            {"stageOrder": 4, "stageName": "Incident INC-1024 Created", "timestamp": "10:15:13", "description": "Automatic incident creation and routing to SecOps Admin", "nodeType": "INCIDENT"},
            {"stageOrder": 5, "stageName": "Alert Routed to SOC", "timestamp": "10:15:15", "description": "High-priority alert dispatched to Live Security Monitor", "nodeType": "ALERT"},
            {"stageOrder": 6, "stageName": "Countermeasure Confirmation", "timestamp": "Pending", "description": "Awaiting analyst approval for quarantine & URL block", "nodeType": "RESPONSE"}
        ],
        "attackChain": [
            {"id": "node-1", "label": "PHISHING EMAIL", "subtext": "operator@sovereign-vault-login.internal", "status": "MALICIOUS", "icon": "mail"},
            {"id": "node-2", "label": "USER CLICK", "subtext": "Clicked embedded link", "status": "TRIGGERED", "icon": "ads_click"},
            {"id": "node-3", "label": "CREDENTIAL HARVEST", "subtext": "sovereign-vault-login.internal/auth", "status": "CRITICAL", "icon": "key"},
            {"id": "node-4", "label": "ACCOUNT COMPROMISE", "subtext": "user@company.com credentials stolen", "status": "SUSPECTED", "icon": "lock_open"},
            {"id": "node-5", "label": "UNKNOWN DEVICE LOGIN", "subtext": "185.220.101.5 (Android 14)", "status": "DETECTED", "icon": "devices"},
            {"id": "node-6", "label": "DATA ACCESS", "subtext": "Access to Financial Vault #4", "status": "PREVENTED", "icon": "folder_shared"}
        ],
        "recommendedResponse": [
            {"action": "QUARANTINE_EMAIL", "label": "Quarantine Phishing Email", "reason": "Prevents other users from opening malicious message", "requiresApproval": True},
            {"action": "BLOCK_URL", "label": "Block Domain sovereign-vault-login.internal", "reason": "Halts active credential exfiltration tunnel at perimeter firewall", "requiresApproval": True},
            {"action": "REVOKE_SESSION", "label": "Revoke User Session Tokens", "reason": "Mitigates immediate account takeover risk", "requiresApproval": True},
            {"action": "FORCE_MFA", "label": "Force Password Reset & MFA Prompt", "reason": "Restores account integrity", "requiresApproval": False}
        ]
    }
]

IOC_DATA = [
    {"id": "ioc-01", "type": "DOMAIN", "value": "sovereign-vault-login.internal", "threatFamily": "Emotet Phishing", "severity": "CRITICAL", "riskScore": 95, "firstSeen": "2026-09-15", "lastSeen": "2026-10-02", "description": "Active phishing credential harvesting domain."},
    {"id": "ioc-02", "type": "IP", "value": "185.220.101.5", "threatFamily": "TOR Exit Node / Botnet", "severity": "HIGH", "riskScore": 88, "firstSeen": "2026-08-20", "lastSeen": "2026-10-02", "description": "Reputable exit node linked with brute force campaigns."},
    {"id": "ioc-03", "type": "HASH", "value": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "threatFamily": "Trojan.Win32.Agent.exe", "severity": "HIGH", "riskScore": 90, "firstSeen": "2026-09-01", "lastSeen": "2026-10-02", "description": "High-entropy executable payload in invoice ZIP archive."}
]

AUDIT_LOGS_DATA = [
    {"id": "log-01", "actor": "Robert Vance", "action": "ANALYSIS_SUBMITTED", "target": "Email Phishing", "detail": "Submitted text from operator@sovereign-vault-login.internal", "ip": "192.168.1.104", "timestamp": "2026-10-02 10:15:10 UTC"}
]

# -------------------------------------------------------------------
# ENDPOINTS
# -------------------------------------------------------------------

@api_view(['GET'])
def root_view(request):
    return Response({
        "system": "CYBERGUARD AI (Django Engine)",
        "database": "Neon PostgreSQL / SQLite Dual Engine",
        "status": "OPERATIONAL",
        "version": "3.0.0",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    })

@api_view(['POST'])
def login_view(request):
    data = request.data or {}
    email = data.get('email', 'user@company.com')
    role = data.get('role', 'USER')

    if email == 'admin@cyberguard.internal':
        role = 'ADMIN'
    elif email == 'soc@cyberguard.internal':
        role = 'SOC_ANALYST'

    fullName = "Robert Vance" if role == "USER" else ("Sarah Jenkins" if role == "ADMIN" else "David Miller")

    return Response({
        "status": "SUCCESS",
        "message": "Authenticated with Zero-Trust Post-Quantum Key Exchange (Django Backend)",
        "user": {
            "id": "usr-001",
            "fullName": fullName,
            "email": email,
            "role": role,
            "department": "Finance & Ops" if role == "USER" else "SecOps Lead",
            "riskScore": 25,
            "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "token": "jwt-cyberguard-postquantum-token-django999"
        }
    })

@api_view(['POST'])
def register_view(request):
    data = request.data or {}
    return Response({
        "status": "SUCCESS",
        "message": "User registered successfully",
        "user": {
            "id": f"usr-{int(time.time())}",
            "fullName": data.get("fullName", "New User"),
            "email": data.get("email", "user@company.com"),
            "role": data.get("role", "USER"),
            "department": "Engineering",
            "riskScore": 15,
            "token": "jwt-cyberguard-postquantum-token-newuser"
        }
    })

@api_view(['GET'])
def live_stream_view(request):
    return Response([
        {"id": "evt-901", "timestamp": time.strftime("%H:%M:%S", time.gmtime()), "eventType": "PHISHING", "severity": "CRITICAL", "source": "185.220.101.5", "user": "user@company.com", "detail": "Phishing link sovereign-vault-login.internal detected"},
        {"id": "evt-902", "timestamp": time.strftime("%H:%M:%S", time.gmtime()), "eventType": "ANOMALY", "severity": "HIGH", "source": "192.168.1.104", "user": "devin.franco@company.com", "detail": "17 failed login attempts followed by successful auth"},
        {"id": "evt-903", "timestamp": time.strftime("%H:%M:%S", time.gmtime()), "eventType": "MALWARE", "severity": "HIGH", "source": "WS-8812", "user": "robert.vance@company.com", "detail": "Double extension executable invoice_2026.pdf.exe quarantined"}
    ])

@api_view(['POST'])
def analyze_threat_view(request):
    data = request.data or {}
    input_type = data.get('inputType', 'email')
    sender = data.get('sender', '')
    content = data.get('content', '')
    url = data.get('url', '')
    file_name = data.get('fileName', '')

    indicators = []
    evidence = []
    risk_score = 15

    if "sovereign-vault-login" in (sender + content + url).lower():
        indicators.append("Look-alike domain mismatch (@sovereign-vault-login.internal)")
        evidence.append({"type": "DOMAIN", "label": "Domain Impersonation", "detail": "Sender domain mimics official vault infrastructure", "impact": "+30"})
        risk_score += 30

    if any(k in content.lower() for k in ["urgent", "suspended", "15 minutes", "verify"]):
        indicators.append("Coercive urgency language detected")
        evidence.append({"type": "NLP_URGENCY", "label": "Psychological Coercion", "detail": "Urgency trigger threatening account lockout", "impact": "+25"})
        risk_score += 25

    if "password" in content.lower() or "login" in url.lower():
        indicators.append("Credential harvesting form embedded")
        evidence.append({"type": "URL_HARVEST", "label": "Credential Form", "detail": "Destination form captures user credentials", "impact": "+25"})
        risk_score += 25

    if input_type in ['deepfake', 'image', 'audio', 'video']:
        category = "DEEPFAKE"
        threat_category = "Digital Impersonation & Synthetic Media"
        risk_score = 87
        indicators = ["Facial lighting inconsistency", "High frequency audio harmonics gap (>8kHz)"]
        evidence = [
            {"type": "SPECTROGRAM", "label": "Audio Frequency Gap", "detail": "Discontinuity in high-frequency vocal harmonics", "impact": "+40"},
            {"type": "FACE_ALIGN", "label": "Lip-Sync Latency", "detail": "120ms frame drift between audio and facial stream", "impact": "+30"}
        ]
        explanation = "Synthetic manipulation detected by Django AI engine. Voice signature matches ElevenLabs v2 cloning signature."
    else:
        category = "PHISHING"
        threat_category = "Phishing & Credential Theft"
        risk_score = min(risk_score, 92)
        if not indicators:
            indicators = ["Potential untrusted external link"]
            evidence = [{"type": "URL", "label": "External Domain", "detail": "Domain not present in enterprise allowlist", "impact": "+15"}]
        explanation = f"High risk classification. Originates from domain '{sender if sender else 'unknown'}' with coercive language demanding credential entry."

    severity = "CRITICAL" if risk_score >= 80 else ("HIGH" if risk_score >= 60 else "MEDIUM")

    AUDIT_LOGS_DATA.append({
        "id": f"log-{uuid.uuid4().hex[:6]}",
        "actor": "Robert Vance",
        "action": "ANALYSIS_PERFORMED",
        "target": input_type.upper(),
        "detail": f"Threat analysis evaluated via Django AI engine. Risk: {risk_score}",
        "ip": "192.168.1.104",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    })

    return Response({
        "category": category,
        "threatCategory": threat_category,
        "riskScore": risk_score,
        "severity": severity,
        "confidence": 94,
        "attackTechnique": "T1566.002 - Spearphishing Link",
        "indicators": indicators,
        "evidence": evidence,
        "explanation": explanation,
        "recommendedResponse": [
            "Quarantine email message immediately",
            "Block domain at perimeter firewall",
            "Revoke active user session tokens",
            "Force password reset & MFA verification"
        ]
    })

@api_view(['GET'])
def get_incidents_view(request):
    return Response(INCIDENTS_DATA)

@api_view(['GET'])
def get_incident_detail_view(request, incident_id):
    inc = next((i for i in INCIDENTS_DATA if i["id"] == incident_id), INCIDENTS_DATA[0])
    return Response(inc)

@api_view(['POST'])
def incident_response_view(request, incident_id):
    inc = next((i for i in INCIDENTS_DATA if i["id"] == incident_id), INCIDENTS_DATA[0])
    inc["status"] = "CONTAINED"
    action = request.data.get("action", "QUARANTINE_EMAIL") if request.data else "QUARANTINE_EMAIL"

    inc["timeline"].append({
        "stageOrder": len(inc["timeline"]) + 1,
        "stageName": f"Countermeasure Enforced: {action}",
        "timestamp": time.strftime("%H:%M:%S", time.gmtime()),
        "description": f"Analyst confirmed countermeasure {action} in Django Backend. Status CONTAINED.",
        "nodeType": "RESPONSE"
    })

    return Response({
        "status": "SUCCESS",
        "message": f"Countermeasure '{action}' enforced successfully via Django backend.",
        "incident": inc
    })

@api_view(['GET', 'POST'])
def threat_intel_view(request):
    return Response(IOC_DATA)

@api_view(['POST'])
def copilot_view(request):
    q = (request.data.get('query', '') if request.data else '').lower()
    if "incident" in q or "1024" in q:
        ans = "Incident #INC-1024 (Django DB evaluated): Critical Phishing campaign (Risk: 92/100) targeting user@company.com with look-alike domain sovereign-vault-login.internal."
    else:
        ans = f"Django AI Telemetry evaluated query '{q}'. All 1,248 perimeter node logs nominal."

    return Response({
        "query": q,
        "answer": ans,
        "confidence": 96,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    })

@api_view(['GET'])
def audit_logs_view(request):
    return Response(AUDIT_LOGS_DATA)

@api_view(['POST'])
def run_demo_scenario_view(request):
    return Response({
        "scenarioName": "Django End-to-End Phishing to Containment Attack Scenario",
        "totalSteps": 13,
        "status": "COMPLETED",
        "incidentId": "INC-1024"
    })
