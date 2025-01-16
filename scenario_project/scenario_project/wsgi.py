"""
シナリオプロジェクトのWSGI設定。

WSGI呼び出し可能オブジェクトをモジュールレベルの変数「application」として公開します。

このファイルの詳細については、次を参照してください：
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scenario_project.settings')

application = get_wsgi_application()
