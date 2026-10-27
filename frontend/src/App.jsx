import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";

function PlaceholderPage({ title, description }) {
  return (
    <main className="page-container">
      <span className="eyebrow">TOURMATECEYLON</span>
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{description}</p>
    </main>
  );
}

function Home() {
  return (
    <main className="page-container">
      <span className="eyebrow">YOUR JOURNEY STARTS HERE</span>
      <h1 className="page-title">Discover the soul of Sri Lanka.</h1>
      <p className="page-subtitle">
        Find extraordinary places, plan your journey, and make
        unforgettable memories across our island.
      </p>
      <a className="button button-primary" href="/destinations">
        Explore destinations
      </a>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/destinations"
          element={
            <PlaceholderPage
              title="Discover Sri Lanka"
              description="Explore beaches, mountains, heritage sites, and wildlife."
            />
          }
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
        <Route
          path="/events"
          element={
            <PlaceholderPage
              title="Events & experiences"
              description="Discover cultural experiences around Sri Lanka."
            />
          }
        />
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

