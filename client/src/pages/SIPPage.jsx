import React, { useState } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { Sparkles, HeartHandshake, Check, ShieldCheck, Users, Award } from 'lucide-react';

export default function SIPPage() {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const { openDonateModal } = useCampaigns();

  const handleStartSIP = () => {
    openDonateModal({
      _id: 'sip_dedicated_cause',
      title: 'Ketto Monthly Social Impact Plan (ICU Support)',
      patientName: 'Critically Ill ICU Patients',
      category: 'medical',
      taxBenefit80G: true,
      targetAmount: 5000000,
      raisedAmount: 4320000,
      donorsCount: 46100,
      defaultAmount: selectedAmount
    });
  };

  return (
    <div className="sip-page">
      <div className="page-hero-banner sip-hero-banner">
        <div className="container">
          <div className="sip-badge" style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <Sparkles size={16} />
            <span>Ketto Social Impact Plan (SIP)</span>
          </div>
          <h1 className="page-hero-title">Give Monthly. Save Critical Lives Every Single Day.</h1>
          <p className="page-hero-desc">
            Join 45,000+ monthly donors who pool small recurring contributions to ensure no underprivileged patient is turned away from an ICU due to lack of immediate funds.
          </p>

          <div className="sip-calculator-card">
            <h3>Choose Your Monthly Contribution</h3>
            <p>Every contribution is 100% tax exempt under Section 80G</p>

            <div className="sip-amount-presets large">
              {[500, 1000, 2500, 5000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  className={`sip-preset-btn ${selectedAmount === amt ? 'active' : ''}`}
                  onClick={() => setSelectedAmount(amt)}
                >
                  ₹{amt.toLocaleString('en-IN')} /mo
                </button>
              ))}
            </div>

            <div className="sip-calculated-impact">
              <span className="impact-headline">Your Monthly Impact:</span>
              <p>
                {selectedAmount === 500 && 'Supplies life-saving pediatric antibiotics and oxygen for 1 critically ill infant.'}
                {selectedAmount === 1000 && 'Funds 2 days of emergency neonatal ventilator care and ICU nursing support.'}
                {selectedAmount === 2500 && 'Sponsors vital dialysis and emergency blood transfusions for 2 patients.'}
                {selectedAmount === 5000 && 'Covers critical pre-operative tests and emergency surgery deposits for a patient.'}
              </p>
            </div>

            <button
              type="button"
              className="btn-sip-action"
              onClick={handleStartSIP}
              style={{ margin: '20px auto 0', display: 'flex', width: 'fit-content' }}
            >
              <HeartHandshake size={20} style={{ marginRight: '8px' }} />
              Start Monthly SIP with ₹{selectedAmount.toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 20px' }}>
        <div className="section-header">
          <span className="section-tag">Why Choose Ketto SIP?</span>
          <h2 className="section-title">The Most Reliable Way to Give</h2>
        </div>

        <div className="sip-benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🏥</div>
            <h4>Direct Hospital Disbursals</h4>
            <p>100% of your funds are transferred directly to verified hospital accounts without intermediaries.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📑</div>
            <h4>Monthly Transparency Reports</h4>
            <p>Receive comprehensive monthly updates with photos and patient recovery stories of those you helped.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🛡️</div>
            <h4>Instant 80G Tax Certificates</h4>
            <p>Download your consolidated annual 80G certificate anytime to claim 50% income tax exemption.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔄</div>
            <h4>Full Flexibility</h4>
            <p>Pause, modify, or cancel your recurring monthly giving plan at any time with a single click.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
