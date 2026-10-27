import React from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { Shield, ArrowRight, Heart, Sparkles, Clock, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  const { openStartModal, liveDonationToast, toastVisible } = useCampaigns();

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Hero Content */}
          <div className="hero-content">
            <div className="hero-tag">
              <Shield size={16} />
              <span>India's Most Trusted Crowdfunding Platform</span>
            </div>

            <h1 className="hero-title">
              Need Funds to Pay For a <span className="highlight">Medical Emergency</span> or Social Cause?
            </h1>

            <p className="hero-desc">
              Crowdfunding on Ketto is fast, transparent, and comes with <strong>0% Platform Fee</strong>. 
              Raise money for hospital bills, surgeries, or noble causes with support from 55 Lakh+ donors.
            </p>

            <div className="hero-cta-group">
              <button 
                type="button" 
                className="btn-hero-main"
                onClick={openStartModal}
              >
                <span>Start a Fundraiser for FREE</span>
                <ArrowRight size={18} />
              </button>

              <Link to="/campaigns" className="btn-hero-secondary">
                <span>Donate to Ongoing Causes</span>
              </Link>
            </div>

            {/* Hero Trust Pillars */}
            <div className="hero-trust-pillars">
              <div className="pillar-item">
                <div className="pillar-icon">0%</div>
                <div className="pillar-content">
                  <h4>Platform Fee</h4>
                  <p>Keep 100% of funds raised</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon">24h</div>
                <div className="pillar-content">
                  <h4>Fast Disbursal</h4>
                  <p>Direct hospital transfer</p>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon">80G</div>
                <div className="pillar-content">
                  <h4>Tax Benefits</h4>
                  <p>Save tax on your donations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="hero-visual-wrapper">
            <div className="hero-img-card">
              <img 
                src="/assets/images/hero-banner.png" 
                alt="Doctor caring for patient family" 
                loading="eager"
              />
            </div>

            {/* Floating Impact Stat */}
            <div className="floating-stat-card">
              <div className="floating-donor-icon">❤️</div>
              <div>
                <div className="floating-stat-title">Total Impact</div>
                <div className="floating-stat-val">₹450+ Crores Raised</div>
              </div>
            </div>

            {/* Floating Live Donor Ticker */}
            {liveDonationToast && (
              <div className={`floating-live-toast ${toastVisible ? 'toast-fade-in' : 'toast-fade-out'}`}>
                <div className="pulse-dot" />
                <span>
                  <strong>{liveDonationToast.name}</strong> donated{' '}
                  <span className="toast-amount">₹{liveDonationToast.amount.toLocaleString('en-IN')}</span> for{' '}
                  <span className="toast-campaign">{liveDonationToast.campaign}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
