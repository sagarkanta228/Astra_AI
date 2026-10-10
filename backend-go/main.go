package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type UserProfile struct {
	ID          string `json:"id"`
	FullName    string `json:"fullName"`
	Email       string `json:"email"`
	Role        string `json:"role"` // 'USER', 'ADMIN', 'SOC_ANALYST'
	Department  string `json:"department"`
	RiskScore   int    `json:"riskScore"`
	AvatarUrl   string `json:"avatarUrl"`
	Token       string `json:"token"`
}

type LiveSecurityEvent struct {
	ID        string `json:"id"`
	Timestamp string `json:"timestamp"`
	EventType string `json:"eventType"` // 'PHISHING', 'MALWARE', 'ANOMALY', 'ACCOUNT_TAKEOVER'
	Severity  string `json:"severity"`  // 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
	Source    string `json:"source"`
	User      string `json:"user"`
	Detail    string `json:"detail"`
}

func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req LoginRequest
	json.NewDecoder(r.Body).Decode(&req)

	role := "USER"
	fullName := "Robert Vance"
	email := "user@company.com"
	dept := "Finance & Ops"

	if req.Role == "ADMIN" || req.Email == "admin@cyberguard.internal" {
		role = "ADMIN"
		fullName = "Sarah Jenkins"
		email = "admin@cyberguard.internal"
		dept = "SecOps Lead"
	} else if req.Role == "SOC_ANALYST" || req.Email == "soc@cyberguard.internal" {
		role = "SOC_ANALYST"
		fullName = "David Miller"
		email = "soc@cyberguard.internal"
		dept = "Threat Forensics"
	}

	user := UserProfile{
		ID:         "usr-001",
		FullName:   fullName,
		Email:      email,
		Role:       role,
		Department: dept,
		RiskScore:  25,
		AvatarUrl:  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
		Token:      "jwt-cyberguard-postquantum-token-xyz789",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "SUCCESS",
		"message": "Authenticated with Zero-Trust Post-Quantum Key Exchange",
		"user":    user,
	})
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req map[string]string
	json.NewDecoder(r.Body).Decode(&req)

	user := UserProfile{
		ID:         fmt.Sprintf("usr-%d", time.Now().Unix()),
		FullName:   req["fullName"],
		Email:      req["email"],
		Role:       req["role"],
		Department: "Engineering",
		RiskScore:  15,
		AvatarUrl:  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
		Token:      "jwt-cyberguard-postquantum-token-newuser",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "SUCCESS",
		"message": "User registered successfully",
		"user":    user,
	})
}

func handleLiveStream(w http.ResponseWriter, r *http.Request) {
	enableCORS(&w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	events := []LiveSecurityEvent{
		{ID: "evt-901", Timestamp: time.Now().Add(-10 * time.Second).Format("15:04:05"), EventType: "PHISHING", Severity: "CRITICAL", Source: "185.220.101.5", User: "user@company.com", Detail: "Phishing link sovereign-vault-login.internal detected"},
		{ID: "evt-902", Timestamp: time.Now().Add(-8 * time.Second).Format("15:04:05"), EventType: "ANOMALY", Severity: "HIGH", Source: "192.168.1.104", User: "devin.franco@company.com", Detail: "17 failed login attempts followed by successful auth"},
		{ID: "evt-903", Timestamp: time.Now().Add(-5 * time.Second).Format("15:04:05"), EventType: "MALWARE", Severity: "HIGH", Source: "WS-8812", User: "robert.vance@company.com", Detail: "Double extension executable invoice_2026.pdf.exe quarantined"},
		{ID: "evt-904", Timestamp: time.Now().Add(-2 * time.Second).Format("15:04:05"), EventType: "DEEPFAKE", Severity: "MEDIUM", Source: "Audio Stream #4", User: "carol.white@company.com", Detail: "Synthetic voice harmonic gap detected (>8kHz)"},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}

func main() {
	http.HandleFunc("/api/v1/auth/login", handleLogin)
	http.HandleFunc("/api/v1/auth/register", handleRegister)
	http.HandleFunc("/api/v1/live-monitor/stream", handleLiveStream)

	fmt.Println("CYBERGUARD AI Go Auth Gateway listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
