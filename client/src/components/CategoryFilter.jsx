import React from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { CATEGORIES } from '../data/mockData';

export default function CategoryFilter({ showTitle = false }) {
  const { selectedCategory, setSelectedCategory, campaigns } = useCampaigns();

  // Calculate count for each category
  const getCategoryCount = (catId) => {
    if (catId === 'all') return campaigns.length;
    return campaigns.filter(c => c.category === catId).length;
  };

  return (
    <div className="category-filter-wrapper">
      {showTitle && (
        <div className="section-header">
          <span className="section-tag">Causes That Need You</span>
          <h2 className="section-title">Explore Fundraisers by Category</h2>
          <p className="section-subtitle">
            Choose a cause close to your heart and make an immediate life-saving difference today.
          </p>
        </div>
      )}

      <div className="category-pills-row">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="pill-icon">{cat.icon}</span>
              <span className="pill-label">{cat.label}</span>
              {count > 0 && <span className="pill-count">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
