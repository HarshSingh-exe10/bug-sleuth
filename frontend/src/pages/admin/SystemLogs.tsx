import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SystemLogs: React.FC = () => {
  const navigate = useNavigate();
  const {} = useAuth();
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filterLevel, setFilterLevel] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [, ] = useState<Set<number>>(new Set());
  const [systemHealth, setSystemHealth] = React.useState<any>(null);
  const [exportingLogs, setExportingLogs] = React.useState(false);
  const [runningHealthCheck, setRunningHealthCheck] = React.useState(false);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock log data
        const mockLogs = [
          {
            id: 1,
            timestamp: '2024-01-19T10:15:00Z',
            level: 'ERROR',
            source: 'Authentication',
            message: 'Failed login attempt for user: nonexistent@example.com',
            details: 'Invalid credentials provided. IP: 192.168.1.100',
            user_id: null,
            request_id: 'req_123456'
          },
          {
            id: 2,
            timestamp: '2024-01-19T10:12:00Z',
            level: 'INFO',
            source: 'BugSubmission',
            message: 'New bug submission created',
            details: 'Bug report #1247 submitted by user john.doe',
            user_id: 1,
            request_id: 'req_123455'
          },
          {
            id: 3,
            timestamp: '2024-01-19T10:10:00Z',
            level: 'WARNING',
            source: 'Database',
            message: 'Slow query detected',
            details: 'Query execution time: 2.3s for similarity search',
            user_id: null,
            request_id: 'req_123454'
          },
          {
            id: 4,
            timestamp: '2024-01-19T10:08:00Z',
            level: 'INFO',
            source: 'ModelTraining',
            message: 'ML model training completed',
            details: 'Bug Similarity Model v2.1 training finished successfully',
            user_id: null,
            request_id: 'req_123453'
          },
          {
            id: 5,
            timestamp: '2024-01-19T10:05:00Z',
            level: 'ERROR',
            source: 'FileUpload',
            message: 'Dataset upload failed',
            details: 'File validation error: Invalid CSV format in line 45',
            user_id: 2,
            request_id: 'req_123452'
          },
          {
            id: 6,
            timestamp: '2024-01-19T10:02:00Z',
            level: 'DEBUG',
            source: 'API',
            message: 'API endpoint called',
            details: 'GET /api/submissions?page=1&limit=10',
            user_id: 1,
            request_id: 'req_123451'
          },
          {
            id: 7,
            timestamp: '2024-01-19T10:00:00Z',
            level: 'INFO',
            source: 'UserManagement',
            message: 'User role updated',
            details: 'User alice.brown promoted to admin by bob.wilson',
            user_id: 3,
            request_id: 'req_123450'
          },
          {
            id: 8,
            timestamp: '2024-01-19T09:58:00Z',
            level: 'WARNING',
            source: 'Security',
            message: 'Multiple failed login attempts',
            details: 'IP 192.168.1.200 has 5 failed attempts in last 10 minutes',
            user_id: null,
            request_id: 'req_123449'
          }
        ];
        
        // Mock system health data
        const mockSystemHealth = {
          status: 'healthy',
          uptime: '15 days, 8 hours',
          cpu_usage: 23,
          memory_usage: 67,
          disk_usage: 45,
          active_connections: 142,
          response_time: 89,
          error_rate: 0.2,
          last_backup: '2024-01-19T02:00:00Z',
          services: {
            database: { status: 'healthy', response_time: 12 },
            redis: { status: 'healthy', response_time: 3 },
            ml_service: { status: 'healthy', response_time: 150 },
            file_storage: { status: 'warning', response_time: 250 }
          }
        };
        
        setLogs(mockLogs);
        setSystemHealth(mockSystemHealth);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleExportLogs = async () => {
    setExportingLogs(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export process
      
      // Create CSV content
      const csvHeader = 'Timestamp,Level,Source,Message,Details,User ID,Request ID\n';
      const csvContent = filteredLogs.map(log => 
        `"${log.timestamp}","${log.level}","${log.source}","${log.message}","${log.details}","${log.user_id || ''}","${log.request_id}"`
      ).join('\n');
      
      // Create and download file
      const blob = new Blob([csvHeader + csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Logs exported successfully');
    } catch (error) {
      console.error('Failed to export logs:', error);
    } finally {
      setExportingLogs(false);
    }
  };

  const handleSystemHealthCheck = async () => {
    setRunningHealthCheck(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate health check
      
      // Update system health with new data
      const updatedHealth = {
        ...systemHealth,
        status: 'healthy',
        cpu_usage: Math.floor(Math.random() * 40) + 10,
        memory_usage: Math.floor(Math.random() * 30) + 50,
        response_time: Math.floor(Math.random() * 50) + 70,
        error_rate: Math.random() * 0.5,
        services: {
          database: { status: 'healthy', response_time: Math.floor(Math.random() * 20) + 5 },
          redis: { status: 'healthy', response_time: Math.floor(Math.random() * 10) + 1 },
          ml_service: { status: 'healthy', response_time: Math.floor(Math.random() * 100) + 100 },
          file_storage: { status: Math.random() > 0.7 ? 'warning' : 'healthy', response_time: Math.floor(Math.random() * 200) + 100 }
        }
      };
      
      setSystemHealth(updatedHealth);
      console.log('System health check completed successfully');
    } catch (error) {
      console.error('Failed to run system health check:', error);
    } finally {
      setRunningHealthCheck(false);
    }
  };

  const handleViewAllLogs = () => {
    // Reset filters to show all logs
    setFilterLevel('all');
    setSearchTerm('');
    console.log('Showing all system logs');
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesLevel && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'INFO': return 'bg-blue-100 text-blue-800';
      case 'DEBUG': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading system logs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
            <p className="text-gray-600">View system logs and error reports</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleViewAllLogs}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            View all system logs →
          </button>
          <button
            onClick={handleExportLogs}
            disabled={exportingLogs}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            {exportingLogs ? 'Exporting...' : 'Export Logs'}
          </button>
          <button
            onClick={handleSystemHealthCheck}
            disabled={runningHealthCheck}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {runningHealthCheck ? 'Checking...' : 'System Health Check'}
          </button>
        </div>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {systemHealth.status === 'healthy' ? '✓' : '⚠️'}
                </p>
                <p className="text-sm text-gray-500">Uptime: {systemHealth.uptime}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CPU Usage</p>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.cpu_usage}%</p>
                <p className="text-sm text-gray-500">Memory: {systemHealth.memory_usage}%</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.response_time}ms</p>
                <p className="text-sm text-gray-500">Error Rate: {systemHealth.error_rate.toFixed(2)}%</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Connections</p>
                <p className="text-2xl font-bold text-gray-900">{systemHealth.active_connections}</p>
                <p className="text-sm text-gray-500">Disk: {systemHealth.disk_usage}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Status */}
      {systemHealth && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(systemHealth.services).map(([service, status]: [string, any]) => (
              <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {service.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-gray-500">{status.response_time}ms</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusColor(status.status)}`}>
                  {status.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="ERROR">Error</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
                <option value="DEBUG">Debug</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.source}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <p className="font-medium">{log.message}</p>
                      <p className="text-gray-500 mt-1">{log.details}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.request_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8c0 2.3-.96 4.377-2.509 5.866L21.414 21 20 22.414l-1.768-1.768z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogs;
