import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CampaignProvider } from './context/CampaignContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DonateModal from './components/DonateModal';
import StartFundraiserModal from './components/StartFundraiserModal';
import AuthModal from './components/AuthModal';

// Pages
import HomePage from './pages/HomePage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import StartFundraiserPage from './pages/StartFundraiserPage';
import SIPPage from './pages/SIPPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CampaignProvider>
          <div className="app-container">
            {/* Header & Sticky Navigation */}
            <Navbar />

            {/* Page Routes */}
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/campaigns" element={<CampaignsPage />} />
                <Route path="/campaign/:id" element={<CampaignDetailPage />} />
                <Route path="/start-fundraiser" element={<StartFundraiserPage />} />
                <Route path="/sip" element={<SIPPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Global Interactive Modals */}
            <DonateModal />
            <StartFundraiserModal />
            <AuthModal />
          </div>
        </CampaignProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
