import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCampaigns, getImpactStats, createDonation, createCampaign } from '../services/api';
import { INITIAL_CAMPAIGNS, SIMULATED_DONATIONS } from '../data/mockData';
import confetti from 'canvas-confetti';

const CampaignContext = createContext(null);

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Sorting state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('all');

  // Stats state
  const [impactStats, setImpactStats] = useState(null);

  // Modal Dialogs state
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [selectedCampaignForDonate, setSelectedCampaignForDonate] = useState(null);
  const [startModalOpen, setStartModalOpen] = useState(false);

  // User History (persisted in localStorage for demo)
  const [userDonations, setUserDonations] = useState(() => {
    try {
      const stored = localStorage.getItem('ketto_user_donations');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [myFundraisers, setMyFundraisers] = useState(() => {
    try {
      const stored = localStorage.getItem('ketto_my_fundraisers');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Simulated live donation ticker toast
  const [liveDonationToast, setLiveDonationToast] = useState(SIMULATED_DONATIONS[0]);
  const [toastVisible, setToastVisible] = useState(true);

  // Persist user activities
  useEffect(() => {
    localStorage.setItem('ketto_user_donations', JSON.stringify(userDonations));
  }, [userDonations]);

  useEffect(() => {
    localStorage.setItem('ketto_my_fundraisers', JSON.stringify(myFundraisers));
  }, [myFundraisers]);

  // Load campaigns from API or Fallback
  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCampaigns({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy
      });
      if (Array.isArray(data) && data.length > 0) {
        setCampaigns(data);
      } else {
        // If empty results from query
        setCampaigns(data || []);
      }
    } catch (err) {
      setError(err.message || 'Error fetching fundraisers');
      setCampaigns(INITIAL_CAMPAIGNS);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy]);

  // Load impact stats on mount
  useEffect(() => {
    loadCampaigns();
    getImpactStats().then(stats => {
      if (stats) setImpactStats(stats);
    });
  }, [loadCampaigns]);

  // Live donation ticker simulator
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % SIMULATED_DONATIONS.length;
      setToastVisible(false);
      setTimeout(() => {
        setLiveDonationToast(SIMULATED_DONATIONS[index]);
        setToastVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Donate Modal Actions
  const openDonateModal = (campaign = null) => {
    const target = campaign || campaigns[0] || INITIAL_CAMPAIGNS[0];
    setSelectedCampaignForDonate(target);
    setDonateModalOpen(true);
  };

  const closeDonateModal = () => {
    setDonateModalOpen(false);
  };

  // Start Fundraiser Modal Actions
  const openStartModal = () => {
    setStartModalOpen(true);
  };

  const closeStartModal = () => {
    setStartModalOpen(false);
  };

  // Process Donation
  const handleMakeDonation = async ({ campaignId, amount, donorName, donorEmail, panCard, isAnonymous }) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      throw new Error('Please enter a valid donation amount');
    }

    // Call API
    const result = await createDonation({
      campaignId,
      amount: numericAmount,
      donorName: isAnonymous ? 'Anonymous' : donorName,
      donorEmail,
      panCard
    });

    // Update campaign raisedAmount and donorsCount optimistically
    setCampaigns(prev =>
      prev.map(c => {
        if (c._id === campaignId) {
          return {
            ...c,
            raisedAmount: (c.raisedAmount || 0) + numericAmount,
            donorsCount: (c.donorsCount || 0) + 1
          };
        }
        return c;
      })
    );

    // Save donation record to history
    const targetCampaign = campaigns.find(c => c._id === campaignId) || selectedCampaignForDonate;
    const newDonationRecord = {
      id: 'REC_' + Math.floor(100000 + Math.random() * 900000),
      campaignId,
      campaignTitle: targetCampaign?.title || 'Medical Emergency Fundraiser',
      amount: numericAmount,
      donorName: isAnonymous ? 'Anonymous' : donorName,
      donorEmail,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      certificate80G: !!targetCampaign?.taxBenefit80G,
      status: 'Completed'
    };

    setUserDonations(prev => [newDonationRecord, ...prev]);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    return newDonationRecord;
  };

  // Process New Campaign Creation
  const handleAddNewCampaign = async (campaignData) => {
    const result = await createCampaign(campaignData);
    const newCamp = result?.data || {
      _id: 'camp_' + Date.now(),
      ...campaignData,
      raisedAmount: 0,
      donorsCount: 0,
      daysLeft: 30,
      isVerified: true
    };

    // Add to state and myFundraisers
    setCampaigns(prev => [newCamp, ...prev]);
    setMyFundraisers(prev => [newCamp, ...prev]);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    return newCamp;
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        impactStats,
        loadCampaigns,
        // Modals
        donateModalOpen,
        selectedCampaignForDonate,
        openDonateModal,
        closeDonateModal,
        startModalOpen,
        openStartModal,
        closeStartModal,
        // Operations
        handleMakeDonation,
        handleAddNewCampaign,
        userDonations,
        myFundraisers,
        // Live Toast
        liveDonationToast,
        toastVisible
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within a CampaignProvider');
  }
  return context;
}
