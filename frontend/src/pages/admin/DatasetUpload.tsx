import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { DatasetUpload as DatasetUploadType } from '../../types';

interface UploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  message: string;
}

const DatasetUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploads, setUploads] = useState<DatasetUploadType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<DatasetUploadType | null>(null);

  useEffect(() => {
    loadUploads();
  }, []);

  const loadUploads = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDatasetUploads();
      setUploads(response.results || []);
    } catch (error) {
      console.error('Error loading uploads:', error);
      // Mock data for demo
      setUploads([
        {
          id: 1,
          filename: 'bug_reports_2024.json',
          file_size: 2048000,
          total_records: 1500,
          processed_records: 1500,
          status: 'completed',
          error_message: '',
          created_at: '2024-01-20T10:30:00Z',
          completed_at: '2024-01-20T10:45:00Z',
          uploaded_by: 1
        },
        {
          id: 2,
          filename: 'additional_bugs.json',
          file_size: 1024000,
          total_records: 750,
          processed_records: 600,
          status: 'processing',
          error_message: '',
          created_at: '2024-01-21T14:15:00Z',
          completed_at: null,
          uploaded_by: 1
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/json' || droppedFile.name.endsWith('.json')) {
        setFile(droppedFile);
      } else {
        alert('Please upload a JSON file');
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/json' || selectedFile.name.endsWith('.json')) {
        setFile(selectedFile);
      } else {
        alert('Please upload a JSON file');
        e.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploadProgress({
        progress: 0,
        status: 'uploading',
        message: 'Uploading file...'
      });

      const response = await apiService.uploadDataset(file, (progress) => {
        setUploadProgress({
          progress,
          status: 'uploading',
          message: `Uploading... ${Math.round(progress)}%`
        });
      });

      setUploadProgress({
        progress: 100,
        status: 'processing',
        message: `Processing ${response.processed_count} records...`
      });

      // Simulate processing time
      setTimeout(() => {
        setUploadProgress({
          progress: 100,
          status: 'completed',
          message: `Successfully processed ${response.processed_count} records`
        });
        
        setFile(null);
        loadUploads();
        
        // Clear progress after 3 seconds
        setTimeout(() => {
          setUploadProgress(null);
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({
        progress: 0,
        status: 'error',
        message: 'Upload failed. Please try again.'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dataset Upload</h1>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Dataset</h2>
        
        <div className="space-y-4">
          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 mx-auto text-blue-500" />
                <p className="text-lg font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleUpload}
                    disabled={!!uploadProgress && uploadProgress.status !== 'error'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Upload Dataset
                  </button>
                  <button
                    onClick={() => setFile(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-lg font-medium text-gray-900">
                  Drop your JSON dataset here, or
                </p>
                <label className="inline-block">
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500">
                  Only JSON files are accepted
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {uploadProgress.status === 'uploading' || uploadProgress.status === 'processing' ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                ) : uploadProgress.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">{uploadProgress.message}</span>
              </div>
              {uploadProgress.status === 'uploading' && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Dataset Format Requirements</h3>
              <ul className="mt-1 text-sm text-blue-700 space-y-1">
                <li>• File must be in JSON format</li>
                <li>• Each record should contain 'title' and 'description' fields</li>
                <li>• Example: {'{"title": "Bug title", "description": "Bug description"}'}</li>
                <li>• Maximum file size: 50MB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upload History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Upload History</h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Loading uploads...</div>
            </div>
          ) : uploads.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No uploads yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploads.map((upload) => (
                    <tr key={upload.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">
                            {upload.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(upload.file_size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {upload.processed_records ? (
                          <span>
                            {upload.processed_records}
                            {upload.total_records && upload.processed_records !== upload.total_records && (
                              <span className="text-gray-400"> / {upload.total_records}</span>
                            )}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(upload.status)}
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              getStatusColor(upload.status)
                            }`}
                          >
                            {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(upload.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedUpload(upload)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {upload.status === 'completed' && (
                            <button
                              className="text-green-600 hover:text-green-800"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Details Modal */}
      {selectedUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Upload Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Filename</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUpload.filename}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">File Size</label>
                  <p className="mt-1 text-sm text-gray-900">{formatFileSize(selectedUpload.file_size)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Records</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUpload.total_records || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Processed Records</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUpload.processed_records || 0}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1 flex items-center space-x-2">
                    {getStatusIcon(selectedUpload.status)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(selectedUpload.status)
                    }`}>
                      {selectedUpload.status.charAt(0).toUpperCase() + selectedUpload.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Upload Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedUpload.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {selectedUpload.completed_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Completed Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedUpload.completed_at).toLocaleString()}
                  </p>
                </div>
              )}
              
              {selectedUpload.error_message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Error Message</label>
                  <p className="mt-1 text-sm text-red-600">{selectedUpload.error_message}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedUpload(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetUpload;
