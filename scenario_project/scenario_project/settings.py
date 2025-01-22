"""
シナリオプロジェクトのDjango設定。

Django 4.2.4を使用して「django-admin startproject」によって生成されました。

このファイルの詳細については、次を参照してください：
https://docs.djangoproject.com/en/4.2/topics/settings/

設定とその値の完全なリストについては、次を参照してください：
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path

# プロジェクト内のパスをこのように構築します: BASE_DIR / 'subdir'。
BASE_DIR = Path(__file__).resolve().parent.parent

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'flowchart/data'

# クイックスタート開発設定 - 本番環境には不適切
# 詳細は次を参照してください：
# https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# セキュリティ警告: 本番環境で使用される秘密鍵を秘密にしておいてください！
SECRET_KEY = 'django-insecure-tl$&vq9z-nr#ve-^e0kn)l$60v9(t+_zr4n*zx(%d05u@9)k=$'

# セキュリティ警告: 本番環境でデバッグをオンにしないでください！
DEBUG = True

ALLOWED_HOSTS = []


# アプリケーション定義

INSTALLED_APPS = [
    'flowchart',
    'workflow',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'scenario_project.urls'

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

WSGI_APPLICATION = 'scenario_project.wsgi.application'


# データベース
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# パスワード検証
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# 国際化
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# 静的ファイル (CSS, JavaScript, 画像)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    BASE_DIR / "static",   
]

# デフォルトの主キーのフィールドタイプ
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
