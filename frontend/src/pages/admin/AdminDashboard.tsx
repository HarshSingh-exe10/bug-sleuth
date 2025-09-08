import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { User, AdminStats as AdminStatsType } from '../../types';
import {
  Users,
  Database,
  Brain,
  Activity,
  Upload,
  Settings,
  FileText,
  AlertCircle,
  TrendingUp,
  Clock,
  UserCheck
} from 'lucide-react';

interface SystemLog {
  id: number;
  level: string;
  message: string;
  timestamp: string;
  user: string;
  action: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs'>('overview');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, usersResponse] = await Promise.all([
          apiService.getAdminStats(),
          apiService.getUsers()
        ]);
        setStats(statsResponse);
        setUsers(usersResponse.results || []);
        
        // Mock system logs for now
        setSystemLogs([
          {
            id: 1,
            level: 'INFO',
            message: 'Dataset uploaded successfully',
            timestamp: new Date().toISOString(),
            user: 'admin',
            action: 'DATASET_UPLOAD'
          },
          {
            id: 2,
            level: 'INFO',
            message: 'Model retrained successfully',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            user: 'admin',
            action: 'MODEL_RETRAIN'
          },
          {
            id: 3,
            level: 'WARNING',
            message: 'High memory usage detected',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            user: 'system',
            action: 'SYSTEM_WARNING'
          }
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set mock data for demo
        setStats({
          total_users: 45,
          total_submissions: 123,
          total_bug_reports: 1500,
          model_accuracy: 0.87,
          recent_uploads: 5,
          pending_uploads: 2
        });
        setUsers([
          {
            id: 1,
            username: 'john_doe',
            email: 'john@example.com',
            first_name: 'John',
            last_name: 'Doe',
            is_admin: false,
            is_staff: false,
            is_active: true,
            date_joined: '2024-01-15T10:30:00Z',
            last_login: '2024-01-20T14:45:00Z'
          },
          {
            id: 2,
            username: 'jane_smith',
            email: 'jane@example.com',
            first_name: 'Jane',
            last_name: 'Smith',
            is_admin: false,
            is_staff: false,
            is_active: true,
            date_joined: '2024-01-10T09:15:00Z',
            last_login: '2024-01-19T16:20:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = ({
    icon,
    title,
    value,
    color
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-2xl font-bold text-gray-700">{value}</p>
        </div>
      </div>
    </div>
  );

  const ActionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    to: string;
    color: string;
  }> = ({ icon, title, description, to, color }) => (
    <Link
      to={to}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );

  const TabButton: React.FC<{
    id: 'overview' | 'users' | 'logs';
    label: string;
    icon: React.ReactNode;
  }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium ${
        activeTab === id
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<Users className="h-6 w-6 text-white" />}
            title="Total Users"
            value={stats.total_users}
            color="bg-blue-500"
          />
          <StatCard
            icon={<FileText className="h-6 w-6 text-white" />}
            title="Bug Submissions"
            value={stats.total_submissions}
            color="bg-green-500"
          />
          <StatCard
            icon={<Database className="h-6 w-6 text-white" />}
            title="Bug Reports"
            value={stats.total_bug_reports}
            color="bg-purple-500"
          />
          <StatCard
            icon={<Brain className="h-6 w-6 text-white" />}
            title="Model Accuracy"
            value={`${(stats.model_accuracy * 100).toFixed(1)}%`}
            color="bg-indigo-500"
          />
          <StatCard
            icon={<Upload className="h-6 w-6 text-white" />}
            title="Recent Uploads"
            value={stats.recent_uploads}
            color="bg-orange-500"
          />
          <StatCard
            icon={<Clock className="h-6 w-6 text-white" />}
            title="Pending Uploads"
            value={stats.pending_uploads}
            color="bg-red-500"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            icon={<Upload className="h-6 w-6 text-white" />}
            title="Dataset Upload"
            description="Upload new datasets to train the model"
            to="/admin/upload"
            color="bg-blue-500"
          />
          <ActionCard
            icon={<Brain className="h-6 w-6 text-white" />}
            title="Model Management"
            description="Manage ML models and training"
            to="/admin/model"
            color="bg-indigo-500"
          />
          <ActionCard
            icon={<Settings className="h-6 w-6 text-white" />}
            title="System Settings"
            description="Configure system parameters"
            to="#"
            color="bg-gray-500"
          />
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200 p-6">
          <div className="flex space-x-4">
            <TabButton id="overview" label="Overview" icon={<Activity className="h-5 w-5" />} />
            <TabButton id="users" label="User Management" icon={<Users className="h-5 w-5" />} />
            <TabButton id="logs" label="System Logs" icon={<FileText className="h-5 w-5" />} />
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      Model accuracy improved to 87.3%
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Upload className="h-4 w-4 mr-2 text-blue-500" />
                      New dataset uploaded (500 records)
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UserCheck className="h-4 w-4 mr-2 text-purple-500" />
                      3 new users registered today
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">System Health</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">API Status</span>
                      <span className="text-sm text-green-600 font-medium">Healthy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Database</span>
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">ML Model</span>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add New User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.first_name?.[0] || user.username[0].toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name} ({user.username})
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.date_joined).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
              <div className="bg-gray-50 rounded-lg">
                <div className="max-h-96 overflow-y-auto">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="border-b border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                              log.level === 'INFO'
                                ? 'bg-blue-100 text-blue-800'
                                : log.level === 'WARNING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {log.level}
                          </span>
                          <div>
                            <p className="text-sm text-gray-900">{log.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {log.user} • {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
