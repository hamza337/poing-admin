import React, { useState, useEffect } from 'react';
import { BarChart3, Globe, Tag, DollarSign, HardDrive, AlertTriangle, Heart, Search, Shield, Users, Package } from 'lucide-react';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableCountries, setAvailableCountries] = useState([]);

  // Filters
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  // Staged inputs (apply on click, not while typing)
  const [tempCategory, setTempCategory] = useState('');
  const [tempCountry, setTempCountry] = useState('');
  const [tempFromDate, setTempFromDate] = useState('');
  const [tempToDate, setTempToDate] = useState('');

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
  }, [filterCategory, filterCountry, filterFromDate, filterToDate]);

  const getCategoryApiName = (displayName) => displayName === 'Lost & Found' ? 'LostFound' : displayName;
  const buildQuery = () => {
    const params = new URLSearchParams();
    if (filterFromDate) params.set('fromDate', filterFromDate);
    if (filterToDate) params.set('toDate', filterToDate);
    if (filterCategory) params.set('category', getCategoryApiName(filterCategory));
    if (filterCountry) params.set('country', filterCountry);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  const handleClearFilters = () => {
    setFilterCategory('');
    setFilterCountry('');
    setFilterFromDate('');
    setFilterToDate('');

    setTempCategory('');
    setTempCountry('');
    setTempFromDate('');
    setTempToDate('');
  };

  const handleApplyFilters = () => {
    // Basic validation: ensure date range is valid
    if (tempFromDate && tempToDate && tempFromDate > tempToDate) {
      // Do not apply if invalid; user can fix inputs
      return;
    }
    setFilterCategory(tempCategory);
    setFilterCountry(tempCountry);
    setFilterFromDate(tempFromDate);
    setFilterToDate(tempToDate);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`${baseUrl}/admin/dashboard${buildQuery()}`);
      const statsData = await statsResponse.json();
      setDashboardStats(statsData);

      // Fetch categories
      const categoriesResponse = await fetch(`${baseUrl}/admin/categories${buildQuery()}`);
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

      // Countries: prefer the dashboard response; fall back to /admin/countries
      let countriesData = Array.isArray(statsData?.countries) ? statsData.countries : null;
      if (!Array.isArray(countriesData)) {
        const countriesResponse = await fetch(`${baseUrl}/admin/countries${buildQuery()}`);
        countriesData = await countriesResponse.json();
      }

      // Filter out null countries and calculate percentages
      const validCountries = (countriesData || []).filter(country => country.country !== null);
      const totalListings = validCountries.reduce((sum, country) => sum + country.listings, 0);
      
      const countriesWithPercentage = validCountries.map(country => ({
        name: country.country || 'N/A',
        listings: country.listings,
        percentage: totalListings > 0 ? ((country.listings / totalListings) * 100).toFixed(1) : 0
      })).sort((a, b) => b.listings - a.listings);

      setTopCountries(countriesWithPercentage);
      setAvailableCountries(validCountries.map(c => c.country).filter(Boolean));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStorageDisplay = (storage) => {
    if (!storage) return '0 GB';
    const tb = parseFloat(storage.tb ?? 0);
    const gb = parseFloat(storage.gb ?? 0);
    if (Number.isFinite(tb) && tb >= 1) {
      return `${tb} TB`;
    }
    if (Number.isFinite(gb) && gb > 0) {
      return `${gb} GB`;
    }
    const bytes = Number(storage.bytes);
    if (Number.isFinite(bytes) && bytes > 0) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return '0 GB';
  };

  // Safely convert possibly undefined/null values to numbers for display
  const toNumber = (val) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  };

  // Derive totals from available arrays when numeric totals are not present
  const derivedTotals = (() => {
    const countriesCount = Array.isArray(dashboardStats?.countries)
      ? dashboardStats.countries.filter(c => c.country !== null).length
      : (Array.isArray(topCountries) ? topCountries.length : 0);
    const categoriesCount = Array.isArray(dashboardStats?.categories)
      ? dashboardStats.categories.length
      : (Array.isArray(categoryStats) ? categoryStats.length : 0);
    const totalListingsCount = Array.isArray(dashboardStats?.categories)
      ? dashboardStats.categories.reduce((sum, c) => sum + (Number(c.listings) || 0), 0)
      : (Array.isArray(categoryStats) ? categoryStats.reduce((sum, c) => sum + (Number(c.listings) || 0), 0) : 0);
    return { countriesCount, categoriesCount, totalListingsCount };
  })();

  const storageValue = (() => {
    // Prefer structured storage, but handle string totalStorage
    if (dashboardStats?.storage) return getStorageDisplay(dashboardStats.storage);
    if (typeof dashboardStats?.totalStorage === 'string') {
      // Display string as-is; for bytes, show 0 GB
      const s = dashboardStats.totalStorage.trim();
      if (s.endsWith('B')) return '0 GB';
      return s;
    }
    return '0 GB';
  })();

  const overallStats = dashboardStats ? [
    { label: 'Total Countries', value: derivedTotals.countriesCount.toLocaleString(), icon: Globe, color: 'blue' },
    { label: 'Total Categories', value: derivedTotals.categoriesCount.toLocaleString(), icon: Tag, color: 'green' },
    { label: 'Total Listings', value: derivedTotals.totalListingsCount.toLocaleString(), icon: Package, color: 'purple' },
    { label: 'Storage Used', value: storageValue, icon: HardDrive, color: 'orange' }
  ] : [];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <div className="flex items-center space-x-4">
            <button onClick={handleClearFilters} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Clear All</button>
            <button
              onClick={handleApplyFilters}
              disabled={Boolean(tempFromDate && tempToDate && tempFromDate > tempToDate)}
              className={`text-white text-sm font-medium px-4 py-2 rounded-lg ${tempFromDate && tempToDate && tempFromDate > tempToDate ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Apply Filters
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a9bf7] focus:border-[#0a9bf7]"
            >
              <option value="">Select category...</option>
              {allCategories.map(cat => (
                <option key={cat.name} value={cat.displayName || cat.name}>{cat.displayName || cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={tempCountry}
              onChange={(e) => setTempCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a9bf7] focus:border-[#0a9bf7]"
            >
              <option value="">Select country...</option>
              {availableCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={tempFromDate}
              onChange={(e) => setTempFromDate(e.target.value)}
              max={tempToDate || undefined}
              className="date-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a9bf7] focus:border-[#0a9bf7]"
              placeholder="Select from date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={tempToDate}
              onChange={(e) => setTempToDate(e.target.value)}
              min={tempFromDate || undefined}
              className="date-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a9bf7] focus:border-[#0a9bf7]"
              placeholder="Select to date"
            />
            {Boolean(tempFromDate && tempToDate && tempFromDate > tempToDate) && (
              <p className="mt-2 text-xs text-red-600">To date must be after From date.</p>
            )}
          </div>
        </div>
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
          {(filterCategory ? categoryStats.filter(c => c.name === filterCategory) : categoryStats)
            .slice()
            .sort((a, b) => b.listings - a.listings)
            .map((category, index) => {
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
            {(filterCountry ? topCountries.filter(c => c.name === filterCountry) : topCountries).map((country, index) => (
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
          Storage per category: {(() => {
            const bytes = Number(dashboardStats?.storage?.bytes);
            const categories = derivedTotals.categoriesCount;
            if (!Number.isFinite(bytes) || categories <= 0) return '0';
            return (bytes / categories / (1024 * 1024 * 1024)).toFixed(2);
          })()} GB
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