
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const stays = [
  {
    id: 1,
    name: "Luxury Beach Villa",
    location: "Mirissa",
    type: "Villa",
    price: 18000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",
    description:
      "Relax in a beautiful villa near the southern coast, with a peaceful atmosphere and ocean views.",
  },
  {
    id: 2,
    name: "Ella Mountain Retreat",
    location: "Ella",
    type: "Guesthouse",
    price: 8500,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=80",
    description:
      "Enjoy green mountain scenery and a comfortable stay close to nature.",
  },
  {
    id: 3,
    name: "Colombo City Hotel",
    location: "Colombo",
    type: "Hotel",
    price: 14500,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    description:
      "A stylish city stay with convenient access to restaurants, shopping and attractions.",
  },
  {
    id: 4,
    name: "Kandy Garden Bungalow",
    location: "Kandy",
    type: "Bungalow",
    price: 11000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80",
    description:
      "Stay in a relaxing setting surrounded by greenery in the hills of Kandy.",
  },
  {
    id: 5,
    name: "Galle Heritage Stay",
    location: "Galle",
    type: "Guesthouse",
    price: 9500,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    description:
      "Discover southern Sri Lankan charm from a comfortable heritage-inspired stay.",
  },
  {
    id: 6,
    name: "Sigiriya Nature Lodge",
    location: "Sigiriya",
    type: "Lodge",
    price: 7500,
    rating: 4.5,
    image:
      "https://pix10.agoda.net/hotelImages/1095376/0/cf2b167f11816ac3763379c039667fee.jpeg?ce=0&s=414x232",
    description:
      "A peaceful base for exploring Sri Lanka's cultural landmarks and natural beauty.",
  },
];

const stayTypes = [
  "All",
  "Hotel",
  "Villa",
  "Guesthouse",
  "Bungalow",
  "Lodge",
];

export default function Stays() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [maxPrice, setMaxPrice] = useState("50000");

  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        stay.name.toLowerCase().includes(searchTerm) ||
        stay.location.toLowerCase().includes(searchTerm);

      const matchesType =
        selectedType === "All" || stay.type === selectedType;

      const matchesPrice = stay.price <= Number(maxPrice);

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [search, selectedType, maxPrice]);

  function clearFilters() {
    setSearch("");
    setSelectedType("All");
    setMaxPrice("50000");
  }

  return (
    <main className="stays-page">
      <section className="stays-hero">
        <p className="stays-eyebrow">YOUR SRI LANKAN ESCAPE</p>

        <h1>Find Your Perfect Stay</h1>

        <p>
          From peaceful mountain retreats to beautiful coastal villas,
          discover a place that feels like home.
        </p>

        <div className="stays-search">
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            placeholder="Search by accommodation or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search stays"
          />
        </div>
      </section>

      <section className="stays-content">
        <div className="stays-heading">
          <div>
            <p className="stays-section-eyebrow">STAY YOUR WAY</p>
            <h2>Explore Accommodations</h2>
          </div>

          <p className="stays-count">
            {filteredStays.length}{" "}
            {filteredStays.length === 1 ? "place" : "places"} found
          </p>
        </div>

        <div className="stays-filters">
          <div className="stays-type-filters">
            {stayTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={`stays-filter ${
                  selectedType === type ? "active" : ""
                }`}
                onClick={() => setSelectedType(type)}
                aria-pressed={selectedType === type}
              >
                {type}
              </button>
            ))}
          </div>

          <label className="stays-price-filter">
            Maximum price per night

            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            >
              <option value="10000">LKR 10,000</option>
              <option value="15000">LKR 15,000</option>
              <option value="20000">LKR 20,000</option>
              <option value="50000">LKR 50,000</option>
            </select>
          </label>
        </div>

        {filteredStays.length > 0 ? (
          <div className="stays-grid">
            {filteredStays.map((stay) => (
              <article className="stay-card" key={stay.id}>
                <div className="stay-image-wrapper">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="stay-image"
                    loading="lazy"
                  />

                  <span className="stay-type">{stay.type}</span>
                </div>

                <div className="stay-body">
                  <p className="stay-location">
                    <span aria-hidden="true">⌖</span>{" "}
                    {stay.location}, Sri Lanka
                  </p>

                  <h3>{stay.name}</h3>

                  <p className="stay-description">
                    {stay.description}
                  </p>

                  <div className="stay-card-footer">
                    <div className="stay-price">
                      <strong>
                        LKR {stay.price.toLocaleString("en-LK")}
                      </strong>
                      <span> / night</span>
                    </div>

                    <span className="stay-rating">
                      ★ {stay.rating.toFixed(1)}
                    </span>
                  </div>

                  <Link
                    to={`/stays/${stay.id}`}
                    className="stay-view-button"
                  >
                    View Stay <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="stays-empty">
            <h3>No stays found</h3>

            <p>
              Try another destination, accommodation type or price.
            </p>

            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="stays-cta">
        <h2>Your next Sri Lankan adventure starts here.</h2>

        <p>
          Find a comfortable base for your journey around the island.
        </p>

        <Link to="/destinations" className="stays-cta-button">
          Explore Destinations
        </Link>
      </section>
    </main>
  );
}
