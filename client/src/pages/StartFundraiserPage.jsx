import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon,
  ShieldCheck,
  Heart
} from 'lucide-react';

const COVER_OPTIONS = [
  { label: 'Medical ICU', url: '/assets/images/hero-banner.png' },
  { label: 'Child Healthcare', url: '/assets/images/campaign-nicu.png' },
  { label: 'Cancer Care', url: '/assets/images/campaign-cancer.png' },
  { label: 'Education Aid', url: '/assets/images/campaign-education.png' },
  { label: 'Animal Rescue', url: '/assets/images/campaign-animal.png' }
];

export default function StartFundraiserPage() {
  const { handleAddNewCampaign } = useCampaigns();
  const navigate = useNavigate();

  // Controlled form state
  const [beneficiaryType, setBeneficiaryType] = useState('Myself / Immediate Family');
  const [category, setCategory] = useState('medical');
  const [otherCause, setOtherCause] = useState('');
  const [title, setTitle] = useState('');
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('500000');
  const [story, setStory] = useState('');
  const [selectedImage, setSelectedImage] = useState('/assets/images/hero-banner.png');
  const [organizerName, setOrganizerName] = useState('Rahul Sharma');

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);

  const validate = () => {
    const errs = {};
    if (!title.trim() || title.trim().length < 10) {
      errs.title = 'Title must be at least 10 characters long';
    }
    if (!patientName.trim()) {
      errs.patientName = 'Patient or beneficiary name is required';
    }
    if (!targetAmount || Number(targetAmount) < 5000) {
      errs.targetAmount = 'Target amount must be at least ₹5,000';
    }
    if (!story.trim() || story.trim().length < 25) {
      errs.story = 'Please provide at least 25 characters describing the medical urgency';
    }
    if (category === 'other' && !otherCause.trim()) {
      errs.otherCause = 'Please specify your cause';
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
      const newCamp = await handleAddNewCampaign({
        title,
        patientName,
        category: category === 'other' ? 'medical' : category,
        targetAmount: Number(targetAmount),
        hospitalName: hospitalName || 'City General Hospital',
        story,
        imageUrl: selectedImage,
        organizer: {
          name: organizerName || 'Campaign Organizer',
          relation: beneficiaryType
        },
        taxBenefit80G: true,
        urgencyTag: 'Urgent Need'
      });
      setCreatedCampaign(newCamp);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to start fundraiser. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="start-fundraiser-page">
      <div className="page-hero-banner">
        <div className="container">
          <span className="section-tag">Zero Cost Crowdfunding</span>
          <h1 className="page-hero-title">Start a Fundraiser with 0% Platform Fee</h1>
          <p className="page-hero-desc">
            Raise funds for hospital bills, surgeries, or personal emergencies in less than 2 minutes. Keep 100% of money raised.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        {createdCampaign ? (
          <div className="start-success-card">
            <CheckCircle2 size={64} className="text-success" style={{ margin: '0 auto 16px' }} />
            <h2>Your Fundraiser is Now Live!</h2>
            <p>
              Your fundraiser <strong>"{createdCampaign.title}"</strong> is actively published on Ketto.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', gap: '14px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-primary-cta"
                onClick={() => navigate(`/campaign/${createdCampaign._id}`)}
              >
                View Campaign Page
              </button>
              <Link to="/campaigns" className="btn-hero-secondary">
                Browse All Campaigns
              </Link>
            </div>
          </div>
        ) : (
          <div className="start-page-grid">
            {/* Form Column */}
            <div className="start-form-card">
              <h2 className="form-card-title">Fundraiser Details</h2>
              <p className="form-card-sub">All details can be updated after review by our hospital verification desk.</p>

              {errors.form && (
                <div className="form-error-alert">
                  <AlertCircle size={16} />
                  <span>{errors.form}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Who are you raising funds for?</label>
                    <select
                      className="form-input"
                      value={beneficiaryType}
                      onChange={(e) => setBeneficiaryType(e.target.value)}
                    >
                      <option>Myself / Immediate Family</option>
                      <option>A Friend / Colleague</option>
                      <option>Registered NGO / Charity</option>
                      <option>Animal Welfare / Rescue</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cause Category</label>
                    <select
                      className="form-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="medical">Medical Emergency / Surgery</option>
                      <option value="children">Child Health & NICU</option>
                      <option value="cancer">Cancer Treatment</option>
                      <option value="education">Education Aid</option>
                      <option value="animal">Animal Shelter</option>
                      <option value="other">Other (Please Specify)</option>
                    </select>
                  </div>
                </div>

                {category === 'other' && (
                  <div className="form-group">
                    <label className="form-label">
                      Specify Cause <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${errors.otherCause ? 'input-error' : ''}`}
                      placeholder="e.g. Disaster Relief, Rural Health"
                      value={otherCause}
                      onChange={(e) => setOtherCause(e.target.value)}
                    />
                    {errors.otherCause && <p className="field-error-msg">{errors.otherCause}</p>}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    Campaign Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.title ? 'input-error' : ''}`}
                    placeholder="e.g. Emergency Open Heart Surgery Needed for 7-Year-Old Rohan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errors.title && <p className="field-error-msg">{errors.title}</p>}
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">
                      Patient / Beneficiary Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${errors.patientName ? 'input-error' : ''}`}
                      placeholder="e.g. Rohan Sharma"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                    {errors.patientName && <p className="field-error-msg">{errors.patientName}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Target Amount (₹) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      step="5000"
                      className={`form-input ${errors.targetAmount ? 'input-error' : ''}`}
                      placeholder="e.g. 500000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                    />
                    {errors.targetAmount && <p className="field-error-msg">{errors.targetAmount}</p>}
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Treating Hospital / Clinic</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. AIIMS Delhi, Apollo Hospital"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Name (Organizer)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Rahul Sharma"
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Campaign Photo</label>
                  <div className="cover-thumbnails-grid">
                    {COVER_OPTIONS.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`cover-thumb-btn ${selectedImage === opt.url ? 'active' : ''}`}
                        onClick={() => setSelectedImage(opt.url)}
                      >
                        <img src={opt.url} alt={opt.label} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Describe Patient Medical Situation <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className={`form-input ${errors.story ? 'input-error' : ''}`}
                    placeholder="Provide details about the patient's condition, the doctor's diagnosis, treatment plan, and how the funds will be utilized..."
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                  />
                  {errors.story && <p className="field-error-msg">{errors.story}</p>}
                </div>

                <button
                  type="submit"
                  className="btn-primary-cta w-full"
                  disabled={isSubmitting}
                  style={{ padding: '16px', fontSize: '1.05rem', marginTop: '12px' }}
                >
                  {isSubmitting ? 'Publishing Fundraiser...' : 'Publish Fundraiser with 0% Fee'}
                </button>
              </form>
            </div>

            {/* Live Card Preview Column */}
            <div className="start-preview-col">
              <div className="live-preview-box">
                <span className="preview-label">Live Campaign Card Preview</span>
                <div className="campaign-card" style={{ maxWidth: '380px', margin: '0 auto' }}>
                  <div className="card-media">
                    <img src={selectedImage} alt="Preview" />
                    <div className="card-badge-container">
                      <span className="badge badge-urgent">Urgent Need</span>
                      <span className="badge badge-tax">80G Benefit</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">
                      {title || 'Urgent Surgery Needed for Patient to Recover'}
                    </h3>
                    <div className="card-organizer">
                      <span>👤 By {organizerName || 'Organizer'} ({beneficiaryType})</span>
                    </div>
                    <div className="card-progress-wrapper">
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: '0%' }} />
                      </div>
                      <div className="card-stats-row">
                        <div className="raised-col">
                          <span className="raised-val">₹0</span>
                          <span className="raised-goal">
                            raised of ₹{Number(targetAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="card-meta-right">
                          <div className="donors-count">0 Donors</div>
                          <div className="days-left">30 Days Left</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="preview-trust-box">
                  <div className="trust-point">
                    <ShieldCheck size={16} className="text-primary" />
                    <span>0% Platform Deduction Guaranteed</span>
                  </div>
                  <div className="trust-point">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Cashless Transfer Directly to Hospital</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
