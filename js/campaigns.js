/* ==========================================================================
   CAMPAIGNS & CATEGORIES SCRIPT
   Connects to Express / MongoDB backend: GET /api/campaigns
   ========================================================================== */

window.API_BASE_URL = window.API_BASE_URL || "http://localhost:5000/api";
var API_BASE_URL = window.API_BASE_URL;

function formatCurrency(num) {
  if (!num && num !== 0) return "₹0";
  return "₹" + Number(num).toLocaleString("en-IN");
}

function renderCampaignCard(campaign) {
  const progress = campaign.progressPercent !== undefined 
    ? campaign.progressPercent 
    : Math.min(100, Math.round(((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100));

  const badgesHtml = (campaign.badges || ["Verified"])
    .map((b, idx) => {
      const cls = idx === 0 ? "badge badge-urgent" : "badge badge-tax";
      return `<span class="${cls}">${b}</span>`;
    })
    .join("");

  return `
    <div class="campaign-card" data-category="${campaign.category}" data-id="${campaign._id}">
      <div class="card-media">
        <img src="${campaign.imageUrl || 'assets/images/hero-banner.png'}" alt="${campaign.title}">
        <div class="card-badge-container">
          ${badgesHtml}
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${campaign.title}</h3>
        <div class="card-organizer">
          <span class="organizer-icon">👤</span> By ${campaign.organizer}
        </div>
        <div class="card-progress-wrapper">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progress}%;"></div>
          </div>
          <div class="card-stats-row">
            <div class="raised-col">
              <span class="raised-val">${formatCurrency(campaign.raisedAmount)}</span>
              <span class="raised-goal">raised of ${formatCurrency(campaign.goalAmount)}</span>
            </div>
            <div class="card-meta-right">
              <div class="donors-count">${(campaign.donorsCount || 0).toLocaleString("en-IN")} Donors</div>
              <div class="days-left">${campaign.daysLeft || 30} Days Left</div>
            </div>
          </div>
        </div>
        <div class="card-footer-actions">
          <button class="btn-card-donate">Donate Now</button>
          <button class="btn-card-share" title="Share Campaign">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.181-.076.355.101.174.449.741.964 1.2 1.014.903 1.637 1.182 1.868 1.297.231.116.368.101.505-.058.138-.159.593-.693.752-.931.159-.24.318-.201.535-.121.217.079 1.378.65 1.616.768.238.118.396.177.454.275.058.098.058.572-.086.977z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
}

async function loadCampaignsFromApi() {
  const grid = document.querySelector(".campaigns-grid");
  if (!grid) return;

  try {
    const res = await fetch(`${API_BASE_URL}/campaigns`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();

    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      grid.innerHTML = result.data.map(renderCampaignCard).join("");
      console.log(`✅ Loaded ${result.data.length} campaigns from backend (${result.source || "api"})`);

      // Re-initialize modal button listeners for dynamically generated cards
      if (typeof window.bindDonateButtons === "function") {
        window.bindDonateButtons();
      }
    }
  } catch (err) {
    console.warn("ℹ️ Could not fetch /api/campaigns (using offline fallback cards):", err.message);
  }
}

function initCampaigns() {
  const catPills = document.querySelectorAll(".cat-pill");
  const searchInputs = document.querySelectorAll(".search-input");

  const applyCampaignFilters = () => {
    const selectedCategory = document.querySelector(".cat-pill.active")?.getAttribute("data-category") || "all";
    const searchTerm = (document.querySelector(".search-input")?.value || "").toLowerCase().trim();
    const campaignCards = document.querySelectorAll(".campaign-card");

    campaignCards.forEach((card) => {
      const title = card.querySelector(".card-title")?.innerText.toLowerCase() || "";
      const organizer = card.querySelector(".card-organizer")?.innerText.toLowerCase() || "";
      const category = card.getAttribute("data-category")?.toLowerCase() || "";
      const cardText = `${title} ${organizer} ${category}`.trim();
      const isCategoryMatch = selectedCategory === "all" || category === selectedCategory;
      const isSearchMatch = !searchTerm || cardText.includes(searchTerm);

      const shouldShow = isCategoryMatch && isSearchMatch;
      card.style.display = shouldShow ? "flex" : "none";
      if (shouldShow) {
        card.style.animation = "fadeIn 0.3s ease";
      }
    });
  };

  // Category Filtering
  catPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      catPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      applyCampaignFilters();
    });
  });

  // Search Bar Live Filtering
  searchInputs.forEach((searchInput) => {
    searchInput.addEventListener("input", () => {
      applyCampaignFilters();
    });
  });

  // Fetch campaigns from backend
  loadCampaignsFromApi().then(() => {
    applyCampaignFilters();
  });
}

// Export / Attach to window
window.initCampaigns = initCampaigns;
window.loadCampaignsFromApi = loadCampaignsFromApi;
window.formatCurrency = formatCurrency;
