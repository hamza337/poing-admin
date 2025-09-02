import React, { useState } from 'react';
import { Settings, Percent, Calendar, Save, RotateCcw, Plus, Trash2, Edit3 } from 'lucide-react';

const PoingConfiguration = () => {
  const [activeTab, setActiveTab] = useState('fees');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', fee: '', expiry: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data for categories with fees and expiry settings
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Accident',
      fee: 2.5,
      expiry: 30,
      color: 'bg-blue-500',
      events: 145,
      revenue: '$12,450'
    },
    {
      id: 2,
      name: 'People',
      fee: 3.0,
      expiry: 14,
      color: 'bg-green-500',
      events: 89,
      revenue: '$8,920'
    },
    {
      id: 3,
      name: 'Lost & Found',
      fee: 2.8,
      expiry: 21,
      color: 'bg-purple-500',
      events: 67,
      revenue: '$6,780'
    },
    {
      id: 4,
      name: 'Pet',
      fee: 3.5,
      expiry: 7,
      color: 'bg-orange-500',
      events: 123,
      revenue: '$15,230'
    },
    {
      id: 5,
      name: 'Crime',
      fee: 2.0,
      expiry: 45,
      color: 'bg-indigo-500',
      events: 78,
      revenue: '$5,460'
    },
    {
      id: 6,
      name: 'Others',
      fee: 2.7,
      expiry: 28,
      color: 'bg-pink-500',
      events: 92,
      revenue: '$9,840'
    }
  ]);

  const handleSaveCategory = (categoryId, field, value) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, [field]: parseFloat(value) || value } : cat
    ));
    setEditingCategory(null);
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

  const totalRevenue = categories.reduce((sum, cat) => {
    return sum + parseFloat(cat.revenue.replace('$', '').replace(',', ''));
  }, 0);

  const averageFee = categories.reduce((sum, cat) => sum + cat.fee, 0) / categories.length;
  const totalEvents = categories.reduce((sum, cat) => sum + cat.events, 0);

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
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Fee</p>
              <p className="text-2xl font-bold text-gray-900">{averageFee.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Percent className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{totalEvents.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-orange-600 font-bold text-lg">$</span>
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
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
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === 'fees' ? 'Category Fee Settings' : 'Category Expiry Settings'}
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (Days)</label>
                  <input
                    type="number"
                    value={newCategory.expiry}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, expiry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Category
                </button>
              </div>
            </div>
          )}

          {/* Categories Grid */}
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
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onBlur={(e) => handleSaveCategory(category.id, 'fee', e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveCategory(category.id, 'fee', e.target.value);
                              }
                            }}
                            autoFocus
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-2xl font-bold text-blue-600">{category.fee}%</span>
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onBlur={(e) => handleSaveCategory(category.id, 'expiry', e.target.value)}
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

          {/* Save All Button */}
          <div className="flex justify-center mt-8">
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg">
              <Save className="w-5 h-5" />
              <span>Save All Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoingConfiguration;