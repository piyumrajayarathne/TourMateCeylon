import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthModal from "./AuthModal.jsx";

export default function Navbar({
  authenticated = false,
  onLogout,
  onLoginSuccess,
}) {
  const [authModal, setAuthModal] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const user = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("tourmate-user") || "null"
      );
    } catch {
      return null;
    }
  })();

  const firstName = user?.firstName || "Traveler";
  const isHotelOwner = user?.role === "Hotel Owner";

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const publicLinks = [
    { label: "Home", path: "/" },
    { label: "Destinations", path: "/destinations" },
    { label: "Events", path: "/events" },
    { label: "Stays", path: "/stays" },
    { label: "My Trips", path: "/my-trips" },
    { label: "My Bookings", path: "/bookings" },
    { label: "Budget", path: "/budget" },
  ];

  function handleLogout() {
    setAccountOpen(false);

    if (onLogout) {
      onLogout();
    }
  }

  return (
    <header className="site-header">
      <Link
        to="/"
        className="brand"
        aria-label="TourMateCeylon home"
      >
        <span className="brand-mark">♧</span>

        <span>
          <span className="brand-name">
            TourMateCeylon
          </span>

          <span className="brand-tagline">
            AN ISLAND. YOUR STORY.
          </span>
        </span>
      </Link>

      <nav
        className="primary-nav"
        aria-label="Main navigation"
      >
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
          <div
            className="account-dropdown"
            ref={accountRef}
          >
            <button
              type="button"
              className="account-dropdown-trigger"
              aria-expanded={accountOpen}
              aria-haspopup="menu"
              onClick={() =>
                setAccountOpen((previous) => !previous)
              }
            >
              <span
                className="account-avatar"
                aria-hidden="true"
              >
                ♙
              </span>

              <span>Hi, {firstName}!</span>

              <span
                className={`account-chevron ${
                  accountOpen ? "open" : ""
                }`}
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            {accountOpen && (
              <div
                className="account-dropdown-menu"
                role="menu"
              >
                <Link
                  to="/profile"
                  role="menuitem"
                  className="account-dropdown-item"
                  onClick={() => setAccountOpen(false)}
                >
                  My Profile
                </Link>

                {isHotelOwner && (
                  <Link
                    to="/hotel-dashboard"
                    role="menuitem"
                    className="account-dropdown-item"
                    onClick={() => setAccountOpen(false)}
                  >
                    Hotel Dashboard
                  </Link>
                )}

                <Link
                  to="/my-trips"
                  role="menuitem"
                  className="account-dropdown-item"
                  onClick={() => setAccountOpen(false)}
                >
                  My Trips
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  className="account-dropdown-item account-logout"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              type="button"
              className="login-link auth-login-trigger"
              onClick={() => setAuthModal("login")}
            >
              Log in
            </button>

            <button
              type="button"
              className="button button-primary"
              onClick={() => setAuthModal("register")}
            >
              Sign up
            </button>
          </>
        )}
      </div>

      {authModal && (
        <AuthModal
          initialMode={authModal}
          onClose={() => setAuthModal(null)}
          onLoginSuccess={() => {
            if (onLoginSuccess) {
              onLoginSuccess();
            }

            setAuthModal(null);
          }}
        />
      )}
    </header>
  );
}
