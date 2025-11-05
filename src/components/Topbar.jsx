import React, { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';

const Topbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.email) {
          setUserEmail(user.email);
        }
        if (user.role) {
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-end">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: '#0a9bf7'}}>
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{userRole === 'report_manager' ? 'Manager' : 'Admin' }</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <button 
                  onClick={() => {
                    // Clear authentication tokens
                    localStorage.removeItem('admin-auth-token');
                    localStorage.removeItem('user');
                    // Redirect to login page
                    window.location.href = '/';
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default Topbar;