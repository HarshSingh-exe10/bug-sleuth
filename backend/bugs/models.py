from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator
import json


class BugReport(models.Model):
    """Model for storing bug reports from the dataset"""
    title = models.CharField(max_length=500, validators=[MinLengthValidator(5)])
    description = models.TextField(validators=[MinLengthValidator(10)])
    # Store TF-IDF vector as JSON for faster similarity lookups
    vector = models.JSONField(null=True, blank=True)
    # Additional metadata
    source = models.CharField(max_length=100, default='dataset')  # 'dataset' or 'user_submission'
    similarity_score = models.FloatField(null=True, blank=True)  # Used when this is a similar bug result
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bug_reports'
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['created_at']),
            models.Index(fields=['source']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title[:50]}...' if len(self.title) > 50 else self.title

    def set_vector(self, vector_array):
        """Convert numpy array to JSON for storage"""
        if hasattr(vector_array, 'tolist'):
            self.vector = vector_array.tolist()
        else:
            self.vector = list(vector_array)

    def get_vector(self):
        """Get vector as list"""
        return self.vector if self.vector else []


class UserBugSubmission(models.Model):
    """Model for storing user-submitted bug reports"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bug_submissions')
    title = models.CharField(max_length=500, validators=[MinLengthValidator(5)])
    description = models.TextField(validators=[MinLengthValidator(10)])
    # Store the vector for this submission
    vector = models.JSONField(null=True, blank=True)
    # Feedback from user
    feedback_helpful = models.BooleanField(null=True, blank=True)
    feedback_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_bug_submissions'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username}: {self.title[:30]}...'

    def set_vector(self, vector_array):
        """Convert numpy array to JSON for storage"""
        if hasattr(vector_array, 'tolist'):
            self.vector = vector_array.tolist()
        else:
            self.vector = list(vector_array)

    def get_vector(self):
        """Get vector as list"""
        return self.vector if self.vector else []


class SimilarityResult(models.Model):
    """Model for storing similarity search results"""
    user_submission = models.ForeignKey(UserBugSubmission, on_delete=models.CASCADE, related_name='similarity_results')
    similar_bug = models.ForeignKey(BugReport, on_delete=models.CASCADE)
    similarity_score = models.FloatField()
    rank = models.PositiveIntegerField()  # 1-5 ranking
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'similarity_results'
        unique_together = ['user_submission', 'similar_bug']
        ordering = ['user_submission', 'rank']

    def __str__(self):
        return f'Similarity: {self.similarity_score:.2f} - {self.similar_bug.title[:30]}'


class DatasetUpload(models.Model):
    """Model for tracking dataset uploads"""
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    filename = models.CharField(max_length=255)
    file_size = models.BigIntegerField()  # Size in bytes
    total_records = models.PositiveIntegerField(null=True, blank=True)
    processed_records = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=[
        ('uploading', 'Uploading'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ], default='uploading')
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'dataset_uploads'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.filename} - {self.status}'
