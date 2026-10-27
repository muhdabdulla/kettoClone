import React, { useState, useEffect } from 'react';
import { useCampaigns } from '../context/CampaignContext';
import { 
  X, 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  Receipt, 
  Download, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const PRESETS = [500, 1000, 2500, 5000];

export default function DonateModal() {
  const { 
    donateModalOpen, 
    closeDonateModal, 
    selectedCampaignForDonate, 
    handleMakeDonation 
  } = useCampaigns();

  // Controlled form state
  const [amount, setAmount] = useState(1000);
  const [donorName, setDonorName] = useState('Rahul Sharma');
  const [donorEmail, setDonorEmail] = useState('rahul@example.com');
  const [want80G, setWant80G] = useState(true);
  const [panCard, setPanCard] = useState('ABCDE1234F');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(null);

  // Synchronize default amount from campaign if provided
  useEffect(() => {
    if (selectedCampaignForDonate?.defaultAmount) {
      setAmount(selectedCampaignForDonate.defaultAmount);
    }
  }, [selectedCampaignForDonate]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && donateModalOpen) {
        closeDonateModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [donateModalOpen, closeDonateModal]);

  if (!donateModalOpen) return null;

  const campaign = selectedCampaignForDonate || {
    title: 'Emergency Medical Fundraiser',
    patientName: 'Patient in Need',
    taxBenefit80G: true
  };

  const validate = () => {
    const errs = {};
    const num = Number(amount);
    if (!num || num < 50) {
      errs.amount = 'Minimum donation amount is ₹50';
    }
    if (!isAnonymous && (!donorName || donorName.trim().length < 2)) {
      errs.donorName = 'Please enter your full name';
    }
    if (!donorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail)) {
      errs.donorEmail = 'Please provide a valid email address';
    }
    if (want80G && (!panCard || panCard.trim().length !== 10)) {
      errs.panCard = 'Valid 10-digit PAN is required for 80G tax certificate';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    try {
      const receipt = await handleMakeDonation({
        campaignId: campaign._id,
        amount: Number(amount),
        donorName,
        donorEmail,
        panCard: want80G ? panCard : '',
        isAnonymous
      });
      setDonationSuccess(receipt);
    } catch (err) {
      setErrors({ form: err.message || 'Payment simulation failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setDonationSuccess(null);
    setErrors({});
    closeDonateModal();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={handleResetAndClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {donationSuccess ? (
          /* SUCCESS CONFIRMATION RECEIPT SCREEN */
          <div className="donation-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={52} className="success-icon" />
            </div>
            <h3 className="modal-title text-success">Thank You for Your Kindness!</h3>
            <p className="modal-subtitle">
              Your contribution has been successfully processed and credited to the fundraiser.
            </p>

            <div className="receipt-card">
              <div className="receipt-header">
                <Receipt size={18} />
                <span>Tax Exemption Donation Receipt</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Receipt Number</span>
                <span className="receipt-val">{donationSuccess.id}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Beneficiary / Cause</span>
                <span className="receipt-val truncate-text">{campaign.title}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Donor Name</span>
                <span className="receipt-val">{donationSuccess.donorName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Amount Donated</span>
                <span className="receipt-val text-primary font-bold">
                  ₹{Number(donationSuccess.amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">80G Certificate</span>
                <span className="receipt-val text-success font-semibold">Eligible & Issued</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Status</span>
                <span className="receipt-badge-completed">Paid via {paymentMethod.toUpperCase()}</span>
              </div>
            </div>

            <p className="receipt-sent-note">
              A copy of this 80G receipt has been emailed to <strong>{donorEmail}</strong>.
            </p>

            <div className="modal-actions-row">
              <button 
                type="button" 
                className="btn-primary-cta w-full"
                onClick={handleResetAndClose}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* DONATION FORM */
          <>
            <div className="modal-header-section">
              <span className="modal-badge">
                <Heart size={13} fill="#01bfbd" stroke="#01bfbd" />
                Verified Fundraiser
              </span>
              <h3 className="modal-title">Make a Contribution</h3>
              <p className="modal-subtitle">
                Supporting: <strong>{campaign.title}</strong>
              </p>
            </div>

            {errors.form && (
              <div className="form-error-alert">
                <AlertCircle size={16} />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Presets Grid */}
            <div className="donate-presets-grid">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`donate-preset-btn ${Number(amount) === preset ? 'active' : ''}`}
                  onClick={() => {
                    setAmount(preset);
                    if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
                  }}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Custom Amount */}
              <div className="form-group">
                <label className="form-label">
                  Enter Custom Amount (₹) <span className="text-danger">*</span>
                </label>
                <div className="input-with-prefix">
                  <span className="input-prefix">₹</span>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    className={`form-input custom-amount-input ${errors.amount ? 'input-error' : ''}`}
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
                    }}
                    placeholder="e.g. 1500"
                  />
                </div>
                {errors.amount && <p className="field-error-msg">{errors.amount}</p>}
              </div>

              {/* Anonymous Checkbox */}
              <div className="checkbox-row" style={{ marginBottom: '12px' }}>
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <label htmlFor="anonymousCheck">Donate anonymously (hide my name from public list)</label>
              </div>

              {/* Full Name */}
              {!isAnonymous && (
                <div className="form-group">
                  <label className="form-label">
                    Your Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.donorName ? 'input-error' : ''}`}
                    value={donorName}
                    onChange={(e) => {
                      setDonorName(e.target.value);
                      if (errors.donorName) setErrors(prev => ({ ...prev, donorName: null }));
                    }}
                    placeholder="e.g. Rahul Sharma"
                  />
                  {errors.donorName && <p className="field-error-msg">{errors.donorName}</p>}
                </div>
              )}

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">
                  Email Address (for instant 80G tax receipt) <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-input ${errors.donorEmail ? 'input-error' : ''}`}
                  value={donorEmail}
                  onChange={(e) => {
                    setDonorEmail(e.target.value);
                    if (errors.donorEmail) setErrors(prev => ({ ...prev, donorEmail: null }));
                  }}
                  placeholder="rahul@example.com"
                />
                {errors.donorEmail && <p className="field-error-msg">{errors.donorEmail}</p>}
              </div>

              {/* 80G Tax Exemption Toggle & Conditional PAN input */}
              <div className="tax-check-box">
                <div className="checkbox-row">
                  <input
                    type="checkbox"
                    id="tax80gCheck"
                    checked={want80G}
                    onChange={(e) => setWant80G(e.target.checked)}
                  />
                  <label htmlFor="tax80gCheck">
                    <strong>I want 80G Tax Exemption Certificate</strong>
                    <span className="tax-subtext"> (Save up to 50% tax under Section 80G)</span>
                  </label>
                </div>

                {want80G && (
                  <div className="conditional-pan-field">
                    <label className="form-label">
                      PAN Card Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      className={`form-input pan-input ${errors.panCard ? 'input-error' : ''}`}
                      value={panCard}
                      onChange={(e) => {
                        setPanCard(e.target.value.toUpperCase());
                        if (errors.panCard) setErrors(prev => ({ ...prev, panCard: null }));
                      }}
                      placeholder="e.g. ABCDE1234F"
                    />
                    {errors.panCard && <p className="field-error-msg">{errors.panCard}</p>}
                  </div>
                )}
              </div>

              {/* Payment Mode Selector */}
              <div className="form-group">
                <label className="form-label">Select Payment Mode</label>
                <div className="payment-modes-grid">
                  <button
                    type="button"
                    className={`pay-mode-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <span>⚡ UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    className={`pay-mode-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <span>💳 Debit/Credit Card</span>
                  </button>
                  <button
                    type="button"
                    className={`pay-mode-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <span>🏦 NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-primary-cta w-full donate-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Processing Secure Payment...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Proceed to Pay ₹{Number(amount || 0).toLocaleString('en-IN')}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="secure-badge-footer">
                <ShieldCheck size={14} className="text-primary" />
                <span>256-Bit SSL Secured • 0% Platform Fee • Tax Deductible</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
