from django.http import JsonResponse , HttpResponse

def health_check(request):
    """
    Simple API endpoint to confirm backend is running.
    """
    return JsonResponse({
        "status": "ok",
        "message": "Backend is running successfully",
    })

def love_you(request):
    html_content = """
    <html>
        <head>
            <title>Health Check</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                    text-align: center;
                }
                .heart {
                    color: red;
                    font-size: 48px;
                    margin-top: 20px;
                    animation: pulse 1s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
            </style>
        </head>
        <body>
            <div>
                <h1>I Love You Baby ❤️</h1>
                <div class="heart">❤️</div>
                <h1>Good Morning ❤️</h1>
                <h3>Kashi wattey website</h3>
                <h3>Vipul</h3>

            </div>
        </body>
    </html>
    """
    return HttpResponse(html_content)