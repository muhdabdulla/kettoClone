// Initial/Fallback campaigns shared across controllers and seeds
const initialCampaigns = [
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
    _id: "660000000000000000000002",
    title: "My 9-Year-Old Son Is Battling Acute Leukemia. Please Help Save Him",
    organizer: "Priya Nair (Mother)",
    category: "cancer",
    goalAmount: 3000000,
    raisedAmount: 1860000,
    donorsCount: 2150,
    daysLeft: 6,
    imageUrl: "assets/images/campaign-cancer.png",
    badges: ["Urgent", "Hospital Verified"],
    status: "active",
    progressPercent: 62
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
    _id: "660000000000000000000004",
    title: "Emergency Medical Care & Shelter for 120+ Injured Street Animals",
    organizer: "Paws & Claws Animal Trust",
    category: "animals",
    goalAmount: 500000,
    raisedAmount: 240000,
    donorsCount: 310,
    daysLeft: 12,
    imageUrl: "assets/images/campaign-animal.png",
    badges: ["Tax Benefit 80G"],
    status: "active",
    progressPercent: 48
  },
  {
    _id: "660000000000000000000005",
    title: "Urgent Open-Heart Surgery Needed for 6-Year-Old Kabir to Survive",
    organizer: "Deepa Verma (Mother)",
    category: "medical",
    goalAmount: 1200000,
    raisedAmount: 984000,
    donorsCount: 980,
    daysLeft: 2,
    imageUrl: "assets/images/hero-banner.png",
    badges: ["Critical Surgery", "80G Benefit"],
    status: "active",
    progressPercent: 82
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
  }
];

module.exports = initialCampaigns;
