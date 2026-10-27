import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo-row">
              <div className="logo-icon small">
                <Heart size={16} fill="#ffffff" stroke="#ffffff" />
              </div>
              <span className="footer-logo-text">ketto</span>
            </Link>
            <p className="footer-desc">
              Ketto is India's most trusted online crowdfunding platform for medical emergencies, 
              cancer care, education, and social causes. Raising funds at 0% platform fee.
            </p>
            <div className="social-icons-row">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">f</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">𝕏</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">ig</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">in</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="YouTube">yt</a>
            </div>
          </div>

          {/* Causes Column */}
          <div className="footer-col">
            <h4>Causes</h4>
            <ul className="footer-links">
              <li><Link to="/campaigns?category=medical">Medical Crowdfunding</Link></li>
              <li><Link to="/campaigns?category=cancer">Cancer Treatment</Link></li>
              <li><Link to="/campaigns?category=children">Child Healthcare</Link></li>
              <li><Link to="/campaigns?category=education">Education Support</Link></li>
              <li><Link to="/campaigns?category=animal">Animal Welfare</Link></li>
              <li><Link to="/campaigns">NGO Fundraising</Link></li>
            </ul>
          </div>

          {/* How It Works Column */}
          <div className="footer-col">
            <h4>How It Works</h4>
            <ul className="footer-links">
              <li><Link to="/#how-it-works">For Individuals</Link></li>
              <li><Link to="/#how-it-works">For NGOs & Charities</Link></li>
              <li><Link to="/#how-it-works">For Corporates & CSR</Link></li>
              <li><Link to="/sip">Social Impact Plan (SIP)</Link></li>
              <li><Link to="/start-fundraiser">Fundraising Tips</Link></li>
            </ul>
          </div>

          {/* About Us Column */}
          <div className="footer-col">
            <h4>About Us</h4>
            <ul className="footer-links">
              <li><Link to="/#">Team Ketto</Link></li>
              <li><Link to="/#">Hospital Partners</Link></li>
              <li><Link to="/#">Careers</Link></li>
              <li><Link to="/#">Press Club</Link></li>
              <li><Link to="/#">Impact Stories</Link></li>
            </ul>
          </div>

          {/* Support & Trust Column */}
          <div className="footer-col">
            <h4>Support & Safety</h4>
            <ul className="footer-links">
              <li>
                <a href="tel:+919930088522">
                  <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  24/7 Helpline Support
                </a>
              </li>
              <li>
                <a href="mailto:support@ketto.org">
                  <Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  support@ketto.org
                </a>
              </li>
              <li><Link to="/#">Trust & Safety Policy</Link></li>
              <li><Link to="/#">80G Tax Exemption Guide</Link></li>
              <li><Link to="/#">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom-row">
          <div className="copyright-text">
            © 2026 Ketto Online Ventures. All rights reserved. | 
            <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 4px', color: '#01bfbd' }} />
            256-Bit SSL Encrypted & Secure
          </div>
          <div className="payment-badges-row">
            <span className="pay-badge">UPI</span>
            <span className="pay-badge">Google Pay</span>
            <span className="pay-badge">PhonePe</span>
            <span className="pay-badge">Paytm</span>
            <span className="pay-badge">Visa / Master</span>
            <span className="pay-badge">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
