import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import {
  Brain,
  Play,
  Square,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Download,
  Upload,
  Settings,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react';
import { ModelInfo } from '../../types';

interface ModelVersion {
  id: number;
  name: string;
  version: string;
  training_status: string;
  accuracy_score: number | null;
  training_time_seconds: number | null;
  training_dataset_size: number | null;
  training_started_at: string;
  training_completed_at: string | null;
  is_active: boolean;
}

interface TrainingProgress {
  status: 'idle' | 'training' | 'completed' | 'error';
  progress: number;
  message: string;
  currentEpoch?: number;
  totalEpochs?: number;
}

const ModelManagement: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({ 
    status: 'idle', 
    progress: 0, 
    message: 'Ready to train' 
  });
  const [selectedModel, setSelectedModel] = useState<ModelVersion | null>(null);
  const [showTrainingConfig, setShowTrainingConfig] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState({
    dataset_size_limit: 10000,
    learning_rate: 0.001,
    batch_size: 32,
    epochs: 10,
    validation_split: 0.2
  });

  useEffect(() => {
    loadModelData();
  }, []);

  const loadModelData = async () => {
    try {
      setLoading(true);
      const [modelResponse] = await Promise.all([
        apiService.getModelInfo()
      ]);
      setModelInfo(modelResponse);
      
      // Mock model versions data
      setModels([
        {
          id: 1,
          name: 'tfidf_similarity',
          version: '1.0.0',
          training_status: 'completed',
          accuracy_score: 0.87,
          training_time_seconds: 1800,
          training_dataset_size: 1500,
          training_started_at: '2024-01-20T10:30:00Z',
          training_completed_at: '2024-01-20T11:00:00Z',
          is_active: true
        },
        {
          id: 2,
          name: 'tfidf_similarity',
          version: '1.1.0',
          training_status: 'training',
          accuracy_score: null,
          training_time_seconds: null,
          training_dataset_size: 2250,
          training_started_at: '2024-01-21T14:15:00Z',
          training_completed_at: null,
          is_active: false
        },
        {
          id: 3,
          name: 'tfidf_similarity',
          version: '0.9.0',
          training_status: 'completed',
          accuracy_score: 0.82,
          training_time_seconds: 1500,
          training_dataset_size: 1200,
          training_started_at: '2024-01-15T09:00:00Z',
          training_completed_at: '2024-01-15T09:25:00Z',
          is_active: false
        }
      ]);
    } catch (error) {
      console.error('Error loading model data:', error);
      // Set mock data for demo
      setModelInfo({
        model_name: 'TF-IDF Similarity Model',
        version: '1.0.0',
        training_status: 'completed',
        accuracy: 0.87,
        dataset_size: 1500,
        last_trained: '2024-01-20T10:30:00Z',
        is_active: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = async () => {
    try {
      setTrainingProgress({ 
        status: 'training', 
        progress: 0, 
        message: 'Initializing training...', 
        currentEpoch: 0,
        totalEpochs: trainingConfig.epochs
      });
      setShowTrainingConfig(false);

      // Simulate training progress
      const totalSteps = trainingConfig.epochs;
      
      for (let step = 0; step <= totalSteps; step++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const progress = (step / totalSteps) * 100;
        
        setTrainingProgress({ 
          status: 'training', 
          progress, 
          message: step < totalSteps 
            ? `Training epoch ${step}/${totalSteps}...` 
            : 'Finalizing model...', 
          currentEpoch: step,
          totalEpochs: totalSteps
        });
      }

      // Complete training
      const response = await apiService.retrainModel();
      
      setTrainingProgress({ 
        status: 'completed', 
        progress: 100, 
        message: `Training completed! Dataset size: ${response.dataset_size} records`,
        currentEpoch: totalSteps,
        totalEpochs: totalSteps
      });
      
      // Reset progress after 3 seconds
      setTimeout(() => {
        setTrainingProgress({ status: 'idle', progress: 0, message: 'Ready to train' });
        loadModelData();
      }, 3000);

    } catch (error) {
      console.error('Training error:', error);
      setTrainingProgress({ 
        status: 'error', 
        progress: 0, 
        message: 'Training failed. Please try again.' 
      });
    }
  };

  const handleStopTraining = () => {
    setTrainingProgress({ status: 'idle', progress: 0, message: 'Training stopped' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'training':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />;
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
      case 'training':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Model Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTrainingConfig(true)}
            disabled={trainingProgress.status === 'training'}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Brain className="h-4 w-4 mr-2" />
            Train New Model
          </button>
        </div>
      </div>

      {/* Current Active Model */}
      {modelInfo && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Active Model</h2>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Model</p>
                  <p className="text-lg font-semibold text-blue-700">
                    {modelInfo.model_name} v{modelInfo.version}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Accuracy</p>
                  <p className="text-lg font-semibold text-green-700">
                    {(modelInfo.accuracy * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-900">Dataset Size</p>
                  <p className="text-lg font-semibold text-purple-700">
                    {modelInfo.dataset_size.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-900">Last Trained</p>
                  <p className="text-lg font-semibold text-orange-700">
                    {new Date(modelInfo.last_trained).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Progress */}
      {trainingProgress.status !== 'idle' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Training Progress</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {trainingProgress.status === 'training' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              ) : trainingProgress.status === 'completed' ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <span className="font-medium text-lg">{trainingProgress.message}</span>
              {trainingProgress.status === 'training' && (
                <button
                  onClick={handleStopTraining}
                  className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <Square className="h-4 w-4 mr-1 inline" />
                  Stop
                </button>
              )}
            </div>
            
            {trainingProgress.status === 'training' && (
              <>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${trainingProgress.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress: {Math.round(trainingProgress.progress)}%</span>
                  <span>
                    Epoch: {trainingProgress.currentEpoch}/{trainingProgress.totalEpochs}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Model Versions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Model Versions</h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Loading models...</div>
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No models trained yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dataset Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Training Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trained Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {models.map((model) => (
                    <tr key={model.id} className={`hover:bg-gray-50 ${
                      model.is_active ? 'bg-blue-50' : ''
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Brain className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {model.name} v{model.version}
                            </span>
                            {model.is_active && (
                              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(model.training_status)}
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              getStatusColor(model.training_status)
                            }`}
                          >
                            {model.training_status.charAt(0).toUpperCase() + model.training_status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {model.accuracy_score ? `${(model.accuracy_score * 100).toFixed(1)}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {model.training_dataset_size?.toLocaleString() || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDuration(model.training_time_seconds)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(model.training_started_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedModel(model)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Activity className="h-4 w-4" />
                          </button>
                          {model.training_status === 'completed' && !model.is_active && (
                            <button
                              className="text-green-600 hover:text-green-800"
                              title="Activate Model"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {model.training_status === 'completed' && (
                            <button
                              className="text-purple-600 hover:text-purple-800"
                              title="Download Model"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
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

      {/* Training Configuration Modal */}
      {showTrainingConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Training Configuration</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dataset Size Limit
                </label>
                <input
                  type="number"
                  value={trainingConfig.dataset_size_limit}
                  onChange={(e) => setTrainingConfig({
                    ...trainingConfig,
                    dataset_size_limit: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Rate
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={trainingConfig.learning_rate}
                  onChange={(e) => setTrainingConfig({
                    ...trainingConfig,
                    learning_rate: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Size
                  </label>
                  <input
                    type="number"
                    value={trainingConfig.batch_size}
                    onChange={(e) => setTrainingConfig({
                      ...trainingConfig,
                      batch_size: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Epochs
                  </label>
                  <input
                    type="number"
                    value={trainingConfig.epochs}
                    onChange={(e) => setTrainingConfig({
                      ...trainingConfig,
                      epochs: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validation Split
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="0.5"
                  value={trainingConfig.validation_split}
                  onChange={(e) => setTrainingConfig({
                    ...trainingConfig,
                    validation_split: parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Note</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Training may take several minutes to complete depending on the dataset size.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowTrainingConfig(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartTraining}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Training
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Details Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Model Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Model Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedModel.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Version</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedModel.version}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1 flex items-center space-x-2">
                    {getStatusIcon(selectedModel.training_status)}
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(selectedModel.training_status)
                    }`}>
                      {selectedModel.training_status.charAt(0).toUpperCase() + selectedModel.training_status.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Accuracy</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedModel.accuracy_score ? `${(selectedModel.accuracy_score * 100).toFixed(2)}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dataset Size</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedModel.training_dataset_size?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Training Time</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDuration(selectedModel.training_time_seconds)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Training Started</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedModel.training_started_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Training Completed</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedModel.training_completed_at 
                      ? new Date(selectedModel.training_completed_at).toLocaleString() 
                      : 'N/A'}
                  </p>
                </div>
              </div>
              
              {selectedModel.is_active && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-blue-900">This is the currently active model</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedModel(null)}
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

export default ModelManagement;
