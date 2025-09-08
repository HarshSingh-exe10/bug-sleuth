import os
import pickle
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.conf import settings
from django.utils import timezone
from .models import MLModel
from bugs.models import BugReport


class TFIDFSimilarityService:
    """Service for handling TF-IDF vectorization and similarity calculations"""
    
    def __init__(self):
        self.vectorizer = None
        self.bug_vectors = None
        self.model_path = settings.ML_MODEL_PATH
        
    def load_active_model(self):
        """Load the currently active ML model"""
        try:
            active_model = MLModel.objects.filter(is_active=True, training_status='completed').first()
            if active_model and os.path.exists(active_model.file_path):
                with open(active_model.file_path, 'rb') as f:
                    model_data = pickle.load(f)
                    self.vectorizer = model_data['vectorizer']
                    self.bug_vectors = model_data['bug_vectors']
                    return True
            return False
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False
    
    def train_model(self, user, dataset_size=None):
        """Train a new TF-IDF model using bug reports from the database"""
        start_time = datetime.now()
        
        # Create new model record
        version = timezone.now().strftime("%Y%m%d_%H%M%S")
        model_record = MLModel.objects.create(
            version=version,
            training_started_by=user,
            training_dataset_size=dataset_size
        )
        
        try:
            # Get all bug reports from database
            bug_reports = BugReport.objects.filter(source='dataset').values('id', 'title', 'description')
            
            if not bug_reports:
                raise ValueError("No bug reports found in database for training")
            
            # Prepare text data
            texts = []
            bug_ids = []
            
            for bug in bug_reports:
                # Combine title and description for better context
                combined_text = f"{bug['title']} {bug['description']}"
                texts.append(combined_text)
                bug_ids.append(bug['id'])
            
            # Initialize and train TF-IDF vectorizer
            self.vectorizer = TfidfVectorizer(
                max_features=10000,
                stop_words='english',
                ngram_range=(1, 2),
                min_df=2,
                max_df=0.8
            )
            
            # Fit and transform the text data
            self.bug_vectors = self.vectorizer.fit_transform(texts)
            
            # Save model
            model_filename = f"tfidf_model_{version}.pkl"
            model_filepath = os.path.join(self.model_path, model_filename)
            
            model_data = {
                'vectorizer': self.vectorizer,
                'bug_vectors': self.bug_vectors,
                'bug_ids': bug_ids,
                'trained_at': timezone.now(),
                'version': version
            }
            
            with open(model_filepath, 'wb') as f:
                pickle.dump(model_data, f)
            
            # Update bug reports with their vectors
            self._save_vectors_to_database(bug_ids, self.bug_vectors)
            
            # Update model record
            training_time = (datetime.now() - start_time).total_seconds()
            model_record.file_path = model_filepath
            model_record.training_status = 'completed'
            model_record.training_completed_at = timezone.now()
            model_record.training_time_seconds = int(training_time)
            model_record.is_active = True
            model_record.save()
            
            return True, "Model training completed successfully"
            
        except Exception as e:
            # Update model record with failure status
            model_record.training_status = 'failed'
            model_record.save()
            return False, f"Model training failed: {str(e)}"
    
    def _save_vectors_to_database(self, bug_ids, vectors):
        """Save TF-IDF vectors to the database for faster lookups"""
        for i, bug_id in enumerate(bug_ids):
            try:
                bug_report = BugReport.objects.get(id=bug_id)
                vector_dense = vectors[i].toarray()[0]  # Convert sparse to dense
                bug_report.set_vector(vector_dense)
                bug_report.save()
            except BugReport.DoesNotExist:
                continue
    
    def find_similar_bugs(self, title, description, top_k=5):
        """Find the most similar bugs to the given title and description"""
        if not self.vectorizer or self.bug_vectors is None:
            if not self.load_active_model():
                return [], "No trained model available"
        
        try:
            # Combine title and description
            query_text = f"{title} {description}"
            
            # Vectorize the query
            query_vector = self.vectorizer.transform([query_text])
            
            # Calculate similarities
            similarities = cosine_similarity(query_vector, self.bug_vectors)[0]
            
            # Get top-k most similar bugs
            top_indices = np.argsort(similarities)[::-1][:top_k]
            
            # Get bug reports and their similarity scores
            similar_bugs = []
            bug_reports = BugReport.objects.filter(source='dataset')
            
            for i, idx in enumerate(top_indices):
                if similarities[idx] > 0.01:  # Only include bugs with some similarity
                    bug_report = bug_reports[idx]
                    similar_bugs.append({
                        'id': bug_report.id,
                        'title': bug_report.title,
                        'description': bug_report.description,
                        'similarity_score': float(similarities[idx]),
                        'rank': i + 1
                    })
            
            return similar_bugs, "Success"
            
        except Exception as e:
            return [], f"Error finding similar bugs: {str(e)}"
    
    def get_model_info(self):
        """Get information about the currently active model"""
        try:
            active_model = MLModel.objects.filter(is_active=True, training_status='completed').first()
            if active_model:
                return {
                    'version': active_model.version,
                    'trained_at': active_model.training_completed_at,
                    'dataset_size': active_model.training_dataset_size,
                    'training_time': active_model.training_time_seconds
                }
            return None
        except Exception:
            return None
    
    def process_dataset_json(self, json_data):
        """Process uploaded JSON dataset and save to database"""
        try:
            processed_count = 0
            
            # Handle different JSON structures
            if isinstance(json_data, list):
                data = json_data
            elif isinstance(json_data, dict) and 'bugs' in json_data:
                data = json_data['bugs']
            elif isinstance(json_data, dict) and 'data' in json_data:
                data = json_data['data']
            else:
                data = [json_data]  # Single bug report
            
            # Clear existing dataset bugs
            BugReport.objects.filter(source='dataset').delete()
            
            # Process each bug report
            for item in data:
                if self._is_valid_bug_report(item):
                    BugReport.objects.create(
                        title=item.get('title', '').strip(),
                        description=item.get('description', '').strip(),
                        source='dataset'
                    )
                    processed_count += 1
            
            return processed_count, "Dataset processed successfully"
            
        except Exception as e:
            return 0, f"Error processing dataset: {str(e)}"
    
    def _is_valid_bug_report(self, item):
        """Validate if an item is a valid bug report"""
        if not isinstance(item, dict):
            return False
        
        title = item.get('title', '').strip()
        description = item.get('description', '').strip()
        
        return (
            len(title) >= 5 and 
            len(description) >= 10 and
            len(title) <= 500
        )


# Global service instance
ml_service = TFIDFSimilarityService()
