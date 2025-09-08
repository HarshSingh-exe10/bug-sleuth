from celery import shared_task
from django.contrib.auth.models import User
from .services import ml_service
from bugs.models import BugReport


@shared_task
def train_model_async(user_id, dataset_size=None):
    """Async task to train the ML model"""
    try:
        user = User.objects.get(id=user_id)
        success, message = ml_service.train_model(user, dataset_size)
        
        return {
            'success': success,
            'message': message,
            'user_id': user_id
        }
    except User.DoesNotExist:
        return {
            'success': False,
            'message': 'User not found',
            'user_id': user_id
        }
    except Exception as e:
        return {
            'success': False,
            'message': str(e),
            'user_id': user_id
        }


@shared_task
def process_dataset_async(json_data, user_id, upload_id=None):
    """Async task to process uploaded dataset"""
    try:
        user = User.objects.get(id=user_id)
        processed_count, message = ml_service.process_dataset_json(json_data)
        
        # Update upload record if provided
        if upload_id:
            from bugs.models import DatasetUpload
            try:
                upload = DatasetUpload.objects.get(id=upload_id)
                upload.processed_records = processed_count
                upload.total_records = processed_count
                upload.status = 'completed'
                upload.save()
            except DatasetUpload.DoesNotExist:
                pass
        
        return {
            'success': True,
            'message': message,
            'processed_count': processed_count,
            'user_id': user_id
        }
    except User.DoesNotExist:
        return {
            'success': False,
            'message': 'User not found',
            'user_id': user_id
        }
    except Exception as e:
        # Update upload record with error if provided
        if upload_id:
            from bugs.models import DatasetUpload
            try:
                upload = DatasetUpload.objects.get(id=upload_id)
                upload.status = 'failed'
                upload.error_message = str(e)
                upload.save()
            except DatasetUpload.DoesNotExist:
                pass
        
        return {
            'success': False,
            'message': str(e),
            'user_id': user_id
        }
