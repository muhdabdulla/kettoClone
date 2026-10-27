import React from 'react';
import { useCampaigns } from '../context/CampaignContext';
import CategoryFilter from '../components/CategoryFilter';
import CampaignCard from '../components/CampaignCard';
import { Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';

export default function CampaignsPage() {
  const { 
    campaigns, 
    loading, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    sortBy, 
    setSortBy,
    loadCampaigns 
  } = useCampaigns();

  return (
    <div className="campaigns-page">
      {/* Page Header */}
      <div className="page-hero-banner">
        <div className="container">
          <span className="section-tag" style={{ color: '#01bfbd' }}>Browse Verified Causes</span>
          <h1 className="page-hero-title">Support a Life-Saving Fundraiser Today</h1>
          <p className="page-hero-desc">
            All medical fundraisers on Ketto are vetted with hospital records, doctor certificates, and zero platform fee deduction.
          </p>

          {/* Search bar inside page header */}
          <div className="page-search-wrapper">
            <div className="search-input-wrapper large">
              <span className="search-icon">
                <Search size={20} />
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by cause, patient name, hospital, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '60px' }}>
        {/* Category Pills */}
        <CategoryFilter />

        {/* Filter Bar with Sort Dropdown & Count */}
        <div className="filter-summary-row">
          <div className="results-count">
            Showing <strong>{campaigns.length}</strong> active campaigns
            {selectedCategory !== 'all' && (
              <span className="active-filter-badge">
                in {selectedCategory}
                <button type="button" onClick={() => setSelectedCategory('all')}>✕</button>
              </span>
            )}
            {searchQuery && (
              <span className="active-filter-badge">
                matching "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery('')}>✕</button>
              </span>
            )}
          </div>

          <div className="sort-controls">
            <label className="sort-label">
              <Filter size={14} />
              <span>Sort by:</span>
            </label>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="all">Default / Recommended</option>
              <option value="most_urgent">Most Urgent (Closing Soon)</option>
              <option value="most_funded">Most Funded</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Campaign Cards Grid */}
        {loading ? (
          <div className="loading-state-wrap">
            <div className="spinner" />
            <p>Filtering fundraisers...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="empty-state-wrap">
            <AlertCircle size={40} className="text-muted" style={{ marginBottom: '12px' }} />
            <h3>No matching fundraisers found</h3>
            <p>Try searching for a different keyword or resetting your category filter.</p>
            <button
              type="button"
              className="btn-hero-secondary"
              style={{ marginTop: '16px' }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('all');
              }}
            >
              <RefreshCw size={15} style={{ marginRight: '6px' }} />
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="campaigns-grid">
            {campaigns.map((camp) => (
              <CampaignCard key={camp._id} campaign={camp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
