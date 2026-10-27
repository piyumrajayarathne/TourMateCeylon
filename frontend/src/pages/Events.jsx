import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const events = [
  {
    id: 1,
    name: "Kandy Esala Perahera",
    category: "Cultural",
    date: "2027-07-25",
    location: "Kandy",
    description:
      "Experience Sri Lanka's Festival of the Tooth, featuring traditional dancers, drummers, and a magnificent procession honouring the Sacred Tooth Relic of the Buddha.",
    image:
      "https://www.consciousjourneys.com/wp-content/uploads/2016/03/esala-6.jpg",
    
  },
  {
    id: 2,
    name: "Galle Literary Festival",
    category: "Arts",
    date: "2027-01-15",
    location: "Galle",
    description:
      "Discover literature, creative conversations, poetry, and cultural experiences in historic Galle.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQawws0r-AQf-J48Jxot5wQK0v6cx3HpRaV8_AbmoVt2BhjFH9BScTHHm0&s=10https://commons.wikimedia.org/wiki/Special:FilePath/Galle_Fort%2C_Sri_Lanka.JPG",
  },
  {
    id: 3,
    name: "Vesak Festival",
    category: "Religious",
    date: "2027-05-20",
    location: "Colombo",
    description:
      "Explore Vesak lanterns, illuminated decorations, and Buddhist cultural traditions celebrating the life and teachings of the Buddha.",
    image:
      "https://ik.imagekit.io/TBR/Island%20Events/Vesak%20Festival%20Sri%20lanka.webp",
    
  },
  {
    id: 4,
    name: "Surfing in Arugam Bay",
    category: "Adventure",
    date: "2027-06-10",
    location: "Arugam Bay",
    description:
      "Enjoy beautiful beaches, coastal scenery, and surfing opportunities at one of Sri Lanka's well-known surfing destinations.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Arugam_Bay.jpg",
    
  },
  {
    id: 5,
    name: "Nuwara Eliya Season",
    category: "Nature",
    date: "2027-04-10",
    location: "Nuwara Eliya",
    description:
      "Explore the cool highlands, gardens, tea estates, and attractions of Nuwara Eliya during the hill-country season.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nuwara-Eliya.jpg",
  },
  
{
  id: 6,
  name: "Sinhala and Tamil New Year",
  category: "Cultural",
  date: "2027-04-14",
  location: "Sri Lanka",
  description:
    "Celebrate the Sinhala and Tamil New Year with traditional games, festive foods, family gatherings, and cultural customs that bring communities together across Sri Lanka.",
  
  image:
     "https://media.istockphoto.com/id/1211758008/photo/shallow-focused-side-view-of-milk-rice-a-sinhala-tamil-new-year-avurudu-festival-food.jpg?s=612x612&w=0&k=20&c=6uWYT5riClJ-aVIyHha-XILM3d2cLaHyQ_TIfo-_srQ=",

  
},

];

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

  return (
    <div className="event-image">
      <img
        src={imageSrc}
        alt={event.name}
        loading="lazy"
        onError={() => {
          if (event.fallbackImage && imageSrc !== event.fallbackImage) {
            setImageSrc(event.fallbackImage);
          }
        }}
      />

      <span className="event-category">{event.category}</span>
    </div>
  );
}

export default function Events() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
  }, [search, activeCategory]);

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

        {filteredEvents.length > 0 ? (
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
