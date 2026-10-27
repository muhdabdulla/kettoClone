# 🌟 Ketto Crowdfunding Clone - Full-Stack Application

A full-stack crowdfunding platform clone inspired by **Ketto**, built for college interim evaluation. The platform features an interactive frontend connected to a robust **Node.js + Express.js + MongoDB Atlas + Mongoose** backend.

---

## 🚀 Key Features & Evaluation Rubric Checklist

1. **Express Server & Routing**: Modular routing architecture (`/api/campaigns`, `/api/donations`, `/api/users`, `/api/leads`).
2. **MongoDB Atlas & Mongoose**: Schemas with validation, relationships (`Donation` -> `Campaign`), and automated updates using `$inc`.
3. **Graceful Fallback**: Active in-memory store so the entire demo functions smoothly whether connected to Atlas or during offline presentation.
4. **Validation & Error Handling**: Centralized error middleware handling Mongoose `ValidationError`, `CastError`, duplicate keys, and invalid request payloads with appropriate HTTP status codes (200, 201, 400, 404, 409, 500).
5. **Middlewares**: Custom request logger (`[METHOD] /url - STATUS (ms)`), CORS enabled for cross-origin frontend communication, and JSON body parser.
6. **Frontend Integration**: Dynamic campaign card rendering directly from database and real-time donation processing with instant progress bar update.

---

## 📁 Project Architecture & Directory Structure

```text
kettoClone1/
├── assets/                    # Platform images, campaign banners & icons
├── components/                # Modular HTML components
├── css/                       # Modular CSS stylesheets (global, header, hero, campaigns, etc.)
├── js/
│   ├── campaigns.js           # Connects to GET /api/campaigns & live filters
│   ├── modals.js              # Connects to POST /api/donations & modal dialogs
│   ├── header.js              # Header & search bar behavior
│   ├── faq.js                 # Interactive accordion
│   └── main.js                # App initializer
├── server/
│   ├── config/
│   │   └── db.js              # MongoDB Atlas connection & error handlers
│   ├── controllers/
│   │   ├── campaignController.js # Campaign CRUD & Impact stats
│   │   ├── donationController.js # Donation creation & atomic updates
│   │   ├── userController.js     # User registration & queries
│   │   └── leadController.js     # Fundraiser inquiry leads
│   ├── data/
│   │   └── initialCampaigns.js   # Seed & fallback initial campaign data
│   ├── middlewares/
│   │   ├── errorHandler.js       # Centralized error handler
│   │   ├── requestLogger.js      # Console logger with timestamps & status codes
│   │   └── validator.js          # Input validation middleware
│   ├── models/
│   │   ├── Campaign.js           # Mongoose Campaign schema & virtuals
│   │   ├── Donation.js           # Mongoose Donation schema
│   │   ├── User.js               # Mongoose User schema
│   │   └── FundraiserLead.js     # Fundraiser inquiry schema
│   ├── routes/
│   │   ├── campaignRoutes.js     # Campaign REST API endpoints
│   │   ├── donationRoutes.js     # Donation REST API endpoints
│   │   ├── userRoutes.js         # User endpoints
│   │   └── leadRoutes.js         # Lead submission endpoints
│   ├── scripts/
│   │   └── seed.js               # Database seeding script (5-6 realistic campaigns)
│   ├── .env                      # Environment variables (PORT, MONGO_URI)
│   ├── package.json              # Server dependencies & scripts
│   └── server.js                 # Main Express server entry point
├── index.html                 # Main frontend landing page
└── README.md                  # Project documentation
```

---

## ⚙️ Quick Setup & Running Instructions

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB Atlas** cluster account (or offline fallback will activate automatically)

### 2. Install Dependencies
Open a terminal in the `server` directory:
```bash
cd server
npm install
```

### 3. Configure Environment Variables
Verify or edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.wxdwjog.mongodb.net/kettoClone?retryWrites=true&w=majority
NODE_ENV=development
```
> **💡 MongoDB Atlas Tip:** In your MongoDB Atlas Dashboard, ensure `0.0.0.0/0` is added to **Network Access** -> **IP Access List** so connections from any network/college WiFi are allowed.

### 4. (Optional) Seed the Database
Populate MongoDB Atlas with initial campaigns, users, and donations:
```bash
npm run seed
```

### 5. Start the Server
```bash
npm start
```
- **Website & Frontend**: [http://localhost:5000](http://localhost:5000)
- **API Base**: [http://localhost:5000/api](http://localhost:5000/api)
- **Campaigns Endpoint**: [http://localhost:5000/api/campaigns](http://localhost:5000/api/campaigns)

---

## 📡 REST API Documentation

### 1. Campaigns API (`/api/campaigns`)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/campaigns` | Get all active campaigns (supports `?category=` and `?search=`) | `200 OK` |
| **GET** | `/api/campaigns/:id` | Get single campaign by MongoDB ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/campaigns` | Create a new campaign (validated: title, organizer, goalAmount >= 1000) | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/campaigns/:id` | Update an existing campaign | `200 OK` / `404 Not Found` |
| **DELETE**| `/api/campaigns/:id` | Delete campaign from database | `200 OK` / `404 Not Found` |
| **GET** | `/api/campaigns/stats/impact` | Aggregate total funds raised, total donors & active campaigns | `200 OK` |

#### Sample Campaign Creation Payload (`POST /api/campaigns`)
```json
{
  "title": "Emergency Open Heart Surgery for 5-Year-Old",
  "organizer": "Suresh Gupta (Father)",
  "category": "medical",
  "goalAmount": 1500000,
  "imageUrl": "assets/images/hero-banner.png",
  "badges": ["Critical ICU", "Tax Benefit 80G"]
}
```

---

### 2. Donations API (`/api/donations`)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/donations` | Process a new donation and atomically increment campaign's `raisedAmount` & `donorsCount` | `201 Created` / `400 Bad Request` |
| **GET** | `/api/donations` | Retrieve all donation records (supports `?campaignId=`) | `200 OK` |
| **GET** | `/api/donations/:campaignId` | Retrieve recent donations for a specific campaign | `200 OK` |

#### Sample Donation Payload (`POST /api/donations`)
```json
{
  "campaignId": "660000000000000000000001",
  "donorName": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "amount": 2500,
  "tax80G": true
}
```

#### Successful Donation Response (`201 Created`)
```json
{
  "success": true,
  "message": "Thank you, Aarav Sharma! Your contribution of ₹2,500 was received.",
  "donation": {
    "_id": "661000000000000000000009",
    "campaignId": "660000000000000000000001",
    "donorName": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "amount": 2500,
    "tax80G": true,
    "paymentStatus": "success",
    "createdAt": "2026-10-06T00:00:00.000Z"
  },
  "updatedCampaign": {
    "_id": "660000000000000000000001",
    "title": "Help 4-Month-Old Baby Aarav Fight Severe Pneumonia & Respiratory Failure",
    "raisedAmount": 1452500,
    "goalAmount": 1900000,
    "donorsCount": 1421,
    "progressPercent": 76
  }
}
```

---

### 3. Users API (`/api/users`) & Fundraiser Leads (`/api/leads`)

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | List registered platform users | `200 OK` |
| **POST** | `/api/users/register` | Register new user with password (bcrypt hashed) | `201 Created` |
| **POST** | `/api/users/signin` | Sign in with email/@username and password | `200 OK` |
| **GET** | `/api/users/check-username` | Live check username availability (`?username=`) | `200 OK` |
| **POST** | `/api/leads` | Submit a "Start a Fundraiser" inquiry lead | `201 Created` |

---

## 🛡️ Error Handling & Validation Overview

- **Input Validation Middleware** (`server/middlewares/validator.js`):
  - Requires mandatory fields (`title`, `donorName`, `email`, `goalAmount`).
  - Ensures valid email formats using regex and minimum donation thresholds (`₹100`).
  - Returns `400 Bad Request` with clear error descriptions.
- **Centralized Error Handler** (`server/middlewares/errorHandler.js`):
  - Handles Mongoose `CastError` (e.g. invalid MongoDB `ObjectId`) -> returns `404 Not Found`.
  - Handles Mongoose `ValidationError` -> returns `400 Bad Request`.
  - Handles duplicate email/keys (`code 11000`) -> returns `409 Conflict`.
  - Catches all unexpected server exceptions -> returns `500 Internal Server Error`.

---

## 🎓 College Presentation Walkthrough

1. **Start the backend**: `cd server && npm start`
2. **Show Server Logs**: Point out the custom request logger middleware displaying method, path, status code, and response time.
3. **Open Frontend**: Open `http://localhost:5000` in browser. Show that campaign cards are populated from backend API (`/api/campaigns`).
4. **Demonstrate Category Filters & Search**: Click on "Child Health", "Cancer Treatment", etc. to show live filtering.
5. **Make a Live Donation**:
   - Click "Donate Now" on any card (e.g. Baby Aarav).
   - Enter amount (e.g. ₹2,000), Donor Name, and Email.
   - Click "Proceed to Pay".
   - Point out that the backend processes `POST /api/donations`, atomically increments `raisedAmount` and `donorsCount`, and updates the progress bar and numbers in real time!
6. **Show API Endpoints via Browser or Postman**:
   - `http://localhost:5000/api/campaigns`
   - `http://localhost:5000/api/donations`
   - `http://localhost:5000/api/campaigns/stats/impact`
