
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Destinations from "./pages/Destinations.jsx";
import DestinationDetails from "./pages/DestinationDetails.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Stays from "./pages/Stays.jsx";
import StayDetails from "./pages/StayDetails.jsx";

function PlaceholderPage({ title, description }) {
  return (
    <main className="page-container">
      <span className="eyebrow">TOURMATECEYLON</span>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{description}</p>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Destinations */}
        <Route
          path="/destinations"
          element={<Destinations />}
        />

        <Route
          path="/destinations/:slug"
          element={<DestinationDetails />}
        />

        {/* Events */}
        <Route path="/events" element={<Events />} />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        {/* Stays */}
        <Route path="/stays" element={<Stays />} />

        <Route
          path="/stays/:id"
          element={<StayDetails />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <PlaceholderPage
              title="Welcome back"
              description="Your next journey is waiting."
            />
          }
        />

        {/* Registration */}
        <Route
          path="/register"
          element={
            <PlaceholderPage
              title="Create your account"
              description="Start planning your Sri Lankan adventure."
            />
          }
        />

        {/* My trips */}
        <Route
          path="/my-trips"
          element={
            <PlaceholderPage
              title="My trips"
              description="Your planned journeys will appear here."
            />
          }
        />

        {/* Budget */}
        <Route
          path="/budget"
          element={
            <PlaceholderPage
              title="Budget dashboard"
              description="Keep track of your travel expenses."
            />
          }
        />

        {/* My bookings */}
        <Route
          path="/bookings"
          element={
            <PlaceholderPage
              title="My bookings"
              description="View and manage your travel bookings."
            />
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <PlaceholderPage
              title="My profile"
              description="Manage your TourMateCeylon account."
            />
          }
        />

        {/* 404 - Keep this route last */}
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page not found"
              description="The page you're looking for doesn't exist."
            />
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}
