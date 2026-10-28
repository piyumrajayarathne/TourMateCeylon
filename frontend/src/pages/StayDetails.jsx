import { Link, useParams } from "react-router-dom";

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
    amenities: [
      "Coastal location",
      "Comfortable accommodation",
      "Ocean views",
      "Relaxing atmosphere",
    ],
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
    amenities: [
      "Mountain scenery",
      "Nature surroundings",
      "Comfortable accommodation",
      "Peaceful atmosphere",
    ],
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
    amenities: [
      "City location",
      "Nearby restaurants",
      "Shopping access",
      "Nearby attractions",
    ],
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
    amenities: [
      "Green surroundings",
      "Relaxing setting",
      "Nature views",
      "Convenient Kandy location",
    ],
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
    amenities: [
      "Heritage-inspired setting",
      "Southern Sri Lankan location",
      "Comfortable accommodation",
      "Nearby local attractions",
    ],
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
    amenities: [
      "Nature surroundings",
      "Peaceful setting",
      "Cultural attractions nearby",
      "Access to local landmarks",
    ],
  },
];

export default function StayDetails() {
  const { id } = useParams();

  // URL parameters are strings, while the stay IDs are numbers.
  const stay = stays.find((item) => String(item.id) === id);

  if (!stay) {
    return (
      <main className="stay-details-not-found">
        <h1>Accommodation not found</h1>
        <p>We couldn't find this accommodation.</p>
        <Link to="/stays">Back to stays</Link>
      </main>
    );
  }

  return (
    <main className="stay-details-page">
      <div className="stay-details-container">
        <Link to="/stays" className="stay-details-back">
          ← Back to stays
        </Link>

        <article className="stay-details-card">
          <div className="stay-details-image-wrapper">
            <img
              src={stay.image}
              alt={stay.name}
              className="stay-details-image"
            />

            <span className="stay-details-type">
              {stay.type}
            </span>
          </div>

          <div className="stay-details-body">
            <p className="stay-details-eyebrow">
              YOUR STAY IN SRI LANKA
            </p>

            <h1>{stay.name}</h1>

            <p className="stay-details-location">
              <span aria-hidden="true">⌖</span>{" "}
              {stay.location}, Sri Lanka
            </p>

            <div className="stay-details-rating">
              <span aria-hidden="true">★</span>
              {stay.rating.toFixed(1)}
              <span>Sample rating</span>
            </div>

            <p className="stay-details-description">
              {stay.description}
            </p>

            <div className="stay-details-price">
              <span>Sample price per night</span>
              <strong>
                LKR {stay.price.toLocaleString("en-LK")}
              </strong>
            </div>

            <section className="stay-details-amenities">
              <h2>Stay Highlights</h2>

              <ul>
                {stay.amenities.map((amenity) => (
                  <li key={amenity}>
                    <span aria-hidden="true">✓</span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <Link
              to="/login"
              className="stay-book-button"
            >
              Continue to book
              <span aria-hidden="true">→</span>
            </Link>

            <p className="stay-details-note">
              Sign in to continue with your booking.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
