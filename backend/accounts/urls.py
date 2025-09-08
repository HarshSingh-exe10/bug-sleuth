from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile endpoints
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # Statistics endpoints
    path('stats/', views.user_stats, name='user_stats'),
    path('admin/stats/', views.admin_stats, name='admin_stats'),
    
    # Admin user management endpoints
    path('admin/users/', views.AdminUserListView.as_view(), name='admin_users'),
    path('admin/users/<int:pk>/', views.AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('admin/users/<int:user_id>/deactivate/', views.deactivate_user, name='deactivate_user'),
    path('admin/users/<int:user_id>/activate/', views.activate_user, name='activate_user'),
]
