import React, { useState } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { Sparkles, Check, HeartHandshake } from 'lucide-react';

const SIP_PRESETS = [500, 1000, 2500];

export default function SocialImpactPlanSection() {
  const [selectedPlan, setSelectedPlan] = useState(500);
  const { openDonateModal } = useCampaigns();

  const handleStartSIP = () => {
    // Open donate modal with pre-selected amount
    openDonateModal({
      _id: 'sip_monthly_cause',
      title: 'Ketto Social Impact Plan (Monthly ICU Support)',
      patientName: 'Critically Ill ICU Patients',
      category: 'medical',
      taxBenefit80G: true,
      targetAmount: 5000000,
      raisedAmount: 4120000,
      donorsCount: 45200,
      defaultAmount: selectedPlan
    });
  };

  return (
    <section className="sip-banner-section" id="sip-section">
      <div className="container">
        <div className="sip-grid">
          {/* Left SIP Info */}
          <div className="sip-content">
            <div className="sip-badge">
              <Sparkles size={16} />
              <span>Ketto Social Impact Plan (SIP)</span>
            </div>
            <h2 className="sip-title">Give Every Month. Save Critical Lives Every Day.</h2>
            <p className="sip-desc">
              Join over 45,000+ monthly donors who contribute as little as ₹500/month to provide immediate 
              emergency funding for underprivileged patients in critical ICU situations without delay.
            </p>
            <div className="sip-features">
              <div className="sip-feat-item">
                <Check size={18} className="sip-check-icon" />
                <span>100% Verified Hospital Cases</span>
              </div>
              <div className="sip-feat-item">
                <Check size={18} className="sip-check-icon" />
                <span>Monthly Patient Impact Reports</span>
              </div>
              <div className="sip-feat-item">
                <Check size={18} className="sip-check-icon" />
                <span>80G Tax Exemption Certificate</span>
              </div>
              <div className="sip-feat-item">
                <Check size={18} className="sip-check-icon" />
                <span>Cancel or Pause Anytime</span>
              </div>
            </div>
          </div>

          {/* Right SIP Giving Box */}
          <div className="sip-card-box">
            <div className="sip-card-title">Select Monthly Giving Amount</div>
            <div className="sip-card-sub">Tax benefit applicable on all monthly plans</div>

            <div className="sip-amount-presets">
              {SIP_PRESETS.map(amt => (
                <button
                  key={amt}
                  type="button"
                  className={`sip-preset-btn ${selectedPlan === amt ? 'active' : ''}`}
                  onClick={() => setSelectedPlan(amt)}
                >
                  ₹{amt.toLocaleString('en-IN')} /mo
                </button>
              ))}
            </div>

            <div className="sip-impact-note">
              <span>Impact: </span>
              <strong>
                {selectedPlan === 500 && 'Sponsors vital medicines for 1 child in ICU every month'}
                {selectedPlan === 1000 && 'Covers 2 days of emergency oxygen & ventilator support'}
                {selectedPlan === 2500 && 'Sponsors critical dialysis or diagnostic MRI for 2 patients'}
              </strong>
            </div>

            <button
              type="button"
              className="btn-sip-action"
              onClick={handleStartSIP}
            >
              <HeartHandshake size={18} style={{ marginRight: '6px' }} />
              Start Monthly Giving (₹{selectedPlan.toLocaleString('en-IN')})
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
