from django.shortcuts import render

def index(request):
    return render(request, 'flowchart/index.html')

def chatbot(request):
    return render(request, 'flowchart/chatbot.html')
