import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Destinations from "./pages/Destinations.jsx";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails.jsx";

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
        <Route path="/" element={<Home />} />

        {/* Destinations page */}
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

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

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

        <Route path="/events" element={<Events />} />

        <Route
          path="/hotels"
          element={
            <PlaceholderPage
              title="Find your stay"
              description="Explore places to stay during your journey."
            />
          }
        />

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
