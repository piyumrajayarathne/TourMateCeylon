import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80";

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
  roomPreference: "",
  specialRequests: "",
};

export default function StayDetails() {
  const { id } = useParams();

  const [stay, setStay] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [modalMode, setModalMode] = useState(null);
  const [reservation, setReservation] = useState(initialReservation);

  const [error, setError] = useState("");
  const [confirmationReference, setConfirmationReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStayDetails = async () => {
      try {
        setLoading(true);
        setPageError("");

        const [hotelResponse, roomsResponse] = await Promise.all([
          fetch(`${API_URL}/hotels/${id}`),
          fetch(`${API_URL}/rooms/hotel/${id}`),
        ]);

        if (!hotelResponse.ok) {
          throw new Error("Unable to retrieve hotel details.");
        }

        if (!roomsResponse.ok) {
          throw new Error("Unable to retrieve available rooms.");
        }

        const hotelData = await hotelResponse.json();
        const roomsData = await roomsResponse.json();

        const hotel = hotelData.hotel || hotelData;
        const availableRooms = roomsData.rooms || [];

        setStay(hotel);
        setRooms(availableRooms);

        setReservation((previous) => ({
          ...previous,
          roomPreference: availableRooms[0]?._id || "",
          guests: String(
            Math.min(2, availableRooms[0]?.maximumGuests || 1)
          ),
        }));
      } catch (err) {
        console.error("Error fetching stay details:", err);
        setPageError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStayDetails();
  }, [id]);

  const selectedRoom = rooms.find(
    (room) => room._id === reservation.roomPreference
  );

  const today = getLocalDateString(new Date());

  const nights = calculateNights(
    reservation.checkIn,
    reservation.checkOut
  );

  const totalPrice = selectedRoom
    ? selectedRoom.pricePerNight * nights
    : 0;

  const stayImage = stay?.images?.[0] || FALLBACK_IMAGE;

  function openReservationForm() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const firstRoom = rooms[0];

    setReservation({
      ...initialReservation,
      checkIn: getLocalDateString(tomorrow),
      checkOut: getLocalDateString(dayAfterTomorrow),
      roomPreference: firstRoom?._id || "",
      guests: String(Math.min(2, firstRoom?.maximumGuests || 1)),
    });

    setError("");
    setConfirmationReference("");
    setModalMode("form");
  }

  function closeModal() {
    if (submitting) return;

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
      ...(name === "roomPreference"
        ? {
            guests: String(
              Math.min(
                Number(previous.guests),
                rooms.find((room) => room._id === value)?.maximumGuests || 1
              )
            ),
          }
        : {}),
    }));

    setError("");
  }

  // Validate reservation details
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

    const guestCount = Number(reservation.guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      !selectedRoom ||
      guestCount > selectedRoom.maximumGuests
    ) {
      setError("Please select a valid room and guest count.");
      return;
    }

    if (nights < 1) {
      setError("Please select at least one night.");
      return;
    }

    setModalMode("preview");
  }

  // Create booking in MongoDB
  async function handleConfirmReservation() {
    try {
      setSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in before making a reservation.");
        return;
      }

      if (!selectedRoom) {
        setError("The selected room is no longer available.");
        return;
      }

      const bookingData = {
        bookingType: "Hotel",
        serviceId: selectedRoom._id,
        startDate: reservation.checkIn,
        endDate: reservation.checkOut,
        numberOfGuests: Number(reservation.guests),
        amount: totalPrice,
      };

      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create your reservation."
        );
      }

      setConfirmationReference(
        data.booking?._id || "Booking created"
      );

      setModalMode("confirmed");
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Loading
  if (loading) {
    return (
      <main className="stay-details-not-found">
        <h1>Loading accommodation...</h1>
        <p>Please wait while we retrieve the hotel details.</p>
      </main>
    );
  }

  // Error or missing hotel
  if (pageError || !stay) {
    return (
      <main className="stay-details-not-found">
        <h1>Accommodation not found</h1>
        <p>{pageError || "We couldn't find this accommodation."}</p>
        <Link to="/stays">Back to stays</Link>
      </main>
    );
  }

  const lowestPrice =
    rooms.length > 0
      ? Math.min(...rooms.map((room) => room.pricePerNight))
      : null;

  return (
    <main className="stay-details-page">
      <div className="stay-details-container">
        <Link to="/stays" className="stay-details-back">
          ← Back to stays
        </Link>

        <article className="stay-details-card">
          <div className="stay-details-image-wrapper">
            <img
              src={stayImage}
              alt={stay.hotelName}
              className="stay-details-image"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />

            <span className="stay-details-type">Hotel</span>
          </div>

          <div className="stay-details-body">
            <p className="stay-details-eyebrow">
              YOUR STAY IN SRI LANKA
            </p>

            <h1>{stay.hotelName}</h1>

            <p className="stay-details-location">
              <span aria-hidden="true">⌖</span>{" "}
              {stay.location}
            </p>

            <div className="stay-details-rating">
              <span aria-hidden="true">★</span>
              {Number(stay.averageRating || 0).toFixed(1)}
              <span>Rating</span>
            </div>

            <p className="stay-details-description">
              {stay.description}
            </p>

            <div className="stay-details-price">
              <span>Starting price per night</span>

              <strong>
                {lowestPrice !== null
                  ? `LKR ${lowestPrice.toLocaleString("en-LK")}`
                  : "No rooms available"}
              </strong>
            </div>

            <section className="stay-details-amenities">
              <h2>Stay Highlights</h2>

              <ul>
                {(stay.amenities || []).map((amenity) => (
                  <li key={amenity}>
                    <span aria-hidden="true">✓</span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <section className="stay-details-amenities">
              <h2>Available Rooms</h2>

              {rooms.length > 0 ? (
                <ul>
                  {rooms.map((room) => (
                    <li key={room._id}>
                      <span aria-hidden="true">✓</span>
                      {room.roomType} — LKR{" "}
                      {room.pricePerNight.toLocaleString("en-LK")} / night
                      {" "}({room.maximumGuests} guests maximum)
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No available rooms at the moment.</p>
              )}
            </section>

            <button
              type="button"
              className="stay-book-button"
              onClick={openReservationForm}
              disabled={rooms.length === 0}
            >
              {rooms.length > 0 ? "Book Now" : "No Rooms Available"}
              <span aria-hidden="true">→</span>
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
              disabled={submitting}
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
                  {stay.hotelName} · {stay.location}
                </p>

                <div className="reservation-selected-stay">
                  <img
                    src={stayImage}
                    alt={stay.hotelName}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div>
                    <strong>{stay.hotelName}</strong>
                    <span>Hotel · {stay.location}</span>
                    <span>
                      {selectedRoom
                        ? `LKR ${selectedRoom.pricePerNight.toLocaleString("en-LK")} / night`
                        : "Select a room"}
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
                      {Array.from(
                        { length: selectedRoom?.maximumGuests || 1 },
                        (_, index) => index + 1
                      ).map((count) => (
                        <option key={count} value={String(count)}>
                          {count} {count === 1 ? "guest" : "guests"}
                        </option>
                      ))}
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
                      required
                    >
                      {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.roomType} — LKR{" "}
                          {room.pricePerNight.toLocaleString("en-LK")} / night
                        </option>
                      ))}
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
                  <img
                    src={stayImage}
                    alt={stay.hotelName}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div>
                    <h3>{stay.hotelName}</h3>
                    <p>{stay.location}</p>
                    <p>{selectedRoom?.roomType}</p>

                    <strong>
                      LKR {selectedRoom?.pricePerNight.toLocaleString("en-LK")} / night
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
                    <strong>{selectedRoom?.roomType}</strong>
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
                      LKR {selectedRoom?.pricePerNight.toLocaleString("en-LK")} × {nights}{" "}
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
                    This booking will be saved to your TourMateCeylon account.
                    Payment is not processed at this stage.
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
                    disabled={submitting}
                  >
                    ← Edit details
                  </button>

                  <button
                    type="button"
                    className="reservation-primary-button"
                    onClick={handleConfirmReservation}
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Confirm Reservation"}
                  </button>
                </div>
              </>
            )}

            {modalMode === "confirmed" && (
              <div className="reservation-confirmation">
                <div
                  className="reservation-success-icon"
                  aria-hidden="true"
                >
                  ✓
                </div>

                <p className="stay-details-eyebrow">
                  RESERVATION SUMMARY
                </p>

                <h2 id="reservation-modal-title">
                  Booking created successfully!
                </h2>

                <p>
                  Your booking has been saved for{" "}
                  <strong>{stay.hotelName}</strong>.
                </p>

                <div className="reservation-reference">
                  <span>Booking reference</span>
                  <strong>{confirmationReference}</strong>
                </div>

                <p className="reservation-demo-note">
                  Your booking is saved in your account with Pending
                  payment status. Payment and final room availability
                  confirmation have not yet been implemented.
                </p>

                <Link
                  to="/bookings"
                  className="reservation-primary-button"
                >
                  View My Bookings
                </Link>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
