import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/destinations";

function makeSlug(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getImage(destination) {
  if (Array.isArray(destination.images)) {
    return destination.images[0] || "";
  }

  if (typeof destination.images === "string") {
    return destination.images;
  }

  return destination.image || "";
}

export default function DestinationDetails() {
  const { slug } = useParams();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDestination() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load destinations.");
        }

        const data = await response.json();

        const found = (data.destinations || []).find(
          (item) => makeSlug(item.name) === slug
        );

        setDestination(found || null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch destination error:", err);
          setError("Unable to load destination details. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDestination();

    return () => controller.abort();
  }, [slug]);

  if (loading) {
    return (
      <main className="destination-details-not-found">
        <h1>Loading destination...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="destination-details-not-found">
        <h1>Something went wrong</h1>
        <p>{error}</p>
        <Link to="/destinations">Back to destinations</Link>
      </main>
    );
  }

  if (!destination) {
    return (
      <main className="destination-details-not-found">
        <h1>Destination not found</h1>
        <p>We couldn't find that destination.</p>
        <Link to="/destinations">Back to destinations</Link>
      </main>
    );
  }

  const region = destination.province || destination.region || "Sri Lanka";
  const image = getImage(destination);
  const bestTime =
    destination.bestVisitingSeason || "Season varies by destination";
  const attractions = Array.isArray(destination.attractions)
    ? destination.attractions
    : [];

  return (
    <main className="destination-details-page">
      <div className="destination-details-container">
        <Link
          to="/destinations"
          className="destination-details-back"
        >
          ← Back to destinations
        </Link>

        <article className="destination-details-card">
          <div className="destination-details-image-wrapper">
            {image ? (
              <img
                src={image}
                alt={destination.name}
                className="destination-details-image"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
            ) : null}

            <span className="destination-details-region">
              {region}
            </span>
          </div>

          <div className="destination-details-body">
            <p className="destination-details-eyebrow">
              DISCOVER SRI LANKA
            </p>

            <h1>{destination.name}</h1>

            <p className="destination-details-description">
              {destination.description}
            </p>

            <div className="destination-details-info">
              <div>
                <span>Best time to visit</span>
                <strong>{bestTime}</strong>
              </div>

              <div>
                <span>Suggested duration</span>
                <strong>
                  {destination.duration || "Plan according to your itinerary"}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{region}</strong>
              </div>
            </div>

            {attractions.length > 0 && (
              <section className="destination-attractions">
                <p className="destination-details-eyebrow">
                  PLACES TO EXPLORE
                </p>

                <h2>Popular Attractions</h2>

                <ul>
                  {attractions.map((attraction) => (
                    <li key={attraction}>{attraction}</li>
                  ))}
                </ul>
              </section>
            )}

            {destination.travelTip && (
              <section className="destination-travel-tip">
                <h2>Travel Tip</h2>
                <p>{destination.travelTip}</p>
              </section>
            )}

            <Link
              to="/my-trips"
              className="destination-plan-button"
            >
              Plan your trip <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
