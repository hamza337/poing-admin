import React, { useState } from 'react';
import { 
  Shield, 
  Edit, 
  Eye, 
  Save, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  History,
  Globe,
  Users,
  Calendar,
  Download,
  Upload,
  Trash2,
  MoreHorizontal,
  X,
  Check,
  Lock,
  Unlock,
  AlertCircle,
  Info
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('current');
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState(`# Privacy Policy

## 1. Information We Collect

### 1.1 Personal Information
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.

**Types of personal information we may collect include:**
- Name and contact information (email address, phone number)
- Account credentials (username, password)
- Profile information (bio, profile picture)
- Payment information (credit card details, billing address)
- Communication preferences

### 1.2 Automatically Collected Information
We automatically collect certain information when you use our platform:
- Device information (IP address, browser type, operating system)
- Usage data (pages visited, time spent, features used)
- Location information (if you enable location services)
- Cookies and similar tracking technologies

## 2. How We Use Your Information

We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices, updates, and support messages
- Respond to your comments, questions, and customer service requests
- Communicate with you about products, services, and events
- Monitor and analyze trends, usage, and activities
- Detect, investigate, and prevent fraudulent transactions
- Personalize and improve your experience

## 3. Information Sharing and Disclosure

### 3.1 Third-Party Service Providers
We may share your information with third-party service providers who perform services on our behalf, such as:
- Payment processing
- Data analysis
- Email delivery
- Hosting services
- Customer service

### 3.2 Legal Requirements
We may disclose your information if required to do so by law or in response to valid requests by public authorities.

### 3.3 Business Transfers
If we are involved in a merger, acquisition, or asset sale, your personal information may be transferred.

## 4. Data Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

**Security measures include:**
- Encryption of data in transit and at rest
- Regular security assessments
- Access controls and authentication
- Employee training on data protection
- Incident response procedures

## 5. Data Retention

We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.

## 6. Your Rights and Choices

### 6.1 Access and Update
You can access and update your account information at any time through your account settings.

### 6.2 Data Portability
You have the right to request a copy of your personal information in a structured, machine-readable format.

### 6.3 Deletion
You can request deletion of your personal information, subject to certain exceptions.

### 6.4 Marketing Communications
You can opt out of receiving promotional emails by following the unsubscribe instructions in those emails.

## 7. International Data Transfers

Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.

## 8. Children's Privacy

Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.

## 9. Changes to This Privacy Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.

## 10. Contact Us

If you have any questions about this privacy policy, please contact us at:
- Email: privacy@platform.com
- Address: 123 Privacy Street, Data City, DC 12345
- Phone: (555) 123-4567

---

*Last updated: December 15, 2024*
*Version: 3.2*`);
  const [draftContent, setDraftContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock version history
  const versions = [
    {
      id: 'current',
      version: '3.2',
      date: '2024-12-15',
      author: 'Legal Team',
      status: 'published',
      changes: 'Updated GDPR compliance and data retention policies',
      acceptances: 2156,
      compliance: ['GDPR', 'CCPA', 'PIPEDA']
    },
    {
      id: 'v3.1',
      version: '3.1',
      date: '2024-11-01',
      author: 'Legal Team',
      status: 'archived',
      changes: 'Added international data transfer provisions',
      acceptances: 1834,
      compliance: ['GDPR', 'CCPA']
    },
    {
      id: 'v3.0',
      version: '3.0',
      date: '2024-09-15',
      author: 'Legal Team',
      status: 'archived',
      changes: 'Major revision for CCPA compliance',
      acceptances: 1456,
      compliance: ['GDPR']
    }
  ];

  // Mock compliance status
  const complianceStatus = {
    GDPR: { status: 'compliant', lastReview: '2024-12-15', nextReview: '2025-03-15' },
    CCPA: { status: 'compliant', lastReview: '2024-12-10', nextReview: '2025-03-10' },
    PIPEDA: { status: 'compliant', lastReview: '2024-12-05', nextReview: '2025-03-05' },
    LGPD: { status: 'review_needed', lastReview: '2024-10-15', nextReview: '2024-12-20' }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setDraftContent(content);
  };

  const handleSave = () => {
    setContent(draftContent);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    // Here you would typically save to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraftContent('');
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (e) => {
    setDraftContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handlePublish = () => {
    // Here you would typically publish to your backend
    alert('Privacy Policy published successfully!');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'published': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Published' },
      'draft': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Draft' },
      'archived': { color: 'bg-gray-100 text-gray-800', icon: FileText, text: 'Archived' }
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

  const getComplianceBadge = (status) => {
    const statusConfig = {
      'compliant': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Compliant' },
      'review_needed': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Review Needed' },
      'non_compliant': { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Non-Compliant' }
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Manage your platform's privacy policy and ensure compliance with data protection regulations.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
            {!isEditing ? (
              <button 
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
        
        {hasUnsavedChanges && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">You have unsaved changes</span>
            </div>
          </div>
        )}
      </div>

      {/* Compliance Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Compliance Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(complianceStatus).map(([regulation, data]) => (
            <div key={regulation} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800">{regulation}</h3>
                {getComplianceBadge(data.status)}
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Last Review: {data.lastReview}</div>
                <div>Next Review: {data.nextReview}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Current Version</h3>
            <p className="text-sm text-gray-600">v3.2</p>
            <p className="text-xs text-gray-500 mt-1">Last updated: Dec 15, 2024</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">User Acceptances</h3>
            <p className="text-sm text-gray-600">2,156</p>
            <p className="text-xs text-gray-500 mt-1">Current version</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <Lock className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Data Protection</h3>
            <p className="text-sm text-gray-600">Fully Compliant</p>
            <p className="text-xs text-gray-500 mt-1">GDPR, CCPA, PIPEDA</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Next Review</h3>
            <p className="text-sm text-gray-600">Mar 15, 2025</p>
            <p className="text-xs text-gray-500 mt-1">Quarterly review</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Editor/Content */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {isEditing ? 'Edit Privacy Policy' : 'Current Privacy Policy'}
              </h2>
              <div className="flex items-center space-x-2">
                {!isEditing && (
                  <button 
                    onClick={handlePublish}
                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Publish
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="border border-gray-300 rounded-lg">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="font-medium text-gray-700 hover:text-gray-900">Bold</button>
                        <button className="font-medium text-gray-700 hover:text-gray-900">Italic</button>
                        <button className="font-medium text-gray-700 hover:text-gray-900">Heading</button>
                        <button className="font-medium text-gray-700 hover:text-gray-900">List</button>
                        <button className="font-medium text-gray-700 hover:text-gray-900">Link</button>
                      </div>
                    </div>
                    <textarea
                      value={draftContent}
                      onChange={handleContentChange}
                      className="w-full h-96 p-4 border-0 resize-none focus:ring-0 focus:outline-none font-mono text-sm"
                      placeholder="Enter your privacy policy content here..."
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    Tip: Use Markdown formatting for better structure (# for headings, ** for bold, etc.)
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  {showPreview ? (
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {content}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Document Summary</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Word Count:</span>
                            <span className="ml-2 font-medium">2,847</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Sections:</span>
                            <span className="ml-2 font-medium">10</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Modified:</span>
                            <span className="ml-2 font-medium">Dec 15, 2024</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Language:</span>
                            <span className="ml-2 font-medium">English</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center py-8">
                        <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Privacy Policy Document</h3>
                        <p className="text-gray-500 mb-4">Click "Preview" to view the full document or "Edit" to make changes</p>
                        <div className="flex justify-center space-x-3">
                          <button 
                            onClick={() => setShowPreview(true)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Document
                          </button>
                          <button 
                            onClick={handleEdit}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Document
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Version History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Version History</h3>
              <History className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {versions.map((version) => (
                <div 
                  key={version.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedVersion === version.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">v{version.version}</span>
                    {getStatusBadge(version.status)}
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>By {version.author}</div>
                    <div>{version.date}</div>
                    <div className="text-gray-500">{version.changes}</div>
                    {version.acceptances && (
                      <div className="flex items-center mt-2">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{version.acceptances} acceptances</span>
                      </div>
                    )}
                    {version.compliance && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {version.compliance.map((comp) => (
                          <span key={comp} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                <span className="text-sm">Export PDF</span>
              </button>
              <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Shield className="h-4 w-4 mr-2" />
                <span className="text-sm">Compliance Check</span>
              </button>
              <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Upload className="h-4 w-4 mr-2" />
                <span className="text-sm">Import Document</span>
              </button>
              <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-sm">Create Template</span>
              </button>
              <button className="w-full flex items-center justify-center p-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="text-sm">Archive Version</span>
              </button>
            </div>
          </div>

          {/* Document Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Statistics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Views:</span>
                <span className="font-medium">5,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Acceptances:</span>
                <span className="font-medium">2,156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Acceptance Rate:</span>
                <span className="font-medium">41.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Read Time:</span>
                <span className="font-medium">6m 45s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Review:</span>
                <span className="font-medium">Dec 15, 2024</span>
              </div>
            </div>
          </div>

          {/* Compliance Alerts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Compliance Alerts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">LGPD Review Due</p>
                    <p className="text-xs text-yellow-700 mt-1">Review needed by Dec 20, 2024</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Quarterly Review</p>
                    <p className="text-xs text-blue-700 mt-1">Next review scheduled for Mar 15, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;