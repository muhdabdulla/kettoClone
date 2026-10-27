import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCampaigns } from '../context/CampaignContext';
import { 
  Heart, 
  Search, 
  Phone, 
  MessageCircle, 
  User, 
  LogOut, 
  PlusCircle, 
  Menu, 
  X,
  ChevronDown,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, openAuth } = useAuth();
  const { searchQuery, setSearchQuery, openStartModal } = useCampaigns();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/campaigns') {
      navigate('/campaigns');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/campaigns' && e.target.value.trim().length > 2) {
      navigate('/campaigns');
    }
  };

  return (
    <>
      {/* TOP NOTIFICATION BAR */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <span className="top-badge">0% Fee</span>
            <span className="top-bar-text">
              Start a fundraiser with 0% Platform Fee. Maximize funds for your loved ones!
            </span>
          </div>
          <div className="top-bar-right">
            <a href="tel:+919930088522" className="top-link">
              <Phone size={14} />
              <span>24/7 Helpline: +91 99300 88522</span>
            </a>
            <Link to="/#how-it-works" className="top-link">How It Works</Link>
          </div>
        </div>
      </div>

      {/* STICKY NAVBAR */}
      <header className="header">
        <div className="container">
          <div className="nav-container">
            {/* Logo */}
            <Link to="/" className="logo-container">
              <div className="logo-icon">
                <Heart size={20} fill="#ffffff" stroke="#ffffff" />
              </div>
              <div className="logo-text">
                ketto
                <span className="logo-sub">For Everyone</span>
              </div>
            </Link>

            {/* Live Search Bar */}
            <form onSubmit={handleSearchSubmit} className="header-search">
              <div className="search-input-wrapper">
                <span className="search-icon">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by cause, patient or hospital..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </form>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav">
              <ul className="nav-menu">
                <li>
                  <Link 
                    to="/campaigns" 
                    className={`nav-link ${location.pathname === '/campaigns' ? 'active' : ''}`}
                  >
                    Browse Fundraisers
                  </Link>
                </li>
                <li>
                  <Link to="/sip" className={`nav-link ${location.pathname === '/sip' ? 'active' : ''}`}>
                    Social Impact Plan
                    <span className="nav-badge-sip">New</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="https://api.whatsapp.com/send?phone=919930088522"
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-nav-btn"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Action Buttons */}
            <div className="nav-actions">
              {isAuthenticated ? (
                <div className="user-profile-menu">
                  <button 
                    className="btn-user-profile"
                    onClick={() => setUserDropdownOpen(prev => !prev)}
                  >
                    <div className="user-avatar-circle">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>

                  {userDropdownOpen && (
                    <div className="user-dropdown-menu">
                      <div className="dropdown-header">
                        <p className="dropdown-user-name">{user.name}</p>
                        <p className="dropdown-user-email">{user.email}</p>
                      </div>
                      <div className="dropdown-divider" />
                      <Link 
                        to="/dashboard" 
                        className="dropdown-item"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        <span>My Dashboard</span>
                      </Link>
                      <button 
                        className="dropdown-item text-danger"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="btn-signin" onClick={() => openAuth('login')}>
                  <User size={15} style={{ marginRight: '6px' }} />
                  Sign In
                </button>
              )}

              <button className="btn-primary-cta" onClick={openStartModal}>
                <PlusCircle size={16} />
                <span>Start a Fundraiser</span>
                <span className="badge-free">0% Fee</span>
              </button>

              <button 
                className="mobile-menu-toggle" 
                onClick={() => setMobileMenuOpen(prev => !prev)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-search-wrap">
              <form onSubmit={handleSearchSubmit}>
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search causes..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
            </div>
            <ul className="mobile-nav-list">
              <li>
                <Link 
                  to="/campaigns" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-link"
                >
                  Browse Fundraisers
                </Link>
              </li>
              <li>
                <Link 
                  to="/sip" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-link"
                >
                  Social Impact Plan (SIP)
                </Link>
              </li>
              <li>
                <Link 
                  to="/start-fundraiser" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-link text-primary font-bold"
                >
                  Start a Fundraiser (0% Fee)
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-link"
                    >
                      My Dashboard ({user.name})
                    </Link>
                  </li>
                  <li>
                    <button 
                      className="mobile-nav-link text-danger w-full text-left"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button 
                    className="mobile-nav-link w-full text-left"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuth('login');
                    }}
                  >
                    Sign In / Register
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
