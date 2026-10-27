# Ketto Crowdfunding Clone - Project Report & Presentation (Overleaf LaTeX Source)

This folder contains the complete, professionally formatted academic project report and presentation slide deck for the **Ketto Clone: Full-Stack Healthcare & Social Cause Crowdfunding Platform** (Course Code: `24CSJ504: ADVANCED WEB TECHNOLOGIES` / `24CSJ303: ADVANCED PROGRAMMING - PROJECT REPORT`) at **T.K.M. College of Engineering (Govt. Aided & Autonomous), Kollam**.

---

## 📁 Directory Structure

```text
ketto_project_report/
├── main.tex                    # Master LaTeX Project Report (10 Chapters, Certificate, Rubric)
├── presentation.tex            # Master Beamer Presentation Slide Deck (16:9 Aspect Ratio, 28 Slides)
├── README.md                   # This instruction guide
└── images/                     # High-Resolution Screenshots & Official College Logos
    ├── tkm_logo.png            # Official TKM College of Engineering seal
    ├── landing_page.png        # Hero banner, 0% fee tag, live community donation ticker
    ├── categories_and_stats.png# Category discovery pills and platform impact metrics
    ├── campaigns_grid.png      # Fundraisers browse grid with dynamic progress bars
    ├── campaign_detail.png     # Single campaign view with medical story tabs & sticky widget
    ├── donate_modal.png        # Controlled donation modal with presets & conditional PAN field
    ├── donate_receipt.png      # Automated 80G tax receipt screen with celebratory confetti
    ├── start_fundraiser.png    # Fundraiser launch wizard with real-time live preview card
    ├── sip_page.png            # Social Impact Plan (SIP) monthly giving calculator
    └── dashboard_page.png      # User profile, donation ledger, and 80G tax certificates
```

---

## 🚀 How to Compile in Overleaf (1-Click Upload)

1. Log into your Overleaf account: [https://www.overleaf.com](https://www.overleaf.com).
2. Click **New Project** $\rightarrow$ **Upload Project**.
3. Select and upload the pre-packaged zip archive:
   **`ketto_project_report.zip`**
4. Overleaf will automatically unpack `main.tex`, `presentation.tex`, and the `images/` directory.
5. **To view Project Report**: Open `main.tex`, set compiler to **pdfLaTeX**, and click **Recompile**.
6. **To view Presentation Slides**: Open `presentation.tex`, set compiler to **pdfLaTeX**, and click **Recompile**.

---

## 💻 How to Compile Locally (via TeX Live / MiKTeX)

From terminal inside `ketto_project_report/`:
```bash
# Compile Project Report to PDF
pdflatex main.tex
pdflatex main.tex

# Compile Presentation Slides to PDF
pdflatex presentation.tex
pdflatex presentation.tex
```

---

## 📊 Summary of Chapters & Rubric Mapping in Report

- **Front Matter**: Title Page, Certificate, Declaration, Acknowledgement, Abstract, Table of Contents, List of Figures, List of Tables.
- **Chapter 1: Introduction**: Background of healthcare out-of-pocket expenditure in India, problem statement, MERN stack justification.
- **Chapter 2: Objectives**: Primary architectural goals, functional and non-functional requirements.
- **Chapter 3: Literature Review / Background Study**: Evaluation of reward-based vs medical platforms, comparative analysis table.
- **Chapter 4: System Design**: 3-tier decoupled architecture diagram, MongoDB schemas (Campaign, Donation, User, Lead).
- **Chapter 5: Implementation Details**: Work division matrix across team members, atomic donation controller listing (`$inc`), controlled form code listing.
- **Chapter 6: User Interface & Demonstration**: High-resolution figures for all platform flows, detailed Evaluation Rubric Mapping (20/20 Marks).
- **Chapter 7: Conclusion**: Key engineering takeaways and achievements.
- **Chapter 8: Future Enhancements**: Live payment webhooks, OCR medical document verification, regional language localization, blockchain auditability.
- **Chapter 9: PO & SDG Mapping**: Mapping to Engineering Program Outcomes (PO1--PO12) and UN SDGs (SDG 3, SDG 10, SDG 17).
- **Chapter 10: References**: Bibliographic citations in IEEE/ACM style.
