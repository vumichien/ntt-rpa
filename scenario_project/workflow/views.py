from django.shortcuts import render

# ビューを作成します。

def index(request):
    return render(request, 'workflow/workflow_index.html')
