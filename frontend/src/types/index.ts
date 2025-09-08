// User types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

// Bug report types
export interface BugReport {
  id: number;
  title: string;
  description: string;
  source: string;
  similarity_score?: number;
  created_at: string;
  updated_at: string;
}

export interface UserBugSubmission {
  id: number;
  user: string;
  title: string;
  description: string;
  feedback_helpful?: boolean;
  feedback_comment?: string;
  created_at: string;
  updated_at: string;
}

export interface SimilarityResult {
  id: number;
  similar_bug: BugReport;
  similarity_score: number;
  rank: number;
  created_at: string;
}

export interface BugSubmissionResponse {
  submission: UserBugSubmission;
  similar_bugs: SimilarityResult[];
  message: string;
  total_similar: number;
}

// Admin types
export interface DatasetUpload {
  id: number;
  uploaded_by: number;
  filename: string;
  file_size: number;
  total_records?: number;
  processed_records: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  error_message: string;
  created_at: string;
  completed_at: string | null;
}

export interface ModelInfo {
  model_name: string;
  version: string;
  training_status: string;
  accuracy: number;
  dataset_size: number;
  last_trained: string;
  is_active: boolean;
}

// Form types
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface BugSubmissionForm {
  title: string;
  description: string;
}

export interface SearchForm {
  query: string;
  limit: number;
}

export interface FeedbackForm {
  helpful: boolean;
  comment?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Statistics types
export interface UserStats {
  total_submissions: number;
  recent_submissions: number;
  is_admin: boolean;
  joined_date: string;
}

export interface AdminStats {
  total_users: number;
  total_submissions: number;
  total_bug_reports: number;
  model_accuracy: number;
  recent_uploads: number;
  pending_uploads: number;
}
