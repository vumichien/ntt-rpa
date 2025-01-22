"""
シナリオプロジェクトのURL設定。

`urlpatterns`リストは、URLをビューにルーティングします。詳細については、次を参照してください：
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
例：
関数ベースのビュー
    1. インポートを追加:  from my_app import views
    2. URLをurlpatternsに追加:  path('', views.home, name='home')
クラスベースのビュー
    1. インポートを追加:  from other_app.views import Home
    2. URLをurlpatternsに追加:  path('', Home.as_view(), name='home')
別のURLconfを含める
    1. include()関数をインポート: from django.urls import include, path
    2. URLをurlpatternsに追加:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('flowchart/', include('flowchart.urls')),
    path('workflow/', include('workflow.urls')),
    path("", RedirectView.as_view(url="/workflow/", permanent=False), name="index"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
