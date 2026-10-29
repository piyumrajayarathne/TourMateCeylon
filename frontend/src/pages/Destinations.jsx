import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/destinations";

const categories = ["All", "Beach", "Nature", "Heritage", "Culture"];


function getCategory(destination) {
  const value = String(destination.category || "").toLowerCase();

  if (value === "beach") return "Beach";
  if (value === "mountain" || value === "wildlife") return "Nature";
  if (value === "historical") return "Heritage";
  if (value === "religious") return "Culture";
  if (value === "adventure") return "Adventure";

  return destination.category || "Other";
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

function getSlug(destination) {
  return (
    destination.slug ||
    destination.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDestinations() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Could not load destinations (${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data.destinations)) {
          throw new Error("The destination API returned an unexpected response.");
        }

        setDestinations(data.destinations);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch destinations error:", err);
          setError(err.message || "Failed to load destinations.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDestinations();

    return () => controller.abort();
  }, []);

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return destinations.filter((destination) => {
      const category = getCategory(destination);
      const region = destination.province || destination.region || "";
      const name = destination.name || "";
      const description = destination.description || "";

      const matchesSearch =
        !query ||
        name.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        region.toLowerCase().includes(query) ||
        String(destination.district || "").toLowerCase().includes(query) ||
        description.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All" || category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [destinations, search, activeCategory]);

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();
    setSearchParams(query ? { search: query } : {});
  }

  function clearFilters() {
    setSearch("");
    setActiveCategory("All");
    setSearchParams({});
  }

  return (
    <main className="destinations-page">
      <section className="destinations-hero">
        <span className="destinations-eyebrow">
          FIND YOUR NEXT ADVENTURE
        </span>

        <h1>
          Discover Sri <em>Lanka.</em>
        </h1>

        <p>
          From quiet beaches to misty mountain trails, find the places
          that make your journey unforgettable.
        </p>

        <form className="destinations-search" onSubmit={handleSearch}>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search places, regions, or experiences..."
            aria-label="Search destinations"
          />
          <button type="submit">Search destinations</button>
        </form>
      </section>

      <section className="destinations-content">
        <div className="destinations-heading">
          <div>
            <span className="destinations-section-eyebrow">
              THE ISLAND AWAITS
            </span>
            <h2>Find your kind of place.</h2>
            <p>
              Explore destinations and choose the experience that suits you.
            </p>
          </div>

          <span className="destination-count">
            {filteredDestinations.length}{" "}
            {filteredDestinations.length === 1 ? "place" : "places"}
          </span>
        </div>

        <div
          className="destination-filters"
          aria-label="Filter by category"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "destination-filter active"
                  : "destination-filter"
              }
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="destinations-empty">
            <h3>Loading destinations...</h3>
            <p>Please wait while we retrieve destinations.</p>
          </div>
        ) : error ? (
          <div className="destinations-empty">
            <h3>Unable to load destinations</h3>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="destinations-grid">
            {filteredDestinations.map((destination, index) => {
              const category = getCategory(destination);
              const region =
                destination.province || destination.region || "Sri Lanka";
              const image = getImage(destination);
              const slug = getSlug(destination);

              return (
                <article
                  className="destination-result-card"
                  key={destination._id || slug}
                >
                  <Link
                    className="destination-result-image"
                    to={`/destinations/${encodeURIComponent(slug)}`}
                    aria-label={`View ${destination.name}`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={destination.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden";
                        }}
                      />
                    ) : null}

                    <span className="destination-result-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>

                  <div className="destination-result-body">
                    <div className="destination-result-meta">
                      <span>{category}</span>
                      <span>{region}</span>
                    </div>

                    <h3>{destination.name}</h3>
                    <p>{destination.description}</p>

                    <Link
                      className="destination-result-link"
                      to={`/destinations/${encodeURIComponent(slug)}`}
                    >
                      Explore destination{" "}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="destinations-empty">
            <span aria-hidden="true">⌕</span>
            <h3>No destinations found</h3>
            <p>
              Try another search or choose a different category.
            </p>
            <button type="button" onClick={clearFilters}>
              Clear search and filters
            </button>
          </div>
        )}
      </section>

      <section className="destinations-cta">
        <span className="destinations-eyebrow">MAKE IT YOUR JOURNEY</span>
        <h2>Your next story starts here.</h2>
        <p>
          Start organising your plans and bring your Sri Lankan adventure
          together in one place.
        </p>
        <Link to="/my-trips" className="destinations-cta-button">
          Start planning a trip <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
