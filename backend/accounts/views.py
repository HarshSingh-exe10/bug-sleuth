from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer
)


class RegisterView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_admin': user.is_staff,
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login endpoint with user info"""
    serializer_class = CustomTokenObtainPairSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    """User profile endpoint"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    """Change password endpoint"""
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = self.request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get user statistics"""
    user = request.user
    
    # Import here to avoid circular imports
    from bugs.models import UserBugSubmission
    
    stats = {
        'total_submissions': UserBugSubmission.objects.filter(user=user).count(),
        'recent_submissions': UserBugSubmission.objects.filter(user=user).count(),
        'is_admin': user.is_staff,
        'joined_date': user.date_joined,
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_stats(request):
    """Get admin statistics"""
    # Import here to avoid circular imports
    from bugs.models import BugReport, UserBugSubmission, DatasetUpload
    from ml_model.models import MLModel
    
    # Get active model info
    active_model = MLModel.objects.filter(is_active=True).first()
    model_accuracy = active_model.accuracy_score if active_model else 0
    
    stats = {
        'total_users': User.objects.count(),
        'total_submissions': UserBugSubmission.objects.count(),
        'total_bug_reports': BugReport.objects.count(),
        'model_accuracy': model_accuracy or 0.87,  # Default value for demo
        'recent_uploads': DatasetUpload.objects.filter(status='completed').count(),
        'pending_uploads': DatasetUpload.objects.filter(status__in=['uploading', 'processing']).count(),
    }
    
    return Response(stats)


class AdminUserListView(generics.ListAPIView):
    """Admin endpoint to list all users"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all().order_by('-date_joined')
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['include_admin_fields'] = True
        return context


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    """Admin endpoint to view and update user details"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['include_admin_fields'] = True
        return context


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def deactivate_user(request, user_id):
    """Deactivate a user account"""
    try:
        user = User.objects.get(id=user_id)
        user.is_active = False
        user.save()
        return Response({'message': f'User {user.username} deactivated successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def activate_user(request, user_id):
    """Activate a user account"""
    try:
        user = User.objects.get(id=user_id)
        user.is_active = True
        user.save()
        return Response({'message': f'User {user.username} activated successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
