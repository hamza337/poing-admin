import React, { useState, useEffect } from 'react';
import { FileText, AlertTriangle, CheckCircle, Clock, Search, Filter, Eye, MoreVertical, Flag, X, Globe, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportsComplaints = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [emailLogsLoading, setEmailLogsLoading] = useState(false);
  const [emailLogsPagination, setEmailLogsPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('reporter');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const appUrl = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    } else if (activeTab === 'email-logs') {
      fetchEmailLogs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'email-logs') {
      fetchEmailLogs();
    }
  }, [emailLogsPagination.page]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.relative')) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/reports`);
      
      if (response.ok) {
        const data = await response.json();
        setReports(data || []);
      } else {
        console.error('Failed to fetch reports');
        toast.error('Failed to load reports');
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailLogs = async () => {
    try {
      setEmailLogsLoading(true);
      const response = await fetch(`${baseUrl}/admin/email-logs?page=${emailLogsPagination.page}&limit=${emailLogsPagination.limit}`);
      
      if (response.ok) {
        const data = await response.json();
        setEmailLogs(data.logs || []);
        setEmailLogsPagination(prev => ({
          ...prev,
          total: data.total || 0,
          totalPages: data.totalPages || 0
        }));
      } else {
        console.error('Failed to fetch email logs');
        toast.error('Failed to load email logs');
        setEmailLogs([]);
      }
    } catch (error) {
      console.error('Error fetching email logs:', error);
      toast.error('Failed to load email logs');
      setEmailLogs([]);
    } finally {
      setEmailLogsLoading(false);
    }
  };

  const markAsIrrelevant = async (reportId) => {
    try {
      const response = await fetch(`${baseUrl}/admin/reports/${reportId}/irrelevant`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        toast.success('Report marked as irrelevant');
        fetchReports(); // Refresh the reports list
      } else {
        toast.error('Failed to mark report as irrelevant');
      }
    } catch (error) {
      console.error('Error marking report as irrelevant:', error);
      toast.error('Error processing request');
    }
    setDropdownOpen(null);
  };

  const handleSuspendUser = (report) => {
    // Check if user is already suspended
    if (report.user?.status === 'suspended') {
      toast.error('This user is already suspended');
      setDropdownOpen(null);
      return;
    }
    setSelectedReport(report);
    setShowSuspendModal(true);
    setDropdownOpen(null);
  };

  const handleBlockUser = (report) => {
    // Check if user is already blocked
    if (report.user?.status === 'blocked') {
      toast.error('This user is already blocked');
      setDropdownOpen(null);
      return;
    }
    setSelectedReport(report);
    setShowBlockModal(true);
    setDropdownOpen(null);
  };

  const handleDeletePost = async (reportId) => {
    try {
      const response = await fetch(`${baseUrl}/admin/reports/${reportId}/delete-event`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        toast.success('Post deleted successfully');
        fetchReports(); // Refresh the reports list
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error deleting post');
    }
    setDropdownOpen(null);
  };

  const handleSendEmail = (report) => {
    setSelectedReport(report);
    setEmailRecipient('reporter');
    setEmailSubject('Important Notice - Report Filed Against Your Account');
    setEmailMessage('Dear User,\n\nWe are writing to inform you that a report has been filed regarding your recent activity. After careful review:\n\n- We have investigated the claims\n- Reviewed all available evidence\n- Determined appropriate next steps\n\nPlease ensure future activities comply with our community guidelines.\n\nRegards,\nReport Management Team');
    setShowEmailModal(true);
    setDropdownOpen(null);
  };

  const sendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const endpoint = emailRecipient === 'reporter' 
        ? `${baseUrl}/admin/reports/${selectedReport.id}/send-email-to-reporter`
        : `${baseUrl}/admin/reports/${selectedReport.id}/send-email-to-accuser`;
      
      const recipientEmail = emailRecipient === 'reporter' 
        ? selectedReport.user?.email
        : selectedReport.event?.seller?.email;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: recipientEmail,
          subject: emailSubject,
          message: emailMessage
        })
      });

      if (response.ok) {
        toast.success(`Email sent successfully to ${emailRecipient}`);
        setShowEmailModal(false);
        setEmailSubject('');
        setEmailMessage('');
      } else {
        toast.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending email');
    }
  };

  // Handle suspend user API call
  const handleSuspendUserAPI = async (suspendUntil) => {
    try {
      const response = await fetch(`${baseUrl}/admin/reports/${selectedReport.id}/suspend`, {
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
        fetchReports(); // Refresh the reports list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to suspend user');
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('An error occurred while suspending user');
    }
  };

  // Handle block user API call
  const handleBlockUserAPI = async () => {
    try {
      const response = await fetch(`${baseUrl}/admin/reports/${selectedReport.id}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('User blocked successfully');
        setShowBlockModal(false);
        fetchReports(); // Refresh the reports list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('An error occurred while blocking user');
    }
  };

  const reportsPerPage = 5;
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      (report.user?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.user?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.event?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.customMessage || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || (report.status || '').toLowerCase().replace(' ', '') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const currentReports = filteredReports.slice(startIndex, startIndex + reportsPerPage);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Fake':
      case 'Spam':
      case 'False Information':
        return <Flag className="h-4 w-4 text-red-500" />;
      case 'Harassment':
      case 'Hate Speech':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Intellectual Property':
        return <FileText className="h-4 w-4" style={{color: '#0a9bf7'}} />;
      case 'Inappropriate Content':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Flag className="h-4 w-4 text-gray-500" />;
    }
  };

  // Calculate stats
  const pendingCount = reports.filter(r => (r.status || '').toLowerCase() === 'pending').length;
  const urgentCount = reports.filter(r => (r.status || '').toLowerCase() === 'pending').length; // Using pending as urgent for now
  const resolvedCount = reports.filter(r => (r.status || '').toLowerCase() === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reports & Complaints</h1>
        <p className="text-gray-600">Monitor and manage user reports against posts and content.</p>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('email-logs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'email-logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email Logs
            </button>
          </nav>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reports</p>
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent Issues</p>
              <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Reports Tab Content */}
      {activeTab === 'reports' && (
        <>
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search reports by reporter, event, category, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#0a9bf7'}}
                />
              </div>
            </div>
          </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accused</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-500">Loading reports...</p>
                    </div>
                  </td>
                </tr>
              ) : currentReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Flag className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 text-lg font-medium mb-2">No reports found</p>
                      <p className="text-gray-400">There are no reports matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {(report.user?.firstName || '') + ' ' + (report.user?.lastName || '')}
                        </div>
                        <div className="text-sm text-gray-500">{report.user?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {(report.event?.seller?.firstName || '') + ' ' + (report.event?.seller?.lastName || '')}
                        </div>
                        <div className="text-sm text-gray-500">{report.event?.seller?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCategoryIcon(report.category)}
                        <span className="ml-2 text-sm text-gray-900">{report.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={report.customMessage}>
                         {report.customMessage || '_'}
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        (report.status || '').toLowerCase() === 'resolved' 
                          ? 'bg-green-100 text-green-800'
                          : (report.status || '').toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          className="text-sm font-medium" 
                          style={{color: '#0a9bf7'}} 
                          onMouseEnter={(e) => e.target.style.color = '#065a8a'} 
                          onMouseLeave={(e) => e.target.style.color = '#0a9bf7'}
                          onClick={() => {
                            setSelectedReport(report);
                            setCurrentMediaIndex(0);
                            setShowDetailModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button 
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            onClick={() => setDropdownOpen(dropdownOpen === report.id ? null : report.id)}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          
                          {dropdownOpen === report.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => markAsIrrelevant(report.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Mark as Irrelevant
                                </button>
                                <button
                                  onClick={() => handleSuspendUser(report)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Suspend User
                                </button>
                                <button
                                onClick={() => handleBlockUser(report)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Block User
                              </button>
                              <button
                                onClick={() => handleDeletePost(report.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Delete Post
                              </button>
                              <button
                                onClick={() => handleSendEmail(report)}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                              >
                                Send Email
                              </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(startIndex + reportsPerPage, filteredReports.length)}</span> of{' '}
                <span className="font-medium">{filteredReports.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? 'z-10 text-white'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                    style={currentPage === index + 1 ? {backgroundColor: '#0a9bf7', borderColor: '#0a9bf7'} : {}}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Email Logs Tab */}
      {activeTab === 'email-logs' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Sent</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailLogsLoading ? (
                   <tr>
                     <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Loading email logs...</p>
                      </div>
                    </td>
                  </tr>
                ) : emailLogs.length === 0 ? (
                   <tr>
                     <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Mail className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg font-medium mb-2">No email logs found</p>
                        <p className="text-gray-400">There are no email logs to display.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">#{log.reportId?.substring(0, 8)}...</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">
                           {new Date(log.sentAt || log.createdAt).toLocaleDateString()}
                         </div>
                         <div className="text-sm text-gray-500">
                           {new Date(log.sentAt || log.createdAt).toLocaleTimeString()}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">{log.recipientEmail}</div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={log.subject}>
                            {log.subject}
                          </div>
                        </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Email Logs Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setEmailLogsPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={emailLogsPagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setEmailLogsPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                disabled={emailLogsPagination.page === emailLogsPagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((emailLogsPagination.page - 1) * emailLogsPagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(emailLogsPagination.page * emailLogsPagination.limit, emailLogsPagination.total)}</span> of{' '}
                  <span className="font-medium">{emailLogsPagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setEmailLogsPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={emailLogsPagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(emailLogsPagination.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setEmailLogsPagination(prev => ({ ...prev, page: index + 1 }))}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        emailLogsPagination.page === index + 1
                          ? 'z-10 text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                      style={emailLogsPagination.page === index + 1 ? {backgroundColor: '#0a9bf7', borderColor: '#0a9bf7'} : {}}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setEmailLogsPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                    disabled={emailLogsPagination.page === emailLogsPagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-200 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Report Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Report Information */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Report Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Category:</span>
                        <div className="flex items-center mt-1">
                          {getCategoryIcon(selectedReport.category)}
                          <span className="ml-2 text-sm text-gray-900">{selectedReport.category}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Reporter:</span>
                        <p className="text-sm text-gray-900">
                          {(selectedReport.user?.firstName || '') + ' ' + (selectedReport.user?.lastName || '')}
                        </p>
                        <p className="text-sm text-gray-500">{selectedReport.user?.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Custom Message:</span>
                        <p className="text-sm text-gray-900 mt-1">
                          {selectedReport.customMessage || '_'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Report Date:</span>
                        <p className="text-sm text-gray-900">
                          {new Date(selectedReport.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Accused Information */}
                  {selectedReport.event?.seller && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Accused User</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Name:</span>
                          <p className="text-sm text-gray-900">
                            {(selectedReport.event.seller.firstName || '') + ' ' + (selectedReport.event.seller.lastName || '')}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Email:</span>
                          <p className="text-sm text-gray-900">{selectedReport.event.seller.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Event Information */}
                  {selectedReport.event && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Event Details</h3>
                      <div className="space-y-2">
                        <div>
                        <span className="text-sm font-medium text-gray-600">Category:</span>
                        <p className="text-sm text-gray-900">{selectedReport.event.category}</p>
                      </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Listing id:</span>
                          <p className="text-sm text-gray-900">{selectedReport.event.eventCode}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Event Date:</span>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedReport.event.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Created Date:</span>
                          <p className="text-sm text-gray-900">
                            {new Date(selectedReport.event.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Free:</span>
                            <p className="text-sm text-gray-900">
                              {selectedReport.event.isFree ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Exclusive:</span>
                            <p className="text-sm text-gray-900">
                              {selectedReport.event.isExclusive ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Price:</span>
                            <p className="text-sm text-gray-900">
                              ${selectedReport.event.price || '0'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Media Slider */}
                <div className="space-y-4">
                  {selectedReport.event?.media && selectedReport.event.media.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Event Media</h3>
                      <div className="relative">
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          {selectedReport.event.media[currentMediaIndex]?.type === 'image' ? (
                            <img
                              src={selectedReport.event.media[currentMediaIndex].url}
                              alt="Event media"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={selectedReport.event.media[currentMediaIndex]?.url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        {selectedReport.event.media.length > 1 && (
                          <>
                            <button
                              onClick={() => setCurrentMediaIndex(
                                currentMediaIndex === 0 
                                  ? selectedReport.event.media.length - 1 
                                  : currentMediaIndex - 1
                              )}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              ←
                            </button>
                            <button
                              onClick={() => setCurrentMediaIndex(
                                (currentMediaIndex + 1) % selectedReport.event.media.length
                              )}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              →
                            </button>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                              {currentMediaIndex + 1} / {selectedReport.event.media.length}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* See on Map Button */}
                  {selectedReport.event?.latitude && selectedReport.event?.longitude && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Location</h3>
                      <a
                        href={`${appUrl}?eventId=${selectedReport.event.id}&lat=${selectedReport.event.latitude}&lng=${selectedReport.event.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        See on Map
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
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
                    Suspend user from report <strong className="text-gray-900">#{selectedReport?.id}</strong> until:
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

      {/* Block User Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={() => setShowBlockModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Block User</h3>
                  <button onClick={() => setShowBlockModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-5">
                  <p className="text-gray-600">
                    Are you sure you want to permanently block the user from report <strong className="text-gray-900">#{selectedReport?.id}</strong>?
                  </p>
                  <p className="text-sm text-red-600">
                    This action will prevent the user from accessing the platform and cannot be easily undone.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="w-full sm:w-auto px-4 py-2 mt-3 sm:mt-0 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockUserAPI}
                  className="w-full sm:w-auto px-4 py-2 bg-red-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Block User
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Send Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={() => setShowEmailModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Send Email</h3>
                </div>
                <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-5">
                {/* Recipient Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Send Email To
                  </label>
                  <select
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="reporter">Reporter ({selectedReport?.user?.email})</option>
                    {selectedReport?.event?.seller?.email && (
                      <option value="accuser">Accused ({selectedReport?.event?.seller?.email})</option>
                    )}
                  </select>
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email subject"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="Enter your message"
                  />
                </div>

                {/* Preview Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Email Preview:</h4>
                  <div className="text-sm text-gray-600">
                    <p><strong>To:</strong> {emailRecipient === 'reporter' ? selectedReport?.user?.email : selectedReport?.event?.seller?.email}</p>
                    <p><strong>Subject:</strong> {emailSubject || 'No subject'}</p>
                    <p><strong>Report ID:</strong> #{selectedReport?.id}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="w-full sm:w-auto px-4 py-2 mt-3 sm:mt-0 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendEmail}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsComplaints;