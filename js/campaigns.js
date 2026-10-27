/* ==========================================================================
   CAMPAIGNS & CATEGORIES SCRIPT
   Connects to Express / MongoDB backend: GET /api/campaigns
   - Displays campaigns sorted by least number of days left initially
   - Shows the first 6 campaigns initially
   - Clicking "Explore All 2,500+ Active Campaigns" shows more campaigns
   - Filterable by Category pills (including "Other Causes") and Search bar
   ========================================================================== */

window.API_BASE_URL = window.API_BASE_URL || "http://localhost:5000/api";
var API_BASE_URL = window.API_BASE_URL;

const fallbackCampaigns = [
  {
    _id: "660000000000000000000005",
    title: "Urgent Open-Heart Surgery Needed for 6-Year-Old Kabir to Survive",
    organizer: "Deepa Verma (Mother)",
    category: "medical",
    goalAmount: 1200000,
    raisedAmount: 984000,
    donorsCount: 980,
    daysLeft: 1,
    imageUrl: "assets/images/hero-banner.png",
    badges: ["Critical Surgery", "80G Benefit"],
    status: "active",
    progressPercent: 82
  },
  {
    _id: "660000000000000000000007",
    title: "Emergency Liver Transplant to Save 3-Year-Old Baby Anvi",
    organizer: "Kavita Rao (Mother)",
    category: "children",
    goalAmount: 2200000,
    raisedAmount: 1850000,
    donorsCount: 1740,
    daysLeft: 2,
    imageUrl: "assets/images/campaign-nicu.png",
    badges: ["Urgent ICU", "Verified Doctor"],
    status: "active",
    progressPercent: 84
  },
  {
    _id: "660000000000000000000001",
    title: "Help 4-Month-Old Baby Aarav Fight Severe Pneumonia & Respiratory Failure",
    organizer: "Ramesh Sharma (Father)",
    category: "children",
    goalAmount: 1900000,
    raisedAmount: 1450000,
    donorsCount: 1420,
    daysLeft: 3,
    imageUrl: "assets/images/campaign-nicu.png",
    badges: ["Critical ICU", "Tax Benefit 80G"],
    status: "active",
    progressPercent: 76
  },
  {
    _id: "660000000000000000000021",
    title: "Emergency Food Kits & Temporary Shelter for 250+ Flood-Hit Families",
    organizer: "Disaster Relief Volunteers",
    category: "others",
    goalAmount: 800000,
    raisedAmount: 640000,
    donorsCount: 710,
    daysLeft: 3,
    imageUrl: "assets/images/hero-banner.png",
    badges: ["Disaster Relief", "80G Benefit"],
    status: "active",
    progressPercent: 80
  },
  {
    _id: "660000000000000000000006",
    title: "Provide Emergency Kidney Transplant & Dialysis for 32-Year-Old Manoj",
    organizer: "Sunita Devi (Wife)",
    category: "medical",
    goalAmount: 2500000,
    raisedAmount: 2275000,
    donorsCount: 3400,
    daysLeft: 4,
    imageUrl: "assets/images/campaign-cancer.png",
    badges: ["Closing Soon", "Verified"],
    status: "active",
    progressPercent: 91
  },
  {
    _id: "660000000000000000000008",
    title: "Brain Tumor Surgery Urgently Needed for Daily Wage Worker Somnath",
    organizer: "Gopal Mukherjee (Brother)",
    category: "medical",
    goalAmount: 1600000,
    raisedAmount: 1120000,
    donorsCount: 1105,
    daysLeft: 5,
    imageUrl: "assets/images/hero-banner.png",
    badges: ["Critical ICU", "Tax Benefit 80G"],
    status: "active",
    progressPercent: 70
  },
  {
    _id: "660000000000000000000002",
    title: "My 9-Year-Old Son Is Battling Acute Leukemia. Please Help Save Him",
    organizer: "Priya Nair (Mother)",
    category: "medical",
    goalAmount: 3000000,
    raisedAmount: 1860000,
    donorsCount: 2150,
    daysLeft: 6,
    imageUrl: "assets/images/campaign-cancer.png",
    badges: ["Urgent Care", "Hospital Verified"],
    status: "active",
    progressPercent: 62
  },
  {
    _id: "660000000000000000000009",
    title: "Emergency Medical Care & Amputation Surgery for Rescued Pup Bruno",
    organizer: "Dr. Arvind (Shelter Vet)",
    category: "animals",
    goalAmount: 180000,
    raisedAmount: 126000,
    donorsCount: 245,
    daysLeft: 7,
    imageUrl: "assets/images/campaign-animal.png",
    badges: ["Animal Emergency", "Verified Shelter"],
    status: "active",
    progressPercent: 70
  },
  {
    _id: "660000000000000000000022",
    title: "Clean Drinking Water Solar Wells for Drought-Affected Rural Villages",
    organizer: "Gramin Jal Mission",
    category: "others",
    goalAmount: 650000,
    raisedAmount: 480000,
    donorsCount: 530,
    daysLeft: 7,
    imageUrl: "assets/images/campaign-education.png",
    badges: ["Rural Water", "NGO Verified"],
    status: "active",
    progressPercent: 74
  },
  {
    _id: "660000000000000000000010",
    title: "Support Chemotherapy & Bone Marrow Transplant for 14-Year-Old Sneha",
    organizer: "Rajesh Kulkarni (Father)",
    category: "medical",
    goalAmount: 3500000,
    raisedAmount: 2100000,
    donorsCount: 1890,
    daysLeft: 8,
    imageUrl: "assets/images/campaign-cancer.png",
    badges: ["Medical Care", "80G Benefit"],
    status: "active",
    progressPercent: 60
  },
  {
    _id: "660000000000000000000003",
    title: "Help Rural Prodigy Ananya Complete Her Artificial Intelligence Degree",
    organizer: "Vidya Education Trust",
    category: "education",
    goalAmount: 400000,
    raisedAmount: 352000,
    donorsCount: 430,
    daysLeft: 9,
    imageUrl: "assets/images/campaign-education.png",
    badges: ["80G Tax Exemption", "NGO Verified"],
    status: "active",
    progressPercent: 88
  },
  {
    _id: "660000000000000000000023",
    title: "Support Paralympic Archer Ramesh to Represent India in World Championship",
    organizer: "Sports Foundation India",
    category: "others",
    goalAmount: 500000,
    raisedAmount: 340000,
    donorsCount: 420,
    daysLeft: 9,
    imageUrl: "assets/images/hero-banner.png",
    badges: ["Sports Talent", "Verified"],
    status: "active",
    progressPercent: 68
  },
  {
    _id: "660000000000000000000011",
    title: "Emergency Spinal Reconstruction Surgery for Accident Victim Vikas",
    organizer: "Anjali Gupta (Sister)",
    category: "medical",
    goalAmount: 1500000,
    raisedAmount: 890000,
    donorsCount: 860,
    daysLeft: 10,
    imageUrl: "assets/images/hero-banner.png",
    badges: ["Trauma ICU", "Verified"],
    status: "active",
    progressPercent: 59
  },
  {
    _id: "660000000000000000000012",
    title: "Support Single Mother Sunita Battling Stage 3 Breast Tumor",
    organizer: "Rohit Verma (Son)",
    category: "medical",
    goalAmount: 2000000,
    raisedAmount: 1340000,
    donorsCount: 1320,
    daysLeft: 11,
    imageUrl: "assets/images/campaign-cancer.png",
    badges: ["Specialized Care", "80G Benefit"],
    status: "active",
    progressPercent: 67
  },
  {
    _id: "660000000000000000000004",
    title: "Emergency Medical Care & Shelter for 120+ Injured Street Animals",
    organizer: "Paws & Claws Animal Trust",
    category: "animals",
    goalAmount: 500000,
    raisedAmount: 240000,
    donorsCount: 310,
    daysLeft: 12,
    imageUrl: "assets/images/campaign-animal.png",
    badges: ["Tax Benefit 80G", "Verified NGO"],
    status: "active",
    progressPercent: 48
  },
  {
    _id: "660000000000000000000024",
    title: "Daily Nutrition & Winter Care Support for 400 Abandoned Senior Citizens",
    organizer: "Anand Elders Home",
    category: "others",
    goalAmount: 700000,
    raisedAmount: 390000,
    donorsCount: 460,
    daysLeft: 13,
    imageUrl: "assets/images/campaign-nicu.png",
    badges: ["Elder Care", "Tax Benefit 80G"],
    status: "active",
    progressPercent: 56
  },
  {
    _id: "660000000000000000000013",
    title: "Help Orphan Siblings Continue Their School Education & Boarding",
    organizer: "Hope Children Foundation",
    category: "education",
    goalAmount: 600000,
    raisedAmount: 410000,
    donorsCount: 520,
    daysLeft: 14,
    imageUrl: "assets/images/campaign-education.png",
    badges: ["Child Education", "80G Exemption"],
    status: "active",
    progressPercent: 68
  },
  {
    _id: "660000000000000000000014",
    title: "Urgent NICU Incubator Support for Preterm Twins Born at 28 Weeks",
    organizer: "Naveen Chawla (Father)",
    category: "children",
    goalAmount: 2400000,
    raisedAmount: 1680000,
    donorsCount: 1560,
    daysLeft: 15,
    imageUrl: "assets/images/campaign-nicu.png",
    badges: ["Critical NICU", "Hospital Verified"],
    status: "active",
    progressPercent: 70
  },
  {
    _id: "660000000000000000000015",
    title: "Vaccination, Food, and Medical Treatment for 80 Abandoned Cattle",
    organizer: "Karuna Animal Sanctuary",
    category: "animals",
    goalAmount: 450000,
    raisedAmount: 215000,
    donorsCount: 290,
    daysLeft: 16,
    imageUrl: "assets/images/campaign-animal.png",
    badges: ["Animal Welfare", "80G Benefit"],
    status: "active",
    progressPercent: 47
  },
  {
    _id: "660000000000000000000016",
    title: "Provide Higher Secondary STEM Scholarships for 50 Rural Girls",
    organizer: "Prerna Girls Foundation",
    category: "education",
    goalAmount: 1000000,
    raisedAmount: 650000,
    donorsCount: 710,
    daysLeft: 18,
    imageUrl: "assets/images/campaign-education.png",
    badges: ["Empowerment", "NGO Verified"],
    status: "active",
    progressPercent: 65
  },
  {
    _id: "660000000000000000000018",
    title: "Build a Sterilization & Trauma Care Center for Stray Dogs in Kochi",
    organizer: "Kerala Animal Rescue Network",
    category: "animals",
    goalAmount: 850000,
    raisedAmount: 390000,
    donorsCount: 420,
    daysLeft: 22,
    imageUrl: "assets/images/campaign-animal.png",
    badges: ["Shelter Build", "80G Tax Exemption"],
    status: "active",
    progressPercent: 45
  }
];

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

  const daysNum = Number(campaign.daysLeft);
  const daysText = isNaN(daysNum)
    ? "30 Days Left"
    : daysNum === 1
      ? "1 Day Left"
      : `${daysNum} Days Left`;

  return `
    <div class="campaign-card" data-category="${campaign.category || 'medical'}" data-id="${campaign._id}">
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
              <div class="days-left">${daysText}</div>
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

// Global state for campaigns
let allCampaigns = [];
let visibleCount = 6;
const PAGE_SIZE = 6;

function sortCampaignsByDaysLeft(list) {
  return list.slice().sort((a, b) => {
    const daysA = typeof a.daysLeft === "number" ? a.daysLeft : parseInt(a.daysLeft, 10) || 999;
    const daysB = typeof b.daysLeft === "number" ? b.daysLeft : parseInt(b.daysLeft, 10) || 999;
    return daysA - daysB;
  });
}

function getFilteredCampaigns() {
  const activePill = document.querySelector(".cat-pill.active");
  const selectedCategory = (activePill?.getAttribute("data-category") || "all").toLowerCase();
  const searchTerm = (document.querySelector(".search-input")?.value || "").toLowerCase().trim();

  return allCampaigns.filter((c) => {
    const category = (c.category || "").toLowerCase();

    let isCategoryMatch = false;
    if (selectedCategory === "all") {
      isCategoryMatch = true;
    } else if (selectedCategory === "others" || selectedCategory === "other") {
      isCategoryMatch = category === "others" || category === "other";
    } else {
      isCategoryMatch = category === selectedCategory;
    }

    if (!isCategoryMatch) return false;

    if (!searchTerm) return true;
    const text = `${c.title || ""} ${c.organizer || ""} ${category}`.toLowerCase();
    return text.includes(searchTerm);
  });
}

function updateExploreButton(filteredCount) {
  const exploreBtn = document.getElementById("exploreMoreBtn") || document.querySelector(".explore-more-wrap button");
  if (!exploreBtn) return;

  const btnSpan = exploreBtn.querySelector("span") || exploreBtn;

  if (filteredCount === 0) {
    exploreBtn.style.display = "none";
    return;
  }

  exploreBtn.style.display = "inline-flex";

  if (visibleCount <= 6 && filteredCount > 6) {
    btnSpan.textContent = "Explore All 2,500+ Active Campaigns";
    exploreBtn.disabled = false;
    exploreBtn.style.opacity = "1";
    exploreBtn.style.cursor = "pointer";
  } else if (visibleCount >= filteredCount) {
    btnSpan.textContent = `Showing All ${filteredCount} Available Campaigns`;
    exploreBtn.disabled = true;
    exploreBtn.style.opacity = "0.75";
    exploreBtn.style.cursor = "default";
  } else {
    btnSpan.textContent = `Explore More Campaigns (${Math.min(visibleCount, filteredCount)} of ${filteredCount} Shown)`;
    exploreBtn.disabled = false;
    exploreBtn.style.opacity = "1";
    exploreBtn.style.cursor = "pointer";
  }
}

function renderCampaignGrid() {
  const grid = document.querySelector(".campaigns-grid");
  if (!grid) return;

  const filtered = getFilteredCampaigns();

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: #64748b;">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 8px;">No Campaigns Found</h3>
        <p style="font-size: 0.95rem;">Try selecting another category or clearing your search filter.</p>
      </div>
    `;
    updateExploreButton(0);
    return;
  }

  const toShow = filtered.slice(0, visibleCount);
  grid.innerHTML = toShow.map(renderCampaignCard).join("");

  // Re-bind modal buttons for dynamically generated cards
  if (typeof window.bindDonateButtons === "function") {
    window.bindDonateButtons();
  }

  updateExploreButton(filtered.length);
}

function addNewCampaign(newCampaign) {
  if (!newCampaign) return;
  // Insert at top of list
  allCampaigns.unshift(newCampaign);
  visibleCount = 6;
  renderCampaignGrid();
}

async function loadCampaignsFromApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/campaigns`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();

    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      // Sort ascending by least number of days left
      allCampaigns = sortCampaignsByDaysLeft(result.data);
      console.log(`✅ Loaded ${allCampaigns.length} campaigns from backend (${result.source || "api"}), sorted by least days left.`);
    } else {
      allCampaigns = sortCampaignsByDaysLeft(fallbackCampaigns);
    }
  } catch (err) {
    console.warn("ℹ️ Could not fetch /api/campaigns (using offline fallback campaigns):", err.message);
    allCampaigns = sortCampaignsByDaysLeft(fallbackCampaigns);
  }

  renderCampaignGrid();
}

function initCampaigns() {
  const catPills = document.querySelectorAll(".cat-pill");
  const searchInputs = document.querySelectorAll(".search-input");
  const exploreBtn = document.getElementById("exploreMoreBtn") || document.querySelector(".explore-more-wrap button");

  // Ensure initial fallback is loaded immediately before API resolves
  if (allCampaigns.length === 0) {
    allCampaigns = sortCampaignsByDaysLeft(fallbackCampaigns);
    renderCampaignGrid();
  }

  // Category Pills Filtering (including "Other Causes")
  catPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      catPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      // Reset visible count to initial 6 when category changes
      visibleCount = 6;
      renderCampaignGrid();
    });
  });

  // Search Bar Live Filtering
  searchInputs.forEach((searchInput) => {
    searchInput.addEventListener("input", () => {
      // Reset visible count to initial 6 on search query change
      visibleCount = 6;
      renderCampaignGrid();
    });
  });

  // Explore All / Load More Campaigns button click handler
  if (exploreBtn) {
    exploreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const filtered = getFilteredCampaigns();
      if (visibleCount < filtered.length) {
        visibleCount += PAGE_SIZE;
        renderCampaignGrid();
      }
    });
  }

  // Delegated Share button click handler
  document.addEventListener("click", (e) => {
    const shareBtn = e.target.closest(".btn-card-share");
    if (shareBtn) {
      e.preventDefault();
      e.stopPropagation();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href);
        if (typeof window.showToast === "function") {
          window.showToast("Campaign link copied to clipboard!");
        }
      } else if (typeof window.showToast === "function") {
        window.showToast("Campaign shared!");
      }
    }
  });

  // Fetch live campaigns from backend API
  loadCampaignsFromApi();
}

// Export / Attach to window
window.initCampaigns = initCampaigns;
window.loadCampaignsFromApi = loadCampaignsFromApi;
window.formatCurrency = formatCurrency;
window.renderCampaignCard = renderCampaignCard;
window.addNewCampaign = addNewCampaign;
window.allCampaigns = allCampaigns;
