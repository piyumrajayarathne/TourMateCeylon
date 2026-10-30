# 🇱🇰 TourMateCeylon

### Sri Lankan Travel and Tourism Management Platform

**Discover Sri Lanka. Plan Your Journey. Explore More.**

TourMateCeylon is a web based travel and tourism management platform developed using the MERN stack. It provides a centralized platform for local and international travellers to explore destinations, discover events, find accommodation, manage bookings, and plan travel budgets.

The platform also provides dedicated hotel management facilities, allowing hotel owners to manage their properties, rooms, prices, and availability.

---

## 🌍 Project Overview

TourMateCeylon aims to improve the travel planning experience in Sri Lanka by bringing important tourism services together in one platform.

Travellers can explore popular destinations, discover upcoming events, browse accommodation options, make hotel bookings, and manage their travel expenses.

Hotel owners can register and manage their hotels, add rooms, update prices, and control room availability through a dedicated dashboard.

---

## ✨ Main Features

### 1. User Authentication

- User registration and login.
- Secure password hashing.
- JWT-based authentication.
- Role-based access control.

### 2. Destination Discovery

- Explore tourist destinations across Sri Lanka.
- View destination information and details.
- Discover places to visit.

### 3. Event Discovery

- Browse cultural, religious, adventure, and other events.
- View event descriptions and details.
- Explore events happening in different parts of Sri Lanka.

### 4. Accommodation Management

- Browse available hotels and accommodation.
- View hotel descriptions, locations, and amenities.
- Explore available rooms.
- Filter accommodation using search criteria and price.

### 5. Hotel Owner Dashboard

- Add, edit, and delete hotels.
- Add, edit, and delete rooms.
- Manage room prices.
- Update room availability.
- View hotel and room management information.

### 6. Hotel Booking

- Browse available rooms.
- Make accommodation bookings.
- View personal booking information.
- Access the My Bookings section.

### 7. Travel Budget Planner

- Plan travel budgets.
- Record travel expenses.
- Track spending.
- Monitor budget usage.

---

## 👥 User Roles

TourMateCeylon supports two main user roles.

### Traveller

Travellers can:

- Register and log in.
- Explore destinations.
- Discover tourism events.
- Browse hotels and available rooms.
- Book accommodation.
- View their bookings.
- Plan and track travel budgets.

### Hotel Owner

Hotel owners can:

- Register and access their accounts.
- Add and manage hotels.
- Add and manage rooms.
- Set room prices.
- Update room availability.
- Manage their accommodation listings.

---

## 🛠️ Technologies Used

| Category                | Technologies              |
| ----------------------- | ------------------------- |
| Frontend                | React.js, JavaScript, CSS |
| Frontend Build Tool     | Vite                      |
| Backend                 | Node.js, Express.js       |
| Database                | MongoDB                   |
| ODM                     | Mongoose                  |
| Authentication          | JSON Web Token (JWT)      |
| Password Security       | bcryptjs                  |
| API Communication       | REST API                  |
| Version Control         | Git, GitHub               |
| Development Environment | Visual Studio Code        |

---

## 📁 Project Structure

```text
TourMateCeylon/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── index.html
│
├── README.md
└── .gitignore

---

## ⚙️ Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd TourMateCeylon
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables.

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 4. Run the Application

Start the MongoDB server first.

**Start the backend:**

From the backend directory:

```bash
node server.js
```

Backend URL:

```text
http://localhost:5000
```

**Start the frontend:**

From the frontend directory:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Open the frontend URL in your browser to access TourMateCeylon.

---

## 🔐 Environment Configuration

The backend requires environment variables for database connectivity and authentication.

Example `.env` configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use the exact variable names expected by your backend code.

**Important:** Never upload your `.env` file, database credentials, JWT secrets, or private passwords to GitHub.

---

## 🔑 Demo Accounts

The application supports two user roles for demonstration and testing.

### Traveller Account

| Field    | Details            |
| -------- | ------------------ |
| Role     | Traveller          |
| Email    | piyumra\@gmail.com |
| Password | 123456abc          |

### Hotel Owner Account

| Field    | Details                            |
| -------- | ---------------------------------- |
| Role     | Hotel Owner                        |
| Email    | **hotelmanager.test\@example.com** |
| Password | 123456abc                          |

Replace these placeholders with dedicated demonstration credentials only if you intend to make them public.

---

## 🗄️ Database

TourMateCeylon uses MongoDB as its database and Mongoose for data modelling and database operations.

The database manages application information such as:

- User accounts
- Hotels
- Rooms
- Bookings
- Tourism events
- Budget and expense records

---

## 🔒 Security

- Passwords are hashed before storage.
- JWT is used for authentication.
- Protected routes restrict unauthorized access.
- Role-based access control separates traveller and hotel owner functionality.
- Sensitive configuration is maintained through environment variables.
