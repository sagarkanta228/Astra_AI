from django.urls import path
from . import views

urlpatterns = [
    path('', views.root_view),
    path('api/v1/auth/login', views.login_view),
    path('api/v1/auth/register', views.register_view),
    path('api/v1/users', views.users_list_view),
    path('api/v1/users/<str:user_id>', views.user_delete_view),
    path('api/v1/live-monitor/stream', views.live_stream_view),
    path('api/v1/analyze/threat', views.analyze_threat_view),
    path('api/v1/analyze/upload', views.upload_threat_file_view),
    path('api/v1/analyze/uploads', views.list_uploaded_files_view),
    path('api/v1/analyze/uploads/<str:file_id>', views.delete_uploaded_file_view),
    path('api/v1/incidents', views.get_incidents_view),
    path('api/v1/incidents/<str:incident_id>/', views.get_incident_detail_view),
    path('api/v1/incidents/<str:incident_id>/response', views.incident_response_view),
    path('api/v1/threat-intelligence', views.threat_intel_view),
    path('api/v1/copilot', views.copilot_view),
    path('api/v1/audit-logs', views.audit_logs_view),
    path('api/v1/telemetry/nodes', views.telemetry_nodes_view),
    path('api/v1/demo/run-scenario', views.run_demo_scenario_view),
]

