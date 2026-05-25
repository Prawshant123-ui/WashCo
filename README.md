<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-0066FF?style=for-the-badge" alt="version"/>
<img src="https://img.shields.io/badge/license-MIT-00BFFF?style=for-the-badge" alt="license"/>
<img src="https://img.shields.io/badge/status-active-00C896?style=for-the-badge" alt="status"/>

<br/><br/>

# 🚗 WashBook — Vehicle Wash Booking System

**A full-stack, role-based vehicle wash booking platform with a sleek blue & white interface.**  
Book a wash, manage offers, and track everything — from one clean dashboard.

<br/>

[Live Demo](https://washco.netlify.app) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Folder Structure](#-folder-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**WashBook** is a modern vehicle wash booking web application that bridges customers and service administrators through a seamless digital experience. Users can browse active offers, place bookings, and review their booking history — while admins have full control over offer management and booking status workflows.

Designed with a **clean blue and white UI**, the platform prioritizes usability, performance, and real-world operational needs like rate limiting, image upload, and robust validation.

---

## ✨ Features

### 👤 User Panel
| Feature | Description |
|---|---|
| 🔐 Authentication | Secure login & registration with JWT |
| 🏷️ View Offers | Browse all active wash offers with pricing |
| 📅 Place Booking | Book a wash slot with service selection |
| 🕓 Booking History | View all past and upcoming bookings |
| 🔍 Search & Filter | Filter bookings by status, date, or service |

### 🛠️ Admin Panel
| Feature | Description |
|---|---|
| 🔐 Secure Admin Login | Separate admin authentication flow |
| ➕ Add Offers | Create new wash offers with images & pricing |
| ✏️ Edit / Delete Offers | Full CRUD control over offers |
| 📋 View All Bookings | Paginated list of all customer bookings |
| 🔄 Update Booking Status | Change status: Pending → Confirmed → Completed |
| 📊 Dashboard Analytics | Visual charts for bookings & revenue trends |

### ⚙️ System-Level Features
- 📄 **Pagination** — Efficient data loading on all listing pages
- 🔎 **Search & Filtering** — Dynamic queries across bookings and offers
- 🚦 **Rate Limiting** — API abuse prevention via Express middleware
- 🖼️ **Image Upload** — Offer images via Multer (cloud/local storage)
- ✅ **Input Validation** — Server-side validation using Express Validator
- 📱 **Responsive Design** — Fully mobile-friendly layout

---

## 🧰 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

| Technology | Purpose |
|---|---|
| **React.js** | Component-based UI framework |
| **Chart.js** | Admin analytics & booking visualizations |
| **Framer Motion** | Page transitions & UI animations |
| **Axios** | HTTP client for API communication |
| **React Router** | Client-side navigation |

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | REST API framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **Multer** | File/image upload handling |
| **Express Validator** | Request validation middleware |
| **express-rate-limit** | API rate limiting |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌─────────────────┐            ┌──────────────────────────┐ │
│  │   User Panel    │            │       Admin Panel        │ │
│  │ - View Offers   │            │ - Manage Offers (CRUD)   │ │
│  │ - Book a Wash   │            │ - View All Bookings      │ │
│  │ - My Bookings   │            │ - Update Status          │ │
│  └────────┬────────┘            └───────────┬──────────────┘ │
└───────────┼──────────────────────────────────┼───────────────┘
            │         REST API (Axios)          │
            ▼                                  ▼
┌──────────────────────────────────────────────────────────────┐
│                   BACKEND (Node + Express)                   │
│                                                              │
│   Auth Routes    Offer Routes    Booking Routes              │
│   /api/auth      /api/offers     /api/bookings               │
│       │               │                │                     │
│   Rate Limiting ─ Validation ─ JWT Middleware                │
│       │               │                │                     │
│              Mongoose ODM                                    │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │      MongoDB        │
             │  users / offers /   │
             │  bookings           │
             └─────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Prawshant123-ui/WashCo.git
cd WashCo
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

Create `.env` in the `/server` directory (see [Environment Variables](#-environment-variables)):

```bash
cp .env.example .env
```

### 5. Run the Application

**Backend** (from `/server`):
```bash
npm run dev
```

**Frontend** (from `/client`):
```bash
npm start
```

App runs at → `http://localhost:3000`  
API runs at → `http://localhost:5000`

---

## 🔐 Environment Variables

Create a `.env` file inside the `/server` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/washbook

# Authentication
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | User login | Public |
| `POST` | `/api/auth/admin/login` | Admin login | Public |

### Offers
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/offers` | Get all offers (paginated) | Public |
| `POST` | `/api/offers` | Create a new offer | Admin |
| `PUT` | `/api/offers/:id` | Update an offer | Admin |
| `DELETE` | `/api/offers/:id` | Delete an offer | Admin |

### Bookings
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/bookings` | Place a booking | User |
| `GET` | `/api/bookings/my` | Get user's bookings | User |
| `GET` | `/api/bookings` | Get all bookings (paginated) | Admin |
| `PATCH` | `/api/bookings/:id/status` | Update booking status | Admin |

---

## 📁 Folder Structure

```
washbook/
├── client/                     # React Frontend
│   ├── public/
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/
│       │   ├── user/           # User-facing pages
│       │   └── admin/          # Admin dashboard pages
│       ├── context/            # Auth & global state
│       ├── hooks/              # Custom React hooks
│       ├── services/           # Axios API calls
│       └── App.jsx
│
├── server/                     # Node.js Backend
│   ├── controllers/            # Route logic
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Offer.js
│   │   └── Booking.js
│   ├── routes/                 # Express route definitions
│   ├── middleware/             # Auth, validation, rate-limit
│   ├── uploads/                # Uploaded offer images
│   ├── utils/
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch → `git checkout -b feature/your-feature`
3. Commit your changes → `git commit -m 'feat: add your feature'`
4. Push to the branch → `git push origin feature/your-feature`
5. Open a Pull Request

Please make sure your code follows existing conventions and passes all validations before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with 💙 by [Your Name](https://github.com/Prawshant123-ui)

⭐ Star this repo if you found it useful!

</div>
