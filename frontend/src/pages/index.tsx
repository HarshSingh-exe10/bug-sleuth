import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Import full-featured admin components
import DatasetUpload from './admin/DatasetUpload';
import ModelManagement from './admin/ModelManagement';

// Placeholder components - these would be fully implemented in a complete application
export const Home: React.FC = () => (
  <div className="text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Bug-Sleuth</h1>
    <p className="text-lg text-gray-600">AI-Powered Duplicate Bug Finder</p>
  </div>
);

export const Login: React.FC = () => {
  const [formData, setFormData] = React.useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login) return;

    setLoading(true);
    setError('');

    try {
      await login(formData);
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:text-blue-500">
          Register here
        </a>
      </p>
    </div>
  );
};

export const Register: React.FC = () => {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!register) return;

    // Validate passwords match
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      // Redirect to dashboard after successful registration and auto-login
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John"
            />
          </div>
          
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Doe"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="johndoe"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        
        <div>
          <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="password_confirm"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:text-blue-500">
          Login here
        </a>
      </p>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = React.useState<any>(null);
  const [recentActivity, setRecentActivity] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState<string>('all');
  const [users, setUsers] = React.useState<any[]>([]);
  
  const quickActions = [
    {
      title: 'Submit Bug Report',
      description: 'Report a new bug with AI-powered duplicate detection',
      icon: '🐛',
      action: () => navigate('/submit'),
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'View History',
      description: user?.is_admin ? 'View all user submissions and their status' : 'See your previous bug submissions and their status',
      icon: '📊',
      action: () => navigate('/history'),
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Search Bugs',
      description: 'Search through existing bug reports',
      icon: '🔍',
      action: () => navigate('/search'),
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    }
  ];
  
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock users data for admin filter
        const mockUsers = [
          { id: 1, username: 'john.doe', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
          { id: 2, username: 'jane.smith', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' },
          { id: 3, username: 'bob.wilson', first_name: 'Bob', last_name: 'Wilson', email: 'bob.wilson@example.com' },
          { id: 4, username: 'alice.brown', first_name: 'Alice', last_name: 'Brown', email: 'alice.brown@example.com' }
        ];
        
        // Mock activity data
        const allActivity = [
          { action: 'Submitted bug report', title: 'Login form validation error', time: '2 hours ago', status: 'pending', user_id: 1, username: 'john.doe' },
          { action: 'Bug resolved', title: 'Navigation menu overlap issue', time: '1 day ago', status: 'resolved', user_id: 2, username: 'jane.smith' },
          { action: 'Submitted bug report', title: 'Data export functionality broken', time: '3 days ago', status: 'in-review', user_id: 1, username: 'john.doe' },
          { action: 'Bug closed', title: 'Email notification settings not saving', time: '4 days ago', status: 'closed', user_id: 3, username: 'bob.wilson' },
          { action: 'Submitted bug report', title: 'Dashboard loading performance issue', time: '5 days ago', status: 'in-review', user_id: 2, username: 'jane.smith' },
          { action: 'Bug resolved', title: 'Mobile responsive layout issues', time: '1 week ago', status: 'resolved', user_id: 4, username: 'alice.brown' }
        ];
        
        let filteredActivity;
        let dashboardStats;
        
        if (user?.is_admin) {
          // Admin view - filter by selected user or show all
          if (selectedUser === 'all') {
            filteredActivity = allActivity;
            dashboardStats = {
              total_submissions: 24,
              resolved_issues: 15,
              pending_review: 9,
              total_users: 4,
              avg_resolution_time: '2.3 days'
            };
          } else {
            const userId = parseInt(selectedUser);
            filteredActivity = allActivity.filter(activity => activity.user_id === userId);
            const userSubmissions = allActivity.filter(activity => activity.user_id === userId && activity.action.includes('Submitted'));
            const userResolved = allActivity.filter(activity => activity.user_id === userId && activity.status === 'resolved');
            const userPending = allActivity.filter(activity => activity.user_id === userId && ['pending', 'in-review'].includes(activity.status));
            
            dashboardStats = {
              total_submissions: userSubmissions.length,
              resolved_issues: userResolved.length,
              pending_review: userPending.length,
              selected_user: mockUsers.find(u => u.id === userId)?.username || 'Unknown',
              resolution_rate: userSubmissions.length > 0 ? Math.round((userResolved.length / userSubmissions.length) * 100) : 0
            };
          }
          setUsers(mockUsers);
        } else {
          // Regular user view - only their own data (assuming current user is ID 1)
          filteredActivity = allActivity.filter(activity => activity.user_id === 1);
          const userSubmissions = filteredActivity.filter(activity => activity.action.includes('Submitted'));
          const userResolved = filteredActivity.filter(activity => activity.status === 'resolved');
          const userPending = filteredActivity.filter(activity => ['pending', 'in-review'].includes(activity.status));
          
          dashboardStats = {
            total_submissions: userSubmissions.length,
            resolved_issues: userResolved.length,
            pending_review: userPending.length,
            resolution_rate: userSubmissions.length > 0 ? Math.round((userResolved.length / userSubmissions.length) * 100) : 0,
            latest_submission: '2 hours ago'
          };
        }
        
        setStats(dashboardStats);
        setRecentActivity(filteredActivity.slice(0, 6)); // Show only first 6 items
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, selectedUser]);
  
  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.first_name || user?.username}!</h1>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading dashboard data...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.first_name || user?.username}!
            </h1>
            <p className="text-gray-600">
              {user?.is_admin ? (
                selectedUser === 'all' ? 
                  "Here's a system-wide overview of bug tracking activity." :
                  `Viewing activity for user: ${stats?.selected_user || 'Selected User'}`
              ) : (
                "Here's an overview of your bug tracking activity."
              )}
            </p>
          </div>
          
          {user?.is_admin && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="user-filter" className="text-sm font-medium text-gray-700">
                  Filter by User:
                </label>
                <select
                  id="user-filter"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Users</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id.toString()}>
                      {user.first_name} {user.last_name} ({user.username})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="h-8 w-px bg-gray-300"></div>
              
              <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                Admin View
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {user?.is_admin && selectedUser !== 'all' ? 'User Submissions' : 'Total Submissions'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_submissions || 0}</p>
              <p className="text-sm text-gray-500">
                {user?.is_admin && selectedUser === 'all' ? '+5 this week' : 
                 user?.is_admin ? `${stats?.selected_user}'s reports` : '+3 this week'}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8c0 2.3-.96 4.377-2.509 5.866L21.414 21 20 22.414l-1.768-1.768z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {user?.is_admin && selectedUser !== 'all' ? 'User Resolved' : 'Resolved Issues'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats?.resolved_issues || 0}</p>
              <p className="text-sm text-green-600">
                {stats?.resolution_rate ? `${stats.resolution_rate}% resolution rate` : 
                 user?.is_admin && selectedUser === 'all' ? '63% resolution rate' : '67% resolution rate'}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {user?.is_admin && selectedUser !== 'all' ? 'User Pending' : 'Pending Review'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pending_review || 0}</p>
              <p className="text-sm text-yellow-600">
                {user?.is_admin && selectedUser === 'all' ? '7 high priority' : 
                 user?.is_admin ? `${stats?.selected_user}'s pending` : '2 high priority'}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {user?.is_admin && selectedUser === 'all' && (
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_users || 0}</p>
                <p className="text-sm text-blue-600">
                  Avg: {stats?.avg_resolution_time || '2.1 days'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
        
        {!user?.is_admin && (
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Latest Activity</p>
                <p className="text-2xl font-bold text-gray-900">📅</p>
                <p className="text-sm text-gray-500">{stats?.latest_submission || 'No recent activity'}</p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className={`card cursor-pointer transition-colors duration-200 ${action.color}`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{action.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          {user?.is_admin && selectedUser !== 'all' && (
            <span className="text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              Filtered: {stats?.selected_user}
            </span>
          )}
        </div>
        <div className="card">
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'resolved' ? 'bg-green-400' : 
                    activity.status === 'in-review' ? 'bg-yellow-400' : 
                    activity.status === 'closed' ? 'bg-gray-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      {user?.is_admin && selectedUser === 'all' && (
                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                          @{activity.username}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{activity.title}</p>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-500">
                  {user?.is_admin && selectedUser !== 'all' 
                    ? `No recent activity for ${stats?.selected_user}`
                    : 'No recent activity'
                  }
                </p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/history')}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View all activity →
              </button>
              {user?.is_admin && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/admin')}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Admin Panel →
                  </button>
                  <button
                    onClick={() => setSelectedUser('all')}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BugSubmit: React.FC = () => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess('Bug report submitted successfully!');
      setFormData({ title: '', description: '' });
      
      // Navigate to results or dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError('Failed to submit bug report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Submit Bug Report</h1>
      
      <div className="card max-w-2xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Bug Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the bug"
              maxLength={200}
            />
            <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 characters</p>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Bug Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detailed description of the bug, including steps to reproduce, expected behavior, and actual behavior..."
              maxLength={2000}
            />
            <p className="text-sm text-gray-500 mt-1">{formData.description.length}/2000 characters</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  AI-Powered Duplicate Detection
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Our system will automatically check for similar bug reports and suggest potential duplicates to help improve efficiency.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Bug Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const SubmissionHistory: React.FC = () => {
  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('all');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  React.useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock data - different data based on user role
        const allSubmissions = [
          {
            id: 1,
            title: 'Login form validation error',
            description: 'Form validation not working correctly when submitting empty fields. The error messages are not displayed properly.',
            status: 'resolved',
            priority: 'high',
            similar_count: 3,
            feedback_helpful: true,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-16T14:20:00Z',
            user_id: 1,
            username: 'john.doe',
            user_email: 'john.doe@example.com'
          },
          {
            id: 2,
            title: 'Navigation menu overlap on mobile',
            description: 'The navigation menu overlaps with content on mobile devices when the screen size is below 768px.',
            status: 'in-review',
            priority: 'medium',
            similar_count: 1,
            feedback_helpful: null,
            created_at: '2024-01-12T15:45:00Z',
            updated_at: '2024-01-13T09:10:00Z',
            user_id: 1,
            username: 'john.doe',
            user_email: 'john.doe@example.com'
          },
          {
            id: 3,
            title: 'Data export functionality broken',
            description: 'Users cannot export data to CSV format. The download button does not respond and no error message is shown.',
            status: 'pending',
            priority: 'high',
            similar_count: 0,
            feedback_helpful: null,
            created_at: '2024-01-10T11:20:00Z',
            updated_at: '2024-01-10T11:20:00Z',
            user_id: 2,
            username: 'jane.smith',
            user_email: 'jane.smith@example.com'
          },
          {
            id: 4,
            title: 'Email notification settings not saving',
            description: 'Changes to email notification preferences are not being saved in the user profile settings.',
            status: 'closed',
            priority: 'low',
            similar_count: 2,
            feedback_helpful: false,
            created_at: '2024-01-08T14:15:00Z',
            updated_at: '2024-01-09T16:30:00Z',
            user_id: 3,
            username: 'bob.wilson',
            user_email: 'bob.wilson@example.com'
          },
          {
            id: 5,
            title: 'Dashboard loading performance issue',
            description: 'The dashboard takes too long to load when there are many items. Need optimization for better user experience.',
            status: 'in-review',
            priority: 'medium',
            similar_count: 1,
            feedback_helpful: null,
            created_at: '2024-01-14T16:25:00Z',
            updated_at: '2024-01-15T10:15:00Z',
            user_id: 2,
            username: 'jane.smith',
            user_email: 'jane.smith@example.com'
          }
        ];
        
        // Filter submissions based on user role
        let mockSubmissions;
        if (user?.is_admin) {
          // Admin sees all submissions
          mockSubmissions = allSubmissions;
        } else {
          // Regular user sees only their own submissions (assuming current user has ID 1)
          mockSubmissions = allSubmissions.filter(submission => submission.user_id === 1);
        }
        
        setSubmissions(mockSubmissions);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [user]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-review': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    return submission.status === filter;
  });
  
  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    'in-review': submissions.filter(s => s.status === 'in-review').length,
    resolved: submissions.filter(s => s.status === 'resolved').length,
    closed: submissions.filter(s => s.status === 'closed').length
  };
  
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Submission History</h1>
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading submissions...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submission History</h1>
          {user?.is_admin && (
            <p className="text-sm text-gray-600 mt-1">Viewing all user submissions (Admin View)</p>
          )}
        </div>
        <button
          onClick={() => navigate('/submit')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          New Submission
        </button>
      </div>
      
      {/* Status Filter */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All', count: statusCounts.all },
              { key: 'pending', label: 'Pending', count: statusCounts.pending },
              { key: 'in-review', label: 'In Review', count: statusCounts['in-review'] },
              { key: 'resolved', label: 'Resolved', count: statusCounts.resolved },
              { key: 'closed', label: 'Closed', count: statusCounts.closed }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    filter === key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Submissions List */}
      {filteredSubmissions.length > 0 ? (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <div key={submission.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getStatusColor(submission.status)
                        }`}>
                          {submission.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getPriorityColor(submission.priority)
                        }`}>
                          {submission.priority} priority
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {submission.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>ID: #{submission.id}</span>
                        <span>Created: {formatDate(submission.created_at)}</span>
                        <span>Updated: {formatDate(submission.updated_at)}</span>
                        {user?.is_admin && (
                          <span className="text-purple-600">
                            User: {submission.username}
                          </span>
                        )}
                        {submission.similar_count > 0 && (
                          <span className="text-blue-600">
                            {submission.similar_count} similar found
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      {submission.feedback_helpful !== null && (
                        <div className={`px-2 py-1 text-xs rounded-full ${
                          submission.feedback_helpful 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {submission.feedback_helpful ? 'Helpful' : 'Not Helpful'}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/results/${submission.id}`)}
                          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8c0 2.3-.96 4.377-2.509 5.866L21.414 21 20 22.414l-1.768-1.768z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === 'all' ? 'No submissions yet' : `No ${filter} submissions`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Get started by submitting your first bug report.'
                : `You don't have any ${filter} submissions at the moment.`
              }
            </p>
            {filter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => navigate('/submit')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Bug Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const SubmissionResults: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submission, setSubmission] = React.useState<any>(null);
  const [similarBugs, setSimilarBugs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);
  
  // Get submission ID from URL (you'd use react-router params in real implementation)
  const submissionId = window.location.pathname.split('/').pop();
  
  React.useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock submission data
        const mockSubmission = {
          id: submissionId,
          title: 'Login form validation error',
          description: 'Form validation not working correctly when submitting empty fields. The error messages are not displayed properly. When users try to submit the login form without filling required fields, the validation should show appropriate error messages, but currently no messages are displayed.',
          status: 'resolved',
          priority: 'high',
          similar_count: 3,
          feedback_helpful: true,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-16T14:20:00Z',
          user_id: 1,
          username: 'john.doe',
          user_email: 'john.doe@example.com',
          steps_to_reproduce: [
            'Navigate to login page',
            'Leave username and password fields empty',
            'Click the login button',
            'Observe that no error messages are shown'
          ],
          expected_behavior: 'Error messages should be displayed for empty required fields',
          actual_behavior: 'No error messages are shown, form appears to do nothing',
          browser: 'Chrome 120.0',
          os: 'Windows 11',
          device: 'Desktop'
        };
        
        // Mock similar bugs
        const mockSimilarBugs = [
          {
            id: 101,
            title: 'Form validation not working on registration page',
            description: 'Similar issue with form validation on the registration page...',
            similarity_score: 0.95,
            source: 'Internal Database',
            status: 'resolved',
            created_at: '2024-01-10',
            resolution: 'Fixed by updating validation library to v2.1'
          },
          {
            id: 102,
            title: 'Password field validation missing',
            description: 'Password field does not show validation errors...',
            similarity_score: 0.87,
            source: 'GitHub Issues',
            status: 'closed',
            created_at: '2024-01-05',
            resolution: 'Duplicate of issue #45'
          },
          {
            id: 103,
            title: 'Client-side validation broken after update',
            description: 'After the recent update, client-side validation stopped working...',
            similarity_score: 0.73,
            source: 'JIRA',
            status: 'in-progress',
            created_at: '2024-01-12',
            resolution: null
          }
        ];
        
        setSubmission(mockSubmission);
        setSimilarBugs(mockSimilarBugs);
      } catch (error) {
        console.error('Failed to fetch submission details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissionDetails();
  }, [submissionId]);
  
  const handleFeedback = async (isHelpful: boolean) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeedbackSubmitted(true);
      setSubmission({...submission, feedback_helpful: isHelpful});
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-review': case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'bg-red-100 text-red-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };
  
  const getSimilarityLabel = (score: number) => {
    if (score >= 0.8) return 'High Match';
    if (score >= 0.6) return 'Medium Match';
    return 'Low Match';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/history')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Submission Details</h1>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading submission details...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (!submission) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/history')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Submission Not Found</h1>
        </div>
        <div className="card">
          <div className="text-center py-8">
            <p className="text-gray-600">The requested submission could not be found.</p>
            <button
              onClick={() => navigate('/history')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to History
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/history')}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submission Details</h1>
          <p className="text-gray-600">ID: #{submission.id}</p>
        </div>
      </div>
      
      {/* Main Submission Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="mb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{submission.title}</h2>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      getStatusColor(submission.status)
                    }`}>
                      {submission.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      getPriorityColor(submission.priority)
                    }`}>
                      {submission.priority} priority
                    </span>
                    {user?.is_admin && (
                      <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                        User: {submission.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{submission.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Steps to Reproduce</h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    {submission.steps_to_reproduce.map((step: string, index: number) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Expected Behavior</h3>
                    <p className="text-gray-700">{submission.expected_behavior}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Actual Behavior</h3>
                    <p className="text-gray-700">{submission.actual_behavior}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Environment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Browser</p>
                      <p className="text-gray-900">{submission.browser}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Operating System</p>
                      <p className="text-gray-900">{submission.os}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Device</p>
                      <p className="text-gray-900">{submission.device}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Submitted</p>
                  <p className="text-xs text-gray-500">{formatDate(submission.created_at)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-xs text-gray-500">{formatDate(submission.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                📧 Email Updates
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                🔗 Copy Link
              </button>
              {user?.is_admin && (
                <>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                    ✏️ Edit Status
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                    👤 Contact User
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Feedback */}
          {!feedbackSubmitted && submission.feedback_helpful === null && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Was this helpful?</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleFeedback(true)}
                  className="flex-1 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                >
                  👎 No
                </button>
              </div>
            </div>
          )}
          
          {feedbackSubmitted && (
            <div className="card">
              <div className="text-center py-4">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-sm text-gray-600">Thank you for your feedback!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Similar Bugs */}
      {similarBugs.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Bug Reports ({similarBugs.length} found)</h2>
          <div className="space-y-4">
            {similarBugs.map((bug) => (
              <div key={bug.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{bug.title}</h3>
                        <p className="text-gray-600 mb-3">{bug.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Source: {bug.source}</span>
                          <span>Created: {bug.created_at}</span>
                          <span>ID: #{bug.id}</span>
                        </div>
                        {bug.resolution && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800"><strong>Resolution:</strong> {bug.resolution}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getSimilarityColor(bug.similarity_score)
                        }`}>
                          {getSimilarityLabel(bug.similarity_score)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(bug.similarity_score * 100)}% match
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          getStatusColor(bug.status)
                        }`}>
                          {bug.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Search: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock search results
      const mockResults = [
        {
          id: 1,
          title: 'Login form validation error',
          description: 'Form validation not working correctly when submitting empty fields...',
          similarity_score: 0.95,
          source: 'GitHub Issues',
          created_at: '2024-01-15'
        },
        {
          id: 2,
          title: 'Authentication timeout issue',
          description: 'Users getting logged out unexpectedly after short periods of inactivity...',
          similarity_score: 0.78,
          source: 'JIRA',
          created_at: '2024-01-10'
        },
        {
          id: 3,
          title: 'Form input field styling broken',
          description: 'CSS styles not applying correctly to form input fields on mobile devices...',
          similarity_score: 0.65,
          source: 'Bugzilla',
          created_at: '2024-01-08'
        }
      ].filter(bug => 
        bug.title.toLowerCase().includes(query.toLowerCase()) ||
        bug.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'bg-red-100 text-red-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };
  
  const getSimilarityLabel = (score: number) => {
    if (score >= 0.8) return 'High Match';
    if (score >= 0.6) return 'Medium Match';
    return 'Low Match';
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Bugs</h1>
      
      {/* Search Form */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search for similar bug reports
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter keywords, bug description, or error messages..."
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Tip: Use specific keywords or error messages for better results
            </p>
          </div>
        </form>
      </div>
      
      {/* Search Results */}
      {hasSearched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Search Results
              {results.length > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({results.length} {results.length === 1 ? 'result' : 'results'})
                </span>
              )}
            </h2>
          </div>
          
          {loading ? (
            <div className="card">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Searching...</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((bug) => (
                <div key={bug.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {bug.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {bug.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Source: {bug.source}</span>
                            <span>Created: {bug.created_at}</span>
                            <span>ID: #{bug.id}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getSimilarityColor(bug.similarity_score)
                          }`}>
                            {getSimilarityLabel(bug.similarity_score)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round(bug.similarity_score * 100)}% match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8c0 2.3-.96 4.377-2.509 5.866L21.414 21 20 22.414l-1.768-1.768z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try different keywords or check your spelling
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Search Tips */}
      {!hasSearched && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Search Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use specific error messages or keywords</li>
            <li>• Include component or feature names</li>
            <li>• Try different variations of your search terms</li>
            <li>• Search results are ranked by similarity</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// Export imported admin components as named exports
export { default as DatasetUpload } from './admin/DatasetUpload';
export { default as ModelManagement } from './admin/ModelManagement';
export { default as UserManagement } from './admin/UserManagement';
export { default as SystemLogs } from './admin/SystemLogs';

// Admin components
export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = React.useState({
    total_users: 0,
    total_submissions: 0,
    total_bug_reports: 0,
    active_models: 0,
    processing_uploads: 0
  });
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock admin stats
        setStats({
          total_users: 156,
          total_submissions: 1247,
          total_bug_reports: 8932,
          active_models: 3,
          processing_uploads: 2
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const adminActions = [
    {
      title: 'Dataset Upload',
      description: 'Upload and manage training datasets for ML models',
      icon: '📁',
      action: () => navigate('/admin/upload'),
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Model Management',
      description: 'Train, deploy, and manage ML models',
      icon: '🤖',
      action: () => navigate('/admin/model'),
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: '👥',
      action: () => navigate('/admin/users'),
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'System Logs',
      description: 'View system logs and error reports',
      icon: '📋',
      action: () => navigate('/admin/logs'),
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    }
  ];
  
  const recentActivity = [
    { action: 'New user registered', details: 'john.doe@example.com', time: '5 minutes ago', type: 'user' },
    { action: 'Dataset uploaded', details: 'stackoverflow_bugs_2024.csv (2.3MB)', time: '1 hour ago', type: 'dataset' },
    { action: 'Model training completed', details: 'Bug Similarity Model v2.1', time: '2 hours ago', type: 'model' },
    { action: 'High-priority bug submitted', details: 'Database connection timeout', time: '4 hours ago', type: 'bug' },
    { action: 'User feedback received', details: 'Similarity results marked as helpful', time: '6 hours ago', type: 'feedback' }
  ];
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return '👤';
      case 'dataset': return '📁';
      case 'model': return '🤖';
      case 'bug': return '🐛';
      case 'feedback': return '💬';
      default: return '📌';
    }
  };
  
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'dataset': return 'bg-green-100 text-green-800';
      case 'model': return 'bg-purple-100 text-purple-800';
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feedback': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading admin dashboard...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.first_name}! Here's your system overview.</p>
      </div>
      
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_users.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12 this week</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_submissions.toLocaleString()}</p>
              <p className="text-sm text-green-600">+89 this week</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8c0 2.3-.96 4.377-2.509 5.866L21.414 21 20 22.414l-1.768-1.768z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bug Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_bug_reports.toLocaleString()}</p>
              <p className="text-sm text-blue-600">Database size</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Models</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active_models}</p>
              <p className="text-sm text-green-600">All healthy</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.processing_uploads}</p>
              <p className="text-sm text-yellow-600">Uploads in queue</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminActions.map((action, index) => (
            <div
              key={index}
              onClick={action.action}
              className={`card cursor-pointer transition-colors duration-200 ${action.color}`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{action.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent System Activity</h2>
        <div className="card">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      getActivityColor(activity.type)
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => navigate('/admin/logs')}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View all system logs →
              </button>
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate('/admin/logs')}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Export Logs
                </button>
                <button 
                  onClick={() => navigate('/admin/logs')}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  System Health Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Default exports for individual components
const pages = {
  Home,
  Login,
  Register,
  Dashboard,
  BugSubmit,
  SubmissionHistory,
  SubmissionResults,
  Search,
  AdminDashboard,
  DatasetUpload,
  ModelManagement,
};

export default pages;
