import React, { useState, useEffect } from 'react';
import { Settings, Percent, Calendar, Save, RotateCcw, Plus, Trash2, Edit3 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PoingConfiguration = () => {
  const [activeTab, setActiveTab] = useState('fees');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', fee: '', expiry: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState({
    totalCategories: 0,
    totalEvents: 0,
    totalRevenue: 0,
    avgFee: 0
  });

  // Categories data from API
  const [categories, setCategories] = useState([]);

  // API base URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/admin/category-fees/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    }
  };

  // Fetch category fees
  const fetchCategoryFees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/admin/category-fees`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform API data to match component structure
      const transformedCategories = response.data.map((item, index) => ({
        id: item.id,
        name: formatCategoryName(item.category),
        fee: item.platformFee,
        expiry: 30, // Default expiry since not provided in API
        color: getColorForCategory(index),
        events: item.eventsCount,
        revenue: `$${item.revenue.toLocaleString()}`
      }));
      
      setCategories(transformedCategories);
    } catch (error) {
      console.error('Error fetching category fees:', error);
      toast.error('Failed to fetch category fees');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format category names
  const formatCategoryName = (category) => {
    const nameMap = {
      'LostFound': 'Lost & Found',
      'Others': 'Others',
      'Crime': 'Crime',
      'People': 'People',
      'Accident': 'Accident',
      'Pet': 'Pet'
    };
    return nameMap[category] || category;
  };

  // Helper function to assign colors to categories
  const getColorForCategory = (index) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-indigo-500', 'bg-pink-500',
      'bg-red-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardStats();
    fetchCategoryFees();
  }, []);

  const handleSaveCategory = async (categoryId, field, value) => {
    if (field !== 'fee') {
      // For non-fee fields, just update locally for now
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, [field]: parseFloat(value) || value } : cat
      ));
      setEditingCategory(null);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${baseUrl}/admin/category-fees/${categoryId}`, {
        platformFee: parseFloat(value)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state on successful API call
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, fee: parseFloat(value) } : cat
      ));
      
      toast.success('Platform fee updated successfully');
      setEditingCategory(null);
      
      // Refresh dashboard stats to reflect changes
      fetchDashboardStats();
    } catch (error) {
      console.error('Error updating category fee:', error);
      toast.error('Failed to update platform fee');
    } finally {
       setSaving(false);
     }
   };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.fee && newCategory.expiry) {
      const newCat = {
        id: Date.now(),
        name: newCategory.name,
        fee: parseFloat(newCategory.fee),
        expiry: parseInt(newCategory.expiry),
        color: 'bg-gray-500',
        events: 0,
        revenue: '$0'
      };
      setCategories(prev => [...prev, newCat]);
      setNewCategory({ name: '', fee: '', expiry: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  // Use dashboard stats from API instead of calculated values

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Poing Configuration</h1>
        </div>
        <p className="text-gray-600">Manage category-wise fees and event expiry settings</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : dashboardStats.totalCategories}</p>
            </div>
            <div className="p-3 rounded-lg text-white" style={{backgroundColor: '#0868a8'}}>
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Fee</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : `${dashboardStats.avgFee.toFixed(1)}%`}</p>
            </div>
            <div className="p-3 rounded-lg text-white" style={{backgroundColor: '#0868a8'}}>
              <Percent className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : dashboardStats.totalEvents.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg text-white" style={{backgroundColor: '#0868a8'}}>
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : `$${dashboardStats.totalRevenue.toLocaleString()}`}</p>
            </div>
            <div className="p-3 rounded-lg text-white" style={{backgroundColor: '#0868a8'}}>
              <span className="text-white font-bold text-lg">$</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('fees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'fees'
                  ? 'border-transparent text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={activeTab === 'fees' ? {borderBottomColor: '#0868a8', color: '#0868a8'} : {}}
            >
              <div className="flex items-center space-x-2">
                <Percent className="w-4 h-4" />
                <span>Fee Configuration</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('expiry')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'expiry'
                  ? 'border-transparent text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={activeTab === 'expiry' ? {borderBottomColor: '#0868a8', color: '#0868a8'} : {}}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Expiry Configuration</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add Category Button */}
          {/* <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === 'fees' ? 'Category Fee Settings' : 'Category Expiry Settings'}
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors duration-200"
              style={{backgroundColor: '#0868a8'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#065a87'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#0868a8'}
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div> */}

          {/* Add Category Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#0868a8'}}
                    onFocus={(e) => e.target.style.borderColor = '#0868a8'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCategory.fee}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, fee: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#0868a8'}}
                    onFocus={(e) => e.target.style.borderColor = '#0868a8'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (Days)</label>
                  <input
                    type="number"
                    value={newCategory.expiry}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, expiry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': '#0868a8'}}
                    onFocus={(e) => e.target.style.borderColor = '#0868a8'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCategory({ name: '', fee: '', expiry: '' });
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 text-white rounded-lg transition-colors duration-200"
                  style={{backgroundColor: '#0868a8'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#065a87'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0868a8'}
                >
                  Add Category
                </button>
              </div>
            </div>
          )}

          {/* Categories Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
              <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingCategory(category.id)}
                      className="p-1 text-gray-400 transition-colors duration-200"
                      style={{'--hover-color': '#0868a8'}}
                      onMouseEnter={(e) => e.target.style.color = '#0868a8'}
                      onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {/* <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button> */}
                  </div>
                </div>

                {activeTab === 'fees' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Fee</label>
                      {editingCategory === category.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            step="0.1"
                            defaultValue={category.fee}
                            disabled={saving}
                            className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{'--tw-ring-color': '#0868a8'}}
                            onFocus={(e) => e.target.style.borderColor = '#0868a8'}
                             onBlur={(e) => {
                               e.target.style.borderColor = '#d1d5db';
                               if (!saving) {
                                 handleSaveCategory(category.id, 'fee', e.target.value);
                               }
                             }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !saving) {
                                handleSaveCategory(category.id, 'fee', e.target.value);
                              }
                            }}
                            autoFocus
                          />
                          <span className="text-gray-500">%</span>
                          {saving && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-2xl font-bold" style={{color: '#0868a8'}}>{category.fee}%</span>
                          <Percent className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Events:</span>
                        <span className="font-medium">{category.events}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium text-green-600">{category.revenue}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Expiry</label>
                      {editingCategory === category.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            defaultValue={category.expiry}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                            style={{'--tw-ring-color': '#0868a8'}}
                            onFocus={(e) => e.target.style.borderColor = '#0868a8'}
                             onBlur={(e) => {
                               e.target.style.borderColor = '#d1d5db';
                               handleSaveCategory(category.id, 'expiry', e.target.value);
                             }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveCategory(category.id, 'expiry', e.target.value);
                              }
                            }}
                            autoFocus
                          />
                          <span className="text-gray-500">days</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-2xl font-bold text-purple-600">{category.expiry} days</span>
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Active Events:</span>
                        <span className="font-medium">{category.events}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Avg. Duration:</span>
                        <span className="font-medium">{Math.round(category.expiry * 0.7)} days</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoingConfiguration;