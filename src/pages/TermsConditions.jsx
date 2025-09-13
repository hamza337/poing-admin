import React, { useState, useEffect } from 'react';
import { Save, Edit, Eye } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import toast from 'react-hot-toast';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const TermsConditions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchTermsContent();
  }, []);

  const fetchTermsContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/admin/legal/terms`, {
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
      console.error('Error fetching terms content:', error);
      setContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContent = () => {
    return `# Terms and Conditions\n\n## 1. Acceptance of Terms\n\nBy accessing and using this platform, you accept and agree to be bound by the terms and provision of this agreement.\n\n## 2. User Accounts\n\n### 2.1 Account Creation\nUsers must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.\n\n### 2.2 Account Responsibilities\n- Keep your login information secure\n- Notify us immediately of any unauthorized use\n- You are responsible for all activities under your account\n\n## 3. Acceptable Use\n\n### 3.1 Permitted Uses\nYou may use our platform for lawful purposes only. This includes:\n- Creating and sharing content\n- Engaging with other users respectfully\n- Using platform features as intended\n\n### 3.2 Prohibited Activities\nThe following activities are strictly prohibited:\n- Harassment or abuse of other users\n- Posting illegal or harmful content\n- Attempting to breach platform security\n- Spamming or unsolicited communications\n\n## 4. Privacy\n\nYour privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.\n\n## 5. Termination\n\nWe reserve the right to terminate or suspend your account at any time for violations of these terms.\n\n## 6. Contact Information\n\nIf you have any questions about these Terms and Conditions, please contact us.`;
  };

  const saveContent = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${baseUrl}/admin/legal/terms`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        toast.success('Terms and Conditions saved successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to save Terms and Conditions');
      }
    } catch (error) {
      console.error('Error saving terms content:', error);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Terms & Conditions</h1>
            <p className="text-gray-600">Manage and update your platform's terms and conditions.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
            <div data-color-mode="light">
              <MDEditor.Markdown 
                source={content} 
                style={{ 
                  whiteSpace: 'pre-wrap',
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

export default TermsConditions;