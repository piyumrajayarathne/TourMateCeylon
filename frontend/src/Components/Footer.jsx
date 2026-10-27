import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            TourMateCeylon
          </Link>
          <p>
            For the places that stay with you. Discover Sri Lanka
            and make room for your own kind of journey.
          </p>
        </div>

        <div className="footer-column">
          <h3>Discover</h3>
          <Link to="/destinations">Destinations</Link>
          <Link to="/events">Cultural events</Link>
          <Link to="/hotels">Places to stay</Link>
        </div>

        <div className="footer-column">
          <h3>Your journey</h3>
          <Link to="/my-trips">Plan a trip</Link>
          <Link to="/budget">Track your budget</Link>
          <Link to="/bookings">My bookings</Link>
        </div>

        <div className="footer-column">
          <h3>Good to know</h3>
          <a href="#about">About TourMateCeylon</a>
          <a href="#privacy">Privacy &amp; terms</a>
          <a href="#responsible-travel">Travel responsibly</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 TourMateCeylon · Thoughtfully made for Sri Lanka</span>
        <span className="footer-note">
          Slow down. Look closer. Travel kindly.
        </span>
      </div>
    </footer>
  );
}
