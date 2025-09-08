import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white text-xl font-bold">
            Bug-Sleuth
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-primary-200">
                  Dashboard
                </Link>
                <Link to="/submit" className="text-white hover:text-primary-200">
                  Submit Bug
                </Link>
                <Link to="/history" className="text-white hover:text-primary-200">
                  History
                </Link>
                <Link to="/search" className="text-white hover:text-primary-200">
                  Search
                </Link>
                {user.is_admin && (
                  <Link to="/admin" className="text-white hover:text-primary-200">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-primary-200">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-700 hover:bg-primary-800 text-white px-3 py-1 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
