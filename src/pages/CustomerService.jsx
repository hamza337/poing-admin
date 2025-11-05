import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  Filter, 
  Star, 
  Archive, 
  Trash2, 
  Reply, 
  Forward, 
  MoreHorizontal,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Send,
  Paperclip,
  Eye,
  EyeOff
} from 'lucide-react';

const CustomerService = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const emailsPerPage = 10;

  // Mock email data
  const emails = [
    {
      id: 1,
      from: 'john.doe@email.com',
      name: 'John Doe',
      subject: 'Unable to reset password',
      preview: 'I have been trying to reset my password for the past hour but the reset link is not working...',
      content: 'Hello Support Team,\n\nI have been trying to reset my password for the past hour but the reset link is not working. Every time I click on it, it says the link has expired even though I just received the email. Can you please help me with this issue?\n\nMy username is: johndoe123\n\nThank you for your assistance.\n\nBest regards,\nJohn Doe',
      timestamp: '2024-01-15 10:30 AM',
      status: 'new',
      priority: 'medium',
      category: 'Account Issues',
      isRead: false,
      isStarred: false
    },
    {
      id: 2,
      from: 'sarah.wilson@email.com',
      name: 'Sarah Wilson',
      subject: 'Payment not processed',
      preview: 'My payment was declined but the money was deducted from my account. Transaction ID: TXN123456...',
      content: 'Dear Support,\n\nI made a payment yesterday for my subscription but it shows as declined in your system. However, the money has been deducted from my bank account.\n\nTransaction ID: TXN123456\nAmount: $29.99\nDate: January 14, 2024\n\nPlease investigate this issue and either process my subscription or refund the amount.\n\nThank you,\nSarah Wilson',
      timestamp: '2024-01-15 09:15 AM',
      status: 'in-progress',
      priority: 'high',
      category: 'Billing',
      isRead: true,
      isStarred: true
    },
    {
      id: 3,
      from: 'mike.chen@email.com',
      name: 'Mike Chen',
      subject: 'Feature request: Dark mode',
      preview: 'Would it be possible to add a dark mode option to the application? Many users would appreciate...',
      content: 'Hi there,\n\nI love using your application, but I spend long hours working and would really appreciate a dark mode option. Many users in the community forums have been asking for this feature.\n\nWould it be possible to add this to your roadmap?\n\nThanks for considering this request!\n\nBest,\nMike Chen',
      timestamp: '2024-01-15 08:45 AM',
      status: 'resolved',
      priority: 'low',
      category: 'Feature Request',
      isRead: true,
      isStarred: false
    },
    {
      id: 4,
      from: 'emma.taylor@email.com',
      name: 'Emma Taylor',
      subject: 'Data export not working',
      preview: 'I am trying to export my data but the download keeps failing. Error message: "Export timeout"...',
      content: 'Hello Support Team,\n\nI am trying to export my data from the platform but the download keeps failing after about 30 seconds. The error message says "Export timeout".\n\nI have tried multiple times and from different browsers (Chrome, Firefox, Safari) but the issue persists.\n\nCan you please help me export my data? I need it for my records.\n\nRegards,\nEmma Taylor',
      timestamp: '2024-01-15 07:20 AM',
      status: 'new',
      priority: 'medium',
      category: 'Technical Issue',
      isRead: false,
      isStarred: false
    },
    {
      id: 5,
      from: 'alex.rodriguez@email.com',
      name: 'Alex Rodriguez',
      subject: 'Account suspended without notice',
      preview: 'My account was suspended this morning without any prior notice or explanation. I need urgent help...',
      content: 'Dear Support,\n\nI logged into my account this morning and found that it has been suspended. I did not receive any prior notice or explanation for this action.\n\nI have been a loyal customer for over 2 years and have never violated any terms of service. This suspension is affecting my business operations.\n\nPlease investigate this matter urgently and restore my account access.\n\nAccount email: alex.rodriguez@email.com\nCustomer ID: CUST789012\n\nUrgent response needed.\n\nAlex Rodriguez',
      timestamp: '2024-01-15 06:55 AM',
      status: 'in-progress',
      priority: 'high',
      category: 'Account Issues',
      isRead: true,
      isStarred: true
    },
    {
      id: 6,
      from: 'lisa.brown@email.com',
      name: 'Lisa Brown',
      subject: 'Mobile app crashes on startup',
      preview: 'The mobile app keeps crashing every time I try to open it. This started after the latest update...',
      content: 'Hi Support,\n\nThe mobile app has been crashing consistently since the latest update. Every time I try to open it, it shows the splash screen for a few seconds and then crashes.\n\nDevice: iPhone 14 Pro\niOS Version: 17.2\nApp Version: 3.2.1\n\nI have tried restarting my phone and reinstalling the app, but the issue persists.\n\nPlease help resolve this issue.\n\nThanks,\nLisa Brown',
      timestamp: '2024-01-14 11:30 PM',
      status: 'resolved',
      priority: 'medium',
      category: 'Technical Issue',
      isRead: true,
      isStarred: false
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, text: 'New' },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'In Progress' },
      'resolved': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Resolved' }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${priorityConfig[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.from.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);
  const startIndex = (currentPage - 1) * emailsPerPage;
  const paginatedEmails = filteredEmails.slice(startIndex, startIndex + emailsPerPage);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setShowReplyForm(false);
  };

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleSendReply = () => {
    // Here you would typically send the reply to your backend
    console.log('Sending reply:', replyText);
    setReplyText('');
    setShowReplyForm(false);
    // You could also update the email status to 'resolved' or 'in-progress'
  };

  const stats = {
    total: emails.length,
    new: emails.filter(e => e.status === 'new').length,
    inProgress: emails.filter(e => e.status === 'in-progress').length,
    resolved: emails.filter(e => e.status === 'resolved').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Service</h1>
        <p className="text-gray-600">Manage customer support emails and help requests.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Emails</p>
              <p className="text-2xl font-bold" style={{color: '#0a9bf7'}}>{stats.total}</p>
            </div>
            <div className="p-3 rounded-full text-white" style={{backgroundColor: '#0a9bf7'}}>
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Requests</p>
              <p className="text-2xl font-bold text-orange-600">{stats.new}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Email Management Interface */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex h-[600px]">
          {/* Email List Panel */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Search and Filter Header */}
            <div className="p-4 border-b border-gray-200 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#0a9bf7'}}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:border-transparent"
                  style={{'--tw-ring-color': '#0a9bf7'}}
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto">
              {paginatedEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedEmail?.id === email.id ? 'border-blue-200' : ''
                  } ${!email.isRead ? 'bg-blue-25' : ''}`}
                  style={selectedEmail?.id === email.id ? {backgroundColor: '#e6f3ff'} : {}}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${!email.isRead ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                          {email.name}
                        </span>
                      </div>
                      {email.isStarred && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(email.priority)}
                      <span className="text-xs text-gray-500">{email.timestamp}</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className={`text-sm ${!email.isRead ? 'font-semibold' : 'font-medium'} text-gray-900 mb-1`}>
                      {email.subject}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{email.preview}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(email.status)}
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {email.category}
                      </span>
                    </div>
                    {!email.isRead && (
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#0a9bf7'}}></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Email Detail Panel */}
          <div className="w-1/2 flex flex-col">
            {selectedEmail ? (
              <>
                {/* Email Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">{selectedEmail.subject}</h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>From: {selectedEmail.name} ({selectedEmail.from})</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusBadge(selectedEmail.status)}
                        {getPriorityBadge(selectedEmail.priority)}
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {selectedEmail.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Star className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Archive className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleReply}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{backgroundColor: '#0a9bf7', '--tw-ring-color': '#0a9bf7'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#065a87'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#0a9bf7'}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2" style={{'--tw-ring-color': '#0a9bf7'}}>
                      <Forward className="h-4 w-4 mr-1" />
                      Forward
                    </button>
                  </div>
                </div>

                {/* Email Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedEmail.content}
                    </div>
                  </div>
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reply to {selectedEmail.name}
                      </label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent"
                        style={{'--tw-ring-color': '#0a9bf7'}}
                        placeholder="Type your reply here..."
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                          <Paperclip className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowReplyForm(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{'--tw-ring-color': '#0a9bf7'}}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{backgroundColor: '#0a9bf7', '--tw-ring-color': '#0a9bf7'}}
                          onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#065a87')}
                          onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#0a9bf7')}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Select an Email</h3>
                  <p className="text-gray-500">Choose an email from the list to view its content and reply</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;