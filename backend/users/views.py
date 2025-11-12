from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.authtoken.models import Token
from rest_framework import permissions, status
from rest_framework.response import Response

# Use DRF's built-in token login
login_view = obtain_auth_token

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        return Response({'error': 'Token not found or already deleted'}, status=status.HTTP_400_BAD_REQUEST)
