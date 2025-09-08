from django.urls import path
from . import views

urlpatterns = [
    # Bug submission endpoints
    path('submit/', views.BugSubmissionView.as_view(), name='bug_submit'),
    path('submissions/', views.UserSubmissionHistoryView.as_view(), name='submission_history'),
    path('submissions/<int:pk>/', views.SubmissionDetailView.as_view(), name='submission_detail'),
    path('submissions/<int:submission_id>/feedback/', views.submit_feedback, name='submit_feedback'),
    
    # Search endpoints
    path('search/', views.BugSearchView.as_view(), name='bug_search'),
    
    # Admin endpoints
    path('admin/upload-dataset/', views.upload_dataset, name='upload_dataset'),
    path('admin/retrain-model/', views.retrain_model, name='retrain_model'),
    path('admin/model-info/', views.model_info, name='model_info'),
    path('admin/uploads/', views.DatasetUploadListView.as_view(), name='upload_list'),
    path('admin/bug-reports/', views.BugReportListView.as_view(), name='bug_report_list'),
    
    # Model management endpoints
    path('admin/models/', views.get_model_versions, name='model_versions'),
    path('admin/models/<int:model_id>/', views.get_model_details, name='model_details'),
    path('admin/models/<int:model_id>/activate/', views.activate_model, name='activate_model'),
]
