/* ==========================================================================
   COMPONENT LOADER - DYNAMIC HTML INCLUSION
   ========================================================================== */

async function loadComponents() {
  const elements = document.querySelectorAll('[data-component]');
  
  const loadPromises = Array.from(elements).map(async (el) => {
    const file = el.getAttribute('data-component');
    try {
      const response = await fetch(file);
      if (response.ok) {
        const html = await response.text();
        el.outerHTML = html;
      } else {
        console.error(`Failed to load component: ${file} (status: ${response.status})`);
      }
    } catch (err) {
      console.error(`Error loading component ${file}:`, err);
    }
  });

  await Promise.all(loadPromises);

  // Initialize all modular scripts after DOM components are inserted
  if (typeof window.initHeader === 'function') window.initHeader();
  if (typeof window.initCampaigns === 'function') window.initCampaigns();
  if (typeof window.initSIP === 'function') window.initSIP();
  if (typeof window.initFAQ === 'function') window.initFAQ();
  if (typeof window.initModals === 'function') window.initModals();
}

document.addEventListener('DOMContentLoaded', loadComponents);
