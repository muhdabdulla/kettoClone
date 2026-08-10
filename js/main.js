/* ==========================================================================
   KETTO CLONE - MASTER JS (MODULE INITIALIZATION)
   Initializes all modular scripts after DOM is ready.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  if (typeof window.initHeader === 'function') window.initHeader();
  if (typeof window.initCampaigns === 'function') window.initCampaigns();
  if (typeof window.initSIP === 'function') window.initSIP();
  if (typeof window.initFAQ === 'function') window.initFAQ();
  if (typeof window.initModals === 'function') window.initModals();
});
