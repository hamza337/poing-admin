import React from 'react';
import { BarChart3, Globe, Tag, DollarSign, HardDrive, AlertTriangle, Heart, Search, Shield, Users, Package } from 'lucide-react';

const Dashboard = () => {
  // Mock data for demonstration
  const overallStats = [
    { label: 'Total Countries', value: '45', icon: Globe, color: 'blue' },
    { label: 'Total Categories', value: '6', icon: Tag, color: 'green' },
    { label: 'Total Listings', value: '12,847', icon: Package, color: 'purple' },
    { label: 'Storage Used', value: '2.4 TB', icon: HardDrive, color: 'orange' }
  ];

  const categoryStats = [
    { name: 'Accident', listings: 2847, sales: '$45,230', icon: AlertTriangle, color: 'red' },
    { name: 'Pet', listings: 3421, sales: '$67,890', icon: Heart, color: 'pink' },
    { name: 'Lost & Found', listings: 1923, sales: '$23,450', icon: Search, color: 'yellow' },
    { name: 'Crime', listings: 1567, sales: '$31,200', icon: Shield, color: 'red' },
    { name: 'People', listings: 2089, sales: '$41,780', icon: Users, color: 'blue' },
    { name: 'Other', listings: 1000, sales: '$15,600', icon: Package, color: 'gray' }
  ];

  const topCountries = [
    { name: 'United States', listings: 3245, percentage: 25.2 },
    { name: 'United Kingdom', listings: 2156, percentage: 16.8 },
    { name: 'Canada', listings: 1834, percentage: 14.3 },
    { name: 'Australia', listings: 1423, percentage: 11.1 },
    { name: 'Germany', listings: 1189, percentage: 9.3 }
  ];

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
                    <span className="text-sm font-semibold text-green-600">{category.sales}</span>
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
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
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
                <span className="text-sm font-bold text-gray-900">2.4 TB / 5.0 TB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '48%'}}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">98.5%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">1.2s</div>
                <div className="text-xs text-gray-600">Avg Response</div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-600 mb-2">Category Distribution</div>
              <div className="flex space-x-1">
                <div className="flex-1 bg-red-400 h-2 rounded-l"></div>
                <div className="flex-1 bg-pink-400 h-2"></div>
                <div className="flex-1 bg-yellow-400 h-2"></div>
                <div className="flex-1 bg-red-500 h-2"></div>
                <div className="flex-1 bg-blue-400 h-2"></div>
                <div className="flex-1 bg-gray-400 h-2 rounded-r"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;