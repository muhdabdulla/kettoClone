# 👥 Ketto Crowdfunding Clone - 4-Person Team Work Division

This codebase has been modularized so that a **team of 4 developers** can work concurrently on distinct sections, styles, and logic without conflicts.

---

## 📂 Project Architecture

```
d:/MyProjects/kettoClone1/
├── index.html                   # Master HTML skeleton with modular component placeholders
├── components/                  # Individual HTML section templates
│   ├── header.html              # Top bar, Logo, Navigation, Search, WhatsApp CTA
│   ├── hero.html                # Main Hero banner, Trust badges, Floating stats overlay
│   ├── stats.html               # Impact numbers counter strip (₹450+ Cr, 55L+ Donors)
│   ├── categories.html          # Cause category selector pills (Medical, Cancer, etc.)
│   ├── campaigns.html           # Trending & urgent campaign cards grid
│   ├── sip.html                 # Social Impact Plan (SIP) monthly giving banner
│   ├── how-it-works.html        # 3-step crowdfunding process
│   ├── why-ketto.html           # 6 trust & assurance feature pillars
│   ├── partners.html            # Hospital network badges (Apollo, Fortis, Max, etc.)
│   ├── faq.html                 # Frequently Asked Questions accordion list
│   ├── bottom-cta.html          # Pre-footer conversion CTA banner
│   ├── footer.html              # Footer links, social icons, and payment badges
│   └── modals.html              # Quick Donate popup & Start Fundraiser popup
├── css/                         # Modular stylesheets by section
│   ├── style.css                # Master stylesheet importing all modular CSS files
│   ├── global.css               # Design tokens, variables, typography, resets
│   ├── header.css               # Header, navbar, and top-bar styles
│   ├── hero.css                 # Hero banner and stats strip styles
│   ├── campaigns.css            # Category pills and campaign cards styles
│   ├── sip.css                  # Social Impact Plan banner styles
│   ├── how-it-works.css         # 3 steps, why ketto features, and partners styles
│   ├── faq.css                  # FAQ accordion styles
│   ├── footer.css               # Bottom CTA and footer styles
│   └── modals.css               # Modals, form inputs, and toast styles
├── js/                          # Modular JavaScript by functionality
│   ├── loader.js                # Dynamic HTML component loader
│   ├── header.js                # Sticky header scroll and mobile nav logic
│   ├── campaigns.js             # Category filtering and live search logic
│   ├── sip.js                   # Monthly giving preset amounts toggle
│   ├── faq.js                   # FAQ accordion expand/collapse logic
│   ├── modals.js                # Donate & Start fundraiser popups, toast, share
│   └── main.js                  # Master module initializer
└── assets/images/               # Campaign and hero photography
```

---

## 👥 4-Member Responsibility Matrix

### 👤 Member 1: Navigation, Branding & Hero Impact
* **Topics**: Top Alert Bar, Main Navbar, Ketto Branding, Hero Section, Real-time Impact Numbers.
* **HTML Components**:
  - `components/header.html`
  - `components/hero.html`
  - `components/stats.html`
* **CSS Files**:
  - `css/header.css`
  - `css/hero.css`
* **JavaScript Files**:
  - `js/header.js`

---

### 👤 Member 2: Browse Fundraisers & Category Discovery
* **Topics**: Category filter pills (Medical, NICU, Cancer, Education, Animals), Campaign Cards Grid, Progress Bars, Goal tracking, Urgency Badges.
* **HTML Components**:
  - `components/categories.html`
  - `components/campaigns.html`
* **CSS Files**:
  - `css/campaigns.css`
* **JavaScript Files**:
  - `js/campaigns.js`

---

### 👤 Member 3: Social Impact Plan (SIP) & How It Works / Trust
* **Topics**: Monthly Giving Plan (SIP) with preset selector, 3-Step Crowdfunding Guide, Why Ketto Trust & Assurance Pillars, Hospital Network Partners.
* **HTML Components**:
  - `components/sip.html`
  - `components/how-it-works.html`
  - `components/why-ketto.html`
  - `components/partners.html`
* **CSS Files**:
  - `css/sip.css`
  - `css/how-it-works.css`
* **JavaScript Files**:
  - `js/sip.js`

---

### 👤 Member 4: FAQ Accordion, Footer & Interactive Popups (Modals)
* **Topics**: Frequently Asked Questions Accordion, Bottom Conversion CTA, Footer & Social/Payment badges, Quick Donate Popup (presets, PAN 80G checkbox, simulated payment), Start Fundraiser Popup, Toast Alerts.
* **HTML Components**:
  - `components/faq.html`
  - `components/bottom-cta.html`
  - `components/footer.html`
  - `components/modals.html`
* **CSS Files**:
  - `css/faq.css`
  - `css/footer.css`
  - `css/modals.css`
* **JavaScript Files**:
  - `js/faq.js`
  - `js/modals.js`

---

## 🚀 How to Run & Test
Run a local static web server in the project folder:
```bash
npx http-server -p 3000
```
Open **`http://localhost:3000`** in your browser. All components in `/components` will be automatically assembled by `js/loader.js`!
