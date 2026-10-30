import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80";

function formatDate(dateString) {
  if (!dateString) return "Not specified";

  return new Date(
    `${String(dateString).slice(0, 10)}T00:00:00`
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLKR(amount) {
  return `LKR ${Number(amount || 0).toLocaleString("en-LK")}`;
}

function getBookingCategory(type) {
  const categories = {
    Hotel: "Accommodation",
    Guide: "Tour guide",
    Experience: "Experience",
    Transport: "Transport",
    Event: "Event",
  };

  return categories[type] || type || "Booking";
}

function getStatusClass(status) {
  switch (status) {
    case "Confirmed":
      return "booking-status-confirmed";
    case "Cancelled":
      return "booking-status-cancelled";
    case "Completed":
      return "booking-status-completed";
    default:
      return "booking-status-pending";
  }
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const apiRequest = useCallback(async (path, options = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please log in to view your bookings.");
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed (${response.status}).`
      );
    }

    return data;
  }, []);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const data = await apiRequest("/bookings/my-bookings");
      setBookings(data.bookings || []);
    } catch (error) {
      setLoadError(error.message || "Unable to load your bookings.");
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const totalAmount = bookings.reduce(
    (total, booking) => total + Number(booking.amount || 0),
    0
  );

  const confirmedCount = bookings.filter(
    (booking) => booking.bookingStatus === "Confirmed"
  ).length;

  async function handleCancel(booking) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    setCancellingId(booking._id);
    setActionError("");

    try {
      const data = await apiRequest(
        `/bookings/${booking._id}/cancel`,
        { method: "PATCH" }
      );

      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id
            ? { ...item, ...data.booking }
            : item
        )
      );
    } catch (error) {
      setActionError(
        error.message || "Could not cancel the booking."
      );
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <main className="my-bookings-page">
      <section className="my-bookings-hero">
        <p className="my-bookings-eyebrow">
          YOUR JOURNEY, ORGANIZED
        </p>

        <h1>My Bookings</h1>

        <p>
          Keep your accommodation and travel reservations organized
          in one place.
        </p>
      </section>

      <section className="my-bookings-content">
        <div className="my-bookings-summary">
          <article className="booking-summary-card">
            <span>Total bookings</span>
            <strong>{bookings.length}</strong>
          </article>

          <article className="booking-summary-card">
            <span>Confirmed</span>
            <strong>{confirmedCount}</strong>
          </article>

          <article className="booking-summary-card">
            <span>Total booking amount</span>
            <strong>{formatLKR(totalAmount)}</strong>
          </article>
        </div>

        <div className="my-bookings-heading">
          <div>
            <p className="my-bookings-eyebrow">
              YOUR RESERVATIONS
            </p>

            <h2>Booking history</h2>
          </div>

          <Link to="/stays" className="bookings-explore-link">
            Explore stays →
          </Link>
        </div>

        {loadError && (
          <div className="my-bookings-note" role="alert">
            <strong>Unable to load bookings</strong>
            <p>{loadError}</p>

            <button type="button" onClick={loadBookings}>
              Try again
            </button>
          </div>
        )}

        {actionError && (
          <div className="my-bookings-note" role="alert">
            <p>{actionError}</p>
          </div>
        )}

        {loading ? (
          <div className="my-bookings-note">
            <p>Loading your bookings...</p>
          </div>
        ) : !loadError && bookings.length === 0 ? (
          <div className="my-bookings-note">
            <strong>No bookings yet</strong>

            <p>
              Explore stays and travel experiences to plan your next
              Sri Lankan adventure.
            </p>
          </div>
        ) : (
          <div className="my-bookings-list">
            {bookings.map((booking) => {
              const canCancel = [
                "Pending",
                "Confirmed",
              ].includes(booking.bookingStatus);

              // Extract populated Room and Hotel information
              const room =
                booking.bookingType === "Hotel"
                  ? booking.serviceId
                  : null;

              const hotel = room?.hotelId || null;

              const hotelName = hotel?.hotelName;
              const hotelLocation = hotel?.location;
              const roomType = room?.roomType;

              const hotelImage =
                hotel?.images?.[0] ||
                room?.images?.[0] ||
                FALLBACK_IMAGE;

              const displayName =
                booking.bookingType === "Hotel" && hotelName
                  ? hotelName
                  : `${getBookingCategory(booking.bookingType)} booking`;

              return (
                <article
                  className="my-booking-card"
                  key={booking._id}
                >
                  {/* Actual hotel photograph */}
                  <div className="my-booking-image">
                    <img
                      src={hotelImage}
                      alt={hotelName || getBookingCategory(booking.bookingType)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  <div className="my-booking-details">
                    <div className="my-booking-topline">
                      <span className="my-booking-category">
                        {getBookingCategory(booking.bookingType)}
                      </span>

                      <span
                        className={`my-booking-status ${getStatusClass(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <h3>{displayName}</h3>

                    <p className="my-booking-location">
                      {hotelLocation
                        ? hotelLocation
                        : `Booking reference: ${booking._id}`}
                    </p>

                    {roomType && (
                      <p className="my-booking-location">
                        Room: {roomType}
                      </p>
                    )}

                    <div className="my-booking-information">
                      <div>
                        <span>Booking reference</span>
                        <strong>{booking._id}</strong>
                      </div>

                      <div>
                        <span>Travel dates</span>
                        <strong>
                          {formatDate(booking.startDate)}
                          {booking.endDate
                            ? ` – ${formatDate(booking.endDate)}`
                            : ""}
                        </strong>
                      </div>

                      <div>
                        <span>Guests</span>
                        <strong>
                          {booking.numberOfGuests}{" "}
                          {booking.numberOfGuests === 1
                            ? "guest"
                            : "guests"}
                        </strong>
                      </div>

                      <div>
                        <span>Payment status</span>
                        <strong>{booking.paymentStatus}</strong>
                      </div>
                    </div>

                    <div className="my-booking-bottom">
                      <div className="my-booking-price">
                        <span>Total booking amount</span>
                        <strong>{formatLKR(booking.amount)}</strong>
                      </div>

                      {canCancel && (
                        <button
                          type="button"
                          className="my-booking-view-button"
                          disabled={cancellingId === booking._id}
                          onClick={() => handleCancel(booking)}
                        >
                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel booking"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
