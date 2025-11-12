from django.http import JsonResponse 

def health_check(request):
    """
    Simple API endpoint to confirm backend is running.
    """
    return JsonResponse({
        "status": "ok",
        "message": "Backend is running successfully",
    })
