/* ==========================================================================
   SOCIAL IMPACT PLAN (SIP) SCRIPT
   ========================================================================== */

function initSIP() {
  const sipPresets = document.querySelectorAll('.sip-preset-btn');
  sipPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      sipPresets.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Export / Attach to window
window.initSIP = initSIP;
