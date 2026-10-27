import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Destinations from "./pages/Destinations.jsx";
import Events from "./pages/Events.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Stays from "./pages/Stays.jsx";

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
          element={
            <PlaceholderPage
              title="Destination details"
              description="Discover more about this destination."
            />
          }
        />

        {/* Events */}
        <Route path="/events" element={<Events />} />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        {/* Stays */}
        <Route path="/stays" element={<Stays />} />

        {/* Login and registration */}
        <Route
          path="/login"
          element={
            <PlaceholderPage
              title="Welcome back"
              description="Your next journey is waiting."
            />
          }
        />

        <Route
          path="/register"
          element={
            <PlaceholderPage
              title="Create your account"
              description="Start planning your Sri Lankan adventure."
            />
          }
        />

        {/* Trips and budget */}
        <Route
          path="/my-trips"
          element={
            <PlaceholderPage
              title="My trips"
              description="Your planned journeys will appear here."
            />
          }
        />

        <Route
          path="/budget"
          element={
            <PlaceholderPage
              title="Budget dashboard"
              description="Keep track of your travel expenses."
            />
          }
        />

        {/* Other pages not implemented yet */}
        <Route
          path="/hotels"
          element={
            <PlaceholderPage
              title="Places to stay"
              description="Discover accommodation options for your journey."
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
