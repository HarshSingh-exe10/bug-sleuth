import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AuthTokens,
  LoginForm,
  RegisterForm,
  BugSubmissionForm,
  BugSubmissionResponse,
  UserBugSubmission,
  PaginatedResponse,
  SearchForm,
  BugReport,
  FeedbackForm,
  DatasetUpload,
  ModelInfo,
  UserStats,
  AdminStats,
  User
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 && localStorage.getItem('refresh_token')) {
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axios.post('/api/auth/token/refresh/', {
              refresh: refreshToken,
            });
            
            localStorage.setItem('access_token', response.data.access);
            
            // Retry the original request
            error.config.headers.Authorization = `Bearer ${response.data.access}`;
            return this.api.request(error.config);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginForm): Promise<AuthTokens> {
    const response: AxiosResponse<AuthTokens> = await this.api.post('/auth/login/', credentials);
    return response.data;
  }

  async register(userData: RegisterForm): Promise<{ user: User; message: string }> {
    const response: AxiosResponse<{ user: User; message: string }> = await this.api.post(
      '/auth/register/',
      userData
    );
    return response.data;
  }

  async getUserProfile(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/profile/');
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response: AxiosResponse<UserStats> = await this.api.get('/auth/stats/');
    return response.data;
  }

  // Bug submission endpoints
  async submitBugReport(bugData: BugSubmissionForm): Promise<BugSubmissionResponse> {
    const response: AxiosResponse<BugSubmissionResponse> = await this.api.post(
      '/bugs/submit/',
      bugData
    );
    return response.data;
  }

  async getUserSubmissions(page?: number): Promise<PaginatedResponse<UserBugSubmission>> {
    const params = page ? { page } : {};
    const response: AxiosResponse<PaginatedResponse<UserBugSubmission>> = await this.api.get(
      '/bugs/submissions/',
      { params }
    );
    return response.data;
  }

  async getSubmissionDetail(id: number): Promise<{
    submission: UserBugSubmission;
    similar_bugs: any[];
  }> {
    const response = await this.api.get(`/bugs/submissions/${id}/`);
    return response.data;
  }

  async submitFeedback(submissionId: number, feedback: FeedbackForm): Promise<{ message: string }> {
    const response = await this.api.post(`/bugs/submissions/${submissionId}/feedback/`, feedback);
    return response.data;
  }

  // Search endpoints
  async searchBugs(searchData: SearchForm): Promise<{
    results: BugReport[];
    total_found: number;
    query: string;
  }> {
    const response = await this.api.post('/bugs/search/', searchData);
    return response.data;
  }

  // Admin endpoints
  async uploadDataset(file: File, onProgress?: (progress: number) => void): Promise<{
    message: string;
    upload_id: number;
    processed_count: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post('/bugs/admin/upload-dataset/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });
    return response.data;
  }

  async retrainModel(): Promise<{ message: string; dataset_size: number }> {
    const response = await this.api.post('/bugs/admin/retrain-model/');
    return response.data;
  }

  async getModelInfo(): Promise<ModelInfo> {
    const response: AxiosResponse<ModelInfo> = await this.api.get('/bugs/admin/model-info/');
    return response.data;
  }

  async getDatasetUploads(page?: number): Promise<PaginatedResponse<DatasetUpload>> {
    const params = page ? { page } : {};
    const response: AxiosResponse<PaginatedResponse<DatasetUpload>> = await this.api.get(
      '/bugs/admin/uploads/',
      { params }
    );
    return response.data;
  }

  async getBugReports(page?: number): Promise<PaginatedResponse<BugReport>> {
    const params = page ? { page } : {};
    const response: AxiosResponse<PaginatedResponse<BugReport>> = await this.api.get(
      '/bugs/admin/bug-reports/',
      { params }
    );
    return response.data;
  }

  async getAdminStats(): Promise<AdminStats> {
    const response: AxiosResponse<AdminStats> = await this.api.get('/auth/admin/stats/');
    return response.data;
  }

  // User management endpoints
  async getUsers(page?: number): Promise<PaginatedResponse<User>> {
    const params = page ? { page } : {};
    const response: AxiosResponse<PaginatedResponse<User>> = await this.api.get(
      '/auth/admin/users/',
      { params }
    );
    return response.data;
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(
      `/auth/admin/users/${userId}/`,
      userData
    );
    return response.data;
  }

  async deactivateUser(userId: number): Promise<{ message: string }> {
    const response = await this.api.post(`/auth/admin/users/${userId}/deactivate/`);
    return response.data;
  }

  async activateUser(userId: number): Promise<{ message: string }> {
    const response = await this.api.post(`/auth/admin/users/${userId}/activate/`);
    return response.data;
  }

  // Model management endpoints
  async getModelVersions(): Promise<any[]> {
    const response = await this.api.get('/bugs/admin/models/');
    return response.data;
  }

  async getModelDetails(modelId: number): Promise<any> {
    const response = await this.api.get(`/bugs/admin/models/${modelId}/`);
    return response.data;
  }

  async activateModel(modelId: number): Promise<{ message: string }> {
    const response = await this.api.post(`/bugs/admin/models/${modelId}/activate/`);
    return response.data;
  }
}

export const apiService = new ApiService();
