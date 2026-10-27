import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { getCampaignById } from '../services/api';
import { 
  Heart, 
  Share2, 
  CheckCircle2, 
  User, 
  Clock, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Check, 
  ArrowLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const { openDonateModal, campaigns } = useCampaigns();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'updates' | 'documents' | 'donors'
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    // Look up in loaded campaigns first or fetch
    const existing = campaigns.find(c => c._id === id);
    if (existing) {
      setCampaign(existing);
      setLoading(false);
    } else {
      getCampaignById(id)
        .then(data => {
          setCampaign(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, campaigns]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ marginTop: '16px', color: '#64748b' }}>Loading fundraiser details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <AlertCircle size={48} className="text-danger" style={{ marginBottom: '16px' }} />
        <h2>Fundraiser Not Found</h2>
        <p>The fundraiser you are looking for may have concluded or been removed.</p>
        <Link to="/campaigns" className="btn-hero-secondary" style={{ marginTop: '20px', display: 'inline-flex' }}>
          <ArrowLeft size={16} style={{ marginRight: '6px' }} />
          Back to All Fundraisers
        </Link>
      </div>
    );
  }

  const target = campaign.targetAmount || 1;
  const raised = campaign.raisedAmount || 0;
  const percentage = Math.min(Math.round((raised / target) * 100), 100);

  const formatRupee = (num) => '₹' + Number(num || 0).toLocaleString('en-IN');

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: `Please contribute to ${campaign.title} on Ketto!`,
          url
        });
        return;
      } catch (e) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {}
  };

  const organizerName = typeof campaign.organizer === 'object' 
    ? campaign.organizer?.name 
    : campaign.organizer || 'Family Member';
    
  const organizerRelation = typeof campaign.organizer === 'object'
    ? campaign.organizer?.relation
    : '';

  return (
    <div className="campaign-detail-page">
      {/* Breadcrumb Bar */}
      <div className="breadcrumb-bar">
        <div className="container">
          <Link to="/campaigns" className="breadcrumb-back-link">
            <ArrowLeft size={16} />
            <span>Back to Browse Fundraisers</span>
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        <div className="detail-layout-grid">
          {/* Left Column: Media & Story Tabs */}
          <div className="detail-main-col">
            <h1 className="detail-page-title">{campaign.title}</h1>

            {/* Campaign Banner Image */}
            <div className="detail-banner-wrap">
              <img
                src={campaign.imageUrl || '/assets/images/hero-banner.png'}
                alt={campaign.title}
                className="detail-banner-img"
              />
              <div className="detail-badge-strip">
                {campaign.urgencyTag && (
                  <span className="badge badge-urgent">{campaign.urgencyTag}</span>
                )}
                {campaign.taxBenefit80G && (
                  <span className="badge badge-tax">80G Tax Exemption</span>
                )}
                {campaign.isVerified && (
                  <span className="badge badge-verified">
                    <CheckCircle2 size={13} style={{ marginRight: '4px' }} />
                    Hospital Verified Case
                  </span>
                )}
              </div>
            </div>

            {/* Organizer Info Header */}
            <div className="organizer-profile-card">
              <div className="organizer-avatar-icon">
                <User size={20} />
              </div>
              <div className="organizer-details">
                <div className="organizer-name">
                  Initiated by <strong>{organizerName}</strong>
                  {organizerRelation && <span className="relation-tag">({organizerRelation})</span>}
                </div>
                <div className="organizer-patient">
                  Beneficiary / Patient: <strong>{campaign.patientName}</strong>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="detail-tabs-bar">
              <button
                type="button"
                className={`detail-tab-btn ${activeTab === 'story' ? 'active' : ''}`}
                onClick={() => setActiveTab('story')}
              >
                Story & Diagnosis
              </button>
              <button
                type="button"
                className={`detail-tab-btn ${activeTab === 'updates' ? 'active' : ''}`}
                onClick={() => setActiveTab('updates')}
              >
                Updates ({campaign.updates?.length || 0})
              </button>
              <button
                type="button"
                className={`detail-tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                Verified Documents
              </button>
              <button
                type="button"
                className={`detail-tab-btn ${activeTab === 'donors' ? 'active' : ''}`}
                onClick={() => setActiveTab('donors')}
              >
                Community Donors ({campaign.donorsCount || 0})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="detail-tab-content">
              {activeTab === 'story' && (
                <div className="tab-story-body">
                  <h3 className="section-subheading">About the Patient's Condition</h3>
                  <p className="story-paragraph">
                    {campaign.story || 
                      `The patient, ${campaign.patientName}, is currently undergoing critical treatment and hospitalization. Medical specialists have emphasized the urgency of intervention. With household resources strained, the family is turning to the wider community for support to cover ongoing medical procedures, ICU room charges, and vital therapies.`}
                  </p>

                  <div className="hospital-callout-card">
                    <Building2 size={24} className="text-primary" />
                    <div>
                      <h4>Treating Hospital</h4>
                      <p>{campaign.hospitalName || 'Verified Specialized Hospital Center'}</p>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        Funds are directly remitted to the hospital accounts upon campaign request.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'updates' && (
                <div className="tab-updates-body">
                  <h3 className="section-subheading">Fundraiser Progress Updates</h3>
                  {Array.isArray(campaign.updates) && campaign.updates.length > 0 ? (
                    <div className="updates-timeline">
                      {campaign.updates.map((update, idx) => (
                        <div key={idx} className="timeline-item">
                          <div className="timeline-dot" />
                          <div className="timeline-date">{update.date}</div>
                          <div className="timeline-text">{update.text}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No updates posted yet. The campaigner will share vitals updates here shortly.</p>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="tab-documents-body">
                  <h3 className="section-subheading">Verified Medical Records</h3>
                  <div className="doc-cards-grid">
                    <div className="doc-item-card">
                      <FileText size={28} className="text-primary" />
                      <div>
                        <h5>Hospital Estimation Certificate</h5>
                        <span>Verified by Ketto Trust & Safety Team</span>
                      </div>
                    </div>
                    <div className="doc-item-card">
                      <ShieldCheck size={28} className="text-success" />
                      <div>
                        <h5>Doctor Diagnosis & Prescription</h5>
                        <span>Attested by attending medical consultant</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'donors' && (
                <div className="tab-donors-body">
                  <h3 className="section-subheading">Top Community Contributors</h3>
                  <div className="donors-list">
                    <div className="donor-list-item">
                      <div className="donor-avatar">R</div>
                      <div className="donor-info">
                        <strong>Rohan Sharma</strong>
                        <span>Contributed ₹2,500 • 2 hours ago</span>
                      </div>
                    </div>
                    <div className="donor-list-item">
                      <div className="donor-avatar">A</div>
                      <div className="donor-info">
                        <strong>Anonymous Well-wisher</strong>
                        <span>Contributed ₹5,000 • 5 hours ago</span>
                      </div>
                    </div>
                    <div className="donor-list-item">
                      <div className="donor-avatar">P</div>
                      <div className="donor-info">
                        <strong>Pooja Deshmukh</strong>
                        <span>Contributed ₹1,000 • 1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Donation Card */}
          <div className="detail-sidebar-col">
            <div className="sticky-donate-box">
              <div className="sidebar-progress-header">
                <span className="sidebar-raised-amount">{formatRupee(raised)}</span>
                <span className="sidebar-goal-amount">raised of {formatRupee(target)}</span>
              </div>

              {/* Progress Bar */}
              <div className="progress-track large">
                <div className="progress-fill" style={{ width: `${percentage}%` }} />
              </div>

              <div className="sidebar-metrics-row">
                <div className="metric-col">
                  <strong>{percentage}%</strong>
                  <span>Funded</span>
                </div>
                <div className="metric-col">
                  <strong>{campaign.donorsCount || 0}</strong>
                  <span>Supporters</span>
                </div>
                <div className="metric-col">
                  <strong>{campaign.daysLeft !== undefined ? campaign.daysLeft : 15}</strong>
                  <span>Days Left</span>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                className="btn-primary-cta w-full donate-cta-large"
                onClick={() => openDonateModal(campaign)}
              >
                <Heart size={20} fill="#ffffff" />
                <span>Donate to this Cause</span>
              </button>

              <button
                type="button"
                className={`btn-card-share w-full share-cta-large ${copied ? 'copied' : ''}`}
                onClick={handleShare}
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    <span>Link Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={18} />
                    <span>Spread the Word (Share)</span>
                  </>
                )}
              </button>

              {/* Trust Indicators */}
              <div className="sidebar-trust-box">
                <div className="trust-point">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>0% Platform Fee - 100% of donation transferred</span>
                </div>
                {campaign.taxBenefit80G && (
                  <div className="trust-point">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Eligible for 50% Tax Deduction under 80G</span>
                  </div>
                )}
                <div className="trust-point">
                  <Clock size={16} className="text-primary" />
                  <span>Direct 24-48h cashless transfer to hospital</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
