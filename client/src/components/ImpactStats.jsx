import React from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { TrendingUp, Users, HeartHandshake, Building2 } from 'lucide-react';

const DEFAULT_STATS = [
  { value: "₹450+ Cr", label: "Total Funds Raised", sublabel: "For urgent medical needs", icon: TrendingUp },
  { value: "55 Lakh+", label: "Generous Donors", sublabel: "From 120+ countries", icon: Users },
  { value: "1.2 Lakh+", label: "Successful Fundraisers", sublabel: "0% platform fee", icon: HeartHandshake },
  { value: "3,500+", label: "Hospital Partners", sublabel: "Direct cashless disbursal", icon: Building2 }
];

export default function ImpactStats() {
  const { impactStats } = useCampaigns();
  const statsList = Array.isArray(impactStats) && impactStats.length === 4 ? impactStats : DEFAULT_STATS;

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {statsList.map((stat, idx) => {
            const Icon = DEFAULT_STATS[idx]?.icon || TrendingUp;
            return (
              <div key={idx} className="stat-card">
                <div className="stat-icon-wrap">
                  <Icon size={24} className="stat-icon" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-sub">{stat.sublabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
