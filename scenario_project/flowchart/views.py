from django.shortcuts import render

# ビュー関数を定義します。
def index(request):
    return render(request, 'flowchart/index.html')

def chatbot(request):
    return render(request, 'flowchart/chatbot.html')
