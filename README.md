# 🇱🇰 TourMateCeylon

### Sri Lankan Travel and Tourism Management Platform

**Discover Sri Lanka. Plan Your Journey. Explore More.**

TourMateCeylon is a web-based travel and tourism management platform developed using the MERN stack. It provides a centralized platform for local and international travellers to explore destinations, discover events, find accommodation, manage bookings, and plan travel budgets.

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
│   ├── .env.example
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
```

*Note: The structure above highlights the main project directories. Additional files and subdirectories may exist.*

---

## ⚙️ Installation and Setup

Follow these steps to run TourMateCeylon on your local machine.

### Prerequisites

Make sure the following software is installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)
- Visual Studio Code (recommended)

### 1. Clone the Repository

Open a terminal and execute:

```bash
git clone https://github.com/piyumrajayarathne/TourMateCeylon.git
cd TourMateCeylon
```

### 2. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Configure the required environment variables.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the example values with your actual local configuration.

Use the exact environment variable names expected by the backend source code.

**Important:** Never upload your actual `.env` file, database credentials, JWT secrets, or private passwords to GitHub.

### 4. Install Frontend Dependencies

Open another terminal in the project root directory and execute:

```bash
cd frontend
npm install
```

### 5. Start MongoDB

Start the local MongoDB Community Server and make sure it is running before starting the backend.

### 6. Start the Backend Server

Open a terminal in the backend directory:

```bash
node server.js
```

The backend server runs at:

```text
http://localhost:5000
```

### 7. Start the Frontend Application

Open another terminal in the frontend directory:

```bash
npm run dev
```

Vite starts the frontend development server.

The frontend is normally available at:

```text
http://localhost:5173
```

### 8. Access the Application

Open the frontend URL in your web browser to access TourMateCeylon.

Make sure MongoDB, the backend server, and the frontend development server are running.

---

## 🔐 Environment Configuration

The backend uses environment variables for database connectivity, server configuration, and authentication.

Example `.env` configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Create your own `.env` file inside the backend directory.

An `.env.example` file can be included in the repository with placeholder values to help other developers configure the application.

**Security reminder:** Never commit actual database credentials, JWT secrets, or other sensitive information to GitHub.

---

## 🔑 Demo Accounts

TourMateCeylon supports two main user roles for demonstration and testing.

### Available User Roles

| Role        | Access                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------- |
| Traveller   | Destination discovery, event discovery, accommodation browsing, bookings, and budget planning |
| Hotel Owner | Hotel management, room management, price management, and availability management              |

Traveller -       username-  piyumra\@gmail.com

&#x20;                      password- 123456abc

Hotel Owner- username- hotelmanager.test\@example.com

&#x20;                      password- 123456abc

---

## 🗄️ Database

TourMateCeylon uses MongoDB as its database and Mongoose for data modelling and database operations.

The application uses the following main data models:

- **User** – Stores user account information, roles, and profile details.
- **Hotel** – Stores hotel information and owner references.
- **Room** – Stores room details, prices, capacity, and availability.
- **Booking** – Stores booking information, dates, amounts, and booking/payment statuses.
- **Destination** – Stores Sri Lankan destination information and details.
- **Event** – Stores tourism event information and details.
- **Trip** – Stores trip plans, budgets, destinations, and booking references.
- **Expense** – Stores travel expenses associated with trips and travellers.

MongoDB ObjectId references are used to represent relationships between related documents.

---

## 🔒 Security

TourMateCeylon incorporates the following security mechanisms:

- Passwords are hashed before storage using bcryptjs.
- JWT is used for user authentication.
- Protected routes restrict unauthorized access.
- Role-based access control separates traveller and hotel owner functionality.
- Sensitive configuration is maintained through environment variables.
- Backend validation helps protect data integrity.



---

## 👩‍💻 Developer

**Project:** TourMateCeylon
**Module:** EC4307 – Web Application Development
**University:** University of Ruhuna
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)

EG/2023/5656

**GitHub Repository:**
[https://github.com/piyumrajayarathne/TourMateCeylon](https://github.com/piyumrajayarathne/TourMateCeylon)

##
