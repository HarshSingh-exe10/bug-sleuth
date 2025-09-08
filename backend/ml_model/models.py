from django.db import models
from django.contrib.auth.models import User


class MLModel(models.Model):
    """Model for tracking ML model versions and training status"""
    name = models.CharField(max_length=100, default='tfidf_similarity')
    version = models.CharField(max_length=50)
    file_path = models.CharField(max_length=255)  # Path to the saved model file
    training_status = models.CharField(max_length=20, choices=[
        ('training', 'Training'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ], default='training')
    training_started_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    training_dataset_size = models.PositiveIntegerField(null=True, blank=True)
    # Model performance metrics
    accuracy_score = models.FloatField(null=True, blank=True)
    training_time_seconds = models.PositiveIntegerField(null=True, blank=True)
    # Timestamps
    training_started_at = models.DateTimeField(auto_now_add=True)
    training_completed_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=False)  # Only one model can be active
    
    class Meta:
        db_table = 'ml_models'
        ordering = ['-training_started_at']
        unique_together = ['name', 'version']

    def __str__(self):
        return f'{self.name} v{self.version} - {self.training_status}'

    def save(self, *args, **kwargs):
        # Ensure only one model is active at a time
        if self.is_active:
            MLModel.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)
