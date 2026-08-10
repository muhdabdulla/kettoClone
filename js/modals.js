/* ==========================================================================
   MODALS, POPUPS & TOAST SCRIPT
   ========================================================================== */

// Toast Notification Helper
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="color:#22c55e;">✔</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function initModals() {
  const donateModal = document.getElementById('donateModal');
  const startModal = document.getElementById('startModal');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  // Open Donate Modal
  const donateBtns = document.querySelectorAll('.btn-card-donate, .open-donate-modal');
  donateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!donateModal) return;

      const card = btn.closest('.campaign-card');
      const campaignTitle = card ? card.querySelector('.card-title')?.innerText : 'Urgent Medical Cause';
      
      const modalTitle = donateModal.querySelector('.modal-title');
      if (modalTitle) {
        modalTitle.innerText = `Donate to: ${campaignTitle.substring(0, 42)}...`;
      }
      donateModal.classList.add('active');
    });
  });

  // Open Start Fundraiser Modal
  const startBtns = document.querySelectorAll('.open-start-modal');
  startBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (startModal) {
        startModal.classList.add('active');
      }
    });
  });

  // Close Modals on X click
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (donateModal) donateModal.classList.remove('active');
      if (startModal) startModal.classList.remove('active');
    });
  });

  // Close Modals on Backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === donateModal) donateModal.classList.remove('active');
    if (e.target === startModal) startModal.classList.remove('active');
  });

  // Donate Modal Preset Amounts
  const donatePresetBtns = document.querySelectorAll('.donate-preset-btn');
  const customAmountInput = document.querySelector('.custom-amount-input');

  donatePresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      donatePresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const amt = btn.getAttribute('data-amount');
      if (customAmountInput) customAmountInput.value = amt;
    });
  });

  // Submit Donation Mock Flow
  const donateSubmitBtn = document.getElementById('donateSubmitBtn');
  if (donateSubmitBtn) {
    donateSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const amount = customAmountInput ? customAmountInput.value || '1000' : '1000';
      if (donateModal) donateModal.classList.remove('active');
      showToast(`Thank you! Simulated contribution of ₹${Number(amount).toLocaleString('en-IN')} received. Tax 80G receipt generated.`);
    });
  }

  // Submit Start Fundraiser Mock Flow
  const startSubmitBtn = document.getElementById('startSubmitBtn');
  if (startSubmitBtn) {
    startSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (startModal) startModal.classList.remove('active');
      showToast('Fundraiser setup submitted! Our campaign expert will reach out to you.');
    });
  }

  // WhatsApp and Share Buttons
  const shareBtns = document.querySelectorAll('.btn-card-share, .share-btn');
  shareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast('Campaign link copied to clipboard!');
      } else {
        showToast('Campaign shared!');
      }
    });
  });
}

// Export / Attach to window
window.initModals = initModals;
window.showToast = showToast;
