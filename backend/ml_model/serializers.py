from rest_framework import serializers
from .models import MLModel


class MLModelSerializer(serializers.ModelSerializer):
    training_time_formatted = serializers.SerializerMethodField()
    
    class Meta:
        model = MLModel
        fields = [
            'id', 'name', 'version', 'file_path', 'training_status',
            'training_dataset_size', 'accuracy_score', 'training_time_seconds',
            'training_time_formatted', 'training_started_at', 'training_completed_at',
            'is_active'
        ]
        read_only_fields = [
            'id', 'training_started_at', 'training_completed_at'
        ]
    
    def get_training_time_formatted(self, obj):
        """Format training time in minutes and seconds"""
        if not obj.training_time_seconds:
            return 'N/A'
        
        minutes = obj.training_time_seconds // 60
        seconds = obj.training_time_seconds % 60
        return f"{minutes}m {seconds}s"
