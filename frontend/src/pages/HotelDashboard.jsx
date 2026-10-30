
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function HotelDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("tourmate-user") || "null"
    );
  } catch {
    user = null;
  }

  const isHotelOwner = user?.role === "Hotel Owner";

  useEffect(() => {
    if (!token || !isHotelOwner) {
      setLoading(false);
      return;
    }

    const fetchMyRooms = async () => {
      try {
        const response = await fetch(`${API_URL}/rooms/my-rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load rooms.");
        }

        setRooms(data.rooms || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRooms();
  }, [token, isHotelOwner]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!isHotelOwner) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="page-container">
      <span className="eyebrow">HOTEL OWNER PORTAL</span>

      <h1 className="page-title">
        Hotel Dashboard
      </h1>

      <p className="page-subtitle">
        Manage your hotels, rooms and accommodation details.
      </p>

      {loading && <p>Loading your rooms...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <section>
          <h2>My Rooms ({rooms.length})</h2>

          {rooms.length === 0 ? (
            <p>You haven't added any rooms yet.</p>
          ) : (
            rooms.map((room) => (
              <article key={room._id}>
                <h3>{room.roomType}</h3>

                <p>
                  Hotel: {room.hotelId?.hotelName || "Hotel"}
                </p>

                <p>
                  Location: {room.hotelId?.location || "Not available"}
                </p>

                <p>
                  Price per night: LKR{" "}
                  {Number(room.pricePerNight).toLocaleString()}
                </p>

                <p>
                  Maximum guests: {room.maximumGuests}
                </p>

                <p>
                  Availability: {room.availabilityStatus}
                </p>
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}
