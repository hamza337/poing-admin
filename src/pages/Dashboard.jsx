import React, { useState, useEffect } from 'react';
import { BarChart3, Globe, Tag, DollarSign, HardDrive, AlertTriangle, Heart, Search, Shield, Users, Package, Filter, Calendar, TrendingUp, RefreshCw } from 'lucide-react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import countries from 'world-countries';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Category mapping with icons and colors
  const categoryConfig = {
    'Accident': { icon: AlertTriangle, color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700' },
    'Crime': { icon: Shield, color: 'bg-red-600', lightColor: 'bg-red-50', textColor: 'text-red-700' },
    'People': { icon: Users, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
    'Pet': { icon: Heart, color: 'bg-pink-500', lightColor: 'bg-pink-50', textColor: 'text-pink-700' },
    'LostFound': { icon: Search, color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
    'Other': { icon: Package, color: 'bg-gray-500', lightColor: 'bg-gray-50', textColor: 'text-gray-700' }
  };

  // Helper function to get display name for categories
  const getCategoryDisplayName = (category) => {
    return category === 'LostFound' ? 'Lost & Found' : category;
  };

  // Country options for select
  const countryOptions = countries.map(country => ({
    value: country.cca2,
    label: country.name.common,
    flag: country.flag
  })).sort((a, b) => a.label.localeCompare(b.label));

  // Category options for select
  const categoryOptions = [
    { value: 'Accident', label: 'Accident' },
    { value: 'Crime', label: 'Crime' },
    { value: 'People', label: 'People' },
    { value: 'Pet', label: 'Pet' },
    { value: 'LostFound', label: 'Lost & Found' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [selectedCategory, selectedCountry, fromDate, toDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Demo data for client presentation
      const demoData = {
        countries: [
          {
            country: "PK",
            listings: 2,
            sold: 1,
            storage: 115846,
            revenue: 15,
            storageFormatted: "113.13 KB"
          },
          {
            country: "GB",
            listings: 1,
            sold: 1,
            storage: 2997199,
            revenue: 25,
            storageFormatted: "2.86 MB"
          },
          {
            country: "AE",
            listings: 1,
            sold: 0,
            storage: 47705,
            revenue: 0,
            storageFormatted: "46.59 KB"
          },
          {
            country: "US",
            listings: 1,
            sold: 1,
            storage: 29845,
            revenue: 12,
            storageFormatted: "29.15 KB"
          },
          {
            country: "IN",
            listings: 1,
            sold: 1,
            storage: 39961,
            revenue: 8,
            storageFormatted: "39.02 KB"
          },
          {
            country: "JP",
            listings: 1,
            sold: 0,
            storage: 8361,
            revenue: 0,
            storageFormatted: "8.17 KB"
          },
          {
            country: "AZ",
            listings: 1,
            sold: 0,
            storage: 39344,
            revenue: 0,
            storageFormatted: "38.42 KB"
          }
        ],
        categories: [
          {
            category: "Accident",
            listings: 3,
            sold: 2,
            storage: 163551,
            revenue: 30,
            storageFormatted: "159.72 KB"
          },
          {
            category: "Pet",
            listings: 1,
            sold: 1,
            storage: 2997199,
            revenue: 25,
            storageFormatted: "2.86 MB"
          },
          {
            category: "People",
            listings: 1,
            sold: 0,
            storage: 29845,
            revenue: 0,
            storageFormatted: "29.15 KB"
          },
          {
            category: "LostFound",
            listings: 1,
            sold: 1,
            storage: 39961,
            revenue: 5,
            storageFormatted: "39.02 KB"
          },
          {
            category: "Other",
            listings: 1,
            sold: 0,
            storage: 8361,
            revenue: 0,
            storageFormatted: "8.17 KB"
          },
          {
            category: "Crime",
            listings: 1,
            sold: 0,
            storage: 39344,
            revenue: 0,
            storageFormatted: "38.42 KB"
          }
        ],
        totalRevenue: 60,
        totalStorage: "3.13 MB"
      };
      
      // Apply filters to demo data
      let filteredData = { ...demoData };
      
      if (selectedCategory) {
        filteredData.categories = demoData.categories.filter(
          cat => cat.category === selectedCategory.value
        );
        // Recalculate totals based on filtered categories
        const categoryRevenue = filteredData.categories.reduce((sum, cat) => sum + cat.revenue, 0);
        const categorySold = filteredData.categories.reduce((sum, cat) => sum + cat.sold, 0);
        filteredData.totalRevenue = categoryRevenue;
        filteredData.totalSold = categorySold;
      }
      
      if (selectedCountry) {
        filteredData.countries = demoData.countries.filter(
          country => country.country === selectedCountry.value
        );
        // Recalculate totals based on filtered countries
        const countryRevenue = filteredData.countries.reduce((sum, country) => sum + country.revenue, 0);
        const countrySold = filteredData.countries.reduce((sum, country) => sum + country.sold, 0);
        filteredData.totalRevenue = countryRevenue;
        filteredData.totalSold = countrySold;
      }
      
      setDashboardData(filteredData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCountry(null);
    setFromDate(null);
    setToDate(null);
  };

  // Calculate totals from API data
  const getTotals = () => {
    if (!dashboardData) {
      return {
        listings: 0,
        sold: 0,
        revenue: 0,
        storage: '0 B'
      };
    }
    
    const totalListings = dashboardData.countries?.reduce((sum, country) => sum + country.listings, 0) || 0;
    const totalSold = dashboardData.totalSold || dashboardData.countries?.reduce((sum, country) => sum + country.sold, 0) || 0;
    const totalRevenue = dashboardData.totalRevenue || 0;
    const totalStorage = dashboardData.totalStorage || '0 B';
    
    return {
      listings: totalListings,
      sold: totalSold,
      revenue: totalRevenue,
      storage: totalStorage
    };
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totals = getTotals();





  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
          <div className="flex items-center space-x-4">
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categoryOptions}
                placeholder="Select category..."
                className="text-sm"
                classNamePrefix="select"
                isClearable
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <Select
                value={selectedCountry}
                onChange={setSelectedCountry}
                options={countryOptions}
                placeholder="Select country..."
                className="text-sm"
                classNamePrefix="select"
                isClearable
              />
            </div>
            
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
               <DatePicker
                 selected={fromDate}
                 onChange={setFromDate}
                 placeholderText="Select from date"
                 className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 dateFormat="yyyy-MM-dd"
                 maxDate={new Date()}
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
               <DatePicker
                 selected={toDate}
                 onChange={setToDate}
                 placeholderText="Select to date"
                 className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 dateFormat="yyyy-MM-dd"
                 minDate={fromDate}
                 maxDate={new Date()}
               />
             </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totals.listings.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Events Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totals.sold.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totals.revenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totals.storage}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <HardDrive className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Categories Analytics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                  <p className="text-sm text-gray-500">Performance by category</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.categories?.map((category, index) => {
                const config = categoryConfig[category.category] || categoryConfig['Other'];
                const IconComponent = config.icon;
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${config.color} rounded-lg`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getCategoryDisplayName(category.category)}</p>
                        <p className="text-sm text-gray-500">{category.storageFormatted}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{category.listings} listings</p>
                      <p className="text-sm text-gray-500">{category.sold} sold</p>
                    </div>
                  </div>
                );
              }) || (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <div className="text-center">
                    <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No category data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Countries Analytics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Countries</h3>
                  <p className="text-sm text-gray-500">Geographic distribution</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.countries?.map((country, index) => {
                const countryInfo = countries.find(c => c.cca2 === country.country);
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {countryInfo?.flag || '🌍'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {countryInfo?.name?.common || country.country}
                        </p>
                        <p className="text-sm text-gray-500">{country.storageFormatted}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{country.listings} listings</p>
                      <p className="text-sm text-gray-500">{country.sold} sold</p>
                    </div>
                  </div>
                );
              }) || (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No country data available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;