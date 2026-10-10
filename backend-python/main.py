from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import hashlib
import time
import uuid

app = FastAPI(
    title="CYBERGUARD AI Engine",
    description="AI-Powered Cyber Threat, Phishing & Digital Impersonation Detection and Response System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# IN-MEMORY DEMO DATABASE
# -------------------------------------------------------------------

INCIDENTS_DB = [
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
            {"type": "SENDER_DOMAIN", "label": "Domain Mismatch", "detail": "Claimed: Sovereign Vault, Actual: sovereign-vault-login.internal", "impact": "+25"},
            {"type": "NLP_URGENCY", "label": "Urgent Coercion", "detail": "Detected phrase: 'Account permanently suspended within 15 minutes'", "impact": "+20"},
            {"type": "URL_HARVEST", "label": "Credential Form", "detail": "URL destination contains unencrypted login credential form", "impact": "+30"},
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
    },
    {
        "id": "INC-1025",
        "title": "Anomalous Account Takeover Attempt from Foreign IP Range",
        "threatType": "ACCOUNT_TAKEOVER",
        "severity": "HIGH",
        "riskScore": 88,
        "confidence": 91,
        "affectedUser": "Robert Vance (user@company.com)",
        "affectedDevice": "Unknown Android Device (185.220.101.5)",
        "status": "TRIAGED",
        "assignedAnalyst": "David Miller",
        "detectedAt": "2026-10-02 09:48:12 UTC",
        "summary": "17 failed login attempts followed by successful authentication from an unknown device in Moscow, Russia.",
        "attackTechnique": "T1110.003 - Password Spraying",
        "indicators": [
            "17 failed logins within 60 seconds",
            "Impossible travel anomaly (New York → Moscow in 10 mins)",
            "Unrecognized Android 14 User-Agent",
            "IP address present on TOR Exit Node list"
        ],
        "evidence": [
            {"type": "BRUTE_FORCE", "label": "High Failure Rate", "detail": "17 login failures before token issuance", "impact": "+35"},
            {"type": "GEOLOCATION", "label": "Impossible Travel", "detail": "Distance delta > 4,500 miles within 10 minutes", "impact": "+30"},
            {"type": "DEVICE_ID", "label": "New Fingerprint", "detail": "Device MAC & OS signature unseen in user history", "impact": "+23"}
        ],
        "timeline": [
            {"stageOrder": 1, "stageName": "Password Spray Triggered", "timestamp": "09:47:00", "description": "17 automated login attempts from 185.220.101.5", "nodeType": "LOG"},
            {"stageOrder": 2, "stageName": "Successful Login", "timestamp": "09:48:12", "description": "Valid credential pair accepted for user@company.com", "nodeType": "LOG"},
            {"stageOrder": 3, "stageName": "Anomaly Alarm Fired", "timestamp": "09:48:15", "description": "Behavioral AI flagged impossible travel & device anomaly", "nodeType": "AI_ENGINE"}
        ],
        "attackChain": [
            {"id": "n1", "label": "PASSWORD SPRAY", "subtext": "17 attempts", "status": "CRITICAL", "icon": "password"},
            {"id": "n2", "label": "UNTRUSTED IP", "subtext": "185.220.101.5", "status": "MALICIOUS", "icon": "public"},
            {"id": "n3", "label": "TOKEN ISSUED", "subtext": "Session active", "status": "SUSPECTED", "icon": "token"}
        ],
        "recommendedResponse": [
            {"action": "REVOKE_SESSION", "label": "Revoke Session Token", "reason": "Disconnect untrusted mobile device immediately", "requiresApproval": True},
            {"action": "BLOCK_IP", "label": "Block IP 185.220.101.5", "reason": "Prevent further password spraying", "requiresApproval": True}
        ]
    }
]

IOC_DB = [
    {"id": "ioc-01", "type": "DOMAIN", "value": "sovereign-vault-login.internal", "threatFamily": "Emotet Phishing", "severity": "CRITICAL", "riskScore": 95, "firstSeen": "2026-09-15", "lastSeen": "2026-10-02", "description": "Active phishing credential harvesting domain."},
    {"id": "ioc-02", "type": "IP", "value": "185.220.101.5", "threatFamily": "TOR Exit Node / Botnet", "severity": "HIGH", "riskScore": 88, "firstSeen": "2026-08-20", "lastSeen": "2026-10-02", "description": "Reputable exit node linked with brute force campaigns."},
    {"id": "ioc-03", "type": "HASH", "value": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "threatFamily": "Trojan.Win32.Agent.exe", "severity": "HIGH", "riskScore": 90, "firstSeen": "2026-09-01", "lastSeen": "2026-10-02", "description": "High-entropy executable payload in invoice ZIP archive."},
    {"id": "ioc-04", "type": "URL", "value": "http://sovereign-vault-login.internal/auth/reset-password", "threatFamily": "Credential Harvester", "severity": "CRITICAL", "riskScore": 97, "firstSeen": "2026-10-01", "lastSeen": "2026-10-02", "description": "Unencrypted HTML form capturing email and plaintext passwords."}
]

AUDIT_LOGS_DB = [
    {"id": "log-01", "actor": "Robert Vance", "action": "ANALYSIS_SUBMITTED", "target": "Email Phishing", "detail": "Submitted text from operator@sovereign-vault-login.internal", "ip": "192.168.1.104", "timestamp": "2026-10-02 10:15:10 UTC"},
    {"id": "log-02", "actor": "Sarah Jenkins", "action": "INCIDENT_TRIAGED", "target": "INC-1024", "detail": "Verified credential harvesting evidence and assigned analyst", "ip": "10.0.4.12", "timestamp": "2026-10-02 10:16:00 UTC"}
]

# -------------------------------------------------------------------
# PYDANTIC SCHEMAS
# -------------------------------------------------------------------

class ThreatAnalysisRequest(BaseModel):
    inputType: str  # 'email', 'url', 'message', 'file_static', 'deepfake', 'account_takeover', 'log'
    content: Optional[str] = ""
    sender: Optional[str] = ""
    url: Optional[str] = ""
    fileName: Optional[str] = ""

class IncidentResponseRequest(BaseModel):
    action: str
    confirmed: bool = True

class CopilotQueryRequest(BaseModel):
    query: str
    contextIncidentId: Optional[str] = None

# -------------------------------------------------------------------
# HELPER DETECTORS
# -------------------------------------------------------------------

def analyze_email_phishing(sender: str, text: str, url: str) -> Dict[str, Any]:
    text_lower = (text + " " + sender + " " + url).lower()
    
    indicators = []
    evidence = []
    risk_score = 15
    
    if "sovereign-vault-login" in text_lower or "login" in sender or "internal-vault" in text_lower:
        indicators.append("Look-alike domain mismatch (@sovereign-vault-login.internal)")
        evidence.append({"type": "DOMAIN", "label": "Domain Impersonation", "detail": "Sender domain mimics official vault infrastructure", "impact": "+30"})
        risk_score += 30

    if any(k in text_lower for k in ["urgent", "suspended", "immediately", "15 minutes", "verify account", "action required"]):
        indicators.append("Coercive urgency and threat language")
        evidence.append({"type": "NLP", "label": "Psychological Coercion", "detail": "Strong urgency trigger threatening account lockout", "impact": "+25"})
        risk_score += 25

    if any(k in text_lower for k in ["password", "credential", "auth", "login", "reset"]):
        indicators.append("Credential harvesting request")
        evidence.append({"type": "FORM", "label": "Credential Harvesting", "detail": "Prompting user to enter authentication credentials", "impact": "+25"})
        risk_score += 25

    if url and any(k in url.lower() for k in ["http:", "login", "auth", "reset"]):
        indicators.append("Unencrypted / Suspicious URL destination")
        evidence.append({"type": "URL", "label": "Insecure HTTP Protocol", "detail": f"Destination points to suspicious link: {url}", "impact": "+15"})
        risk_score += 15

    risk_score = min(risk_score, 98)
    severity = "CRITICAL" if risk_score >= 80 else ("HIGH" if risk_score >= 60 else ("MEDIUM" if risk_score >= 40 else "SAFE"))
    
    return {
        "category": "PHISHING",
        "threatCategory": "Phishing & Credential Theft",
        "riskScore": risk_score,
        "severity": severity,
        "confidence": 94,
        "attackTechnique": "T1566.002 - Spearphishing Link",
        "indicators": indicators if indicators else ["No explicit phishing signals detected"],
        "evidence": evidence,
        "explanation": f"High risk detection. The message originates from look-alike domain '{sender if sender else 'unknown'}' and contains coercive urgency language demanding immediate credential validation.",
        "recommendedResponse": [
            "Do not click any embedded links",
            "Quarantine email message immediately",
            "Block sender domain at perimeter firewall",
            "Report attempt to SecOps Team"
        ]
    }

def analyze_file_static(file_name: str, content_bytes: bytes = b"") -> Dict[str, Any]:
    file_name_lower = file_name.lower()
    indicators = []
    evidence = []
    risk_score = 5

    # Double extension check
    if file_name_lower.endswith(".exe") or file_name_lower.endswith(".dll") or file_name_lower.endswith(".bat") or file_name_lower.endswith(".ps1"):
        indicators.append("Executable binary extension detected (.exe / .dll / .bat)")
        evidence.append({"type": "FILE_TYPE", "label": "Executable Payload", "detail": "File contains executable code structure", "impact": "+40"})
        risk_score += 40

    if ".pdf.exe" in file_name_lower or ".doc.exe" in file_name_lower or ".zip.exe" in file_name_lower:
        indicators.append("Double extension masking technique (e.g., .pdf.exe)")
        evidence.append({"type": "OBFUSCATION", "label": "Double Extension", "detail": "File disguises executable as document file", "impact": "+35"})
        risk_score += 35

    # Calculate SHA-256
    file_hash = hashlib.sha256(content_bytes if content_bytes else file_name.encode()).hexdigest()
    
    risk_score = min(risk_score, 97)
    severity = "CRITICAL" if risk_score >= 80 else ("HIGH" if risk_score >= 60 else ("MEDIUM" if risk_score >= 40 else "SAFE"))

    return {
        "category": "MALWARE",
        "threatCategory": "Malicious File / Static Analysis",
        "riskScore": risk_score,
        "severity": severity,
        "confidence": 92,
        "fileHash": file_hash,
        "attackTechnique": "T1204.002 - Malicious File Execution",
        "indicators": indicators if indicators else ["Static indicators nominal. No double extension or malicious header."],
        "evidence": evidence,
        "explanation": f"Static inspection calculated SHA-256 hash '{file_hash[:16]}...'. Risk score {risk_score}/100 assigned due to executable extension flags.",
        "recommendedResponse": [
            "QUARANTINE_FILE",
            "Do not execute file locally",
            "Block SHA-256 hash in EDR sandbox",
            "Submit hash to Threat Intelligence Feed"
        ]
    }

# -------------------------------------------------------------------
# ENDPOINTS
# -------------------------------------------------------------------

class LoginSchema(BaseModel):
    email: Optional[str] = "user@company.com"
    password: Optional[str] = ""
    role: Optional[str] = "USER"

@app.get("/")
def read_root():
    return {
        "system": "CYBERGUARD AI",
        "status": "OPERATIONAL",
        "version": "2.0.0",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@app.post("/api/v1/auth/login")
def handle_login(req: LoginSchema):
    role = req.role if req.role in ["ADMIN", "SOC_ANALYST", "USER"] else "USER"
    if req.email == "admin@cyberguard.internal":
        role = "ADMIN"
    elif req.email == "soc@cyberguard.internal":
        role = "SOC_ANALYST"
        
    fullName = "Robert Vance" if role == "USER" else ("Sarah Jenkins" if role == "ADMIN" else "David Miller")
    email = req.email if req.email else ("user@company.com" if role == "USER" else f"{role.lower()}@cyberguard.internal")
    dept = "Finance & Ops" if role == "USER" else ("SecOps Lead" if role == "ADMIN" else "Threat Forensics")
    
    return {
        "status": "SUCCESS",
        "message": "Authenticated with Zero-Trust Post-Quantum Key Exchange",
        "user": {
            "id": "usr-001",
            "fullName": fullName,
            "email": email,
            "role": role,
            "department": dept,
            "riskScore": 25,
            "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "token": "jwt-cyberguard-postquantum-token-xyz789"
        }
    }

@app.post("/api/v1/auth/register")
def handle_register(req: Dict[str, Any]):
    return {
        "status": "SUCCESS",
        "message": "User registered successfully",
        "user": {
            "id": f"usr-{int(time.time())}",
            "fullName": req.get("fullName", "New CyberGuard User"),
            "email": req.get("email", "newuser@company.com"),
            "role": req.get("role", "USER"),
            "department": "Engineering",
            "riskScore": 15,
            "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "token": "jwt-cyberguard-postquantum-token-newuser"
        }
    }

@app.get("/api/v1/live-monitor/stream")
def handle_live_stream():
    return [
        {"id": "evt-901", "timestamp": time.strftime("%H:%M:%S", time.gmtime()), "eventType": "PHISHING", "severity": "CRITICAL", "source": "185.220.101.5", "user": "user@company.com", "detail": "Phishing link sovereign-vault-login.internal detected"},
        {"id": "evt-902", "timestamp": time.strftime("%H:%M:%S", time.gmtime()), "eventType": "ANOMALY", "severity": "HIGH", "source": "192.168.1.104", "user": "devin.franco@company.com", "detail": "17 failed login attempts followed by successful auth"},
        {"id": "evt-903", "timestamp": time.strftime("%H:%M:%S", time.gmtime()), "eventType": "MALWARE", "severity": "HIGH", "source": "WS-8812", "user": "robert.vance@company.com", "detail": "Double extension executable invoice_2026.pdf.exe quarantined"},
        {"id": "evt-904", "timestamp": time.strftime("%H:%M:%S", time.gmtime()), "eventType": "DEEPFAKE", "severity": "MEDIUM", "source": "Audio Stream #4", "user": "carol.white@company.com", "detail": "Synthetic voice harmonic gap detected (>8kHz)"}
    ]


@app.post("/api/v1/analyze/threat")
def analyze_threat(req: ThreatAnalysisRequest):
    if req.inputType == "email" or req.inputType == "message":
        res = analyze_email_phishing(req.sender or "operator@sovereign-vault-login.internal", req.content or "", req.url or "")
    elif req.inputType == "file_static" or req.inputType == "file":
        res = analyze_file_static(req.fileName or "invoice_2026.pdf.exe")
    elif req.inputType == "url" or req.inputType == "website":
        res = analyze_email_phishing("system@url-scan.internal", f"URL destination check: {req.url or 'http://sovereign-vault-login.internal/auth'}", req.url or "http://sovereign-vault-login.internal/auth")
    elif req.inputType == "deepfake" or req.inputType == "image" or req.inputType == "audio" or req.inputType == "video":
        res = {
            "category": "DEEPFAKE",
            "threatCategory": "Digital Impersonation & Synthetic Media",
            "riskScore": 87,
            "severity": "HIGH",
            "confidence": 89,
            "attackTechnique": "T1565.001 - Data Manipulation: Synthetic Identity",
            "indicators": [
                "Facial lighting inconsistency across frames",
                "Synthetic neural voice frequency artifacts",
                "Claimed identity mismatch (CEO audio stream)"
            ],
            "evidence": [
                {"type": "SPECTROGRAM", "label": "Audio Frequency Gap", "detail": "Discontinuity in high-frequency vocal harmonics (>8kHz)", "impact": "+40"},
                {"type": "FACE_ALIGN", "label": "Lip-Sync Latency", "detail": "120ms frame drift between audio track and buccal movement", "impact": "+30"}
            ],
            "explanation": "Potential synthetic manipulation detected. Voice spectrum analysis indicates AI-generated voice cloning signature matching ElevenLabs v2 model.",
            "recommendedResponse": [
                "Require secondary out-of-band phone verification",
                "Flag audio media sample in SecOps Vault",
                "Do not authorize financial transfer requests based on audio command"
            ]
        }
    else:
        res = analyze_email_phishing(req.sender or "", req.content or "", req.url or "")

    # Automatically log audit trail
    AUDIT_LOGS_DB.append({
        "id": f"log-{uuid.uuid4().hex[:6]}",
        "actor": "Robert Vance",
        "action": "ANALYSIS_PERFORMED",
        "target": req.inputType.upper(),
        "detail": f"Threat analysis performed. Category: {res['category']}, Risk Score: {res['riskScore']}",
        "ip": "192.168.1.104",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    })

    return res

@app.get("/api/v1/incidents")
def get_incidents():
    return INCIDENTS_DB

@app.get("/api/v1/incidents/{incident_id}")
def get_incident_by_id(incident_id: str):
    inc = next((i for i in INCIDENTS_DB if i["id"] == incident_id), None)
    if not inc:
        # Fallback to first incident if ID matching fails
        return INCIDENTS_DB[0]
    return inc

@app.post("/api/v1/incidents/{incident_id}/response")
def apply_incident_response(incident_id: str, req: IncidentResponseRequest):
    inc = next((i for i in INCIDENTS_DB if i["id"] == incident_id), None)
    if not inc:
        inc = INCIDENTS_DB[0]

    inc["status"] = "CONTAINED"
    
    # Append timeline node
    inc["timeline"].append({
        "stageOrder": len(inc["timeline"]) + 1,
        "stageName": f"Countermeasure Enforced: {req.action}",
        "timestamp": time.strftime("%H:%M:%S", time.gmtime()),
        "description": f"Analyst confirmed countermeasure {req.action}. Status updated to CONTAINED.",
        "nodeType": "RESPONSE"
    })

    AUDIT_LOGS_DB.append({
        "id": f"log-{uuid.uuid4().hex[:6]}",
        "actor": "Sarah Jenkins",
        "action": "COUNTERMEASURE_ENFORCED",
        "target": incident_id,
        "detail": f"Applied action: {req.action}. Incident status changed to CONTAINED.",
        "ip": "10.0.4.12",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    })

    return {
        "status": "SUCCESS",
        "message": f"Countermeasure '{req.action}' successfully executed. Incident {incident_id} is now CONTAINED.",
        "incident": inc
    }

@app.get("/api/v1/threat-intelligence")
def search_threat_intelligence(query: Optional[str] = Query("")):
    if not query:
        return IOC_DB
    q = query.lower()
    results = [ioc for ioc in IOC_DB if q in ioc["value"].lower() or q in ioc["type"].lower() or q in ioc["threatFamily"].lower()]
    return results

@app.post("/api/v1/files/scan")
def scan_file_static(file: UploadFile = File(...)):
    content = file.file.read()
    res = analyze_file_static(file.filename, content)
    return {
        "fileName": file.filename,
        "fileSize": len(content),
        "mimeType": file.content_type,
        "analysis": res
    }

@app.post("/api/v1/copilot")
def query_copilot(req: CopilotQueryRequest):
    q = req.query.lower()
    
    if "incident" in q or "1024" in q:
        ans = "Incident #INC-1024 involves a Critical Phishing campaign (Risk: 92/100). The attacker impersonated Sovereign Vault using domain '@sovereign-vault-login.internal' with an unencrypted credential harvesting URL. Recommended action is to quarantine the email and block the domain."
    elif "evidence" in q or "why" in q:
        ans = "The AI classified this threat as Critical based on 4 key evidence indicators: (1) Domain Mismatch (+25 impact), (2) Psychological Urgency Coercion (+20 impact), (3) Unencrypted Credential Harvesting Form (+30 impact), and (4) Microsoft 365 Brand Visual Impersonation (+17 impact)."
    elif "action" in q or "do next" in q or "recommend" in q:
        ans = "Recommended SecOps actions: (1) Quarantine the phishing message, (2) Enforce perimeter domain block on 'sovereign-vault-login.internal', (3) Revoke active session tokens for user@company.com, and (4) Prompt MFA password reset."
    elif "user" in q or "affected" in q:
        ans = "Affected user is Robert Vance (user@company.com) on Workstation WS-8812 (192.168.1.104). User risk score is currently 25/100."
    else:
        ans = f"Based on CyberGuard AI telemetry analysis: Query '{req.query}' evaluated across 1,248 active threat events. No critical unauthorized exfiltration observed outside of flagged Incident #INC-1024."

    return {
        "query": req.query,
        "answer": ans,
        "confidence": 96,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    }

@app.get("/api/v1/audit-logs")
def get_audit_logs():
    return AUDIT_LOGS_DB

@app.post("/api/v1/demo/run-scenario")
def run_hackathon_demo_scenario():
    """
    Executes the 13-step Hackathon Attack Demo Scenario:
    User receives phishing email -> Analyzes -> Phishing detected (Risk 92) -> Incident created -> Admin alerted -> Investigation -> Evidence & Timeline -> AI recommends response -> Admin approves -> Incident CONTAINED -> Report generated.
    """
    demo_steps = [
        {"step": 1, "phase": "RECEIVE", "title": "Phishing Email Delivered", "detail": "User receives email from operator@sovereign-vault-login.internal claiming urgent password reset."},
        {"step": 2, "phase": "SUBMIT", "title": "User Submits Content", "detail": "User clicks 'Analyze Email' in CyberGuard Threat Portal."},
        {"step": 3, "phase": "DETECT", "title": "AI Engine Detection", "detail": "AI classifies content as PHISHING with 94% confidence."},
        {"step": 4, "phase": "SCORE", "title": "Risk Score Calculated", "detail": "Risk Score = 92/100 (CRITICAL SEVERITY)."},
        {"step": 5, "phase": "INCIDENT", "title": "Incident Created", "detail": "Automatic Incident #INC-1024 created and assigned to SecOps Admin."},
        {"step": 6, "phase": "ALERT", "title": "Admin Alert Triggered", "detail": "Real-time alert pushed to Admin Live Security Monitor."},
        {"step": 7, "phase": "OPEN", "title": "Admin Opens Incident", "detail": "Admin clicks incident #INC-1024 to enter Investigation Console."},
        {"step": 8, "phase": "EVIDENCE", "title": "Evidence Inspected", "detail": "Domain mismatch, urgency language, credential form, and visual asset theft confirmed."},
        {"step": 9, "phase": "TIMELINE", "title": "Attack Chain Visualized", "detail": "6-node attack chain graph rendered from Email Delivery to Credential Harvest."},
        {"step": 10, "phase": "RECOMMEND", "title": "AI Countermeasure Recommended", "detail": "AI Copilot recommends 'QUARANTINE_EMAIL' and 'BLOCK_URL'."},
        {"step": 11, "phase": "APPROVE", "title": "Admin Approves Action", "detail": "Admin clicks 'Enforce Countermeasures' button."},
        {"step": 12, "phase": "CONTAIN", "title": "Status Updated to CONTAINED", "detail": "Firewall domain block active. Session tokens revoked."},
        {"step": 13, "phase": "REPORT", "title": "Executive Report Generated", "detail": "Incident #INC-1024 report archived with full evidence audit trail."}
    ]

    return {
        "scenarioName": "Full End-to-End Phishing to Containment Attack Chain",
        "totalSteps": 13,
        "status": "COMPLETED",
        "incidentId": "INC-1024",
        "steps": demo_steps
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
