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
  Check
} from 'lucide-react';

const TermsConditions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('current');
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState(`# Terms and Conditions

## 1. Acceptance of Terms

By accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.

## 2. User Accounts

### 2.1 Account Creation
Users must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.

### 2.2 Account Responsibilities
- Keep your login information secure
- Notify us immediately of any unauthorized use
- You are responsible for all activities under your account

## 3. Acceptable Use

### 3.1 Permitted Uses
You may use our platform for lawful purposes only. This includes:
- Creating and sharing content
- Engaging with other users respectfully
- Using platform features as intended

### 3.2 Prohibited Activities
The following activities are strictly prohibited:
- Harassment or abuse of other users
- Posting illegal or harmful content
- Attempting to breach platform security
- Spamming or unsolicited communications

## 4. Content and Intellectual Property

### 4.1 User Content
You retain ownership of content you create and post on our platform. By posting content, you grant us a license to use, display, and distribute your content on the platform.

### 4.2 Platform Content
All platform features, design, and functionality are owned by us and protected by intellectual property laws.

## 5. Privacy and Data Protection

Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.

## 6. Termination

We reserve the right to terminate or suspend accounts that violate these terms. Users may also terminate their accounts at any time.

## 7. Limitation of Liability

Our platform is provided "as is" without warranties. We are not liable for any damages arising from your use of the platform.

## 8. Changes to Terms

We may update these terms from time to time. Users will be notified of significant changes, and continued use constitutes acceptance of updated terms.

## 9. Contact Information

For questions about these terms, please contact our legal team at legal@platform.com.

---

*Last updated: December 15, 2024*
*Version: 2.1*`);
  const [draftContent, setDraftContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock version history
  const versions = [
    {
      id: 'current',
      version: '2.1',
      date: '2024-12-15',
      author: 'Legal Team',
      status: 'published',
      changes: 'Updated user account responsibilities and data protection clauses',
      acceptances: 1247
    },
    {
      id: 'v2.0',
      version: '2.0',
      date: '2024-11-20',
      author: 'Legal Team',
      status: 'archived',
      changes: 'Major revision - added intellectual property section',
      acceptances: 892
    },
    {
      id: 'v1.9',
      version: '1.9',
      date: '2024-10-15',
      author: 'Legal Team',
      status: 'archived',
      changes: 'Updated privacy references and contact information',
      acceptances: 654
    }
  ];

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
    alert('Terms and Conditions published successfully!');
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Terms & Conditions</h1>
            <p className="text-gray-600">Manage and update your platform's terms and conditions.</p>
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

      {/* Document Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Current Version</h3>
            <p className="text-sm text-gray-600">v2.1</p>
            <p className="text-xs text-gray-500 mt-1">Last updated: Dec 15, 2024</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">User Acceptances</h3>
            <p className="text-sm text-gray-600">1,247</p>
            <p className="text-xs text-gray-500 mt-1">Current version</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Public Status</h3>
            <p className="text-sm text-gray-600">Live & Active</p>
            <p className="text-xs text-gray-500 mt-1">Visible to users</p>
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
                {isEditing ? 'Edit Terms & Conditions' : 'Current Terms & Conditions'}
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
                      placeholder="Enter your terms and conditions content here..."
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
                            <span className="ml-2 font-medium">1,247</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Sections:</span>
                            <span className="ml-2 font-medium">9</span>
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
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Terms & Conditions Document</h3>
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
                <span className="font-medium">3,421</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Acceptances:</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Acceptance Rate:</span>
                <span className="font-medium">36.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Read Time:</span>
                <span className="font-medium">4m 32s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Review:</span>
                <span className="font-medium">Dec 15, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;