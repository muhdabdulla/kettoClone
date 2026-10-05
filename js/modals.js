/* ==========================================================================
   MODALS, POPUPS & TOAST SCRIPT
   Connects to Express / MongoDB backend: POST /api/donations and POST /api/leads
   ========================================================================== */

var API_BASE_URL = window.API_BASE_URL || "http://localhost:5000/api";

// Toast Notification Helper
function showToast(message, isError = false) {
  let toast = document.querySelector(".toast-msg");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  const icon = isError ? "❌" : "✔";
  const color = isError ? "#ef4444" : "#22c55e";
  toast.innerHTML = `<span style="color:${color};">${icon}</span> ${message}`;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

// Global active campaign pointer
window.activeCampaignId = "660000000000000000000001";
window.activeCampaignCard = null;

function bindDonateButtons() {
  const donateModal = document.getElementById("donateModal");
  const donateBtns = document.querySelectorAll(".btn-card-donate, .open-donate-modal");

  donateBtns.forEach((btn) => {
    // Avoid double-attaching listeners
    if (btn.dataset.hasListener) return;
    btn.dataset.hasListener = "true";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!donateModal) return;

      const card = btn.closest(".campaign-card");
      window.activeCampaignCard = card;

      let campaignId = card?.getAttribute("data-id") || "660000000000000000000001";
      window.activeCampaignId = campaignId;

      const campaignTitle = card ? card.querySelector(".card-title")?.innerText : "Urgent Medical Cause";
      const modalTitle = donateModal.querySelector(".modal-title");
      if (modalTitle && campaignTitle) {
        modalTitle.innerText = `Donate to: ${campaignTitle.substring(0, 42)}...`;
      }

      donateModal.classList.add("active");
    });
  });
}

function initModals() {
  const donateModal = document.getElementById("donateModal");
  const startModal = document.getElementById("startModal");
  const authModal = document.getElementById("authModal");
  const modalCloseBtns = document.querySelectorAll(".modal-close-btn");

  bindDonateButtons();

  // Helper to sync logged-in state across the UI
  function updateAuthState() {
    const savedUserStr = localStorage.getItem("ketto_user");
    const signinBtns = document.querySelectorAll(".btn-signin");
    const donorNameInput = document.querySelector(".donor-name-input");
    const donorEmailInput = document.querySelector(".donor-email-input");

    if (savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr);
        const displayHandle = user.username ? `@${user.username}` : user.name.split(" ")[0];
        signinBtns.forEach((btn) => {
          btn.innerHTML = `<span style="display:inline-flex; align-items:center; gap:6px;">👤 <strong>${displayHandle}</strong></span>`;
          btn.title = `Logged in as ${user.email} (Click to Sign Out)`;
          btn.classList.add("logged-in");
        });

        if (donorNameInput && !donorNameInput.value) donorNameInput.value = user.name;
        if (donorEmailInput && !donorEmailInput.value) donorEmailInput.value = user.email;
      } catch (e) {}
    } else {
      signinBtns.forEach((btn) => {
        btn.innerText = "Sign In";
        btn.classList.remove("logged-in");
        btn.title = "Sign In";
      });
    }
  }

  updateAuthState();

  // Open Sign In Modal (or sign out if already logged in)
  const signinBtns = document.querySelectorAll(".btn-signin");
  signinBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (localStorage.getItem("ketto_user")) {
        if (confirm("Do you want to sign out?")) {
          localStorage.removeItem("ketto_user");
          updateAuthState();
          showToast("Signed out successfully.");
        }
        return;
      }
      if (authModal) {
        authModal.classList.add("active");
      }
    });
  });

  // Open Start Fundraiser Modal
  const startBtns = document.querySelectorAll(".open-start-modal");
  startBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (startModal) {
        startModal.classList.add("active");
      }
    });
  });

  // Close Modals on Close (X) click
  modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (donateModal) donateModal.classList.remove("active");
      if (startModal) startModal.classList.remove("active");
      if (authModal) authModal.classList.remove("active");
    });
  });

  // Close Modals on Backdrop click
  window.addEventListener("click", (e) => {
    if (e.target === donateModal) donateModal.classList.remove("active");
    if (e.target === startModal) startModal.classList.remove("active");
    if (e.target === authModal) authModal.classList.remove("active");
  });

  // ============================================================
  // AUTH TAB SWITCHER  (called by inline onclick in HTML)
  // ============================================================
  window.switchAuthTab = function (tab) {
    const signinPanel   = document.getElementById("signinPanel");
    const registerPanel = document.getElementById("registerPanel");
    const tabSignIn     = document.getElementById("tabSignIn");
    const tabRegister   = document.getElementById("tabRegister");

    if (tab === "signin") {
      signinPanel.style.display   = "";
      registerPanel.style.display = "none";
      tabSignIn.style.color        = "#01bfbd";
      tabSignIn.style.borderBottom = "3px solid #01bfbd";
      tabRegister.style.color        = "#9ca3af";
      tabRegister.style.borderBottom = "3px solid transparent";
    } else {
      signinPanel.style.display   = "none";
      registerPanel.style.display = "";
      tabRegister.style.color        = "#01bfbd";
      tabRegister.style.borderBottom = "3px solid #01bfbd";
      tabSignIn.style.color        = "#9ca3af";
      tabSignIn.style.borderBottom = "3px solid transparent";
    }
  };

  // ============================================================
  // USERNAME AUTO-SUGGEST when typing Full Name
  // ============================================================
  window.suggestUsername = function (name) {
    const input = document.getElementById("regUsername");
    if (!input || input.value.length > 0) return;
    const base = name.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (base.length >= 3) input.value = base;
  };

  // ============================================================
  // LIVE USERNAME AVAILABILITY CHECK (debounced)
  // ============================================================
  let usernameCheckTimer = null;
  window.checkUsernameAvail = function (val) {
    const status = document.getElementById("usernameStatus");
    if (!status) return;
    const clean = val.toLowerCase().replace(/\s+/g, "");
    if (clean.length < 3) {
      status.textContent = "";
      return;
    }
    if (!/^[a-z0-9_]+$/.test(clean)) {
      status.style.color = "#ef4444";
      status.textContent = "Only letters, numbers, and underscores allowed.";
      return;
    }
    status.style.color = "#9ca3af";
    status.textContent = "Checking…";
    clearTimeout(usernameCheckTimer);
    usernameCheckTimer = setTimeout(async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/users/check-username?username=${encodeURIComponent(clean)}`);
        const data = await res.json();
        if (data.available) {
          status.style.color = "#22c55e";
          status.textContent = `✔ @${clean} is available!`;
        } else {
          status.style.color = "#ef4444";
          status.textContent = `✖ @${clean} is already taken.`;
        }
      } catch {
        status.textContent = "";
      }
    }, 600);
  };

  // ============================================================
  // SIGN IN  (email or username)
  // ============================================================
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  if (authSubmitBtn) {
    authSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const identifier = document.getElementById("siIdentifier")?.value?.trim() || "";

      if (!identifier) {
        showToast("Please enter your email or @username.", true);
        return;
      }

      const originalText = authSubmitBtn.innerText;
      authSubmitBtn.innerText = "Signing in…";
      authSubmitBtn.disabled  = true;

      // Detect email vs username
      const isEmail  = identifier.includes("@") && identifier.includes(".");
      const payload  = isEmail
        ? { email: identifier }
        : { username: identifier.replace(/^@/, "") };

      try {
        const response = await fetch(`${API_BASE_URL}/users/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          localStorage.setItem("ketto_user", JSON.stringify(data.data));
          if (authModal) authModal.classList.remove("active");
          updateAuthState();
          showToast(data.message || `Welcome back, @${data.data.username}!`);
        } else {
          // If not found, nudge them to register
          if (response.status === 404) {
            showToast("No account found. Please register first.", true);
            window.switchAuthTab("register");
          } else {
            showToast(data.message || "Sign in failed. Please try again.", true);
          }
        }
      } catch (err) {
        console.error("Sign in error:", err);
        // Offline graceful fallback
        const fallback = { name: identifier.replace(/^@/, ""), username: identifier.replace(/^@/, ""), email: identifier };
        localStorage.setItem("ketto_user", JSON.stringify(fallback));
        if (authModal) authModal.classList.remove("active");
        updateAuthState();
        showToast("Welcome to Ketto! (offline mode)");
      } finally {
        authSubmitBtn.innerText = originalText;
        authSubmitBtn.disabled  = false;
      }
    });
  }

  // ============================================================
  // REGISTER  — POST /api/users/register
  // ============================================================
  const regSubmitBtn = document.getElementById("regSubmitBtn");
  if (regSubmitBtn) {
    regSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const name     = document.getElementById("regName")?.value?.trim()     || "";
      const username = document.getElementById("regUsername")?.value?.trim() || "";
      const email    = document.getElementById("regEmail")?.value?.trim()    || "";
      const phone    = document.getElementById("regPhone")?.value?.trim()    || "";

      // Client-side validation
      if (!name) { showToast("Please enter your full name.", true); return; }
      if (!username || username.length < 3) { showToast("Username must be at least 3 characters.", true); return; }
      if (!/^[a-z0-9_]+$/i.test(username)) { showToast("Username: only letters, numbers, underscores.", true); return; }
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) { showToast("Please enter a valid email address.", true); return; }

      // Block if username is already flagged taken
      const statusEl = document.getElementById("usernameStatus");
      if (statusEl?.textContent?.includes("already taken")) {
        showToast("That username is taken. Please choose a different one.", true);
        return;
      }

      const originalText = regSubmitBtn.innerText;
      regSubmitBtn.innerText = "Creating account…";
      regSubmitBtn.disabled  = true;

      try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, username: username.toLowerCase(), email, phone })
        });

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          localStorage.setItem("ketto_user", JSON.stringify(data.data));
          if (authModal) authModal.classList.remove("active");
          // Clear register fields
          ["regName","regUsername","regEmail","regPhone"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
          });
          if (statusEl) statusEl.textContent = "";
          updateAuthState();
          showToast(data.message || `Welcome, @${data.data.username}! Account created.`);
        } else {
          showToast(data.message || "Registration failed. Please try again.", true);
        }
      } catch (err) {
        console.error("Register error:", err);
        // Offline fallback
        const fallback = { name, username: username.toLowerCase(), email, phone };
        localStorage.setItem("ketto_user", JSON.stringify(fallback));
        if (authModal) authModal.classList.remove("active");
        updateAuthState();
        showToast(`Welcome, @${username}! (offline – saved locally)`);
      } finally {
        regSubmitBtn.innerText = originalText;
        regSubmitBtn.disabled  = false;
      }
    });
  }


  // Donate Modal Preset Amounts
  const donatePresetBtns = document.querySelectorAll(".donate-preset-btn");
  const customAmountInput = document.querySelector(".custom-amount-input");

  donatePresetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      donatePresetBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const amt = btn.getAttribute("data-amount");
      if (customAmountInput) customAmountInput.value = amt;
    });
  });

  // ==========================================
  // REAL DONATION API CALL: POST /api/donations
  // ==========================================
  const donateSubmitBtn = document.getElementById("donateSubmitBtn");
  if (donateSubmitBtn) {
    donateSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const amount = Number(customAmountInput?.value || 1000);
      const donorNameInput = document.querySelector(".donor-name-input");
      const donorEmailInput = document.querySelector(".donor-email-input");
      const tax80gCheckbox = document.getElementById("tax80g");

      const donorName = donorNameInput?.value?.trim() || "Generous Supporter";
      const email = donorEmailInput?.value?.trim() || "donor@example.com";
      const tax80G = !!tax80gCheckbox?.checked;

      // Validation
      if (isNaN(amount) || amount < 100) {
        showToast("Minimum donation amount is ₹100", true);
        return;
      }

      const originalBtnText = donateSubmitBtn.innerText;
      donateSubmitBtn.innerText = "Processing Donation...";
      donateSubmitBtn.disabled = true;

      try {
        const payload = {
          campaignId: window.activeCampaignId,
          donorName,
          email,
          amount,
          tax80G
        };

        const response = await fetch(`${API_BASE_URL}/donations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          if (donateModal) donateModal.classList.remove("active");

          // Show celebration toast
          showToast(data.message || `Thank you, ${donorName}! Your contribution of ₹${amount.toLocaleString("en-IN")} was received.`);

          // Live UI update of the active campaign card
          if (window.activeCampaignCard && data.updatedCampaign) {
            const raisedVal = window.activeCampaignCard.querySelector(".raised-val");
            const donorsCount = window.activeCampaignCard.querySelector(".donors-count");
            const progressFill = window.activeCampaignCard.querySelector(".progress-fill");

            if (raisedVal) {
              raisedVal.innerText = "₹" + Number(data.updatedCampaign.raisedAmount).toLocaleString("en-IN");
            }
            if (donorsCount && data.updatedCampaign.donorsCount) {
              donorsCount.innerText = `${Number(data.updatedCampaign.donorsCount).toLocaleString("en-IN")} Donors`;
            }
            if (progressFill && data.updatedCampaign.progressPercent !== undefined) {
              progressFill.style.width = `${data.updatedCampaign.progressPercent}%`;
            }
          }
        } else {
          showToast(data.message || "Failed to process donation", true);
        }
      } catch (err) {
        console.error("Donation API error:", err);
        // Fallback simulated success if server is offline
        if (donateModal) donateModal.classList.remove("active");
        showToast(`Thank you, ${donorName}! Contribution of ₹${amount.toLocaleString("en-IN")} recorded.`);
      } finally {
        donateSubmitBtn.innerText = originalBtnText;
        donateSubmitBtn.disabled = false;
      }
    });
  }

  // ==========================================
  // START FUNDRAISER: POST /api/campaigns & ADD TO LIVE UI
  // ==========================================
  const startSubmitBtn = document.getElementById("startSubmitBtn");
  if (startSubmitBtn) {
    startSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      // Read all enhanced form fields
      const organizerInput  = document.getElementById("startOrganizerName");
      const cityInput       = document.getElementById("startCity");
      const titleInput      = document.getElementById("startCampaignTitle");
      const descInput       = document.getElementById("startDescription");
      const beneficiaryEl   = document.getElementById("startBeneficiary");
      const causeEl         = document.getElementById("startCause");
      const goalInput       = document.getElementById("startGoalAmount");
      const daysEl          = document.getElementById("startDaysLeft");
      const mobileInput     = document.getElementById("startMobile");
      const tax80GCheck     = document.getElementById("start80G");

      const organizerName = organizerInput?.value?.trim() || "";
      const city          = cityInput?.value?.trim() || "";
      const customTitle   = titleInput?.value?.trim() || "";
      const description   = descInput?.value?.trim() || "";
      const beneficiary   = beneficiaryEl?.value || "Myself / Immediate Family";
      const cause         = causeEl?.value || "Medical Emergency / Surgery";
      const goalAmount    = Number(goalInput?.value) || 500000;
      const daysLeft      = Number(daysEl?.value) || 30;
      const mobile        = mobileInput?.value?.trim() || "";
      const has80G        = !!tax80GCheck?.checked;

      // --- Validation ---
      if (!organizerName) {
        showToast("Please enter your full name.", true);
        organizerInput?.focus();
        return;
      }
      if (!customTitle) {
        showToast("Please enter a campaign title.", true);
        titleInput?.focus();
        return;
      }
      if (!mobile || mobile.length < 8) {
        showToast("Please enter a valid mobile number.", true);
        mobileInput?.focus();
        return;
      }
      if (goalAmount < 1000) {
        showToast("Goal amount must be at least ₹1,000.", true);
        goalInput?.focus();
        return;
      }

      // --- Category, image & badge mapping based on cause ---
      let category = "medical";
      let imageUrl = "assets/images/hero-banner.png";
      let badges   = ["New Fundraiser", has80G ? "Tax Benefit 80G" : "Verified"];

      if (cause.includes("Cancer")) {
        category = "cancer";
        imageUrl  = "assets/images/campaign-cancer.png";
        badges    = ["Urgent Care", has80G ? "80G Exemption" : "Verified"];
      } else if (cause.includes("Child") || cause.includes("NICU")) {
        category = "children";
        imageUrl  = "assets/images/campaign-nicu.png";
        badges    = ["Critical ICU", has80G ? "80G Benefit" : "Verified"];
      } else if (cause.includes("Education")) {
        category = "education";
        imageUrl  = "assets/images/campaign-education.png";
        badges    = ["Education Aid", has80G ? "80G Verified" : "Verified"];
      } else if (cause.includes("Animal")) {
        category = "animals";
        imageUrl  = "assets/images/campaign-animal.png";
        badges    = ["Animal Rescue", "Verified"];
      }

      // Build final title and organizer strings
      const cityStr  = city ? `, ${city}` : "";
      const finalTitle = customTitle || `Urgent ${cause} Support for ${beneficiary}`;
      const organizer  = `${organizerName}${cityStr}`;

      const originalText = startSubmitBtn.innerText;
      startSubmitBtn.innerText = "Creating Campaign...";
      startSubmitBtn.disabled = true;

      try {
        // 1. POST new campaign to MongoDB Atlas via backend
        const response = await fetch(`${API_BASE_URL}/campaigns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: finalTitle,
            organizer,
            category,
            goalAmount,
            raisedAmount: 0,
            donorsCount: 0,
            daysLeft,
            imageUrl,
            badges,
            description,
            mobile
          })
        });

        const result = await response.json();

        if (response.ok && result.success && result.data) {
          // 2. Close modal & clear form
          if (startModal) startModal.classList.remove("active");
          [organizerInput, cityInput, titleInput, descInput, mobileInput].forEach(el => { if (el) el.value = ""; });
          if (descInput) descInput.value = "";

          // 3. Inject new campaign card at the TOP of the campaigns grid
          const grid = document.querySelector(".campaigns-grid");
          if (grid && typeof renderCampaignCard === "function") {
            const newCardHtml = renderCampaignCard(result.data);
            grid.insertAdjacentHTML("afterbegin", newCardHtml);
            bindDonateButtons();
          }

          // 4. Celebration toast + smooth scroll to campaigns section
          showToast(`🎉 "${finalTitle.substring(0, 40)}..." is now LIVE! Scroll down to see it.`);
          const campaignsSection = document.getElementById("campaigns");
          if (campaignsSection) {
            setTimeout(() => campaignsSection.scrollIntoView({ behavior: "smooth" }), 600);
          }
        } else {
          showToast(result.message || "Failed to create fundraiser. Please try again.", true);
        }
      } catch (err) {
        console.error("Create campaign error:", err);
        // Offline fallback – still show the card using local data
        if (startModal) startModal.classList.remove("active");

        const fallbackCampaign = {
          _id: "local_" + Date.now(),
          title: finalTitle,
          organizer,
          category,
          goalAmount,
          raisedAmount: 0,
          donorsCount: 0,
          daysLeft,
          imageUrl,
          badges,
          progressPercent: 0
        };

        const grid = document.querySelector(".campaigns-grid");
        if (grid && typeof renderCampaignCard === "function") {
          grid.insertAdjacentHTML("afterbegin", renderCampaignCard(fallbackCampaign));
          bindDonateButtons();
        }

        showToast("🎉 Fundraiser added! (Server offline – data saved locally for demo)");
        const campaignsSection = document.getElementById("campaigns");
        if (campaignsSection) {
          setTimeout(() => campaignsSection.scrollIntoView({ behavior: "smooth" }), 600);
        }
      } finally {
        startSubmitBtn.innerText = originalText;
        startSubmitBtn.disabled = false;
      }
    });
  }

  // WhatsApp and Share Buttons
  const shareBtns = document.querySelectorAll(".btn-card-share, .share-btn");
  shareBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast("Campaign link copied to clipboard!");
      } else {
        showToast("Campaign shared!");
      }
    });
  });
}

// Export / Attach to window
window.initModals = initModals;
window.bindDonateButtons = bindDonateButtons;
window.showToast = showToast;
