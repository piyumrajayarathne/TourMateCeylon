import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const destinations = [
  {
    name: "Galle Fort",
    category: "Heritage",
    region: "Southern Province",
    description:
      "Explore historic streets, colonial architecture, boutique shops, and beautiful ocean views.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Galle_Fort%2C_Sri_Lanka.JPG",
  },
  {
    name: "Ella",
    category: "Nature",
    region: "Uva Province",
    description:
      "Discover misty mountains, tea plantations, scenic hikes, and the famous Nine Arch Bridge.",
    image:
      "https://www.tracedirecte.com/media/original_images/pont-9-arcs-ella-sri-lanka.jpg.1920x0_q85.jpg",
  },
  {
    name: "Mirissa",
    category: "Beach",
    region: "Southern Province",
    description:
      "Enjoy palm-lined beaches, golden sunsets, ocean adventures, and a relaxed coastal atmosphere.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Mirissa_Sri_lanka.jpg",
  },
  {
    name: "Sigiriya",
    category: "Heritage",
    region: "Central Province",
    description:
      "Visit the iconic rock fortress and discover the history and scenery surrounding it.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sigiriya%2CSri_Lanka.jpg",
  },
  {
    name: "Kandy",
    category: "Culture",
    region: "Central Province",
    description:
      "Experience a cultural city known for its lake, historic temples, and surrounding hills.",
    image: "/images/kandy.jpg",
  },
  {
    name: "Nuwara Eliya",
    category: "Nature",
    region: "Central Province",
    description:
      "Explore cool highlands, green tea estates, gardens, and scenic mountain landscapes.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nuwara-Eliya.jpg",  
  },
];

const categories = ["All", "Beach", "Nature", "Heritage", "Culture"];

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return destinations.filter((destination) => {
      const matchesSearch =
        !query ||
        destination.name.toLowerCase().includes(query) ||
        destination.category.toLowerCase().includes(query) ||
        destination.region.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All" ||
        destination.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

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

        <div className="destination-filters" aria-label="Filter by category">
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

        {filteredDestinations.length > 0 ? (
          <div className="destinations-grid">
            {filteredDestinations.map((destination, index) => (
              <article
                className="destination-result-card"
                key={destination.name}
              >
                <Link
                  className="destination-result-image"
                  to={`/destinations/${encodeURIComponent(
                    destination.name.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                  aria-label={`View ${destination.name}`}
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />
                  <span className="destination-result-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>

                <div className="destination-result-body">
                  <div className="destination-result-meta">
                    <span>{destination.category}</span>
                    <span>{destination.region}</span>
                  </div>

                  <h3>{destination.name}</h3>
                  <p>{destination.description}</p>

                  <Link
                    className="destination-result-link"
                    to={`/destinations/${encodeURIComponent(
                      destination.name.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                  >
                    Explore destination <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
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
