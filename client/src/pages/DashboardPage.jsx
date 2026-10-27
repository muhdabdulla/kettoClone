import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCampaigns } from '../context/CampaignContext';
import { 
  User, 
  Heart, 
  Receipt, 
  FileText, 
  PlusCircle, 
  Download, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, openAuth } = useAuth();
  const { userDonations, myFundraisers, openStartModal } = useCampaigns();
  const [activeTab, setActiveTab] = useState('donations'); // 'donations' | 'fundraisers' | 'receipts'

  const totalDonated = userDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const currentUser = user || {
    name: 'Rahul Sharma',
    email: 'rahul@example.com'
  };

  return (
    <div className="dashboard-page">
      <div className="container" style={{ padding: '40px 20px 80px' }}>
        {/* User Profile Banner */}
        <div className="dashboard-header-card">
          <div className="dashboard-avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="dashboard-user-info">
            <h2>{currentUser.name}</h2>
            <p>{currentUser.email}</p>
            <span className="badge-donor">Verified Ketto Supporter</span>
          </div>

          <div className="dashboard-quick-actions">
            <button
              type="button"
              className="btn-primary-cta"
              onClick={openStartModal}
            >
              <PlusCircle size={16} />
              <span>Start New Fundraiser</span>
            </button>
          </div>
        </div>

        {/* Impact Overview Stats */}
        <div className="dashboard-stats-grid">
          <div className="dash-stat-card">
            <div className="dash-stat-icon">❤️</div>
            <div className="dash-stat-data">
              <span className="dash-val">₹{totalDonated.toLocaleString('en-IN')}</span>
              <span className="dash-label">Total Amount Donated</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">🎁</div>
            <div className="dash-stat-data">
              <span className="dash-val">{userDonations.length}</span>
              <span className="dash-label">Donations Completed</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <div className="dash-stat-icon">🏥</div>
            <div className="dash-stat-data">
              <span className="dash-val">{myFundraisers.length}</span>
              <span className="dash-label">Fundraisers Created</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="dashboard-tabs-bar">
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            <Heart size={16} />
            <span>My Donations ({userDonations.length})</span>
          </button>
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'fundraisers' ? 'active' : ''}`}
            onClick={() => setActiveTab('fundraisers')}
          >
            <FileText size={16} />
            <span>My Fundraisers ({myFundraisers.length})</span>
          </button>
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'receipts' ? 'active' : ''}`}
            onClick={() => setActiveTab('receipts')}
          >
            <Receipt size={16} />
            <span>80G Tax Certificates</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="dashboard-content-box">
          {/* TAB 1: DONATIONS */}
          {activeTab === 'donations' && (
            <div>
              {userDonations.length === 0 ? (
                <div className="empty-state-wrap">
                  <Heart size={44} className="text-muted" style={{ marginBottom: '12px' }} />
                  <h3>No Donations Yet</h3>
                  <p>When you donate to verified causes on Ketto, your contributions will appear here.</p>
                  <Link to="/campaigns" className="btn-hero-secondary" style={{ marginTop: '16px' }}>
                    Browse Verified Causes
                  </Link>
                </div>
              ) : (
                <div className="donations-table-wrap">
                  <table className="donations-table">
                    <thead>
                      <tr>
                        <th>Receipt ID</th>
                        <th>Fundraiser Cause</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>80G Tax Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userDonations.map((don) => (
                        <tr key={don.id}>
                          <td><strong>{don.id}</strong></td>
                          <td>
                            <Link to={`/campaign/${don.campaignId}`} className="table-campaign-link">
                              {don.campaignTitle}
                            </Link>
                          </td>
                          <td>{don.date}</td>
                          <td className="text-primary font-bold">
                            ₹{Number(don.amount).toLocaleString('en-IN')}
                          </td>
                          <td>
                            <span className="badge badge-verified">
                              <CheckCircle2 size={12} style={{ marginRight: '3px' }} />
                              80G Eligible
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn-download-receipt"
                              onClick={() => alert(`Receipt ${don.id} generated for ₹${don.amount}. Sent to ${don.donorEmail}`)}
                            >
                              <Download size={13} style={{ marginRight: '4px' }} />
                              Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY FUNDRAISERS */}
          {activeTab === 'fundraisers' && (
            <div>
              {myFundraisers.length === 0 ? (
                <div className="empty-state-wrap">
                  <FileText size={44} className="text-muted" style={{ marginBottom: '12px' }} />
                  <h3>No Fundraisers Started Yet</h3>
                  <p>Need funds for hospital bills or social causes? Start with 0% platform fee.</p>
                  <button
                    type="button"
                    className="btn-primary-cta"
                    onClick={openStartModal}
                    style={{ marginTop: '16px' }}
                  >
                    Start a Fundraiser for FREE
                  </button>
                </div>
              ) : (
                <div className="campaigns-grid">
                  {myFundraisers.map((camp) => (
                    <div key={camp._id} className="campaign-card">
                      <div className="card-media">
                        <img src={camp.imageUrl} alt={camp.title} />
                      </div>
                      <div className="card-body">
                        <h3 className="card-title">{camp.title}</h3>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                          Beneficiary: {camp.patientName}
                        </p>
                        <div className="card-progress-wrapper">
                          <div className="progress-track">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min(Math.round(((camp.raisedAmount || 0) / (camp.targetAmount || 1)) * 100), 100)}%`
                              }}
                            />
                          </div>
                          <div className="card-stats-row">
                            <span className="raised-val">₹{(camp.raisedAmount || 0).toLocaleString('en-IN')}</span>
                            <span className="raised-goal">of ₹{Number(camp.targetAmount || 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <Link 
                          to={`/campaign/${camp._id}`} 
                          className="btn-card-donate w-full text-center"
                          style={{ marginTop: '12px' }}
                        >
                          View Live Page
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 80G RECEIPTS */}
          {activeTab === 'receipts' && (
            <div className="receipts-tab-view">
              <div className="tax-summary-banner">
                <h3>80G Tax Exemption Guide</h3>
                <p>
                  Donations made through Ketto are eligible for up to 50% deduction under Section 80G of the Income Tax Act. Download consolidated annual receipts for tax filing.
                </p>
              </div>

              {userDonations.length > 0 ? (
                <div className="receipt-items-list">
                  {userDonations.map((don) => (
                    <div key={don.id} className="receipt-item-row">
                      <div className="receipt-item-left">
                        <Receipt size={24} className="text-primary" />
                        <div>
                          <h4>{don.campaignTitle}</h4>
                          <span className="text-muted">Receipt #{don.id} • Date: {don.date}</span>
                        </div>
                      </div>
                      <div className="receipt-item-right">
                        <span className="receipt-amt">₹{Number(don.amount).toLocaleString('en-IN')}</span>
                        <button
                          type="button"
                          className="btn-download-receipt"
                          onClick={() => alert(`Receipt #${don.id} download initiated.`)}
                        >
                          <Download size={14} style={{ marginRight: '4px' }} />
                          Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted" style={{ textAlign: 'center', padding: '30px 0' }}>
                  No donations yet. Tax receipts will automatically be generated here after each donation.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
