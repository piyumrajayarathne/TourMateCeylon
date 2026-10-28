import { useState } from "react";
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

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);

  return Math.round((end - start) / 86400000);
}

const initialReservation = {
  guestName: "",
  email: "",
  mobile: "",
  checkIn: "",
  checkOut: "",
  guests: "2",
  roomPreference: "Standard room",
  specialRequests: "",
};

export default function StayDetails() {
  const { id } = useParams();

  const stay = stays.find((item) => String(item.id) === id);

  const [modalMode, setModalMode] = useState(null);
  const [reservation, setReservation] = useState(initialReservation);
  const [error, setError] = useState("");
  const [confirmationReference, setConfirmationReference] = useState("");

  const today = getLocalDateString(new Date());
  const nights = calculateNights(
    reservation.checkIn,
    reservation.checkOut
  );
  const totalPrice = stay ? stay.price * nights : 0;

  function openReservationForm() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    setReservation({
      ...initialReservation,
      checkIn: getLocalDateString(tomorrow),
      checkOut: getLocalDateString(dayAfterTomorrow),
    });

    setError("");
    setConfirmationReference("");
    setModalMode("form");
  }

  function closeModal() {
    setModalMode(null);
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setReservation((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "checkIn" && previous.checkOut <= value
        ? { checkOut: "" }
        : {}),
    }));

    setError("");
  }

  function handleReview(event) {
    event.preventDefault();
    setError("");

    if (
      !reservation.guestName.trim() ||
      !reservation.email.trim() ||
      !reservation.mobile.trim()
    ) {
      setError("Please complete all required guest details.");
      return;
    }

    if (
      !reservation.checkIn ||
      !reservation.checkOut ||
      reservation.checkIn < today ||
      reservation.checkOut <= reservation.checkIn
    ) {
      setError("Please choose valid check-in and check-out dates.");
      return;
    }

    if (
      !Number.isInteger(Number(reservation.guests)) ||
      Number(reservation.guests) < 1 ||
      Number(reservation.guests) > 20
    ) {
      setError("Please select between 1 and 20 guests.");
      return;
    }

    setModalMode("preview");
  }

  function handleConfirmReservation() {
    // Demo confirmation only. No reservation is saved to a server yet.
    const reference = `TMC-${Date.now().toString().slice(-8)}`;

    setConfirmationReference(reference);
    setModalMode("confirmed");
  }

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

            <span className="stay-details-type">{stay.type}</span>
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

            <button
              type="button"
              className="stay-book-button"
              onClick={openReservationForm}
            >
              Book Now <span aria-hidden="true">→</span>
            </button>

            <p className="stay-details-note">
              Enter your details and review your reservation before confirming.
            </p>
          </div>
        </article>
      </div>

      {modalMode && (
        <div
          className="reservation-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className={`reservation-modal ${
              modalMode === "preview" ? "reservation-modal-preview" : ""
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-modal-title"
          >
            <button
              type="button"
              className="reservation-modal-close"
              onClick={closeModal}
              aria-label="Close reservation dialog"
            >
              ×
            </button>

            {modalMode === "form" && (
              <>
                <p className="stay-details-eyebrow">
                  PLAN YOUR STAY
                </p>

                <h2 id="reservation-modal-title">
                  Reservation details
                </h2>

                <p className="reservation-modal-subtitle">
                  {stay.name} · {stay.location}, Sri Lanka
                </p>

                <div className="reservation-selected-stay">
                  <img src={stay.image} alt="" />
                  <div>
                    <strong>{stay.name}</strong>
                    <span>{stay.type} · {stay.location}</span>
                    <span>
                      LKR {stay.price.toLocaleString("en-LK")} / night
                    </span>
                  </div>
                </div>

                <form
                  className="reservation-form"
                  onSubmit={handleReview}
                >
                  <label>
                    Guest full name
                    <input
                      name="guestName"
                      value={reservation.guestName}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Enter your full name"
                      maxLength={100}
                      required
                    />
                  </label>

                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      value={reservation.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>

                  <label>
                    Mobile number
                    <input
                      name="mobile"
                      type="tel"
                      value={reservation.mobile}
                      onChange={handleChange}
                      autoComplete="tel"
                      placeholder="+94 7X XXX XXXX"
                      maxLength={25}
                      required
                    />
                  </label>

                  <label>
                    Number of guests
                    <select
                      name="guests"
                      value={reservation.guests}
                      onChange={handleChange}
                      required
                    >
                      {Array.from({ length: 20 }, (_, index) => index + 1).map(
                        (count) => (
                          <option key={count} value={String(count)}>
                            {count} {count === 1 ? "guest" : "guests"}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  <label>
                    Check-in
                    <input
                      name="checkIn"
                      type="date"
                      min={today}
                      value={reservation.checkIn}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    Check-out
                    <input
                      name="checkOut"
                      type="date"
                      min={reservation.checkIn || today}
                      value={reservation.checkOut}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="reservation-form-full">
                    Room preference
                    <select
                      name="roomPreference"
                      value={reservation.roomPreference}
                      onChange={handleChange}
                    >
                      <option>Standard room</option>
                      <option>Deluxe room</option>
                      <option>Family room</option>
                      <option>Suite</option>
                    </select>
                  </label>

                  <label className="reservation-form-full">
                    Special requests (optional)
                    <textarea
                      name="specialRequests"
                      value={reservation.specialRequests}
                      onChange={handleChange}
                      placeholder="Any preferences or requests?"
                      rows="2"
                      maxLength={500}
                    />
                  </label>

                  {error && (
                    <p className="reservation-form-error" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="reservation-form-footer">
                    <p>
                      Estimated accommodation cost{" "}
                      <strong>
                        LKR {totalPrice.toLocaleString("en-LK")}
                      </strong>
                    </p>

                    <button
                      type="submit"
                      className="reservation-primary-button"
                    >
                      Review Reservation →
                    </button>
                  </div>
                </form>
              </>
            )}

            {modalMode === "preview" && (
              <>
                <p className="stay-details-eyebrow">
                  PLEASE CHECK YOUR DETAILS
                </p>

                <h2 id="reservation-modal-title">
                  Reservation preview
                </h2>

                <p className="reservation-modal-subtitle">
                  Review your details before confirming.
                </p>

                <div className="reservation-preview-stay">
                  <img src={stay.image} alt={stay.name} />

                  <div>
                    <h3>{stay.name}</h3>
                    <p>{stay.location}, Sri Lanka</p>
                    <p>{stay.type}</p>
                    <strong>
                      LKR {stay.price.toLocaleString("en-LK")} / night
                    </strong>
                  </div>
                </div>

                <div className="reservation-preview-details">
                  <div>
                    <span>Guest name</span>
                    <strong>{reservation.guestName}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{reservation.email}</strong>
                  </div>

                  <div>
                    <span>Mobile</span>
                    <strong>{reservation.mobile}</strong>
                  </div>

                  <div>
                    <span>Guests</span>
                    <strong>{reservation.guests}</strong>
                  </div>

                  <div>
                    <span>Check-in</span>
                    <strong>{formatDate(reservation.checkIn)}</strong>
                  </div>

                  <div>
                    <span>Check-out</span>
                    <strong>{formatDate(reservation.checkOut)}</strong>
                  </div>

                  <div>
                    <span>Room preference</span>
                    <strong>{reservation.roomPreference}</strong>
                  </div>

                  {reservation.specialRequests.trim() && (
                    <div className="reservation-preview-full">
                      <span>Special requests</span>
                      <strong>{reservation.specialRequests}</strong>
                    </div>
                  )}
                </div>

                <div className="reservation-price-breakdown">
                  <div>
                    <span>
                      LKR {stay.price.toLocaleString("en-LK")} × {nights}{" "}
                      {nights === 1 ? "night" : "nights"}
                    </span>
                    <strong>
                      LKR {totalPrice.toLocaleString("en-LK")}
                    </strong>
                  </div>

                  <div className="reservation-total">
                    <span>Estimated total</span>
                    <strong>
                      LKR {totalPrice.toLocaleString("en-LK")}
                    </strong>
                  </div>

                  <p>
                    Based on the displayed sample nightly price. Taxes,
                    extra fees, availability and final rates have not
                    been verified.
                  </p>
                </div>

                {error && (
                  <p className="reservation-form-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="reservation-preview-actions">
                  <button
                    type="button"
                    className="reservation-secondary-button"
                    onClick={() => {
                      setError("");
                      setModalMode("form");
                    }}
                  >
                    ← Edit details
                  </button>

                  <button
                    type="button"
                    className="reservation-primary-button"
                    onClick={handleConfirmReservation}
                  >
                    Confirm Reservation
                  </button>
                </div>
              </>
            )}

            {modalMode === "confirmed" && (
              <div className="reservation-confirmation">
                <div className="reservation-success-icon" aria-hidden="true">
                  ✓
                </div>

                <p className="stay-details-eyebrow">
                  RESERVATION SUMMARY
                </p>

                <h2 id="reservation-modal-title">
                  Details confirmed!
                </h2>

                <p>
                  Your reservation form has been completed for{" "}
                  <strong>{stay.name}</strong>.
                </p>

                <div className="reservation-reference">
                  <span>Demo reference</span>
                  <strong>{confirmationReference}</strong>
                </div>

                <p className="reservation-demo-note">
                  This is a frontend demonstration only. No reservation
                  has been saved, no room availability has been checked,
                  and no booking confirmation has been sent.
                </p>

                <button
                  type="button"
                  className="reservation-primary-button"
                  onClick={closeModal}
                >
                  Done
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
