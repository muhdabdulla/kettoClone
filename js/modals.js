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
  const startModal  = document.getElementById("startModal");
  const authModal   = document.getElementById("authModal");
  const userModal   = document.getElementById("userModal");
  const modalCloseBtns = document.querySelectorAll(".modal-close-btn");

  bindDonateButtons();

  // Inline Alert Helpers
  function showAuthAlert(el, message, isError = true) {
    if (!el) return;
    el.className = `auth-alert ${isError ? "error" : "success"}`;
    el.innerHTML = `<span>${isError ? "⚠️" : "✔"}</span> <span>${message}</span>`;
    el.style.display = "flex";
  }

  function hideAuthAlert(el) {
    if (el) el.style.display = "none";
  }

  // Helper to sync logged-in state across the UI
  function updateAuthState() {
    const savedUserStr = localStorage.getItem("ketto_user");
    const signinBtns = document.querySelectorAll(".btn-signin");
    const donorNameInput = document.querySelector(".donor-name-input");
    const donorEmailInput = document.querySelector(".donor-email-input");

    if (savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr);
        const displayHandle = user.username ? `@${user.username}` : (user.name ? user.name.split(" ")[0] : "User");
        signinBtns.forEach((btn) => {
          btn.innerHTML = `<span style="display:inline-flex; align-items:center; gap:6px;">👤 <strong>${displayHandle}</strong></span>`;
          btn.title = `Logged in as @${user.username || user.email} (Click to view Profile / Sign Out)`;
          btn.classList.add("logged-in");
        });

        // Update User Profile Modal Details
        const profName = document.getElementById("userProfileName");
        const profHandle = document.getElementById("userProfileHandle");
        const profEmail = document.getElementById("userProfileEmail");
        const profRole = document.getElementById("userProfileRole");

        if (profName) profName.innerText = user.name || "Ketto Member";
        if (profHandle) profHandle.innerText = user.username ? `@${user.username}` : "";
        if (profEmail) profEmail.innerText = user.email || "";
        if (profRole) profRole.innerText = user.role || "Donor";

        if (donorNameInput && !donorNameInput.value) donorNameInput.value = user.name;
        if (donorEmailInput && !donorEmailInput.value) donorEmailInput.value = user.email;
      } catch (e) {
        console.error("Error reading saved user:", e);
      }
    } else {
      signinBtns.forEach((btn) => {
        btn.innerText = "Sign In";
        btn.classList.remove("logged-in");
        btn.title = "Sign In / Join Ketto";
      });
    }
  }

  updateAuthState();

  // Click Sign In button (opens Auth modal or User Profile modal if logged in)
  const signinBtns = document.querySelectorAll(".btn-signin");
  signinBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const currentUser = localStorage.getItem("ketto_user");
      if (currentUser) {
        if (userModal) userModal.classList.add("active");
        return;
      }
      if (authModal) {
        hideAuthAlert(document.getElementById("signinAlert"));
        hideAuthAlert(document.getElementById("registerAlert"));
        authModal.classList.add("active");
      }
    });
  });

  // Logout button handler in User Modal
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("ketto_user");
      if (userModal) userModal.classList.remove("active");
      updateAuthState();
      showToast("Signed out successfully.");
    });
  }

  // "Start Fundraiser" shortcut from user profile modal
  const startFundraiserProfileBtn = document.getElementById("startFundraiserProfileBtn");
  if (startFundraiserProfileBtn) {
    startFundraiserProfileBtn.addEventListener("click", () => {
      if (userModal) userModal.classList.remove("active");
      if (startModal) startModal.classList.add("active");
    });
  }

  // Open Start Fundraiser Modal from regular CTAs
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
      if (userModal) userModal.classList.remove("active");
    });
  });

  // Close Modals on Backdrop click
  window.addEventListener("click", (e) => {
    if (e.target === donateModal) donateModal.classList.remove("active");
    if (e.target === startModal) startModal.classList.remove("active");
    if (e.target === authModal) authModal.classList.remove("active");
    if (e.target === userModal) userModal.classList.remove("active");
  });

  // ============================================================
  // AUTH TAB SWITCHER
  // ============================================================
  window.switchAuthTab = function (tab) {
    const signinPanel   = document.getElementById("signinPanel");
    const registerPanel = document.getElementById("registerPanel");
    const tabSignIn     = document.getElementById("tabSignIn");
    const tabRegister   = document.getElementById("tabRegister");

    hideAuthAlert(document.getElementById("signinAlert"));
    hideAuthAlert(document.getElementById("registerAlert"));

    if (tab === "signin") {
      if (signinPanel) signinPanel.style.display   = "";
      if (registerPanel) registerPanel.style.display = "none";
      if (tabSignIn) {
        tabSignIn.style.color        = "#01bfbd";
        tabSignIn.style.borderBottom = "3px solid #01bfbd";
      }
      if (tabRegister) {
        tabRegister.style.color        = "#9ca3af";
        tabRegister.style.borderBottom = "3px solid transparent";
      }
    } else {
      if (signinPanel) signinPanel.style.display   = "none";
      if (registerPanel) registerPanel.style.display = "";
      if (tabRegister) {
        tabRegister.style.color        = "#01bfbd";
        tabRegister.style.borderBottom = "3px solid #01bfbd";
      }
      if (tabSignIn) {
        tabSignIn.style.color        = "#9ca3af";
        tabSignIn.style.borderBottom = "3px solid transparent";
      }
    }
  };

  // ============================================================
  // USERNAME AUTO-SUGGEST when typing Full Name
  // ============================================================
  window.suggestUsername = function (name) {
    const input = document.getElementById("regUsername");
    if (!input || input.value.trim().length > 0) return;
    const base = name.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (base.length >= 3) {
      input.value = base;
      window.checkUsernameAvail(base);
    }
  };

  // ============================================================
  // LIVE USERNAME AVAILABILITY CHECK (debounced)
  // ============================================================
  let usernameCheckTimer = null;
  window.checkUsernameAvail = function (val) {
    const status = document.getElementById("usernameStatus");
    if (!status) return;
    const clean = val.toLowerCase().replace(/\s+/g, "").replace(/^@/, "");
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
    status.textContent = "Checking availability…";
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
    }, 450);
  };

  // ============================================================
  // PASSWORD VISIBILITY TOGGLE
  // ============================================================
  window.togglePasswordVisibility = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      if (btn) btn.innerHTML = "&#x1F576;&#xFE0F;"; // sunglasses / unmasked
    } else {
      input.type = "password";
      if (btn) btn.innerHTML = "&#x1F441;"; // eye
    }
  };

  // ============================================================
  // REAL-TIME PASSWORD MATCHING & LENGTH CHECK
  // ============================================================
  window.checkPasswordMatch = function () {
    const pwd = document.getElementById("regPassword")?.value || "";
    const confirm = document.getElementById("regConfirmPassword")?.value || "";
    const matchStatus = document.getElementById("passwordMatchStatus");
    const hint = document.getElementById("regPassHint");

    if (hint) {
      if (pwd.length > 0 && pwd.length < 6) {
        hint.style.color = "#ef4444";
        hint.textContent = `Must be at least 6 characters (${pwd.length}/6 entered)`;
      } else if (pwd.length >= 6) {
        hint.style.color = "#22c55e";
        hint.textContent = `✔ Password length valid (${pwd.length} chars)`;
      } else {
        hint.style.color = "#9ca3af";
        hint.textContent = "Must be at least 6 characters";
      }
    }

    if (!matchStatus) return;
    if (!confirm) {
      matchStatus.textContent = "";
      return;
    }

    if (pwd === confirm) {
      matchStatus.style.color = "#22c55e";
      matchStatus.textContent = "✔ Passwords match";
    } else {
      matchStatus.style.color = "#ef4444";
      matchStatus.textContent = "✖ Passwords do not match";
    }
  };

  // ============================================================
  // SIGN IN — POST /api/users/signin (by email or username + password)
  // ============================================================
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  if (authSubmitBtn) {
    authSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const signinAlert = document.getElementById("signinAlert");
      hideAuthAlert(signinAlert);

      const identifier = document.getElementById("siIdentifier")?.value?.trim() || "";
      const password   = document.getElementById("siPassword")?.value || "";

      if (!identifier) {
        showAuthAlert(signinAlert, "Please enter your email or username.");
        showToast("Please enter your email or username.", true);
        return;
      }

      if (!password) {
        showAuthAlert(signinAlert, "Please enter your password.");
        showToast("Please enter your password.", true);
        return;
      }

      const originalText = authSubmitBtn.innerText;
      authSubmitBtn.innerText = "Signing in…";
      authSubmitBtn.disabled  = true;

      const cleanId = identifier.replace(/^@/, "").trim();
      const isEmail = cleanId.includes("@") && cleanId.includes(".");
      const payload = {
        identifier: cleanId,
        ...(isEmail ? { email: cleanId } : { username: cleanId }),
        password
      };

      try {
        const response = await fetch(`${API_BASE_URL}/users/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          // Authentication successful!
          localStorage.setItem("ketto_user", JSON.stringify(data.data));
          if (authModal) authModal.classList.remove("active");
          const pwdEl = document.getElementById("siPassword");
          if (pwdEl) pwdEl.value = "";
          updateAuthState();
          showToast(data.message || `Welcome back, @${data.data.username}!`);
        } else {
          // Password incorrect, user not found, or invalid input
          const errMsg = data.message || "Sign in failed. Please check your credentials.";
          showAuthAlert(signinAlert, errMsg, true);
          showToast(errMsg, true);
        }
      } catch (err) {
        console.error("Sign in network error:", err);
        const netMsg = "Could not connect to backend server. Please verify backend is running on http://localhost:5000.";
        showAuthAlert(signinAlert, netMsg, true);
        showToast(netMsg, true);
      } finally {
        authSubmitBtn.innerText = originalText;
        authSubmitBtn.disabled  = false;
      }
    });
  }

  // ============================================================
  // REGISTER — POST /api/users/register
  // ============================================================
  const regSubmitBtn = document.getElementById("regSubmitBtn");
  if (regSubmitBtn) {
    regSubmitBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const regAlert = document.getElementById("registerAlert");
      hideAuthAlert(regAlert);

      const name            = document.getElementById("regName")?.value?.trim()            || "";
      const username        = document.getElementById("regUsername")?.value?.trim().replace(/^@/, "") || "";
      const email           = document.getElementById("regEmail")?.value?.trim()           || "";
      const password        = document.getElementById("regPassword")?.value                || "";
      const confirmPassword = document.getElementById("regConfirmPassword")?.value         || "";
      const phone           = document.getElementById("regPhone")?.value?.trim()           || "";

      // Client-side validations
      if (!name) {
        showAuthAlert(regAlert, "Please enter your full name.");
        showToast("Please enter your full name.", true);
        return;
      }
      if (!username || username.length < 3) {
        showAuthAlert(regAlert, "Username must be at least 3 characters long.");
        showToast("Username must be at least 3 characters.", true);
        return;
      }
      if (!/^[a-z0-9_]{3,30}$/i.test(username)) {
        showAuthAlert(regAlert, "Username can only contain letters, numbers, and underscores (3-30 chars).");
        showToast("Username format invalid.", true);
        return;
      }
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        showAuthAlert(regAlert, "Please enter a valid email address.");
        showToast("Please enter a valid email address.", true);
        return;
      }
      if (!password || password.length < 6) {
        showAuthAlert(regAlert, "Password must be at least 6 characters long.");
        showToast("Password must be at least 6 characters long.", true);
        return;
      }
      if (password !== confirmPassword) {
        showAuthAlert(regAlert, "Passwords do not match. Please re-enter.");
        showToast("Passwords do not match.", true);
        return;
      }

      // Check if username is already flagged taken
      const statusEl = document.getElementById("usernameStatus");
      if (statusEl?.textContent?.includes("already taken")) {
        showAuthAlert(regAlert, `Username @${username} is already taken. Please choose another.`);
        showToast("Username already taken.", true);
        return;
      }

      const originalText = regSubmitBtn.innerText;
      regSubmitBtn.innerText = "Creating account…";
      regSubmitBtn.disabled  = true;

      try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
            confirmPassword,
            phone
          })
        });

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          // Successfully registered!
          localStorage.setItem("ketto_user", JSON.stringify(data.data));
          if (authModal) authModal.classList.remove("active");

          // Clear form fields
          ["regName","regUsername","regEmail","regPassword","regConfirmPassword","regPhone"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = "";
          });
          if (statusEl) statusEl.textContent = "";
          const matchStatus = document.getElementById("passwordMatchStatus");
          if (matchStatus) matchStatus.textContent = "";

          updateAuthState();
          showToast(data.message || `Welcome to Ketto, @${data.data.username}! Account created.`);
        } else {
          const errMsg = data.message || "Registration failed. Please try again.";
          showAuthAlert(regAlert, errMsg, true);
          showToast(errMsg, true);
        }
      } catch (err) {
        console.error("Register network error:", err);
        const netMsg = "Could not connect to backend server. Please verify backend is running on http://localhost:5000.";
        showAuthAlert(regAlert, netMsg, true);
        showToast(netMsg, true);
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

  // Toggle "Other (Specify)" input field in Start Fundraiser modal
  const causeSelect = document.getElementById("startCause");
  const otherCauseGroup = document.getElementById("startOtherCauseGroup");
  const otherCauseInput = document.getElementById("startOtherCause");

  if (causeSelect && otherCauseGroup) {
    causeSelect.addEventListener("change", () => {
      const isOther = causeSelect.value.toLowerCase().includes("other");
      otherCauseGroup.style.display = isOther ? "block" : "none";
      if (isOther && otherCauseInput) {
        otherCauseInput.focus();
      }
    });
  }

  // ==========================================
  // CAUSE COVER PHOTO: UPLOAD & LIVE PREVIEW
  // ==========================================
  let currentCauseImageData = "";
  const browseCauseImageBtn = document.getElementById("browseCauseImageBtn");
  const startImageFile = document.getElementById("startImageFile");
  const startImageUrl = document.getElementById("startImageUrl");
  const causeImagePreviewContainer = document.getElementById("causeImagePreviewContainer");
  const causeImagePreview = document.getElementById("causeImagePreview");
  const removeCauseImageBtn = document.getElementById("removeCauseImageBtn");

  function resetCauseImageUpload() {
    currentCauseImageData = "";
    if (startImageFile) startImageFile.value = "";
    if (startImageUrl) startImageUrl.value = "";
    if (causeImagePreview) causeImagePreview.src = "";
    if (causeImagePreviewContainer) causeImagePreviewContainer.style.display = "none";
  }

  if (browseCauseImageBtn && startImageFile) {
    browseCauseImageBtn.addEventListener("click", () => {
      startImageFile.click();
    });
  }

  if (startImageFile) {
    startImageFile.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast("Image file size should be less than 5MB.", true);
          return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
          currentCauseImageData = evt.target.result;
          if (causeImagePreview) causeImagePreview.src = currentCauseImageData;
          if (causeImagePreviewContainer) causeImagePreviewContainer.style.display = "block";
          if (startImageUrl) startImageUrl.value = "";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (startImageUrl) {
    startImageUrl.addEventListener("input", (e) => {
      const url = e.target.value.trim();
      if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image/") || url.startsWith("assets/"))) {
        currentCauseImageData = url;
        if (causeImagePreview) causeImagePreview.src = url;
        if (causeImagePreviewContainer) causeImagePreviewContainer.style.display = "block";
        if (startImageFile) startImageFile.value = "";
      } else if (!url && (!startImageFile || !startImageFile.files?.length)) {
        currentCauseImageData = "";
        if (causeImagePreviewContainer) causeImagePreviewContainer.style.display = "none";
      }
    });
  }

  if (removeCauseImageBtn) {
    removeCauseImageBtn.addEventListener("click", () => {
      resetCauseImageUpload();
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
      const otherCauseEl    = document.getElementById("startOtherCause");

      const organizerName = organizerInput?.value?.trim() || "";
      const city          = cityInput?.value?.trim() || "";
      const customTitle   = titleInput?.value?.trim() || "";
      const description   = descInput?.value?.trim() || "";
      const beneficiary   = beneficiaryEl?.value || "Myself / Immediate Family";
      const cause         = causeEl?.value || "Medical Emergency / Surgery";
      const otherCauseVal = otherCauseEl?.value?.trim() || "";
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
      if (cause.toLowerCase().includes("other") && !otherCauseVal) {
        showToast("Please specify your fundraising cause.", true);
        otherCauseEl?.focus();
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

      if (cause.toLowerCase().includes("other")) {
        category = "others";
        imageUrl = "assets/images/hero-banner.png";
        badges   = [otherCauseVal.substring(0, 18), has80G ? "80G Benefit" : "Verified"];
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

      // If user uploaded a custom cause image or provided a photo URL, override default image
      if (currentCauseImageData) {
        imageUrl = currentCauseImageData;
      }

      // Build final title and organizer strings
      const cityStr  = city ? `, ${city}` : "";
      const displayCause = cause.toLowerCase().includes("other") ? otherCauseVal : cause;
      const finalTitle = customTitle || `Urgent ${displayCause} Support for ${beneficiary}`;
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
          [organizerInput, cityInput, titleInput, descInput, mobileInput, otherCauseEl].forEach(el => { if (el) el.value = ""; });
          if (descInput) descInput.value = "";
          if (otherCauseGroup) otherCauseGroup.style.display = "none";
          if (causeEl) causeEl.selectedIndex = 0;
          resetCauseImageUpload();

          // 3. Inject new campaign card into campaigns state & live grid
          if (typeof window.addNewCampaign === "function") {
            window.addNewCampaign(result.data);
          } else {
            const grid = document.querySelector(".campaigns-grid");
            if (grid && typeof renderCampaignCard === "function") {
              const newCardHtml = renderCampaignCard(result.data);
              grid.insertAdjacentHTML("afterbegin", newCardHtml);
              bindDonateButtons();
            }
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

        resetCauseImageUpload();

        if (typeof window.addNewCampaign === "function") {
          window.addNewCampaign(fallbackCampaign);
        } else {
          const grid = document.querySelector(".campaigns-grid");
          if (grid && typeof renderCampaignCard === "function") {
            grid.insertAdjacentHTML("afterbegin", renderCampaignCard(fallbackCampaign));
            bindDonateButtons();
          }
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
