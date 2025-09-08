import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const {} = useAuth();
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('all');
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Mock user data
        const mockUsers = [
          {
            id: 1,
            username: 'john.doe',
            email: 'john.doe@example.com',
            first_name: 'John',
            last_name: 'Doe',
            is_admin: false,
            is_active: true,
            created_at: '2024-01-10T10:30:00Z',
            last_login: '2024-01-18T15:20:00Z',
            submissions_count: 12,
            status: 'active'
          },
          {
            id: 2,
            username: 'jane.smith',
            email: 'jane.smith@example.com',
            first_name: 'Jane',
            last_name: 'Smith',
            is_admin: false,
            is_active: true,
            created_at: '2024-01-08T14:15:00Z',
            last_login: '2024-01-19T09:45:00Z',
            submissions_count: 8,
            status: 'active'
          },
          {
            id: 3,
            username: 'bob.wilson',
            email: 'bob.wilson@example.com',
            first_name: 'Bob',
            last_name: 'Wilson',
            is_admin: true,
            is_active: true,
            created_at: '2024-01-05T11:20:00Z',
            last_login: '2024-01-19T10:15:00Z',
            submissions_count: 25,
            status: 'active'
          },
          {
            id: 4,
            username: 'alice.brown',
            email: 'alice.brown@example.com',
            first_name: 'Alice',
            last_name: 'Brown',
            is_admin: false,
            is_active: false,
            created_at: '2024-01-12T16:45:00Z',
            last_login: '2024-01-15T12:30:00Z',
            submissions_count: 3,
            status: 'suspended'
          },
          {
            id: 5,
            username: 'charlie.davis',
            email: 'charlie.davis@example.com',
            first_name: 'Charlie',
            last_name: 'Davis',
            is_admin: false,
            is_active: true,
            created_at: '2024-01-14T08:20:00Z',
            last_login: '2024-01-18T17:10:00Z',
            submissions_count: 6,
            status: 'active'
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserAction = async (userId: number, action: string) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user status locally
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId 
            ? { 
                ...u, 
                is_active: action === 'activate' ? true : action === 'deactivate' ? false : u.is_active,
                is_admin: action === 'promote' ? true : action === 'demote' ? false : u.is_admin,
                status: action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : u.status
              }
            : u
        )
      );
      
      console.log(`User ${userId} ${action}d successfully`);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;
    
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Bulk ${action} applied to users:`, selectedUsers);
      setSelectedUsers([]);
    } catch (error) {
      console.error(`Failed to perform bulk ${action}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = 
      filterRole === 'all' ||
      (filterRole === 'admin' && user.is_admin) ||
      (filterRole === 'user' && !user.is_admin) ||
      (filterRole === 'active' && user.is_active) ||
      (filterRole === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole;
  });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (isAdmin: boolean) => {
    return isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        </div>
        <div className="card">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading users...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins</option>
                <option value="user">Regular Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedUsers.length} selected</span>
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                Deactivate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.first_name[0]}{user.last_name[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.is_admin)}`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.submissions_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.last_login)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {user.is_active ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'deactivate')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Activate
                        </button>
                      )}
                      {user.is_admin ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'demote')}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          Demote
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'promote')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Promote
                        </button>
                      )}
                      <button
                        onClick={() => console.log('Edit user', user.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
