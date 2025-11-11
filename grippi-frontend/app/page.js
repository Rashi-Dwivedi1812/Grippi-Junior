'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, MousePointer, Eye, DollarSign } from 'lucide-react';

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/campaigns';
        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error('Failed to fetch data from the API');
        }
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    if (filter === 'All') return true;
    return campaign.status === filter;
  });

  // Calculate summary stats
  const stats = {
    total: filteredCampaigns.length,
    clicks: filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0),
    cost: filteredCampaigns.reduce((sum, c) => sum + c.cost, 0),
    impressions: filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0),
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <p className="text-red-600 font-semibold text-center text-lg">Error Loading Data</p>
          <p className="text-slate-600 text-center mt-2">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Campaign Analytics
            </h1>
          </div>
          <p className="text-slate-600 ml-14">Monitor and analyze your campaign performance</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Total Campaigns</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Total Clicks</span>
              <MousePointer className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.clicks.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Total Cost</span>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">${stats.cost.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Total Impressions</span>
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.impressions.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter and Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-800">Campaign Details</h2>
              <div className="flex items-center gap-3">
                <label htmlFor="status-filter" className="text-sm font-medium text-slate-700">
                  Status:
                </label>
                <select
                  id="status-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-700 font-medium cursor-pointer transition-all"
                >
                  <option value="All">All Campaigns</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-4 text-left">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Campaign Name</span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Status</span>
                  </th>
                  <th className="p-4 text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Clicks</span>
                  </th>
                  <th className="p-4 text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Cost</span>
                  </th>
                  <th className="p-4 text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Impressions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((campaign, index) => (
                    <tr 
                      key={campaign.id} 
                      className="hover:bg-slate-50 transition-colors group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4">
                        <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {campaign.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          campaign.status === 'Active'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            campaign.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'
                          }`}></span>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-slate-700 font-medium">{campaign.clicks.toLocaleString()}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-slate-700 font-medium">${campaign.cost.toFixed(2)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-slate-700 font-medium">{campaign.impressions.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                          <BarChart3 className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">No campaigns found</p>
                        <p className="text-slate-500 text-sm">Try adjusting your filter to see more results</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}