from django.db import models

class Incident(models.Model):
    incident_id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=255)
    threat_type = models.CharField(max_length=64)
    severity = models.CharField(max_length=32)
    risk_score = models.IntegerField(default=50)
    confidence = models.IntegerField(default=90)
    affected_user = models.CharField(max_length=128)
    affected_device = models.CharField(max_length=128)
    status = models.CharField(max_length=32, default="INVESTIGATING")
    assigned_analyst = models.CharField(max_length=128, default="Sarah Jenkins")
    detected_at = models.DateTimeField(auto_now_add=True)
    summary = models.TextField()
    attack_technique = models.CharField(max_length=128, default="T1566.002 - Spearphishing Link")
    indicators = models.JSONField(default=list)
    evidence = models.JSONField(default=list)
    timeline = models.JSONField(default=list)
    attack_chain = models.JSONField(default=list)
    recommended_response = models.JSONField(default=list)

    def __str__(self):
        return f"{self.incident_id} - {self.title}"

class ThreatIntelIOC(models.Model):
    ioc_id = models.CharField(max_length=64, primary_key=True)
    type = models.CharField(max_length=32)
    value = models.CharField(max_length=255)
    threat_family = models.CharField(max_length=128)
    severity = models.CharField(max_length=32)
    risk_score = models.IntegerField(default=80)
    first_seen = models.CharField(max_length=32)
    last_seen = models.CharField(max_length=32)
    description = models.TextField()

    def __str__(self):
        return f"{self.type}: {self.value}"

class AuditLog(models.Model):
    log_id = models.CharField(max_length=64, primary_key=True)
    actor = models.CharField(max_length=128)
    action = models.CharField(max_length=64)
    target = models.CharField(max_length=128)
    detail = models.TextField()
    ip = models.CharField(max_length=64)
    timestamp = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.actor} - {self.action}"

class UserAccount(models.Model):
    user_id = models.CharField(max_length=64, primary_key=True)
    full_name = models.CharField(max_length=128)
    email = models.CharField(max_length=128, unique=True)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=32, default="USER")
    title = models.CharField(max_length=128, default="Standard User")
    department = models.CharField(max_length=128, default="Operations")
    device = models.CharField(max_length=128, default="Managed Device")
    status = models.CharField(max_length=32, default="ACTIVE")
    avatar_url = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.email}) - {self.role}"

class UploadedThreatFile(models.Model):
    file_id = models.CharField(max_length=64, primary_key=True)
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=64, default="video")
    file_size = models.BigIntegerField(default=0)
    file_path = models.CharField(max_length=512, blank=True)
    mime_type = models.CharField(max_length=128, blank=True)
    sha256 = models.CharField(max_length=64, blank=True)
    uploaded_by = models.CharField(max_length=128, default="Tanmaya Pany (Admin)")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    analysis_status = models.CharField(max_length=32, default="ANALYZED")
    risk_score = models.IntegerField(default=85)
    severity = models.CharField(max_length=32, default="HIGH")
    threat_category = models.CharField(max_length=128, default="Synthetic Media / Deepfake")
    detection_summary = models.TextField(blank=True)
    indicators = models.JSONField(default=list)
    evidence = models.JSONField(default=list)

    def __str__(self):
        return f"{self.file_name} ({self.file_type}) - Risk: {self.risk_score}"

