import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthModal from "./AuthModal.jsx";

export default function Navbar({ authenticated = false }) {
const [authModal, setAuthModal] = useState(null);
  
  const publicLinks = [
    { label: "Home", path: "/" },
    { label: "Destinations", path: "/destinations" },
    { label: "Events", path: "/events" },
    { label: "Stays", path: "/stays" },
    { label: "My Trips", path: "/my-trips" },
    { label: "My Bookings", path: "/bookings" },
    { label: "Budget", path: "/budget" },
  ];

  const accountLinks = [
    { label: "My trips", path: "/my-trips" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <header className="site-header">
      <Link
        to="/"
        className="brand"
        aria-label="TourMateCeylon home"
      >
        <span className="brand-mark">♧</span>
        <span>
          <span className="brand-name">TourMateCeylon</span>
          <span className="brand-tagline">
            AN ISLAND. YOUR STORY.
          </span>
        </span>
      </Link>

      <nav className="primary-nav" aria-label="Main navigation">
        {publicLinks.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        {authenticated ? (
          <nav className="account-nav" aria-label="Your account">
            {accountLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : (
          <>
            <button
              type="button"
              className="login-link auth-login-trigger"
            onClick={() => setAuthModal("login")}
            >
            Log in
            </button>
            <Link
              className="button button-primary"
              to="/my-trips"
            >
              Start planning
            </Link>
          </>
        )}
      </div>

      {authModal && (
        <AuthModal
        initialMode={authModal}
        onClose={() => setAuthModal(null)}
        />
      )}
    </header>
  );
}
