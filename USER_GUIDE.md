# Bug-Sleuth User Guide

This comprehensive guide explains how to use Bug-Sleuth, an AI-powered duplicate bug finder, for both standard users and administrators.

## Table of Contents
- [Getting Started](#getting-started)
- [Standard User Guide](#standard-user-guide)
- [Administrator Guide](#administrator-guide)
- [Understanding Similarity Results](#understanding-similarity-results)
- [Best Practices](#best-practices)
- [FAQ](#frequently-asked-questions)

## Getting Started

### Account Creation and Login

1. **Registration**
   - Navigate to the registration page
   - Fill in required information:
     - Username (must be unique)
     - Email address
     - First and last name
     - Password (must meet security requirements)
     - Password confirmation
   - Click "Register" to create your account
   - You'll be automatically logged in after successful registration

2. **Login**
   - Enter your username and password
   - Click "Login" to access the application
   - Your session will remain active until you log out or the token expires

3. **Navigation**
   - Use the navigation bar to access different sections
   - Available options depend on your user role (standard user vs. admin)

## Standard User Guide

### Dashboard Overview

The dashboard provides:
- Quick access to main features
- Overview of your recent activity
- Statistics about your submissions
- Links to key functions

### Submitting Bug Reports

1. **Navigate to Bug Submission**
   - Click "Submit Bug" in the navigation bar
   - You'll see a clean, intuitive form

2. **Fill Out the Form**
   - **Title**: Enter a clear, descriptive title (minimum 5 characters)
     - Good: "Login button unresponsive when clicked multiple times"
     - Poor: "Bug" or "Error"
   - **Description**: Provide detailed steps to reproduce (minimum 10 characters)
     - Include specific error messages
     - Describe expected vs. actual behavior
     - Mention browser/OS if relevant
     - Add any relevant technical details

3. **Submit and Review Results**
   - Click "Submit Bug Report"
   - The system processes your submission using AI
   - You'll be redirected to a results page showing:
     - Your submitted bug report
     - Top 5 most similar existing bugs
     - Similarity scores (as percentages)
     - Ranking of similar bugs

### Understanding Similarity Results

#### Similarity Scores
- **90-100%**: Nearly identical bugs (high confidence match)
- **70-89%**: Very similar bugs (likely duplicates)
- **50-69%**: Moderately similar bugs (worth investigating)
- **30-49%**: Somewhat similar bugs (may share common themes)
- **Below 30%**: Low similarity (probably different issues)

#### Result Display
Each similar bug shows:
- **Rank**: 1-5 ranking based on similarity
- **Similarity Score**: Percentage match
- **Title**: Original bug title
- **Description**: Original bug description
- **Color Coding**:
  - Red: High similarity (likely duplicate)
  - Yellow: Medium similarity (investigate further)
  - Green: Low similarity (probably different)

### Providing Feedback

1. **Access Feedback Option**
   - On the results page, find the feedback section
   - This helps improve the AI model over time

2. **Submit Feedback**
   - Mark results as "Helpful" or "Not Helpful"
   - Add optional comments explaining your assessment
   - Click "Submit Feedback"

### Viewing Submission History

1. **Access History**
   - Click "History" in the navigation bar
   - View all your past bug submissions

2. **History Features**
   - See submission date and time
   - View titles and descriptions
   - Access similarity results for each submission
   - Filter and search through your history

3. **Reviewing Past Results**
   - Click on any submission to view its similarity results
   - See the feedback you provided previously
   - Update feedback if your assessment changed

### Searching the Bug Database

1. **Navigate to Search**
   - Click "Search" in the navigation bar
   - Enter search terms in the query box

2. **Search Tips**
   - Use specific keywords from bug titles or descriptions
   - Try different variations of terms
   - Use multiple keywords for better results
   - Minimum 3 characters required

3. **Review Search Results**
   - Browse through matching bugs
   - Click on bugs to view full details
   - Use results to check if your bug already exists

## Administrator Guide

### Admin Dashboard

Administrators have additional features accessible through the "Admin" section:

1. **System Statistics**
   - Total number of users
   - Total bug reports in database
   - User submissions count
   - Active ML models
   - System performance metrics

2. **Quick Actions**
   - Upload new datasets
   - Retrain ML models
   - View system logs
   - Manage user accounts

### Dataset Management

#### Uploading Datasets

1. **Navigate to Dataset Upload**
   - Go to Admin → Dataset Upload
   - Review current dataset status

2. **Prepare Your Dataset**
   - Ensure JSON format is correct:
     ```json
     {
       "bugs": [
         {
           "title": "Clear, descriptive title",
           "description": "Detailed description with steps to reproduce"
         }
       ]
     }
     ```
   - Supported formats:
     - `{"bugs": [bug_objects]}`
     - `{"data": [bug_objects]}`
     - `[bug_objects]` (direct array)

3. **Upload Process**
   - Click "Choose File" and select your JSON file
   - File size limit: 2GB
   - Click "Upload Dataset"
   - Monitor progress with the progress bar
   - Large files are automatically chunked to prevent timeouts

4. **Validation and Processing**
   - System validates JSON structure
   - Filters out invalid entries
   - Reports number of successfully processed records
   - Updates database with new bug reports

#### Dataset Requirements

**Valid Bug Reports Must Have:**
- Title: 5-500 characters
- Description: 10+ characters
- Both fields must be non-empty strings

**Invalid entries are skipped and logged**

### ML Model Management

#### Understanding the Model

Bug-Sleuth uses:
- **TF-IDF Vectorization**: Converts text to numerical features
- **Cosine Similarity**: Measures similarity between bug reports
- **Persistent Storage**: Models saved as .pkl files
- **Version Control**: Each model has a unique version timestamp

#### Retraining the Model

1. **When to Retrain**
   - After uploading new datasets
   - When similarity results seem less accurate
   - Periodically to maintain performance
   - After significant data changes

2. **Retraining Process**
   - Go to Admin → Model Management
   - Review current model information:
     - Version timestamp
     - Training dataset size
     - Training duration
     - Performance metrics
   - Click "Retrain Model"
   - Monitor progress (can take several minutes for large datasets)

3. **Model Training Steps**
   - Extracts all bug reports from database
   - Combines title and description for each bug
   - Trains TF-IDF vectorizer with optimized parameters:
     - Max features: 10,000
     - N-gram range: 1-2
     - Stop words: English
     - Min document frequency: 2
     - Max document frequency: 0.8
   - Calculates similarity vectors
   - Saves model and vectors to disk
   - Updates database with vector data

4. **Model Activation**
   - New model automatically becomes active
   - Previous model versions are kept for rollback
   - Only one model is active at a time

#### Model Performance Monitoring

Track these metrics:
- **Training Time**: How long the model took to train
- **Dataset Size**: Number of bug reports used for training
- **Vector Dimension**: Size of the feature space
- **Storage Size**: Disk space used by the model

### System Monitoring

#### Upload History
- View all dataset uploads
- Check upload status and errors
- Monitor file sizes and processing times
- Review error logs for failed uploads

#### User Management
- View user statistics
- Monitor system usage
- Track submission patterns
- Identify heavy users

## Best Practices

### For All Users

1. **Writing Good Bug Reports**
   - Use descriptive, specific titles
   - Include step-by-step reproduction instructions
   - Mention expected vs. actual behavior
   - Add error messages if available
   - Specify environment details when relevant

2. **Before Submitting**
   - Search existing bugs first
   - Review similar bugs from previous searches
   - Consider if your bug is truly unique

3. **Using Search Effectively**
   - Try multiple keyword combinations
   - Use specific technical terms
   - Check both title and description matches

### For Administrators

1. **Dataset Management**
   - Maintain consistent JSON format
   - Clean data before uploading
   - Remove duplicate entries when possible
   - Validate data quality regularly

2. **Model Retraining**
   - Retrain after significant dataset updates
   - Monitor model performance over time
   - Keep track of model versions
   - Plan retraining during low-usage periods

3. **System Maintenance**
   - Monitor disk space for model storage
   - Review upload logs regularly
   - Clean up old model files periodically
   - Back up important datasets

## Frequently Asked Questions

### General Questions

**Q: How accurate is the similarity detection?**
A: Accuracy depends on the quality and size of the training dataset. Generally, similarity scores above 70% indicate strong matches, while scores above 90% suggest near-duplicates.

**Q: Can I edit or delete my submitted bug reports?**
A: Currently, bug reports cannot be edited or deleted once submitted. However, you can provide feedback to help improve future results.

**Q: How long does it take to get similarity results?**
A: Results are typically displayed within 2-3 seconds for most bug reports. Complex reports or large datasets may take slightly longer.

### Technical Questions

**Q: What happens if the ML model isn't trained?**
A: If no trained model is available, you'll receive a message indicating that similarity detection is unavailable. Contact an administrator to train the model.

**Q: Why are some similarity scores low even for similar bugs?**
A: Low scores can result from different terminology, writing styles, or insufficient training data. The model learns from the existing dataset, so diverse, high-quality training data improves accuracy.

**Q: Can I see the technical details of how similarity is calculated?**
A: The system uses TF-IDF vectorization followed by cosine similarity calculation. Each bug report is converted to a numerical vector, and similarity is measured as the cosine of the angle between vectors.

### Admin Questions

**Q: What's the maximum dataset size supported?**
A: The system supports datasets up to 2GB in size. For larger datasets, consider splitting into multiple uploads or contact technical support.

**Q: How often should I retrain the model?**
A: Retrain after uploading significant amounts of new data (>1000 new bugs) or when you notice declining similarity accuracy. Monthly retraining is a good baseline.

**Q: Can I roll back to a previous model version?**
A: Currently, only the most recent model is active. However, previous model files are preserved on disk for potential manual rollback by system administrators.

### Troubleshooting

**Q: Upload failed with "Invalid JSON format" error**
A: Verify your JSON file structure matches the expected format. Common issues include missing commas, unclosed brackets, or invalid UTF-8 encoding.

**Q: Similarity results seem inaccurate**
A: This may indicate the model needs retraining or the training dataset is insufficient. Try retraining the model or adding more diverse training data.

**Q: Login token expired**
A: Sessions expire after 60 minutes for security. Simply log in again to continue using the application.

## Support and Contact

If you encounter issues not covered in this guide:

1. Check the troubleshooting section in the README
2. Review error messages carefully
3. Contact your system administrator
4. Report bugs through the appropriate channels

---

*This guide is maintained by the Bug-Sleuth development team. Last updated: [Current Date]*
