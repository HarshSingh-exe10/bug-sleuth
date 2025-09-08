# Bug-Sleuth: AI-Powered Duplicate Bug Finder

Bug-Sleuth is a full-stack web application that allows users to submit bug reports and uses machine learning to find and display the most closely related existing bugs from a large dataset. The application features an admin interface for managing and retraining the ML model.

## 🚀 Features

### Core Features
- **Smart Bug Submission**: Submit new bug reports with title and description
- **AI-Powered Similarity Detection**: Uses TF-IDF vectorization and cosine similarity to find duplicate bugs
- **Top-5 Similar Bugs**: Shows the most similar existing bugs with similarity scores
- **User Authentication**: Secure JWT-based authentication system
- **Submission History**: Track and review your past bug submissions
- **Advanced Search**: Search through the bug database using keywords and filters
- **Feedback System**: Users can provide feedback on similarity results

### Admin Features
- **Dataset Management**: Upload large JSON datasets (up to 2GB) with file chunking
- **Model Retraining**: One-click ML model retraining with progress monitoring
- **Admin Dashboard**: Comprehensive statistics and management tools
- **Asynchronous Processing**: Background tasks for dataset processing and model training

### Technical Features
- **Scalable Architecture**: Django REST API backend with React SPA frontend
- **Database Optimization**: Optimized for large datasets with proper indexing
- **File Chunking**: Handles large file uploads without server timeouts
- **Real-time Progress**: Progress bars for upload and training operations
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Python 3.8+
- Django 4.2+ with Django REST Framework
- PostgreSQL (configurable, currently using SQLite for development)
- scikit-learn for ML model
- Celery + Redis for asynchronous tasks
- JWT authentication

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API communication
- React Router for navigation
- Context API for state management

**Machine Learning:**
- TF-IDF (Term Frequency-Inverse Document Frequency) vectorization
- Cosine similarity for bug matching
- Persistent model storage with pickle

## 📋 Prerequisites

Before setting up Bug-Sleuth, ensure you have the following installed:

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **PostgreSQL 12+** (optional, SQLite used by default)
- **Redis** (for Celery - optional for basic functionality)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bug-sleuth.git
cd bug-sleuth
```

### 2. Backend Setup

#### Navigate to backend directory
```bash
cd backend
```

#### Create and activate virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python dependencies
```bash
pip install -r requirements.txt
```

#### Configure Database (Optional - PostgreSQL)
If you want to use PostgreSQL instead of SQLite:

1. Create a PostgreSQL database
2. Update `backend/bug_sleuth/settings.py`:
   ```python
   # Uncomment and configure PostgreSQL settings
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'bug_sleuth',
           'USER': 'your_username',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

#### Run database migrations
```bash
python manage.py migrate
```

#### Create a superuser (admin)
```bash
python manage.py createsuperuser
```

#### Start the Django development server
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

#### Install Node.js dependencies
```bash
npm install
```

#### Start the React development server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### 4. Optional: Celery Setup (for async tasks)

If you want to enable asynchronous processing:

#### Install and start Redis
```bash
# Windows (using Chocolatey)
choco install redis-64

# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis-server
```

#### Start Celery worker (in a new terminal)
```bash
cd backend
# Activate virtual environment first
celery -A bug_sleuth worker --loglevel=info
```

## 🚀 Usage Guide

### For Standard Users

1. **Register/Login**: Create an account or log in to access the application
2. **Submit Bug Report**: Go to "Submit Bug" and fill in the title and description
3. **View Results**: After submission, see the top 5 most similar bugs with similarity scores
4. **Provide Feedback**: Rate the usefulness of similarity results
5. **View History**: Check your past submissions in the "History" section
6. **Search Bugs**: Use the search feature to find specific bugs in the database

### For Admin Users

1. **Access Admin Dashboard**: Log in with admin credentials and navigate to the Admin section
2. **Upload Dataset**: 
   - Go to "Dataset Upload"
   - Select a JSON file (supports files up to 2GB)
   - Monitor upload progress with the progress bar
   - File is automatically processed and validated
3. **Retrain Model**: 
   - Go to "Model Management"
   - Click "Retrain Model" to update the ML model with new data
   - Monitor training progress and performance metrics
4. **View Statistics**: Check system statistics and usage metrics

## 📊 Dataset Format

The application expects JSON datasets in the following format:

```json
{
  "bugs": [
    {
      "title": "Application crashes on startup",
      "description": "When launching the application, it immediately crashes with error code 0x80004005..."
    },
    {
      "title": "Login button not working",
      "description": "Clicking the login button does not submit the form or show any response..."
    }
  ]
}
```

Alternative formats supported:
- Array of bug objects directly: `[{bug1}, {bug2}, ...]`
- Object with `data` key: `{"data": [{bug1}, {bug2}, ...]}`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory for custom configuration:

```bash
# Database
DB_NAME=bug_sleuth
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Redis (for Celery)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Security
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### Frontend Configuration

Create a `.env` file in the frontend directory:

```bash
REACT_APP_API_URL=http://localhost:8000/api
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile
- `GET /api/auth/stats/` - Get user statistics

### Bug Management Endpoints
- `POST /api/bugs/submit/` - Submit new bug report
- `GET /api/bugs/submissions/` - Get user's submissions
- `GET /api/bugs/submissions/{id}/` - Get submission details
- `POST /api/bugs/submissions/{id}/feedback/` - Submit feedback
- `POST /api/bugs/search/` - Search bugs

### Admin Endpoints (Admin only)
- `POST /api/bugs/admin/upload-dataset/` - Upload dataset
- `POST /api/bugs/admin/retrain-model/` - Retrain ML model
- `GET /api/bugs/admin/model-info/` - Get model information
- `GET /api/bugs/admin/uploads/` - List dataset uploads
- `GET /api/bugs/admin/bug-reports/` - List all bug reports

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change Django port
   python manage.py runserver 8001
   
   # Change React port
   PORT=3001 npm start
   ```

2. **Database connection errors**
   - Ensure PostgreSQL is running
   - Verify database credentials in settings.py
   - Try using SQLite (default) for development

3. **Module not found errors**
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend
   npm install
   ```

4. **CORS errors**
   - Ensure `django-cors-headers` is installed
   - Check CORS settings in `settings.py`

5. **File upload issues**
   - Check file size limits in settings
   - Ensure proper file permissions
   - Verify JSON format

### Performance Optimization

1. **For large datasets:**
   - Use PostgreSQL instead of SQLite
   - Increase file upload limits
   - Consider pagination for large result sets

2. **For production:**
   - Set `DEBUG = False`
   - Configure proper static file serving
   - Use production-grade database
   - Set up proper logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- scikit-learn team for the excellent ML library
- Django and React communities for the robust frameworks
- Contributors and testers who helped improve this application

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Contact the development team

---

**Built with ❤️ for efficient bug management and duplicate detection**
