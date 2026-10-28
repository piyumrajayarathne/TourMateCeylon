import { Link } from "react-router-dom";

const bookings = [
  {
    id: "TMC-2026-001",
    stayId: 1,
    title: "Luxury Beach Villa",
    category: "Accommodation",
    location: "Mirissa, Sri Lanka",
    dates: "12 Nov – 15 Nov 2026",
    guests: "2 guests",
    price: 18000,
    status: "Confirmed",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "TMC-2026-002",
    stayId: 2,
    title: "Ella Mountain Retreat",
    category: "Accommodation",
    location: "Ella, Sri Lanka",
    dates: "20 Dec – 22 Dec 2026",
    guests: "2 guests",
    price: 8500,
    status: "Confirmed",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "TMC-2026-003",
    stayId: 5,
    title: "Galle Heritage Stay",
    category: "Accommodation",
    location: "Galle, Sri Lanka",
    dates: "05 Jan – 07 Jan 2027",
    guests: "2 guests",
    price: 9500,
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
  },
];

export default function MyBookings() {
  const totalAmount = bookings.reduce(
    (total, booking) => total + booking.price,
    0
  );

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  return (
    <main className="my-bookings-page">
      <section className="my-bookings-hero">
        <p className="my-bookings-eyebrow">
          YOUR JOURNEY, ORGANIZED
        </p>

        <h1>My Bookings</h1>

        <p>
          Keep your accommodation plans organized in one place.
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
            <span>Sample total</span>
            <strong>
              LKR {totalAmount.toLocaleString("en-LK")}
            </strong>
          </article>
        </div>

        <div className="my-bookings-heading">
          <div>
            <p className="my-bookings-eyebrow">
              YOUR RESERVATIONS
            </p>
            <h2>Booking history</h2>
          </div>

          <Link
            to="/stays"
            className="bookings-explore-link"
          >
            Explore stays →
          </Link>
        </div>

        <div className="my-bookings-list">
          {bookings.map((booking) => (
            <article
              className="my-booking-card"
              key={booking.id}
            >
              <img
                className="my-booking-image"
                src={booking.image}
                alt={booking.title}
                loading="lazy"
              />

              <div className="my-booking-details">
                <div className="my-booking-topline">
                  <span className="my-booking-category">
                    {booking.category}
                  </span>

                  <span
                    className={`my-booking-status ${
                      booking.status === "Confirmed"
                        ? "booking-status-confirmed"
                        : "booking-status-pending"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <h3>{booking.title}</h3>

                <p className="my-booking-location">
                  {booking.location}
                </p>

                <div className="my-booking-information">
                  <div>
                    <span>Booking reference</span>
                    <strong>{booking.id}</strong>
                  </div>

                  <div>
                    <span>Travel dates</span>
                    <strong>{booking.dates}</strong>
                  </div>

                  <div>
                    <span>Guests</span>
                    <strong>{booking.guests}</strong>
                  </div>
                </div>

                <div className="my-booking-bottom">
                  <div className="my-booking-price">
                    <span>Sample price per night</span>
                    <strong>
                      LKR {booking.price.toLocaleString("en-LK")}
                    </strong>
                  </div>

                  <Link
                    to={`/stays/${booking.stayId}`}
                    className="my-booking-view-button"
                  >
                    View stay details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="my-bookings-note">
          <strong>Sample booking data</strong>
          <p>
            These bookings, dates, statuses, and reference numbers
            are examples for the interface. They are not real
            reservations, and payments have not been made.
          </p>
        </div>
      </section>
    </main>
  );
}
