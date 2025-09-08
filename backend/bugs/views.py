import json
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.utils import timezone
from ml_model.services import ml_service
from .models import BugReport, UserBugSubmission, SimilarityResult, DatasetUpload
from .serializers import (
    BugReportSerializer,
    UserBugSubmissionSerializer,
    BugSubmissionCreateSerializer,
    SimilarityResultSerializer,
    FeedbackSerializer,
    DatasetUploadSerializer,
    BugSearchSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class BugSubmissionView(generics.CreateAPIView):
    """Create a new bug submission and get similarity results"""
    serializer_class = BugSubmissionCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the bug submission
        submission = serializer.save(user=request.user)
        
        # Find similar bugs using ML service
        similar_bugs, message = ml_service.find_similar_bugs(
            submission.title,
            submission.description,
            top_k=5
        )
        
        # Save similarity results
        similarity_results = []
        for bug_data in similar_bugs:
            try:
                bug_report = BugReport.objects.get(id=bug_data['id'])
                similarity_result = SimilarityResult.objects.create(
                    user_submission=submission,
                    similar_bug=bug_report,
                    similarity_score=bug_data['similarity_score'],
                    rank=bug_data['rank']
                )
                similarity_results.append(similarity_result)
            except BugReport.DoesNotExist:
                continue
        
        # Prepare response
        response_data = {
            'submission': UserBugSubmissionSerializer(submission).data,
            'similar_bugs': SimilarityResultSerializer(similarity_results, many=True).data,
            'message': message if similar_bugs else 'No similar bugs found',
            'total_similar': len(similar_bugs)
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)


class UserSubmissionHistoryView(generics.ListAPIView):
    """List user's bug submission history"""
    serializer_class = UserBugSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        return UserBugSubmission.objects.filter(user=self.request.user)


class SubmissionDetailView(generics.RetrieveAPIView):
    """Get details of a specific submission with similarity results"""
    serializer_class = UserBugSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserBugSubmission.objects.filter(user=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        submission = self.get_object()
        similarity_results = SimilarityResult.objects.filter(
            user_submission=submission
        ).order_by('rank')
        
        response_data = {
            'submission': self.get_serializer(submission).data,
            'similar_bugs': SimilarityResultSerializer(similarity_results, many=True).data
        }
        
        return Response(response_data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_feedback(request, submission_id):
    """Submit feedback for a bug submission"""
    try:
        submission = UserBugSubmission.objects.get(
            id=submission_id,
            user=request.user
        )
    except UserBugSubmission.DoesNotExist:
        return Response(
            {'error': 'Submission not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = FeedbackSerializer(data=request.data)
    if serializer.is_valid():
        submission.feedback_helpful = serializer.validated_data['helpful']
        submission.feedback_comment = serializer.validated_data.get('comment', '')
        submission.save()
        
        return Response({'message': 'Feedback submitted successfully'})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BugSearchView(generics.GenericAPIView):
    """Search through bug reports"""
    serializer_class = BugSearchSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        query = serializer.validated_data['query']
        limit = serializer.validated_data['limit']
        
        # Search in bug reports
        bug_reports = BugReport.objects.filter(
            Q(title__icontains=query) | Q(description__icontains=query)
        ).order_by('-created_at')[:limit]
        
        serialized_bugs = BugReportSerializer(bug_reports, many=True)
        
        return Response({
            'results': serialized_bugs.data,
            'total_found': bug_reports.count(),
            'query': query
        })


# Admin-only views
@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def upload_dataset(request):
    """Upload and process dataset (Admin only)"""
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    uploaded_file = request.FILES['file']
    
    # Validate file type
    if not uploaded_file.name.endswith('.json'):
        return Response(
            {'error': 'Only JSON files are allowed'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create upload record
    upload_record = DatasetUpload.objects.create(
        uploaded_by=request.user,
        filename=uploaded_file.name,
        file_size=uploaded_file.size,
        status='processing'
    )
    
    try:
        # Read and parse JSON file
        file_content = uploaded_file.read().decode('utf-8')
        json_data = json.loads(file_content)
        
        # Process dataset
        processed_count, message = ml_service.process_dataset_json(json_data)
        
        # Update upload record
        upload_record.total_records = processed_count
        upload_record.processed_records = processed_count
        upload_record.status = 'completed'
        upload_record.completed_at = timezone.now()
        upload_record.save()
        
        return Response({
            'message': f'Dataset uploaded successfully. Processed {processed_count} records.',
            'upload_id': upload_record.id,
            'processed_count': processed_count
        }, status=status.HTTP_201_CREATED)
        
    except json.JSONDecodeError:
        upload_record.status = 'failed'
        upload_record.error_message = 'Invalid JSON format'
        upload_record.save()
        
        return Response(
            {'error': 'Invalid JSON format'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        upload_record.status = 'failed'
        upload_record.error_message = str(e)
        upload_record.save()
        
        return Response(
            {'error': f'Processing failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def retrain_model(request):
    """Retrain the ML model (Admin only)"""
    try:
        # Get dataset size
        dataset_size = BugReport.objects.filter(source='dataset').count()
        
        if dataset_size == 0:
            return Response(
                {'error': 'No dataset available for training'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Train model
        success, message = ml_service.train_model(request.user, dataset_size)
        
        if success:
            return Response({
                'message': message,
                'dataset_size': dataset_size
            })
        else:
            return Response(
                {'error': message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    except Exception as e:
        return Response(
            {'error': f'Training failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def model_info(request):
    """Get current model information (Admin only)"""
    info = ml_service.get_model_info()
    
    if info:
        return Response(info)
    else:
        return Response(
            {'message': 'No active model found'},
            status=status.HTTP_404_NOT_FOUND
        )


class DatasetUploadListView(generics.ListAPIView):
    """List dataset uploads (Admin only)"""
    serializer_class = DatasetUploadSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = StandardResultsSetPagination
    queryset = DatasetUpload.objects.all()


class BugReportListView(generics.ListAPIView):
    """List all bug reports (Admin only)"""
    serializer_class = BugReportSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class = StandardResultsSetPagination
    queryset = BugReport.objects.all()


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def get_model_versions(request):
    """Get all model versions (Admin only)"""
    from ml_model.models import MLModel
    from ml_model.serializers import MLModelSerializer
    
    models = MLModel.objects.all().order_by('-training_started_at')
    serializer = MLModelSerializer(models, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def activate_model(request, model_id):
    """Activate a specific model version (Admin only)"""
    from ml_model.models import MLModel
    
    try:
        model = MLModel.objects.get(id=model_id, training_status='completed')
        
        # Deactivate all other models
        MLModel.objects.filter(is_active=True).update(is_active=False)
        
        # Activate this model
        model.is_active = True
        model.save()
        
        return Response({
            'message': f'Model {model.name} v{model.version} activated successfully'
        })
        
    except MLModel.DoesNotExist:
        return Response(
            {'error': 'Model not found or not completed'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def get_model_details(request, model_id):
    """Get detailed information about a specific model (Admin only)"""
    from ml_model.models import MLModel
    from ml_model.serializers import MLModelSerializer
    
    try:
        model = MLModel.objects.get(id=model_id)
        serializer = MLModelSerializer(model)
        return Response(serializer.data)
    except MLModel.DoesNotExist:
        return Response(
            {'error': 'Model not found'},
            status=status.HTTP_404_NOT_FOUND
        )
