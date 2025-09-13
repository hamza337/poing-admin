import React, { useState, useEffect } from 'react';
import { BarChart3, Globe, Tag, DollarSign, HardDrive, AlertTriangle, Heart, Search, Shield, Users, Package } from 'lucide-react';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // All possible categories with their icons and colors
  const allCategories = [
    { name: 'Accident', icon: AlertTriangle, color: 'red' },
    { name: 'Pet', icon: Heart, color: 'pink' },
    { name: 'LostFound', displayName: 'Lost & Found', icon: Search, color: 'yellow' },
    { name: 'Crime', icon: Shield, color: 'red' },
    { name: 'People', icon: Users, color: 'blue' },
    { name: 'Other', icon: Package, color: 'gray' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`${baseUrl}/admin/dashboard`);
      const statsData = await statsResponse.json();
      setDashboardStats(statsData);

      // Fetch categories
      const categoriesResponse = await fetch(`${baseUrl}/admin/categories`);
      const categoriesData = await categoriesResponse.json();
      
      // Merge API data with all categories, showing 0 for missing ones
      const mergedCategories = allCategories.map(category => {
        const apiCategory = categoriesData.find(cat => cat.category === category.name);
        return {
          name: category.displayName || category.name,
          listings: apiCategory ? apiCategory.listings : 0,
          sales: apiCategory ? apiCategory.sales : 0,
          icon: category.icon,
          color: category.color
        };
      });
      setCategoryStats(mergedCategories);

      // Fetch countries
      const countriesResponse = await fetch(`${baseUrl}/admin/countries`);
      const countriesData = await countriesResponse.json();
      
      // Filter out null countries and calculate percentages
      const validCountries = countriesData.filter(country => country.country !== null);
      const totalListings = validCountries.reduce((sum, country) => sum + country.listings, 0);
      
      const countriesWithPercentage = validCountries.map(country => ({
        name: country.country,
        listings: country.listings,
        percentage: totalListings > 0 ? ((country.listings / totalListings) * 100).toFixed(1) : 0
      }));
      
      setTopCountries(countriesWithPercentage);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStorageDisplay = (storage) => {
    if (!storage) return '0 GB';
    
    const tbValue = parseFloat(storage.tb);
    if (tbValue >= 1) {
      return `${storage.tb} TB`;
    } else {
      return `${storage.gb} GB`;
    }
  };

  const overallStats = dashboardStats ? [
    { label: 'Total Countries', value: dashboardStats.totalCountries.toLocaleString(), icon: Globe, color: 'blue' },
    { label: 'Total Categories', value: dashboardStats.totalCategories.toLocaleString(), icon: Tag, color: 'green' },
    { label: 'Total Listings', value: dashboardStats.totalListings.toLocaleString(), icon: Package, color: 'purple' },
    { label: 'Storage Used', value: getStorageDisplay(dashboardStats.storage), icon: HardDrive, color: 'orange' }
  ] : [];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-white' + ' ' + 'rounded-lg',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600',
      pink: 'bg-pink-100 text-pink-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of listings, countries, categories, and performance metrics.</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overallStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Category Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getColorClasses(category.color)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">{category.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Listings:</span>
                    <span className="text-sm font-semibold text-gray-900">{category.listings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sales:</span>
                    <span className="text-sm font-semibold text-green-600">{category.sales.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Country Statistics and Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Countries by Listings</h2>
          <div className="space-y-4">
            {topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: '#0868a8'}}>
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-800">{country.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{country.listings.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{country.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Storage & Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Storage & Performance</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Total Storage</span>
                <span className="text-sm font-bold text-gray-900">{dashboardStats ? getStorageDisplay(dashboardStats.storage) : '0 GB'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full" style={{width: '100%', background: '#0868a8'}}></div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-3">Category Distribution</div>
              <div className="text-xs text-gray-500 mb-2">
                Storage per category: {dashboardStats ? (dashboardStats.storage.bytes / dashboardStats.totalCategories / (1024 * 1024 * 1024)).toFixed(2) : '0'} GB
              </div>
              <div className="flex space-x-1">
                {allCategories.map((category, index) => {
                  const colors = {
                    red: '#ef4444',
                    pink: '#ec4899', 
                    yellow: '#eab308',
                    blue: '#0868a8',
                    gray: '#6b7280'
                  };
                  return (
                    <div 
                      key={index}
                      className={`flex-1 h-2 ${index === 0 ? 'rounded-l' : ''} ${index === allCategories.length - 1 ? 'rounded-r' : ''}`}
                      style={{background: colors[category.color] || colors.gray}}
                      title={category.displayName || category.name}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;