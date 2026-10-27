import { useState } from "react";
import { Link } from "react-router-dom";

const destinations = [
  {
    name: "Galle Fort",
    category: "HERITAGE & CULTURE",
    description: "Walk through history beside the Indian Ocean.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Galle_Fort%2C_Sri_Lanka.JPG",
  },
  {
    name: "Ella",
    category: "HIGHLANDS",
    description: "Misty mountains, tea gardens, and winding trails.",
    image:
      "https://www.tracedirecte.com/media/original_images/pont-9-arcs-ella-sri-lanka.jpg.1920x0_q85.jpg",
  },
  {
    name: "Mirissa",
    category: "COASTAL ESCAPES",
    description: "Slow mornings and golden sunsets by the sea.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Mirissa_Sri_lanka.jpg",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");

  function handleSearch(event) {
  event.preventDefault();

  const query = search.trim();

  if (!query) {
    alert("Please enter a destination to explore.");
    return;
  }

  const matchedDestination = destinations.find((destination) =>
    destination.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!matchedDestination) {
    alert(
      "Sorry, we couldn't find that destination. Try Galle Fort, Ella, or Mirissa."
    );
    return;
  }

  window.location.href = `/destinations?search=${encodeURIComponent(
    matchedDestination.name
  )}`;
}
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <span className="home-eyebrow">
            YOUR ISLAND STORY BEGINS HERE
          </span>

          <h1>
            Find your kind
            <br />
            of <em>paradise.</em>
          </h1>

          <p>
            From mist-covered mountains to quiet coastal mornings,
            discover the Sri Lanka that speaks to you.
          </p>

          <form className="destination-search" onSubmit={handleSearch}>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Where would you like to go?"
              aria-label="Search destinations"
            />
            <button type="submit">Explore <span>→</span></button>
          </form>

          <div className="hero-note">
            <span className="hero-note-line" />
            <span>A little island. A thousand ways to feel alive.</span>
          </div>
        </div>

      </section>

      <section className="home-intro section-container">
        <div>
          <span className="section-eyebrow">NOT JUST A DESTINATION</span>
          <h2>
            Travel slowly.
            <br />
            <em>Feel everything.</em>
          </h2>
        </div>
        <div className="home-intro-copy">
          <p>
            Sri Lanka is an island of unexpected moments. A train
            disappearing into the hills. The scent of fresh tea.
            A quiet temple at sunrise.
          </p>
          <p>
            Let us help you find the places, people, and experiences
            that make a journey your own.
          </p>
          <Link className="text-link" to="/destinations">
            Discover the island <span>→</span>
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-container">
          <div className="section-heading-row">
            <div>
              <span className="section-eyebrow">A FEW PLACES TO BEGIN</span>
              <h2>Somewhere wonderful.</h2>
            </div>
            <Link className="text-link" to="/destinations">
              All destinations <span>→</span>
            </Link>
          </div>

          <div className="destination-grid">
            {destinations.map((destination, index) => (
              <article className="home-destination-card" key={destination.name}>
                <Link
                  className="destination-image-link"
                  to={`/destinations?search=${encodeURIComponent(destination.name)}`}
                  aria-label={`Explore ${destination.name}`}
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    loading="lazy"
                  />
                  <span className="destination-number">
                    0{index + 1}
                  </span>
                </Link>
                <div className="destination-card-content">
                  <span className="section-eyebrow">
                    {destination.category}
                  </span>
                  <h3>{destination.name}</h3>
                  <p>{destination.description}</p>
                  <Link
                    className="text-link"
                    to={`/destinations?search=${encodeURIComponent(destination.name)}`}
                  >
                    Discover this place <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-planner">
        <div className="home-planner-content">
          <span className="section-eyebrow">YOUR JOURNEY, YOUR WAY</span>
          <h2>
            The best stories
            <br />
            are <em>still unwritten.</em>
          </h2>
          <p>
            Create your own itinerary, organise your plans, and
            keep your travel budget in one place.
          </p>
          <Link className="button button-gold" to="/my-trips">
            Start planning your trip <span>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
