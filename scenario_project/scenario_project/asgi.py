"""
シナリオプロジェクトのASGI設定。

ASGI呼び出し可能オブジェクトをモジュールレベルの変数「application」として公開します。

このファイルの詳細については、次を参照してください：
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scenario_project.settings')

application = get_asgi_application()
