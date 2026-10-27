import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { Share2, Heart, CheckCircle2, User, Clock, Check } from 'lucide-react';

export default function CampaignCard({ campaign }) {
  const { openDonateModal } = useCampaigns();
  const [copied, setCopied] = useState(false);

  if (!campaign) return null;

  const target = campaign.targetAmount || 1;
  const raised = campaign.raisedAmount || 0;
  const percentage = Math.min(Math.round((raised / target) * 100), 100);

  const formatRupee = (num) => {
    return '₹' + Number(num || 0).toLocaleString('en-IN');
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/campaign/${campaign._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: `Please support this urgent fundraiser: ${campaign.title}`,
          url
        });
        return;
      } catch (err) {}
    }
    // Fallback: clipboard copy
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {}
  };

  return (
    <div className="campaign-card" data-category={campaign.category}>
      {/* Card Media */}
      <div className="card-media">
        <Link to={`/campaign/${campaign._id}`}>
          <img
            src={campaign.imageUrl || '/assets/images/hero-banner.png'}
            alt={campaign.title}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/assets/images/hero-banner.png';
            }}
          />
        </Link>
        <div className="card-badge-container">
          {campaign.urgencyTag && (
            <span className="badge badge-urgent">{campaign.urgencyTag}</span>
          )}
          {campaign.taxBenefit80G && (
            <span className="badge badge-tax">80G Benefit</span>
          )}
          {campaign.isVerified && (
            <span className="badge badge-verified">
              <CheckCircle2 size={11} style={{ marginRight: '3px' }} />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/campaign/${campaign._id}`} title={campaign.title}>
            {campaign.title}
          </Link>
        </h3>

        <div className="card-organizer">
          <User size={13} className="organizer-icon" />
          <span>
            By {typeof campaign.organizer === 'object' ? campaign.organizer?.name : campaign.organizer || 'Campaign Organizer'}
            {campaign.organizer?.relation ? ` (${campaign.organizer.relation})` : ''}
          </span>
        </div>

        {/* Progress Bar & Stats */}
        <div className="card-progress-wrapper">
          <div className="progress-track" title={`${percentage}% Funded`}>
            <div 
              className="progress-fill" 
              style={{ width: `${percentage}%` }} 
            />
          </div>

          <div className="card-stats-row">
            <div className="raised-col">
              <span className="raised-val">{formatRupee(raised)}</span>
              <span className="raised-goal">raised of {formatRupee(target)}</span>
            </div>
            <div className="card-meta-right">
              <div className="donors-count">{campaign.donorsCount || 0} Donors</div>
              <div className="days-left">
                <Clock size={12} style={{ marginRight: '3px' }} />
                {campaign.daysLeft !== undefined ? `${campaign.daysLeft} Days Left` : 'Active'}
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="card-footer-actions">
          <button
            type="button"
            className="btn-card-donate"
            onClick={() => openDonateModal(campaign)}
          >
            <Heart size={15} style={{ marginRight: '5px' }} />
            Donate Now
          </button>

          <button
            type="button"
            className={`btn-card-share ${copied ? 'copied' : ''}`}
            onClick={handleShare}
            title={copied ? 'Link Copied!' : 'Share Fundraiser'}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
