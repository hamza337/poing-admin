import React, { useState, useEffect } from 'react';
import { Settings, Percent, DollarSign, Calendar, Save, Edit3, Check, X, AlertTriangle, Users, Heart, Shield, Search, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const PoingConfiguration = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('platform');
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempValues, setTempValues] = useState({});

  const [categoryConfigs, setCategoryConfigs] = useState([]);
  const [recommendedPrices, setRecommendedPrices] = useState({});
  const [categoryFeesData, setCategoryFeesData] = useState({});

  // Helper function to map category names for API calls
  const getCategoryApiName = (categoryName) => {
    if (categoryName === 'Lost & Found') {
      return 'LostFound';
    }
    return categoryName;
  };

  // Helper function to map API category names back to display names
  const getCategoryDisplayName = (apiCategoryName) => {
    if (apiCategoryName === 'LostFound') {
      return 'Lost & Found';
    }
    return apiCategoryName;
  };

  // Fetch category fees and recommended prices from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch category fees
        const feesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/admin/category-fees`);
        const feesData = await feesResponse.json();
        
        // Store category fees data with IDs for API updates
        const feesById = {};
        feesData.forEach(item => {
          const displayName = getCategoryDisplayName(item.category);
          feesById[displayName] = {
            id: item.id,
            platformFee: item.platformFee || 0,
            flatFee: item.flatFee || 0
          };
        });
        setCategoryFeesData(feesById);
        
        // Fetch recommended prices
        const pricesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/admin/recommended-prices`);
        const pricesData = await pricesResponse.json();
        
        // Transform recommended prices data
        const prices = {};
        pricesData.forEach(item => {
          const displayName = getCategoryDisplayName(item.category);
          prices[displayName] = {
            id: item.id,
            price: item.price
          };
        });
        setRecommendedPrices(prices);
        
        // Map API data to our component structure
        const mappedData = feesData.map(item => {
          const categoryName = getCategoryDisplayName(item.category);
          let icon, color, lightColor, borderColor;
          
          // Map category to icon and colors
          switch(categoryName.toLowerCase()) {
            case 'accident':
              icon = <AlertTriangle className="h-5 w-5" />;
              color = 'bg-gray-600';
              lightColor = 'bg-gray-50';
              borderColor = 'border-gray-200';
              break;
            case 'people':
              icon = <Users className="h-5 w-5" />;
              color = 'bg-gray-600';
              lightColor = 'bg-gray-50';
              borderColor = 'border-gray-200';
              break;
            case 'pet':
              icon = <Heart className="h-5 w-5" />;
              color = 'bg-gray-600';
              lightColor = 'bg-gray-50';
              borderColor = 'border-gray-200';
              break;
            case 'crime':
              icon = <Shield className="h-5 w-5" />;
              color = 'bg-gray-600';
              lightColor = 'bg-gray-50';
              borderColor = 'border-gray-200';
              break;
            case 'lostfound':
              icon = <Search className="h-5 w-5" />;
              color = 'bg-gray-600';
              lightColor = 'bg-gray-50';
              borderColor = 'border-gray-200';
              break;
            default: // 'other'
              icon = <MoreHorizontal className="h-5 w-5" />;
              color = 'bg-gray-600';
              lightColor = 'bg-gray-50';
              borderColor = 'border-gray-200';
          }
          
          return {
            id: categoryName.toLowerCase(),
            name: categoryName === 'LostFound' ? 'Lost & Found' : categoryName,
            icon,
            color,
            lightColor,
            borderColor,
            platformFee: item.platformFee || 0,
            flatFee: item.flatFee || 0,
            recommendedFee: prices[categoryName]?.price || 5.00,
            eventExpiry: 30 // Default value
          };
        });
        
        setCategoryConfigs(mappedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load category configurations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleEdit = (categoryId) => {
    const category = categoryConfigs.find(c => c.id === categoryId);
    setEditingCategory(categoryId);
    setTempValues({
      platformFee: category.platformFee,
      flatFee: category.flatFee,
      recommendedFee: category.recommendedFee,
      eventExpiry: category.eventExpiry
    });
  };

  const handleSave = async (categoryId) => {
    try {
      const category = categoryConfigs.find(c => c.id === categoryId);
      if (!category) return;

      // Save based on active tab
      if (activeTab === 'recommended') {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/admin/recommended-prices/set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category: getCategoryApiName(category.name),
            price: tempValues.recommendedFee
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to save recommended price');
        }
        
        // Update local state
        setRecommendedPrices(prev => ({
          ...prev,
          [category.name]: {
            ...prev[category.name],
            price: tempValues.recommendedFee
          }
        }));
      } else if (activeTab === 'platform' || activeTab === 'flat') {
        const categoryFeeData = categoryFeesData[category.name];
        if (!categoryFeeData) {
          throw new Error('Category fee data not found');
        }
        
        let requestBody = {};
        if (activeTab === 'platform') {
          requestBody.platformFee = tempValues.platformFee;
        } else if (activeTab === 'flat') {
          requestBody.flatFee = tempValues.flatFee;
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/admin/category-fees/${categoryFeeData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to save ${activeTab} fee`);
        }
        
        // Update local category fees data
        setCategoryFeesData(prev => ({
          ...prev,
          [category.name]: {
            ...prev[category.name],
            ...requestBody
          }
        }));
      }
      
      // Update local category configs
      setCategoryConfigs(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, ...tempValues }
          : cat
      ));
      
      setEditingCategory(null);
      setTempValues({});
      toast.success('Configuration updated successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setTempValues({});
  };

  const handleInputChange = (field, value) => {
    setTempValues(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };





  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-xl">
               <Settings className="h-8 w-8 text-[#0868A8]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Poing Configuration</h1>
              <p className="text-gray-600 mt-2 text-md">Manage platform fees, flat fees, recommended fees, and event expiry per category</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
           <div className="p-1">
             <nav className="flex space-x-1">
               <button
                 onClick={() => setActiveTab('platform')}
                 className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                   activeTab === 'platform'
                     ? 'bg-[#0868A8] text-white shadow-md'
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 }`}
               >
                 <div className="flex items-center justify-center space-x-2">
                   <Percent className="w-4 h-4" />
                   <span>Platform Fee</span>
                 </div>
               </button>
               <button
                 onClick={() => setActiveTab('flat')}
                 className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                   activeTab === 'flat'
                     ? 'bg-[#0868A8] text-white shadow-md'
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 }`}
               >
                 <div className="flex items-center justify-center space-x-2">
                   <DollarSign className="w-4 h-4" />
                   <span>Flat Fee</span>
                 </div>
               </button>
               <button
                 onClick={() => setActiveTab('recommended')}
                 className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                   activeTab === 'recommended'
                     ? 'bg-[#0868A8] text-white shadow-md'
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 }`}
               >
                 <div className="flex items-center justify-center space-x-2">
                   <DollarSign className="w-4 h-4" />
                   <span>Recommended Price</span>
                 </div>
               </button>
               <button
                 onClick={() => setActiveTab('expiry')}
                 className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                   activeTab === 'expiry'
                     ? 'bg-[#0868A8] text-white shadow-md'
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 }`}
               >
                 <div className="flex items-center justify-center space-x-2">
                   <Calendar className="w-4 h-4" />
                   <span>Event Expiry</span>
                 </div>
               </button>
             </nav>
           </div>
         </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0868A8]"></div>
            <span className="ml-3 text-gray-600">Loading configurations...</span>
          </div>
        ) : (
          /* Tab Content */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {categoryConfigs.map((category) => {
            const isEditing = editingCategory === category.id;
            
            return (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                {/* Card Header */}
                <div className="bg-gray-50 px-6 py-4 rounded-t-xl border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-600 p-2 rounded-lg text-white">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">
                          {activeTab === 'platform' && 'Platform Fee Configuration'}
                          {activeTab === 'flat' && 'Flat Fee Configuration'}
                          {activeTab === 'recommended' && 'Recommended Price Configuration'}
                          {activeTab === 'expiry' && 'Event Expiry Configuration'}
                        </p>
                      </div>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={() => handleEdit(category.id)}
                        className="p-2 text-[#0868A8] hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-5 w-5" />
                      </button>
                    ) : (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleSave(category.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content - Show only relevant field based on active tab */}
                <div className="p-6">
                  {activeTab === 'platform' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Percent className="h-4 w-4 text-indigo-500" />
                        <label className="text-sm font-medium text-gray-700">Platform Fee (%)</label>
                      </div>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.1"
                          value={tempValues.platformFee || ''}
                          onChange={(e) => handleInputChange('platformFee', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0868A8] focus:border-[#0868A8] transition-colors"
                          placeholder="Enter platform fee %"
                        />
                      ) : (
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                           <span className="text-2xl font-bold text-gray-700">{category.platformFee}%</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-2">Percentage fee charged on each transaction</p>
                    </div>
                  )}

                  {activeTab === 'flat' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <label className="text-sm font-medium text-gray-700">Flat Fee (USD)</label>
                      </div>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={tempValues.flatFee || ''}
                          onChange={(e) => handleInputChange('flatFee', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0868A8] focus:border-[#0868A8] transition-colors"
                          placeholder="Enter flat fee"
                        />
                      ) : (
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                           <span className="text-2xl font-bold text-gray-700">${category.flatFee}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-2">Fixed fee charged for free events</p>
                    </div>
                  )}

                  {activeTab === 'recommended' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-blue-500" />
                        <label className="text-sm font-medium text-gray-700">Recommended Price (USD)</label>
                      </div>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={tempValues.recommendedFee || ''}
                          onChange={(e) => handleInputChange('recommendedFee', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0868A8] focus:border-[#0868A8] transition-colors"
                          placeholder="Enter recommended price"
                        />
                      ) : (
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                           <span className="text-2xl font-bold text-gray-700">${category.recommendedFee}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-2">Suggested price for events in this category</p>
                    </div>
                  )}

                  {activeTab === 'expiry' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        <label className="text-sm font-medium text-gray-700">Event Expiry (Days)</label>
                      </div>
                      {isEditing ? (
                        <input
                          type="number"
                          value={tempValues.eventExpiry || ''}
                          onChange={(e) => handleInputChange('eventExpiry', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0868A8] focus:border-[#0868A8] transition-colors"
                          placeholder="Enter expiry days"
                        />
                      ) : (
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                           <span className="text-2xl font-bold text-gray-700">{category.eventExpiry} days</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-2">Number of days before events expire</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}


      </div>
    </div>
  );
};

export default PoingConfiguration;