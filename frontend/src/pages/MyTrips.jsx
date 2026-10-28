
import { Link } from "react-router-dom";

const trips = [
  {
    id: 1,
    destination: "Ella",
    region: "Uva Province",
    dates: "12 Nov – 15 Nov 2026",
    duration: "3 nights",
    status: "Upcoming",
    image:
      "https://www.tracedirecte.com/media/original_images/pont-9-arcs-ella-sri-lanka.jpg.1920x0_q85.jpg",
    slug: "ella",
    description:
      "Discover mountain views, tea plantations and scenic railway journeys.",
  },
  {
    id: 2,
    destination: "Galle",
    region: "Southern Province",
    dates: "20 Dec – 22 Dec 2026",
    duration: "2 nights",
    status: "Planning",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Galle_Fort%2C_Sri_Lanka.JPG",
    slug: "galle-fort",
    description:
      "Explore historic Galle Fort, charming streets and beautiful coastal views.",
  },
  {
    id: 3,
    destination: "Sigiriya",
    region: "Central Province",
    dates: "05 Jan – 07 Jan 2027",
    duration: "2 nights",
    status: "Planning",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sigiriya%2CSri_Lanka.jpg",
    slug: "sigiriya",
    description:
      "Visit the iconic Lion Rock and discover Sri Lanka's ancient heritage.",
  },
];

export default function MyTrips() {
  return (
    <main className="my-trips-page">
      <section className="my-trips-hero">
        <p className="my-trips-eyebrow">YOUR JOURNEY, YOUR STORY</p>
        <h1>My Trips</h1>
        <p>
          Keep your travel plans together and get ready for
          your next Sri Lankan adventure.
        </p>

        <Link to="/destinations" className="my-trips-primary-button">
          Explore destinations <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="my-trips-content">
        <div className="my-trips-heading">
          <div>
            <p className="my-trips-eyebrow">YOUR TRAVEL PLANNER</p>
            <h2>Journeys to remember</h2>
          </div>

          <span className="my-trips-count">
            {trips.length} sample trips
          </span>
        </div>

        <div className="my-trips-grid">
          {trips.map((trip) => (
            <article className="my-trip-card" key={trip.id}>
              <div className="my-trip-image-wrapper">
                <img
                  src={trip.image}
                  alt={trip.destination}
                  className="my-trip-image"
                />

                <span
                  className={`my-trip-status ${
                    trip.status === "Upcoming"
                      ? "my-trip-status-upcoming"
                      : "my-trip-status-planning"
                  }`}
                >
                  {trip.status}
                </span>
              </div>

              <div className="my-trip-body">
                <p className="my-trip-region">{trip.region}</p>
                <h3>{trip.destination}</h3>
                <p className="my-trip-description">
                  {trip.description}
                </p>

                <div className="my-trip-meta">
                  <div>
                    <span className="my-trip-meta-label">
                      Travel dates
                    </span>
                    <strong>{trip.dates}</strong>
                  </div>

                  <div>
                    <span className="my-trip-meta-label">
                      Duration
                    </span>
                    <strong>{trip.duration}</strong>
                  </div>
                </div>

                <Link
                  to={`/destinations/${trip.slug}`}
                  className="my-trip-view-button"
                >
                  Explore destination
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="my-trips-note">
          <span aria-hidden="true">✦</span>
          <div>
            <h3>Your next adventure starts here</h3>
            <p>
              These are sample trips for the page design.
              Saved trips and personal travel dates will be
              connected when trip management is implemented.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
