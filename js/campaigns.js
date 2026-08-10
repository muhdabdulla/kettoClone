/* ==========================================================================
   CAMPAIGNS & CATEGORIES SCRIPT
   ========================================================================== */

function initCampaigns() {
  const catPills = document.querySelectorAll('.cat-pill');
  const campaignCards = document.querySelectorAll('.campaign-card');

  // Category Filtering
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const selectedCategory = pill.getAttribute('data-category');

      campaignCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCat === selectedCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Search Bar Live Filtering
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      campaignCards.forEach(card => {
        const title = card.querySelector('.card-title')?.innerText.toLowerCase() || '';
        const organizer = card.querySelector('.card-organizer')?.innerText.toLowerCase() || '';
        const category = card.getAttribute('data-category')?.toLowerCase() || '';

        if (title.includes(term) || organizer.includes(term) || category.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

// Export / Attach to window
window.initCampaigns = initCampaigns;
