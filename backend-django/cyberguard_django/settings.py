import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# Auto-load .env file from project or workspace root
for env_file in [BASE_DIR / '.env', BASE_DIR.parent / '.env']:
    if env_file.exists():
        try:
            with open(env_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        os.environ.setdefault(k.strip(), v.strip())
            break
        except Exception:
            pass

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-cyberguard-postquantum-secret-key-prod')
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 'yes')
ALLOWED_HOSTS = [h.strip() for h in os.getenv('ALLOWED_HOSTS', '*').split(',')]


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'cyberguard_app',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'cyberguard_django.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'cyberguard_django.wsgi.application'

USE_NEON = os.getenv("USE_NEON", "false").lower() in ("true", "1", "yes")
NEON_DB_URL = os.getenv(
    "NEON_DATABASE_URL",
    "postgresql://neondb_owner:npg_1Ze9uYGTfDcn@ep-dark-truth-b4xvk6bl-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require"
)

if USE_NEON and NEON_DB_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=NEON_DB_URL,
            conn_max_age=600,
            ssl_require=True
        ),
        'sqlite': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    if NEON_DB_URL:
        try:
            DATABASES['neondb'] = dj_database_url.config(
                default=NEON_DB_URL,
                conn_max_age=600,
                ssl_require=True
            )
        except Exception:
            pass



AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
