import React, { useEffect, useState } from 'react';
import { 
  Reply,
  User,
  MessageSquare,
  Send
} from 'lucide-react';

const CustomerService = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  // Removed status filter per request
  const [currentPage, setCurrentPage] = useState(1);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeText, setComposeText] = useState('');
  const emailsPerPage = 5;
  // Inbox messages state and network flags
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [totalCount, setTotalCount] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL ;

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const sanitizeEmailHtml = (rawHtml) => {
    if (!rawHtml) return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');
      // Remove style/script/head/link/meta/base tags
      [...doc.querySelectorAll('script, style, head, link, meta, base')].forEach((el) => el.remove());
      // Remove inline event handlers and inline styles
      [...doc.querySelectorAll('*')].forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (/^on/i.test(attr.name) || attr.name === 'style') {
            el.removeAttribute(attr.name);
          }
        });
        if (el.tagName.toLowerCase() === 'a') {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      });
      return doc.body ? doc.body.innerHTML : doc.documentElement.innerHTML;
    } catch {
      return rawHtml;
    }
  };

  const formatTimestamp = (dateValue) => {
    try {
      const d = dateValue ? new Date(dateValue) : new Date();
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric' };
      return d.toLocaleString(undefined, options);
    } catch {
      return String(dateValue || '');
    }
  };

  // Extract plain email address from various "from" formats
  const extractEmailAddress = (fromValue) => {
    if (!fromValue) return '';
    // If object with email field
    if (typeof fromValue === 'object' && fromValue.email) return String(fromValue.email).trim();
    const str = String(fromValue).trim();
    // Angle bracket format: "Name" <email@domain>
    const angleMatch = str.match(/<([^>]+)>/);
    if (angleMatch && angleMatch[1]) return angleMatch[1].trim();
    // Generic email pattern anywhere in the string
    const emailMatch = str.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch && emailMatch[0]) return emailMatch[0].trim();
    return str; // fallback
  };

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('admin-auth-token');
        const res = await fetch(`${baseUrl}/inbox/messages?page=${currentPage}&limit=${emailsPerPage}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to load messages (${res.status})`);
        }
        const data = await res.json();
        const normalized = Array.isArray(data) ? data : (Array.isArray(data?.messages) ? data.messages : []);
        const prepared = normalized.map((msg, idx) => ({
          id: msg.id || msg._id || idx + 1,
          from: (msg.from?.email) || msg.from || msg.sender || 'unknown@unknown',
          name: (msg.from?.name) || msg.name || msg.senderName || (msg.from || 'Unknown'),
          subject: msg.subject || '(no subject)',
          preview: stripHtml(msg.html || msg.text || '').slice(0, 140),
          html: sanitizeEmailHtml(msg.html || msg.text || ''),
          timestamp: formatTimestamp(msg.createdAt || msg.date || msg.timestamp),
          status: msg.status || 'new',
          priority: msg.priority || 'medium',
          category: msg.category || 'Inbox',
          isRead: !!msg.isRead,
          isStarred: !!msg.isStarred,
        }));
        setEmails(prepared);
        // derive pagination info if available
        const total = (typeof data?.total === 'number' ? data.total : (typeof data?.pagination?.total === 'number' ? data.pagination.total : null));
        setTotalCount(total);
        setHasNextPage(total != null ? (currentPage * emailsPerPage) < total : (normalized.length === emailsPerPage));
      } catch (err) {
        console.error('Error fetching inbox messages:', err);
        setError(err.message || 'Error fetching inbox messages');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [baseUrl, currentPage, emailsPerPage]);

  // Status and priority badges removed per request

  const filteredEmails = emails;
  const totalPages = totalCount != null ? Math.ceil(totalCount / emailsPerPage) : null;
  const paginatedEmails = filteredEmails;

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setShowReplyForm(false);
    setShowComposeForm(false);
  };

  const handleReply = () => {
    setShowReplyForm(true);
    setShowComposeForm(false);
  };

  const handleCompose = () => {
    setSelectedEmail(null);
    setShowReplyForm(false);
    setShowComposeForm(true);
  };

  const handleSendReply = async () => {
    if (!selectedEmail || !replyText.trim()) return;
    setSending(true);
    try {
      const token = localStorage.getItem('admin-auth-token');
      const payload = {
        to: extractEmailAddress(selectedEmail.from),
        subject: `Re: ${selectedEmail.subject}`,
        html: replyText,
      };
      const res = await fetch(`${baseUrl}/inbox/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to send email (${res.status})`);
      }
      setReplyText('');
      setShowReplyForm(false);
    } catch (err) {
      console.error('Error sending email:', err);
      alert(`Failed to send email: ${err.message || err}`);
    } finally {
      setSending(false);
    }
  };

  const handleSendCompose = async () => {
    const toEmail = extractEmailAddress(composeTo);
    if (!toEmail || !composeSubject.trim() || !composeText.trim()) return;
    setSending(true);
    try {
      const token = localStorage.getItem('admin-auth-token');
      const payload = {
        to: toEmail,
        subject: composeSubject.trim(),
        html: composeText,
      };
      const res = await fetch(`${baseUrl}/inbox/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to send email (${res.status})`);
      }
      setComposeTo('');
      setComposeSubject('');
      setComposeText('');
      setShowComposeForm(false);
    } catch (err) {
      console.error('Error sending email:', err);
      alert(`Failed to send email: ${err.message || err}`);
    } finally {
      setSending(false);
    }
  };

  // Removed stats calculation per request

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Service</h1>
        <p className="text-gray-600">Manage customer support emails and help requests.</p>
      </div>

      {/* Stats cards removed per request */}

      {/* Email Management Interface */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex h-[600px]">
          {/* Email List Panel */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* List Header with Compose */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">Inbox</div>
              <button
                onClick={handleCompose}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{backgroundColor: '#0a9bf7', '--tw-ring-color': '#0a9bf7'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#065a87'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0a9bf7'}
              >
                Compose
              </button>
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="p-4 text-sm text-gray-600">Loading messages...</div>
              )}
              {error && (
                <div className="p-4 text-sm text-red-600">{error}</div>
              )}
              {!loading && !error && paginatedEmails.map((email) => (
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
                      {/* Removed star indicator */}
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Priority badge removed */}
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
                      {/* Status badge removed */}
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
            {(totalPages ? totalPages > 1 : emails.length > 0) && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage}{totalPages ? ` of ${totalPages}` : ''}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={Boolean(totalPages ? (currentPage === totalPages) : !hasNextPage)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Email Detail Panel */}
          <div className="w-1/2 flex flex-col">
            {showComposeForm ? (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Email</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="text"
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      placeholder="Subject"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={composeText}
                      onChange={(e) => setComposeText(e.target.value)}
                      rows="8"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                      placeholder="Type your message (HTML supported)"
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setShowComposeForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{'--tw-ring-color': '#0a9bf7'}}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendCompose}
                      disabled={!composeTo.trim() || !composeSubject.trim() || !composeText.trim() || sending}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{backgroundColor: '#0a9bf7', '--tw-ring-color': '#0a9bf7'}}
                      onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#065a87')}
                      onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#0a9bf7')}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {sending ? 'Sending…' : 'Send Email'}
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedEmail ? (
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
                        {/* Status and priority badges removed */}
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {selectedEmail.category}
                        </span>
                      </div>
                    </div>
                    {/* Removed unused header action buttons (star, archive, delete, options) */}
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
                    {/* Removed Forward button */}
                  </div>
                </div>

                {/* Email Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="prose max-w-none">
                      <div className="email-html-content text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedEmail.html || '' }} />
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
                      {/* Removed Paperclip attachment button */}
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
                          disabled={!replyText.trim() || sending}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{backgroundColor: '#0a9bf7', '--tw-ring-color': '#0a9bf7'}}
                          onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#065a87')}
                          onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#0a9bf7')}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          {sending ? 'Sending…' : 'Send Reply'}
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