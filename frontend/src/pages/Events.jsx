import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/events";

const categories = [
  "All",
  "Cultural",
  "Arts",
  "Religious",
  "Adventure",
  "Nature",
  "Food",
];

function EventImage({ event }) {
  const [imageSrc, setImageSrc] = useState(event.image);

  const fallbackImage =
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=900";

  return (
    <div className="event-image">
      <img
        src={imageSrc || fallbackImage}
        alt={event.name}
        loading="lazy"
        onError={() => {
          if (imageSrc !== fallbackImage) {
            setImageSrc(fallbackImage);
          }
        }}
      />

      <span className="event-category">{event.category}</span>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load events.");
        }

        const formattedEvents = (data.events || []).map((event) => ({
          id: event._id,
          name: event.eventTitle,
          category: event.category,
          date: event.startDate.slice(0, 10),
          location: event.venue,
          description: event.description,
          image: event.images?.[0] || "",
          endDate: event.endDate,
          ticketPrice: event.ticketPrice,
        }));

        setEvents(formattedEvents);
      } catch (error) {
        setError(error.message || "Unable to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.name.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All" ||
        event.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [events, search, activeCategory]);

  function formatDate(date) {
    return new Date(`${date}T12:00:00`).toLocaleDateString("en-LK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function clearFilters() {
    setSearch("");
    setActiveCategory("All");
  }

  return (
    <main className="events-page">
      <section className="events-hero">
        <span className="events-eyebrow">
          EXPERIENCE THE ISLAND
        </span>

        <h1>
          Discover what's <em>happening.</em>
        </h1>

        <p>
          From vibrant cultural celebrations to outdoor adventures,
          discover experiences that make your Sri Lankan journey special.
        </p>

        <label className="events-search">
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            placeholder="Search events, places, or categories..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search events"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </label>
      </section>

      <section className="events-content">
        <div className="events-heading">
          <div>
            <span className="events-section-eyebrow">
              MAKE MEMORIES
            </span>

            <h2>Find an experience.</h2>

            <p>
              Explore celebrations and activities around Sri Lanka.
            </p>
          </div>

          <span className="events-count">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "event" : "events"}
          </span>
        </div>

        <div
          className="events-filters"
          aria-label="Filter events by category"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "events-filter active"
                  : "events-filter"
              }
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="events-empty">
            <h3>Loading events...</h3>
            <p>Please wait while we retrieve events.</p>
          </div>
        ) : error ? (
          <div className="events-empty">
            <h3>Unable to load events</h3>
            <p>{error}</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <article className="event-card" key={event.id}>
                <EventImage event={event} />

                <div className="event-body">
                  <div className="event-date">
                    <span aria-hidden="true">▦</span>{" "}
                    {formatDate(event.date)}
                  </div>

                  <h3>{event.name}</h3>

                  <p className="event-description">
                    {event.description}
                  </p>

                  <div className="event-location">
                    <span aria-hidden="true">⌖</span>{" "}
                    {event.location}, Sri Lanka
                  </div>

                  <Link
                    to={`/events/${event.id}`}
                    className="event-link"
                  >
                    Explore event{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="events-empty">
            <h3>No events found</h3>
            <p>Try a different keyword or category.</p>

            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="events-cta">
        <span className="events-eyebrow">
          PLAN YOUR ADVENTURE
        </span>

        <h2>Make room for something memorable.</h2>

        <p>
          Add your travel plans and organise your next Sri Lankan adventure.
        </p>

        <Link to="/my-trips" className="events-cta-button">
          Plan your trip <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
