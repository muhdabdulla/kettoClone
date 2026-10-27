// Initial sample data for Ketto Clone (used for fallback or offline presentation)
export const INITIAL_CAMPAIGNS = [
  {
    _id: "660000000000000000000005",
    title: "Urgent Open-Heart Surgery Needed for 6-Year-Old Kabir to Survive",
    category: "medical",
    targetAmount: 1200000,
    raisedAmount: 984000,
    donorsCount: 980,
    daysLeft: 1,
    organizer: {
      name: "Deepa Verma",
      relation: "Mother",
      location: "Mumbai, Maharashtra"
    },
    patientName: "Kabir Verma",
    hospitalName: "Kokilaben Dhirubhai Ambani Hospital, Mumbai",
    imageUrl: "/assets/images/hero-banner.png",
    story: "6-year-old Kabir was diagnosed with a severe congenital heart defect that requires immediate open-heart arterial switch surgery. His father is an auto-rickshaw driver and mother a homemaker. The family has exhausted all savings on preliminary treatments. Doctors have indicated that without surgery within 48 hours, his chances of survival diminish drastically. Every rupee donated goes directly to hospital clearance.",
    isVerified: true,
    taxBenefit80G: true,
    urgencyTag: "Critical Surgery",
    updates: [
      { date: "Yesterday", text: "Pre-surgery vitals stabilized. Admitted to pediatric cardiology ICU." },
      { date: "3 days ago", text: "First milestone reached! Thank you 700+ donors for standing by Kabir." }
    ]
  },
  {
    _id: "660000000000000000000007",
    title: "Emergency Liver Transplant to Save 3-Year-Old Baby Anvi",
    category: "children",
    targetAmount: 2200000,
    raisedAmount: 1850000,
    donorsCount: 1740,
    daysLeft: 2,
    organizer: {
      name: "Kavita Rao",
      relation: "Mother",
      location: "Bengaluru, Karnataka"
    },
    patientName: "Baby Anvi",
    hospitalName: "Manipal Hospital, Old Airport Road, Bengaluru",
    imageUrl: "/assets/images/campaign-nicu.png",
    story: "Little Anvi was born with Biliary Atresia, a rare liver disease that causes irreversible liver damage. Her skin and eyes turned deep yellow and fluids started accumulating. Her father has been matched as a living liver donor, but the emergency transplant surgery and post-operative ICU care costs ₹22 Lakhs. Your generosity can grant this little girl a lifetime of happiness.",
    isVerified: true,
    taxBenefit80G: true,
    urgencyTag: "Urgent ICU",
    updates: [
      { date: "2 days ago", text: "Father completed donor fitness screening successfully." }
    ]
  },
  {
    _id: "660000000000000000000001",
    title: "Help 4-Month-Old Baby Aarav Fight Severe Pneumonia & Respiratory Failure",
    category: "children",
    targetAmount: 1900000,
    raisedAmount: 1450000,
    donorsCount: 1420,
    daysLeft: 3,
    organizer: {
      name: "Ramesh Sharma",
      relation: "Father",
      location: "New Delhi, Delhi"
    },
    patientName: "Baby Aarav",
    hospitalName: "Max Super Speciality Hospital, Saket, Delhi",
    imageUrl: "/assets/images/campaign-nicu.png",
    story: "Baby Aarav was only 3 months old when a sudden acute respiratory syncytial virus attacked his lungs, leading to critical respiratory failure and septic shock. He is currently on high-frequency oscillatory ventilator support in the neonatal ICU. The daily ICU bed and medical cost is ₹65,000. Ramesh works as a clerk and has spent his life savings.",
    isVerified: true,
    taxBenefit80G: true,
    urgencyTag: "Critical ICU",
    updates: [
      { date: "4 days ago", text: "Ventilator pressure lowered slightly as oxygen levels stabilized." }
    ]
  },
  {
    _id: "660000000000000000000006",
    title: "Provide Emergency Kidney Transplant & Dialysis for 32-Year-Old Manoj",
    category: "medical",
    targetAmount: 2500000,
    raisedAmount: 2275000,
    donorsCount: 3400,
    daysLeft: 4,
    organizer: {
      name: "Sunita Devi",
      relation: "Wife",
      location: "Lucknow, Uttar Pradesh"
    },
    patientName: "Manoj Kumar",
    hospitalName: "Medanta - The Medicity, Gurugram",
    imageUrl: "/assets/images/campaign-cancer.png",
    story: "Manoj is a 32-year-old sole breadwinner for a family of 5, including two school-going daughters. Both his kidneys have suffered chronic end-stage failure. He requires 3 dialysis sessions per week and an emergency kidney transplant. Sunita is donating her kidney, but the transplant package and immunosuppressive drugs cost ₹25 Lakhs.",
    isVerified: true,
    taxBenefit80G: false,
    urgencyTag: "Closing Soon",
    updates: [
      { date: "5 days ago", text: "Final transplant clearance received from state authorization committee." }
    ]
  },
  {
    _id: "660000000000000000000008",
    title: "Brain Tumor Surgery Urgently Needed for Daily Wage Worker Somnath",
    category: "medical",
    targetAmount: 1600000,
    raisedAmount: 1120000,
    donorsCount: 1105,
    daysLeft: 5,
    organizer: {
      name: "Gopal Mukherjee",
      relation: "Brother",
      location: "Kolkata, West Bengal"
    },
    patientName: "Somnath Mukherjee",
    hospitalName: "Apollo Multispeciality Hospitals, Kolkata",
    imageUrl: "/assets/images/hero-banner.png",
    story: "Somnath, a daily wage construction worker, collapsed suddenly on a construction site. Scans revealed a progressive high-grade intracranial glioblastoma requiring urgent neurosurgical resection. His brother Gopal has pooled every resource from their village, but they fall ₹4.8 Lakhs short of the urgent surgery deposit.",
    isVerified: true,
    taxBenefit80G: true,
    urgencyTag: "Critical ICU",
    updates: []
  },
  {
    _id: "660000000000000000000002",
    title: "My 9-Year-Old Son Is Battling Acute Leukemia. Please Help Save Him",
    category: "cancer",
    targetAmount: 3000000,
    raisedAmount: 1860000,
    donorsCount: 2150,
    daysLeft: 6,
    organizer: {
      name: "Priya Nair",
      relation: "Mother",
      location: "Kochi, Kerala"
    },
    patientName: "Aditya Nair",
    hospitalName: "Amrita Institute of Medical Sciences, Kochi",
    imageUrl: "/assets/images/campaign-cancer.png",
    story: "Aditya loved playing cricket with his school friends until persistent fever and extreme fatigue led to the devastating diagnosis: B-cell Acute Lymphoblastic Leukemia. He has completed preliminary induction chemotherapy but urgently needs targeted immunotherapy and Bone Marrow Transplant to achieve total remission.",
    isVerified: true,
    taxBenefit80G: true,
    urgencyTag: "Hospital Verified",
    updates: [
      { date: "1 week ago", text: "Cycle 2 of targeted immunotherapy commenced with minimal side effects." }
    ]
  },
  {
    _id: "660000000000000000000003",
    title: "Support Higher Education Scholarships for 50 Underprivileged Girls",
    category: "education",
    targetAmount: 850000,
    raisedAmount: 640000,
    donorsCount: 520,
    daysLeft: 12,
    organizer: {
      name: "Pragati Educational Foundation",
      relation: "NGO",
      location: "Pune, Maharashtra"
    },
    patientName: "Girls Higher Education Batch 2026",
    hospitalName: "Pragati Educational Trust",
    imageUrl: "/assets/images/campaign-education.png",
    story: "In rural Maharashtra, dozens of talented young girls drop out after Class 12 due to inability to pay college tuition fees. Pragati Foundation provides 100% full fee sponsorship for 50 girls pursuing B.Sc, Engineering, and Nursing degrees. Your contribution covers tuition, books, and safe hostel accommodation.",
    isVerified: true,
    taxBenefit80G: true,
    urgencyTag: "Education Aid",
    updates: []
  },
  {
    _id: "660000000000000000000004",
    title: "Emergency Care & Shelter for 120 Abandoned & Injured Street Animals",
    category: "animal",
    targetAmount: 600000,
    raisedAmount: 430000,
    donorsCount: 410,
    daysLeft: 15,
    organizer: {
      name: "Paws & Hope Animal Welfare Trust",
      relation: "Shelter",
      location: "Hyderabad, Telangana"
    },
    patientName: "Paws Rescue Sanctuary Animals",
    hospitalName: "Paws & Hope Veterinary Clinic",
    imageUrl: "/assets/images/campaign-animal.png",
    story: "Paws & Hope shelter provides 24/7 veterinary surgery, shelter, nutritious food, and rehabilitation for injured stray dogs, cats, and cows rescued from road accidents. Funds will cover surgical supplies, rabies vaccinations, and food rations for 3 months.",
    isVerified: true,
    taxBenefit80G: true,
    urgencyTag: "Animal Welfare",
    updates: []
  }
];

export const CATEGORIES = [
  { id: "all", label: "All Causes", icon: "🌐" },
  { id: "medical", label: "Medical Emergency", icon: "🏥" },
  { id: "cancer", label: "Cancer Treatment", icon: "🎗️" },
  { id: "children", label: "Child Health & NICU", icon: "👶" },
  { id: "education", label: "Education Aid", icon: "🎓" },
  { id: "animal", label: "Animal Welfare", icon: "🐾" }
];

export const IMPACT_METRICS = [
  { value: "₹450+ Cr", label: "Total Raised", sublabel: "For urgent medical needs" },
  { value: "55 Lakh+", label: "Generous Donors", sublabel: "From 120+ countries" },
  { value: "1.2 Lakh+", label: "Successful Fundraisers", sublabel: "0% platform fee" },
  { value: "3,500+", label: "Hospital Partners", sublabel: "Direct cashless disbursal" }
];

export const SIMULATED_DONATIONS = [
  { name: "Rohan Sharma", amount: 2500, campaign: "Baby Aarav" },
  { name: "Ananya Iyer", amount: 1000, campaign: "Kabir Open-Heart Surgery" },
  { name: "Vikram Malhotra", amount: 5000, campaign: "Baby Anvi Liver Transplant" },
  { name: "Neha Deshmukh", amount: 1500, campaign: "Aditya Leukemia Treatment" },
  { name: "Suresh Pillai", amount: 10000, campaign: "Somnath Brain Tumor Surgery" },
  { name: "Kavita Menon", amount: 500, campaign: "50 Girls Scholarship" }
];

export const FAQS = [
  {
    q: "What is crowdfunding and how does Ketto work?",
    a: "Crowdfunding is a way to raise funds for medical treatment, education, or social causes by collecting small contributions from a large number of people online. On Ketto, you can create a campaign in 2 minutes, share it with family and friends, and withdraw the raised money directly to your hospital or bank account."
  },
  {
    q: "Does Ketto really charge 0% platform fee?",
    a: "Yes! Ketto charges 0% platform fee on all fundraisers so that the maximum possible amount reaches the patient or cause. Only third-party payment gateway transaction charges (processing fee) apply."
  },
  {
    q: "How quickly can I withdraw funds for an urgent medical emergency?",
    a: "You can request fund withdrawal at any time during your campaign. For verified medical emergencies, funds are transferred directly to the hospital's billing desk within 24 to 48 hours."
  },
  {
    q: "Are donations made on Ketto eligible for 80G tax benefits?",
    a: "Yes, donations made to registered NGOs and eligible medical campaigns on Ketto qualify for tax deduction under Section 80G of the Indian Income Tax Act. You will receive an instant 80G tax certificate with your receipt upon successful payment."
  },
  {
    q: "What documents are required to start a medical fundraiser?",
    a: "To verify a medical campaign, you will need: (1) Hospital estimate letter or medical discharge summary, (2) Doctor's diagnosis certificate, and (3) Patient & campaigner government photo ID (Aadhaar / PAN / Passport)."
  }
];
