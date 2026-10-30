import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/events";

export default function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load event.");
        }

        const item = data.event;

        setEvent({
          id: item._id,
          name: item.eventTitle,
          category: item.category,
          date: item.startDate.slice(0, 10),
          endDate: item.endDate,
          location: item.venue,
          description: item.description,
          image: item.images?.[0] || "",
          ticketPrice: item.ticketPrice,
        });
      } catch (error) {
        setError(error.message || "Unable to load event.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <main className="events-page">
        <section className="events-content">
          <h2>Loading event...</h2>
          <p>Please wait while we retrieve the event details.</p>
        </section>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="events-page">
        <section className="events-content">
          <h1>Event not found</h1>
          <p>{error || "Sorry, we couldn't find this event."}</p>

          <Link to="/events" className="event-link">
            ← Back to events
          </Link>
        </section>
      </main>
    );
  }

  const formattedDate = new Date(
    `${event.date}T12:00:00`
  ).toLocaleDateString("en-LK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fallbackImage =
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=900";

  return (
    <main className="events-page">
      <section className="event-details">
        <Link to="/events" className="event-details-back">
          ← Back to all events
        </Link>

        <div className="event-details-card">
          <img
            className="event-details-image"
            src={event.image || fallbackImage}
            alt={event.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage;
            }}
          />

          <div className="event-details-body">
            <span className="event-category">
              {event.category}
            </span>

            <p className="events-section-eyebrow">
              DISCOVER SRI LANKA
            </p>

            <h1>{event.name}</h1>

            <p className="event-details-description">
              {event.description}
            </p>

            <div className="event-details-info">
              <p>
                <strong>Date:</strong> {formattedDate}
              </p>

              <p>
                <strong>Location:</strong> {event.location}, Sri Lanka
              </p>

              <p>
                <strong>Category:</strong> {event.category}
              </p>

              <p>
                <strong>Ticket Price:</strong>{" "}
                {event.ticketPrice === 0
                  ? "Free"
                  : `LKR ${event.ticketPrice.toLocaleString("en-LK")}`}
              </p>
            </div>

            <div>
              <Link to="/my-trips" className="event-link">
                Plan your trip →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
