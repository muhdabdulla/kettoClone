import React from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import HeroSection from '../components/HeroSection';
import ImpactStats from '../components/ImpactStats';
import CategoryFilter from '../components/CategoryFilter';
import CampaignCard from '../components/CampaignCard';
import HowItWorks from '../components/HowItWorks';
import SocialImpactPlanSection from '../components/SocialImpactPlanSection';
import FAQAccordion from '../components/FAQAccordion';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const { campaigns, loading, error, openStartModal } = useCampaigns();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <HeroSection />

      {/* Impact Stats */}
      <ImpactStats />

      {/* Category Pills & Campaign Grid */}
      <section className="campaigns-section" id="campaigns">
        <div className="container">
          <CategoryFilter showTitle={true} />

          {loading ? (
            <div className="loading-state-wrap">
              <div className="spinner" />
              <p>Loading active verified fundraisers...</p>
            </div>
          ) : error ? (
            <div className="error-state-wrap">
              <AlertCircle size={32} className="text-danger" />
              <p>{error}</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="empty-state-wrap">
              <p>No campaigns found in this category.</p>
            </div>
          ) : (
            <div className="campaigns-grid">
              {campaigns.slice(0, 6).map((camp) => (
                <CampaignCard key={camp._id} campaign={camp} />
              ))}
            </div>
          )}

          <div className="explore-more-wrap">
            <Link to="/campaigns" className="btn-hero-secondary">
              <span>Explore All 2,500+ Active Campaigns</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Impact Plan Section */}
      <SocialImpactPlanSection />

      {/* How It Works (3 Steps) */}
      <HowItWorks />

      {/* Bottom CTA Banner */}
      <section className="bottom-cta-section">
        <div className="container">
          <div className="bottom-cta-box">
            <div className="cta-content">
              <span className="cta-badge">
                <Sparkles size={14} />
                0% Platform Fee Guarantee
              </span>
              <h2 className="cta-title">Need Urgent Funds for Medical Bills?</h2>
              <p className="cta-desc">
                Over 55 Lakh+ donors have supported patients across India. Start your fundraiser in 2 minutes with zero platform deduction.
              </p>
            </div>
            <div className="cta-actions">
              <button 
                type="button" 
                className="btn-hero-main"
                onClick={openStartModal}
              >
                <span>Start a Fundraiser for FREE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <FAQAccordion />
    </div>
  );
}
