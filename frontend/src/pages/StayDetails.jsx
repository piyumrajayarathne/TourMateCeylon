
import { Link, useParams } from "react-router-dom";

const stays = [
  {
    id: "1",
    name: "Ocean Breeze Villa",
    location: "Mirissa, Southern Province",
    type: "Villa",
    price: 18000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1400&q=85",
    description:
      "Enjoy a relaxing coastal escape with comfortable accommodation and easy access to the beach.",
    amenities: [
      "Free Wi-Fi",
      "Air conditioning",
      "Swimming pool",
      "Private bathroom",
    ],
  },
  {
    id: "2",
    name: "Hilltop Tea Retreat",
    location: "Ella, Uva Province",
    type: "Guesthouse",
    price: 12000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=85",
    description:
      "Relax among the hills and tea plantations in a peaceful setting close to Ella's natural attractions.",
    amenities: [
      "Free Wi-Fi",
      "Mountain views",
      "Breakfast available",
      "Private bathroom",
    ],
  },
  {
    id: "3",
    name: "Kandy Heritage Stay",
    location: "Kandy, Central Province",
    type: "Hotel",
    price: 15000,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85",
    description:
      "A comfortable base for discovering Kandy's cultural landmarks, lake and surrounding hill country.",
    amenities: [
      "Free Wi-Fi",
      "Air conditioning",
      "Restaurant",
      "Room service",
    ],
  },
  {
    id: "4",
    name: "Galle Fort Boutique Stay",
    location: "Galle, Southern Province",
    type: "Boutique Hotel",
    price: 22000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=85",
    description:
      "Explore historic Galle and its charming streets while enjoying a stylish accommodation experience.",
    amenities: [
      "Free Wi-Fi",
      "Air conditioning",
      "Breakfast available",
      "Nearby attractions",
    ],
  },
  {
    id: "5",
    name: "Sigiriya Nature Lodge",
    location: "Sigiriya, Central Province",
    type: "Lodge",
    price: 10000,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1400&q=85",
    description:
      "Stay close to nature while exploring Sigiriya Rock Fortress and nearby cultural attractions.",
    amenities: [
      "Free Wi-Fi",
      "Garden",
      "Outdoor seating",
      "Parking",
    ],
  },
  {
    id: "6",
    name: "Nuwara Eliya Garden Cottage",
    location: "Nuwara Eliya, Central Province",
    type: "Cottage",
    price: 16000,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=85",
    description:
      "Enjoy cool mountain weather, garden surroundings and attractions in Sri Lanka's hill country.",
    amenities: [
      "Free Wi-Fi",
      "Garden",
      "Hot water",
      "Free parking",
    ],
  },
];

export default function StayDetails() {
  const { id } = useParams();

  const stay = stays.find((item) => item.id === id);

  if (!stay) {
    return (
      <main className="stay-details-not-found">
        <h1>Accommodation not found</h1>
        <p>
          We couldn't find this accommodation.
          Please return to the stays page.
        </p>
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
              {stay.location}
            </p>

            <div className="stay-details-rating">
              <span aria-hidden="true">★</span>
              {stay.rating}
              <span>Sample guest rating</span>
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
              <h2>Amenities</h2>

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
