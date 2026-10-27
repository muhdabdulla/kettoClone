import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { X, Sparkles, AlertCircle, CheckCircle2, ArrowRight, Image as ImageIcon } from 'lucide-react';

const COVER_OPTIONS = [
  { label: 'Medical ICU', url: '/assets/images/hero-banner.png' },
  { label: 'Child Healthcare', url: '/assets/images/campaign-nicu.png' },
  { label: 'Cancer Care', url: '/assets/images/campaign-cancer.png' },
  { label: 'Education Aid', url: '/assets/images/campaign-education.png' },
  { label: 'Animal Rescue', url: '/assets/images/campaign-animal.png' }
];

export default function StartFundraiserModal() {
  const { startModalOpen, closeStartModal, handleAddNewCampaign } = useCampaigns();
  const navigate = useNavigate();

  // Controlled form state
  const [beneficiaryType, setBeneficiaryType] = useState('Myself / Immediate Family');
  const [category, setCategory] = useState('medical');
  const [otherCause, setOtherCause] = useState('');
  const [title, setTitle] = useState('');
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [story, setStory] = useState('');
  const [selectedImage, setSelectedImage] = useState('/assets/images/hero-banner.png');
  const [organizerName, setOrganizerName] = useState('Ankit Mehra');

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCampaign, setCreatedCampaign] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && startModalOpen) {
        closeStartModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startModalOpen, closeStartModal]);

  if (!startModalOpen) return null;

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
      errs.otherCause = 'Please specify your cause category';
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

  const handleClose = () => {
    setCreatedCampaign(null);
    setErrors({});
    closeStartModal();
  };

  const handleViewCampaign = () => {
    const id = createdCampaign?._id;
    handleClose();
    if (id) {
      navigate(`/campaign/${id}`);
    } else {
      navigate('/campaigns');
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box modal-box-large" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {createdCampaign ? (
          /* SUCCESS SCREEN */
          <div className="donation-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={54} className="success-icon" />
            </div>
            <h3 className="modal-title text-success">Fundraiser Live on Ketto!</h3>
            <p className="modal-subtitle">
              Your fundraiser <strong>"{createdCampaign.title}"</strong> has been approved and published at 0% platform fee.
            </p>

            <div className="preview-campaign-box">
              <img 
                src={createdCampaign.imageUrl} 
                alt={createdCampaign.title}
                className="preview-img"
              />
              <div className="preview-info">
                <h4>{createdCampaign.title}</h4>
                <p>Goal: ₹{Number(createdCampaign.targetAmount).toLocaleString('en-IN')}</p>
                <p className="text-muted">Beneficiary: {createdCampaign.patientName}</p>
              </div>
            </div>

            <div className="modal-actions-row">
              <button 
                type="button" 
                className="btn-primary-cta w-full"
                onClick={handleViewCampaign}
              >
                <span>View My Fundraiser</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* START FORM */
          <>
            <div className="modal-header-section">
              <span className="modal-badge">
                <Sparkles size={13} fill="#01bfbd" stroke="#01bfbd" />
                0% Platform Fee
              </span>
              <h3 className="modal-title">Start a Fundraiser with 0% Fee</h3>
              <p className="modal-subtitle">
                Raise money for hospital bills, treatments, or noble causes in less than 2 minutes.
              </p>
            </div>

            {errors.form && (
              <div className="form-error-alert">
                <AlertCircle size={16} />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row-2">
                {/* Beneficiary Type */}
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

                {/* Category */}
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

              {/* Conditional "Other" category */}
              {category === 'other' && (
                <div className="form-group">
                  <label className="form-label">
                    Specify Your Cause <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.otherCause ? 'input-error' : ''}`}
                    placeholder="e.g. Disaster Relief, Community Sports, Rural Development"
                    value={otherCause}
                    onChange={(e) => {
                      setOtherCause(e.target.value);
                      if (errors.otherCause) setErrors(prev => ({ ...prev, otherCause: null }));
                    }}
                  />
                  {errors.otherCause && <p className="field-error-msg">{errors.otherCause}</p>}
                </div>
              )}

              {/* Campaign Title */}
              <div className="form-group">
                <label className="form-label">
                  Fundraiser Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'input-error' : ''}`}
                  placeholder="e.g. Urgent Surgery Needed for 5-Year-Old Rohan"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                  }}
                />
                {errors.title && <p className="field-error-msg">{errors.title}</p>}
              </div>

              <div className="form-row-2">
                {/* Patient Name */}
                <div className="form-group">
                  <label className="form-label">
                    Patient / Beneficiary Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.patientName ? 'input-error' : ''}`}
                    placeholder="e.g. Rohan Sharma"
                    value={patientName}
                    onChange={(e) => {
                      setPatientName(e.target.value);
                      if (errors.patientName) setErrors(prev => ({ ...prev, patientName: null }));
                    }}
                  />
                  {errors.patientName && <p className="field-error-msg">{errors.patientName}</p>}
                </div>

                {/* Target Amount */}
                <div className="form-group">
                  <label className="form-label">
                    Target Goal Amount (₹) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    className={`form-input ${errors.targetAmount ? 'input-error' : ''}`}
                    placeholder="e.g. 500000"
                    value={targetAmount}
                    onChange={(e) => {
                      setTargetAmount(e.target.value);
                      if (errors.targetAmount) setErrors(prev => ({ ...prev, targetAmount: null }));
                    }}
                  />
                  {errors.targetAmount && <p className="field-error-msg">{errors.targetAmount}</p>}
                </div>
              </div>

              {/* Hospital Name */}
              <div className="form-group">
                <label className="form-label">Hospital or Clinic Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Apollo Hospital, Fortis, AIIMS"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                />
              </div>

              {/* Cover Photo Choice */}
              <div className="form-group">
                <label className="form-label">Choose Cover Photo</label>
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

              {/* Story */}
              <div className="form-group">
                <label className="form-label">
                  Explain Medical Urgency & Story <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={3}
                  className={`form-input ${errors.story ? 'input-error' : ''}`}
                  placeholder="Describe the patient's medical condition, diagnosis, and why community help is urgently needed..."
                  value={story}
                  onChange={(e) => {
                    setStory(e.target.value);
                    if (errors.story) setErrors(prev => ({ ...prev, story: null }));
                  }}
                />
                {errors.story && <p className="field-error-msg">{errors.story}</p>}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-primary-cta w-full"
                disabled={isSubmitting}
                style={{ padding: '14px', fontSize: '1.05rem', marginTop: '10px' }}
              >
                {isSubmitting ? (
                  <span>Publishing Fundraiser...</span>
                ) : (
                  <>
                    <span>Publish Fundraiser for FREE</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
