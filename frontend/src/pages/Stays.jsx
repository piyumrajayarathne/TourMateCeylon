import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80";

const stayTypes = ["All", "Hotel"];

export default function Stays() {
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [maxPrice, setMaxPrice] = useState("50000");

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setLoading(true);
        setError("");

        const [hotelResponse, roomResponse] = await Promise.all([
          fetch(`${API_URL}/hotels`),
          fetch(`${API_URL}/rooms`),
        ]);

        if (!hotelResponse.ok || !roomResponse.ok) {
          throw new Error("Failed to retrieve accommodation data.");
        }

        const hotelData = await hotelResponse.json();
        const roomData = await roomResponse.json();

        const hotels = hotelData.hotels || [];
        const rooms = roomData.rooms || [];

        const roomsByHotel = {};

        rooms.forEach((room) => {
          const hotelId =
            room.hotelId?._id || room.hotelId;

          if (hotelId) {
            if (!roomsByHotel[hotelId]) {
              roomsByHotel[hotelId] = [];
            }

            roomsByHotel[hotelId].push(room);
          }
        });

        const formattedStays = hotels.map((hotel) => {
          const hotelRooms = roomsByHotel[hotel._id] || [];

          const availableRooms = hotelRooms.filter(
            (room) => room.availabilityStatus === "Available"
          );

          const lowestPrice =
            availableRooms.length > 0
              ? Math.min(
                  ...availableRooms.map((room) =>
                    Number(room.pricePerNight)
                  )
                )
              : null;

          return {
            id: hotel._id,
            name: hotel.hotelName,
            location: hotel.location,
            type: "Hotel",
            price: lowestPrice,
            rating: hotel.averageRating || 0,
            image: hotel.images?.[0] || "",
            description: hotel.description,
            roomCount: availableRooms.length,
          };
        });

        // Only show hotels that have available rooms
        setStays(
          formattedStays.filter((stay) => stay.roomCount > 0)
        );
      } catch (err) {
        console.error("Error fetching stays:", err);
        setError(
          "Unable to load accommodations. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, []);

  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        stay.name.toLowerCase().includes(searchTerm) ||
        stay.location.toLowerCase().includes(searchTerm);

      const matchesType =
        selectedType === "All" || stay.type === selectedType;

      const matchesPrice =
        stay.price !== null &&
        stay.price <= Number(maxPrice);

      return matchesSearch && matchesType && matchesPrice;
    });
  }, [stays, search, selectedType, maxPrice]);

  function clearFilters() {
    setSearch("");
    setSelectedType("All");
    setMaxPrice("50000");
  }

  return (
    <main className="stays-page">
      {/* Hero section */}
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

      {/* Accommodation section */}
      <section className="stays-content">
        <div className="stays-heading">
          <div>
            <p className="stays-section-eyebrow">STAY YOUR WAY</p>
            <h2>Explore Accommodations</h2>
          </div>

          <p className="stays-count">
            {loading
              ? "Loading..."
              : `${filteredStays.length} ${
                  filteredStays.length === 1 ? "place" : "places"
                } found`}
          </p>
        </div>

        {/* Filters */}
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

        {/* Loading */}
        {loading ? (
          <div className="stays-empty">
            <h3>Loading accommodations...</h3>
            <p>Please wait while we retrieve available stays.</p>
          </div>
        ) : error ? (
          <div className="stays-empty">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        ) : filteredStays.length > 0 ? (
          /* Stay cards */
          <div className="stays-grid">
            {filteredStays.map((stay) => (
              <article className="stay-card" key={stay.id}>
                <div className="stay-image-wrapper">
                  <img
                    src={stay.image || FALLBACK_IMAGE}
                    alt={stay.name}
                    className="stay-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <span className="stay-type">{stay.type}</span>
                </div>

                <div className="stay-body">
                  <p className="stay-location">
                    <span aria-hidden="true">⌖</span>{" "}
                    {stay.location}
                  </p>

                  <h3>{stay.name}</h3>

                  <p className="stay-description">
                    {stay.description}
                  </p>

                  <div className="stay-card-footer">
                    <div className="stay-price">
                      {stay.price !== null ? (
                        <>
                          <strong>
                            LKR {stay.price.toLocaleString("en-LK")}
                          </strong>
                          <span> / night</span>
                        </>
                      ) : (
                        <strong>No rooms available</strong>
                      )}
                    </div>

                    <span className="stay-rating">
                      ★ {Number(stay.rating).toFixed(1)}
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

      {/* Call to action */}
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
