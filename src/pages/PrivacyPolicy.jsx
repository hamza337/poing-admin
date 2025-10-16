import React, { useState, useEffect } from 'react';
import { Save, Edit, Eye } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import toast from 'react-hot-toast';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const PrivacyPolicy = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchPrivacyContent();
  }, []);

  const fetchPrivacyContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/legal/privacy`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || getDefaultContent());
      } else {
        setContent(getDefaultContent());
      }
    } catch (error) {
      console.error('Error fetching privacy content:', error);
      setContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContent = () => {
    return `# Privacy Policy\n\n## 1. Information We Collect\n\n### 1.1 Personal Information\nWe collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support.\n\n### 1.2 Usage Information\nWe automatically collect certain information about your use of our platform, including:\n- Device information and identifiers\n- Log data and analytics\n- Location information (with your consent)\n\n## 2. How We Use Your Information\n\n### 2.1 Service Provision\nWe use your information to:\n- Provide and maintain our services\n- Process transactions and send notifications\n- Respond to your requests and provide customer support\n\n### 2.2 Communication\nWe may use your information to:\n- Send you updates about our services\n- Notify you about changes to our policies\n- Provide marketing communications (with your consent)\n\n## 3. Information Sharing\n\n### 3.1 Third-Party Services\nWe may share your information with trusted third-party service providers who assist us in operating our platform.\n\n### 3.2 Legal Requirements\nWe may disclose your information when required by law or to protect our rights and safety.\n\n## 4. Data Security\n\nWe implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.\n\n## 5. Your Rights\n\nYou have the right to:\n- Access your personal information\n- Correct inaccurate data\n- Request deletion of your data\n- Opt-out of marketing communications\n\n## 6. Data Retention\n\nWe retain your information for as long as necessary to provide our services and comply with legal obligations.\n\n## 7. Contact Us\n\nIf you have any questions about this Privacy Policy, please contact us.`;
  };

  const saveContent = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${baseUrl}/admin/legal/privacy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        toast.success('Privacy Policy saved successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to save Privacy Policy');
      }
    } catch (error) {
      console.error('Error saving privacy content:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Manage and update your platform's privacy policy.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-[#0868A8] text-white rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveContent}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Editor/Viewer */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          {isEditing ? (
            <div data-color-mode="light">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                height={600}
                preview="edit"
                data-color-mode="light"
                visibleDragBar={false}
              />
            </div>
          ) : (
            <div data-color-mode="light" className="prose prose-sm max-w-none">
              <MDEditor.Markdown 
                source={content} 
                style={{ 
                  backgroundColor: 'transparent',
                  padding: '16px'
                }} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;