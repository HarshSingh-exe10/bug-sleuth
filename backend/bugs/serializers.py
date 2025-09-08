from rest_framework import serializers
from .models import BugReport, UserBugSubmission, SimilarityResult, DatasetUpload


class BugReportSerializer(serializers.ModelSerializer):
    """Serializer for BugReport model"""
    similarity_score = serializers.FloatField(read_only=True)
    
    class Meta:
        model = BugReport
        fields = [
            'id', 'title', 'description', 'source', 'similarity_score',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'source']


class UserBugSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for user bug submissions"""
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = UserBugSubmission
        fields = [
            'id', 'user', 'title', 'description', 'feedback_helpful',
            'feedback_comment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class BugSubmissionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating bug submissions"""
    
    class Meta:
        model = UserBugSubmission
        fields = ['title', 'description']
        extra_kwargs = {
            'title': {'required': True, 'allow_blank': False},
            'description': {'required': True, 'allow_blank': False},
        }
    
    def validate_title(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long")
        return value.strip()
    
    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters long")
        return value.strip()


class SimilarityResultSerializer(serializers.ModelSerializer):
    """Serializer for similarity results"""
    similar_bug = BugReportSerializer(read_only=True)
    
    class Meta:
        model = SimilarityResult
        fields = [
            'id', 'similar_bug', 'similarity_score', 'rank', 'created_at'
        ]


class FeedbackSerializer(serializers.Serializer):
    """Serializer for user feedback on similarity results"""
    helpful = serializers.BooleanField(required=True)
    comment = serializers.CharField(required=False, allow_blank=True, max_length=1000)


class DatasetUploadSerializer(serializers.ModelSerializer):
    """Serializer for dataset uploads"""
    uploaded_by = serializers.StringRelatedField(read_only=True)
    progress_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = DatasetUpload
        fields = [
            'id', 'uploaded_by', 'filename', 'file_size', 'total_records',
            'processed_records', 'status', 'progress_percentage', 'error_message',
            'created_at', 'completed_at'
        ]
        read_only_fields = [
            'id', 'uploaded_by', 'progress_percentage', 'created_at', 'completed_at'
        ]
    
    def get_progress_percentage(self, obj):
        if obj.total_records and obj.total_records > 0:
            return round((obj.processed_records / obj.total_records) * 100, 2)
        return 0


class BugSearchSerializer(serializers.Serializer):
    """Serializer for bug search queries"""
    query = serializers.CharField(max_length=1000, required=True)
    limit = serializers.IntegerField(min_value=1, max_value=50, default=10)
    
    def validate_query(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Search query must be at least 3 characters long")
        return value.strip()
