import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, MoreVertical, Edit, Ban, Clock, X, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateManagerModal, setShowCreateManagerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [managersLoading, setManagersLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [newManager, setNewManager] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [editUser, setEditUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    address: '',
    profilePicture: null,
    profileImageUrl: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const usersPerPage = 20;

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'managers') {
      fetchManagers();
    }
  }, [currentPage, searchTerm, activeTab]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1);
        fetchUsers();
      } else if (searchTerm === '') {
        setCurrentPage(1);
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/users?page=${currentPage}&limit=${usersPerPage}&search=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Transform API data to match component expectations and filter out report managers
        const transformedUsers = (data.users || data.data || [])
          .filter(user => user.role !== 'report_manager') // Client-side filtering
          .map(user => ({
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            country: user.country || 'N/A',
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            profileImageUrl: user.profileImageUrl || null,
            status: user.status === 'active' ? 'Active' : 
                    user.suspendedUntil ? 'Suspended' : 
                    user.status === 'blocked' ? 'Blocked' : 'Active',
            suspendedUntil: user.suspendedUntil
          }));
        
        setUsers(transformedUsers);
        setTotalUsers(transformedUsers.length);
        setTotalPages(Math.ceil(transformedUsers.length / usersPerPage));
      } else {
        console.error('Failed to fetch users');
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    setManagersLoading(true);
    try {
      const response = await fetch(`${baseUrl}/admin/users?page=${currentPage}&limit=${usersPerPage}&search=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Filter for report managers on client side
        const reportManagers = (data.users || data.data || [])
          .filter(user => user.role === 'report_manager');
        
        setManagers(reportManagers);
        setTotalUsers(reportManagers.length);
        setTotalPages(Math.ceil(reportManagers.length / usersPerPage));
      } else {
        console.error('Failed to fetch managers');
        setManagers([]);
        setTotalUsers(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      setManagers([]);
      setTotalUsers(0);
      setTotalPages(0);
    } finally {
      setManagersLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          password: newUser.password
        })
      });

      if (response.ok) {
        // Reset form and close modal
        setNewUser({ firstName: '', lastName: '', email: '', password: '' });
        setShowCreateModal(false);
        // Refresh the users list
        fetchUsers();
        toast.success('User created successfully');
      } else {
        const errorData = await response.json();
        console.error('Error creating user:', errorData);
        toast.error('Failed to create user');
      }
    } catch (error) {
      console.error('Network error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleCreateManager = async () => {
    try {
      const response = await fetch(`${baseUrl}/admin/create-report-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          email: newManager.email,
          firstName: newManager.firstName,
          lastName: newManager.lastName
        })
      });

      if (response.ok) {
        // Reset form and close modal
        setNewManager({ firstName: '', lastName: '', email: '' });
        setShowCreateManagerModal(false);
        // Refresh the managers list
        fetchManagers();
        toast.success('Manager created successfully');
      } else {
        const errorData = await response.json();
        console.error('Error creating manager:', errorData);
        toast.error('Failed to create manager');
      }
    } catch (error) {
      console.error('Network error creating manager:', error);
      toast.error('Failed to create manager');
    }
  };

  const handleEditUser = (user) => {
    setEditUser({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      country: user.country || '',
      address: user.address || '',
      profilePicture: user.profileImageUrl || null,
      profileImageUrl: user.profileImageUrl || '',
      password: '' // Don't prepopulate password as it's encrypted
    });
    setSelectedUser(user);
    setShowEditModal(true);
    setShowDropdown(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Step 1: Get presigned URL
      const presignedResponse = await fetch('https://api.dreamlandmodels.com/events/presigned-urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: [{
            fileName: file.name,
            fileType: file.type
          }]
        })
      });

      if (!presignedResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }

      const presignedData = await presignedResponse.json();
      const { url, imageUrl } = presignedData[0];

      // Step 2: Upload to S3
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (uploadResponse.status !== 200) {
        throw new Error('Failed to upload image');
      }

      // Step 3: Update local state with the image URL
      setEditUser(prev => ({ ...prev, profileImageUrl: imageUrl }));
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const updateData = {
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        phoneNumber: editUser.phone,
        country: editUser.country,
        address: editUser.address
      };

      // Include profile image URL if it was updated
      if (editUser.profileImageUrl) {
        updateData.profileImageUrl = editUser.profileImageUrl;
      }

      // Include password if it was provided
      if (editUser.password && editUser.password.trim() !== '') {
        updateData.password = editUser.password;
      }

      const response = await fetch(`${baseUrl}/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setShowEditModal(false);
        fetchUsers();
        toast.success('User updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Error updating user:', errorData);
        toast.error('Failed to update user');
      }
    } catch (error) {
      console.error('Network error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleBlockUser = async (user) => {
    try {
      const endpoint = user.status === 'Active' ? 'block' : 'activate';
      const response = await fetch(`https://api.dreamlandmodels.com/admin/users/${user.id}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const message = user.status === 'Active' ? 'User blocked successfully' : 'User activated successfully';
        toast.success(message);
        fetchUsers(); // Refresh the user list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || `Failed to ${endpoint} user`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while updating user status');
    }
    setShowDropdown(null);
  };

  const handleSuspendUser = (user) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
    setShowDropdown(null);
  };

  // Handle suspend user API call
  const handleSuspendUserAPI = async (suspendUntil) => {
    try {
      const response = await fetch(`https://api.dreamlandmodels.com/admin/users/${selectedUser.id}/suspend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ until: suspendUntil })
      });

      if (response.ok) {
        toast.success('User suspended successfully');
        setShowSuspendModal(false);
        fetchUsers(); // Refresh the user list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to suspend user');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while suspending user');
    }
  };



  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'bg-green-100 text-green-800 border border-green-200',
      'Suspended': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'Blocked': 'bg-red-100 text-red-800 border border-red-200'
    };
    const dotClasses = {
      'Active': 'bg-green-500',
      'Suspended': 'bg-yellow-500',
      'Blocked': 'bg-red-500'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusClasses[status]}`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${dotClasses[status]}`}></div>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-sm text-gray-600">Manage and monitor all user accounts</p>
          </div>
          <button 
            onClick={() => activeTab === 'users' ? setShowCreateModal(true) : setShowCreateManagerModal(true)}
            className="text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 flex items-center gap-2"
            style={{backgroundColor: '#0a9bf7', '--tw-ring-color': '#0a9bf7'}}
          >
            <Plus className="h-4 w-4" />
            {activeTab === 'users' ? 'Create User' : 'Invite Manager'}
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('users');
              setCurrentPage(1);
              setSearchTerm('');
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'users'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Platform Users
          </button>
          <button
            onClick={() => {
              setActiveTab('managers');
              setCurrentPage(1);
              setSearchTerm('');
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'managers'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Managers
          </button>
        </div>
      </div>

      {/* Platform Users Tab */}
      {activeTab === 'users' && (
        <>
          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">First Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Country</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No users found</p>
                    <p className="text-sm">Try adjusting your search criteria or create a new user.</p>
                  </td>
                </tr>
              ) : (
                // User rows
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {user.firstName || 'N/A'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.lastName || 'N/A'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email || 'N/A'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.country || 'N/A'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === user.id ? null : user.id)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-200"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {showDropdown === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                          <div className="py-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors duration-200"
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Edit User
                            </button>
                            <button
                              onClick={() => handleSuspendUser(user)}
                              className="flex items-center px-4 py-3 text-sm text-yellow-700 hover:bg-yellow-50 w-full text-left transition-colors duration-200"
                            >
                              <Clock className="h-4 w-4 mr-3" />
                              Suspend User
                            </button>
                            <button
                              onClick={() => handleBlockUser(user)}
                              className={`flex items-center px-4 py-3 text-sm w-full text-left transition-colors duration-200 ${
                                user.status === 'Active' 
                                  ? 'text-red-700 hover:bg-red-50'
                                  : 'text-green-700 hover:bg-green-50'
                              }`}
                            >
                              {user.status === 'Active' ? (
                                <Ban className="h-4 w-4 mr-3" />
                              ) : (
                                <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              {user.status === 'Active' ? 'Block User' : 'Activate User'}
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{totalUsers > 0 ? ((currentPage - 1) * usersPerPage) + 1 : 0}</span> to{' '}
                <span className="font-semibold text-gray-900">{Math.min(currentPage * usersPerPage, totalUsers)}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalUsers}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-lg shadow-sm" style={{gap: '2px'}}>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 5;
                  
                  if (totalPages <= maxVisiblePages) {
                    // Show all pages if total pages is less than or equal to max visible
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold transition-all duration-200 ${
                            currentPage === i
                              ? 'z-10 border-blue-500 text-white shadow-md'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                          style={currentPage === i ? {backgroundColor: '#0a9bf7'} : {}}
                        >
                          {i}
                        </button>
                      );
                    }
                  } else {
                    // Complex pagination with ellipsis
                    const startPage = Math.max(1, currentPage - 2);
                    const endPage = Math.min(totalPages, currentPage + 2);
                    
                    // Always show first page
                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => setCurrentPage(1)}
                          className="relative inline-flex items-center px-4 py-2 border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm font-semibold transition-all duration-200"
                        >
                          1
                        </button>
                      );
                      
                      if (startPage > 2) {
                        pages.push(
                          <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500">
                            •••
                          </span>
                        );
                      }
                    }
                    
                    // Show pages around current page
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold transition-all duration-200 ${
                            currentPage === i
                              ? 'z-10 border-blue-500 text-white shadow-md'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                          style={currentPage === i ? {backgroundColor: '#0a9bf7'} : {}}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    // Always show last page
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500">
                            •••
                          </span>
                        );
                      }
                      
                      pages.push(
                        <button
                          key={totalPages}
                          onClick={() => setCurrentPage(totalPages)}
                          className="relative inline-flex items-center px-4 py-2 border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm font-semibold transition-all duration-200"
                        >
                          {totalPages}
                        </button>
                      );
                    }
                  }
                  
                  return pages;
                })()}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
          </div>
        </>
      )}

      {/* Managers Tab */}
      {activeTab === 'managers' && (
        <>
          {/* Search */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search managers by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Managers Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">First Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {managersLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        </td>
                      </tr>
                    ))
                  ) : managers.length === 0 ? (
                    // Empty state
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">No managers found</p>
                        <p className="text-sm">Try adjusting your search criteria or invite a new manager.</p>
                      </td>
                    </tr>
                  ) : (
                    // Manager rows
                    managers.map((manager) => (
                      <tr key={manager.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {manager.firstName || 'N/A'}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                          {manager.lastName || 'N/A'}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                          {manager.email || 'N/A'}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                          Report Manager
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500 relative">
                          <button
                            onClick={() => setShowDropdown(showDropdown === manager.id ? null : manager.id)}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-200"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {showDropdown === manager.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                              <div className="py-2">
                                <button
                                  onClick={() => handleEditUser(manager)}
                                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors duration-200"
                                >
                                  <Edit className="h-4 w-4 mr-3" />
                                  Edit Manager
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{totalUsers > 0 ? ((currentPage - 1) * usersPerPage) + 1 : 0}</span> to{' '}
                    <span className="font-semibold text-gray-900">{Math.min(currentPage * usersPerPage, totalUsers)}</span> of{' '}
                    <span className="font-semibold text-gray-900">{totalUsers}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm" style={{gap: '2px'}}>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Previous
                    </button>
                    {(() => {
                      const pages = [];
                      const maxVisiblePages = 5;
                      
                      if (totalPages <= maxVisiblePages) {
                        // Show all pages if total pages is less than or equal to max visible
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold transition-all duration-200 ${
                                currentPage === i
                                  ? 'z-10 border-blue-500 text-white shadow-md'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                              style={currentPage === i ? {backgroundColor: '#0a9bf7'} : {}}
                            >
                              {i}
                            </button>
                          );
                        }
                      } else {
                        // Complex pagination with ellipsis
                        const startPage = Math.max(1, currentPage - 2);
                        const endPage = Math.min(totalPages, currentPage + 2);
                        
                        // Always show first page
                        if (startPage > 1) {
                          pages.push(
                            <button
                              key={1}
                              onClick={() => setCurrentPage(1)}
                              className="relative inline-flex items-center px-4 py-2 border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm font-semibold transition-all duration-200"
                            >
                              1
                            </button>
                          );
                          
                          if (startPage > 2) {
                            pages.push(
                              <span key="ellipsis1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500">
                                •••
                              </span>
                            );
                          }
                        }
                        
                        // Show pages around current page
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold transition-all duration-200 ${
                                currentPage === i
                                  ? 'z-10 border-blue-500 text-white shadow-md'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                              style={currentPage === i ? {backgroundColor: '#0a9bf7'} : {}}
                            >
                              {i}
                            </button>
                          );
                        }
                        
                        // Always show last page
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span key="ellipsis2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-500">
                                •••
                              </span>
                            );
                          }
                          
                          pages.push(
                            <button
                              key={totalPages}
                              onClick={() => setCurrentPage(totalPages)}
                              className="relative inline-flex items-center px-4 py-2 border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm font-semibold transition-all duration-200"
                            >
                              {totalPages}
                            </button>
                          );
                        }
                      }
                      
                      return pages;
                    })()}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Manager Modal */}
      {showCreateManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={() => setShowCreateManagerModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Invite New Manager</h3>
                <button onClick={() => setShowCreateManagerModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={newManager.firstName}
                      onChange={(e) => setNewManager({...newManager, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors text-sm"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                      onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={newManager.lastName}
                      onChange={(e) => setNewManager({...newManager, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                      onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newManager.email}
                    onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                    style={{'--tw-ring-color': '#0a9bf7'}}
                    onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> An invitation email will be sent to the manager with login credentials.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
              <button
                onClick={() => setShowCreateManagerModal(false)}
                className="w-full sm:w-auto px-4 py-2 mt-3 sm:mt-0 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{'--tw-ring-color': '#0a9bf7'}}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateManager}
                disabled={!newManager.firstName || !newManager.lastName || !newManager.email}
                className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{backgroundColor: '#0a9bf7', '--tw-ring-color': '#0a9bf7'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#065a8a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0a9bf7'}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New User</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors text-sm"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                      onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                      onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                    style={{'--tw-ring-color': '#0a9bf7'}}
                    onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                      onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-full sm:w-auto px-4 py-2 mt-3 sm:mt-0 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                style={{'--tw-ring-color': '#0a9bf7'}}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password}
                className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{backgroundColor: '#0a9bf7', '--tw-ring-color': '#0a9bf7'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#065a8a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0a9bf7'}
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white px-6 pt-4 pb-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Profile Picture Section - Only show for regular users */}
                {selectedUser?.role !== 'report_manager' && (
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mr-4 overflow-hidden flex-shrink-0">
                      <img 
                        src={editUser.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden" 
                        id="profile-upload"
                      />
                      <label 
                        htmlFor="profile-upload" 
                        className={`text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {uploadingImage ? 'Uploading...' : 'Change Picture'}
                      </label>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={editUser.firstName}
                        onChange={(e) => setEditUser({...editUser, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors text-sm"
                        style={{'--tw-ring-color': '#0a9bf7'}}
                        onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={editUser.lastName}
                        onChange={(e) => setEditUser({...editUser, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                        style={{'--tw-ring-color': '#0a9bf7'}}
                        onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                      onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                    />
                  </div>
                  {/* Show additional fields only for regular users */}
                  {selectedUser?.role !== 'report_manager' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={editUser.phone}
                          onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                          style={{'--tw-ring-color': '#0a9bf7'}}
                          onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={editUser.country}
                          onChange={(e) => setEditUser({...editUser, country: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                          style={{'--tw-ring-color': '#0a9bf7'}}
                          onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={editUser.password}
                        onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors"
                        style={{'--tw-ring-color': '#0a9bf7'}}
                        onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                        placeholder="Enter new password (leave blank to keep current)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  {/* Show address field only for regular users */}
                  {selectedUser?.role !== 'report_manager' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={editUser.address}
                        onChange={(e) => setEditUser({...editUser, address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-colors resize-none text-sm"
                        style={{'--tw-ring-color': '#0a9bf7'}}
                        onFocus={(e) => e.target.style.borderColor = '#0a9bf7'}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex flex-row justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                  style={{'--tw-ring-color': '#0a9bf7'}}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                  style={{backgroundColor: '#0a9bf7', '--tw-ring-color': '#0a9bf7'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#065a8a'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0a9bf7'}
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        )}



      {/* Suspend User Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={() => setShowSuspendModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Suspend User</h3>
                  <button onClick={() => setShowSuspendModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-5">
                  <p className="text-gray-600">
                    Suspend <strong className="text-gray-900">{selectedUser?.firstName} {selectedUser?.lastName}</strong> until:
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suspension End Date</label>
                    <input
                      type="datetime-local"
                      id="suspendUntil"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      min={new Date().toISOString().slice(0, 16)}
                      defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="w-full sm:w-auto px-4 py-2 mt-3 sm:mt-0 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const suspendUntil = document.getElementById('suspendUntil').value;
                    if (suspendUntil) {
                      const isoDate = new Date(suspendUntil).toISOString();
                      handleSuspendUserAPI(isoDate);
                    } else {
                      toast.error('Please select a suspension end date');
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-yellow-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  Suspend User
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default UserManagement;