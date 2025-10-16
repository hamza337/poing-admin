import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Headphones,
  Shield,
  Lock,
  Settings,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get user data from localStorage
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }, []);

  const allNavigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['user','admin', 'report_manager'] // Available to all roles
    },
    {
      name: 'User Management',
      path: '/user-management',
      icon: Users,
      allowedRoles: ['user', 'admin'] // Restricted for report_manager
    },
    {
      name: 'Reports & Complaints',
      path: '/reports-complaints',
      icon: FileText,
      allowedRoles: ['user', 'admin', 'report_manager'] // Available to all roles
    },
    {
      name: 'Customer Service',
      path: '/customer-service',
      icon: Headphones,
      allowedRoles: ['user', 'admin'] // Restricted for report_manager
    },
    {
      name: 'Poing Configuration',
      path: '/poing-configuration',
      icon: Settings,
      allowedRoles: ['user', 'admin'] // Restricted for report_manager
    },
    {
      name: 'Terms & Conditions',
      path: '/terms-conditions',
      icon: Shield,
      allowedRoles: ['user', 'admin', 'report_manager'] // Available to all roles
    },
    {
      name: 'Privacy Policy',
      path: '/privacy-policy',
      icon: Lock,
      allowedRoles: ['user', 'admin', 'report_manager'] // Available to all roles
    }
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => {
    if (!user || !user.role) return true; // Show all if no user data
    return item.allowedRoles.includes(user.role);
  });

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white shadow-xl z-50 transition-[width,transform] duration-300 ease-in-out will-change-[width,transform] transform-gpu
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
            {/* Desktop collapse toggle button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden lg:flex rounded-lg bg-gray-100 hover:bg-gray-200 transition-[background-color,padding] duration-200 transform-gpu ${
                isCollapsed ? 'p-1.5' : 'p-2'
              }`}
            >
              <Menu size={isCollapsed ? 16 : 12} className="text-gray-600" />
            </button>
            
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                {/* Desktop: Show full logo */}
                <img 
                  src="/brandLogo.png" 
                  alt="Poing Admin" 
                  className="h-12 w-auto hidden sm:block"
                />
                {/* Mobile: Show PA text */}
                <div className="w-7 h-7 rounded-lg flex items-center justify-center sm:hidden" style={{background: '#0868a8'}}>
                  <span className="text-white font-bold text-xs">PA</span>
                </div>
              </div>
            )}

          </div>
          
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                        flex items-center px-3 py-3 rounded-lg transition-[background-color,color] duration-200
                        ${isActive 
                          ? 'text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                        ${isCollapsed ? 'justify-center' : 'space-x-3'}
                      `}
                      style={({ isActive }) => isActive ? { background: '#0868a8' } : {}}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <IconComponent size={20} className="flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-md bg-white shadow-md hover:bg-gray-50"
      >
        <Menu size={20} className="text-gray-600" />
      </button>
    </>
  );
};

export default Sidebar;