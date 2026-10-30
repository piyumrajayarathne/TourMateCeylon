import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";
const MAX_ROOM_PRICE = 50000;

const initialHotelForm = {
  hotelName: "",
  description: "",
  location: "",
  amenities: "",
  image: "",
};

const initialRoomForm = {
  hotelId: "",
  roomType: "",
  pricePerNight: "",
  maximumGuests: "",
  image: "",
};

export default function HotelDashboard() {
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

  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showHotelForm, setShowHotelForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);

  const [hotelForm, setHotelForm] = useState(initialHotelForm);
  const [roomForm, setRoomForm] = useState(initialRoomForm);

  const [editingHotelId, setEditingHotelId] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  // Fetch hotels and rooms
  const fetchDashboardData = useCallback(async () => {
    try {
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [hotelResponse, roomResponse] = await Promise.all([
        fetch(`${API_URL}/hotels/my-hotels`, { headers }),
        fetch(`${API_URL}/rooms/my-rooms`, { headers }),
      ]);

      const hotelData = await hotelResponse.json();
      const roomData = await roomResponse.json();

      if (!hotelResponse.ok) {
        throw new Error(
          hotelData.message || "Failed to load hotels."
        );
      }

      if (!roomResponse.ok) {
        throw new Error(
          roomData.message || "Failed to load rooms."
        );
      }

      setHotels(hotelData.hotels || []);
      setRooms(roomData.rooms || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && isHotelOwner) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [token, isHotelOwner, fetchDashboardData]);

  const availableRooms = rooms.filter(
    (room) => room.availabilityStatus === "Available"
  ).length;

  const unavailableRooms = rooms.filter(
    (room) => room.availabilityStatus === "Unavailable"
  ).length;

  const handleSaveHotel = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        hotelName: hotelForm.hotelName.trim(),
        description: hotelForm.description.trim(),
        location: hotelForm.location.trim(),
        amenities: hotelForm.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        images: hotelForm.image.trim()
          ? [hotelForm.image.trim()]
          : [],
      };

      const url = editingHotelId
        ? `${API_URL}/hotels/${editingHotelId}`
        : `${API_URL}/hotels`;

      const response = await fetch(url, {
        method: editingHotelId ? "PUT" : "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save hotel."
        );
      }

      const wasEditing = Boolean(editingHotelId);

      setHotelForm(initialHotelForm);
      setEditingHotelId(null);
      setShowHotelForm(false);

      setSuccess(
        wasEditing
          ? "Hotel updated successfully!"
          : "Hotel added successfully!"
      );

      await fetchDashboardData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditHotel = (hotel) => {
    setEditingHotelId(hotel._id);

    setHotelForm({
      hotelName: hotel.hotelName || "",
      description: hotel.description || "",
      location: hotel.location || "",
      amenities: hotel.amenities?.join(", ") || "",
      image: hotel.images?.[0] || "",
    });

    setShowHotelForm(true);
    setShowRoomForm(false);
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelHotelForm = () => {
    setShowHotelForm(false);
    setEditingHotelId(null);
    setHotelForm(initialHotelForm);
  };

  const handleDeleteHotel = async (hotelId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hotel? This action cannot be undone."
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/hotels/${hotelId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete hotel."
        );
      }

      setSuccess("Hotel deleted successfully!");

      if (editingHotelId === hotelId) {
        cancelHotelForm();
      }

      await fetchDashboardData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();

    const price = Number(roomForm.pricePerNight);

    if (
      !Number.isFinite(price) ||
      price < 1 ||
      price > MAX_ROOM_PRICE
    ) {
      setError(
        "Room price must be between LKR 1 and LKR 50,000."
      );
      setSuccess("");
      return;
    }

    if (!Number.isInteger(price)) {
      setError("Room price must be a whole number.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        hotelId: roomForm.hotelId,
        roomType: roomForm.roomType.trim(),
        pricePerNight: price,
        maximumGuests: Number(roomForm.maximumGuests),
        images: roomForm.image.trim()
          ? [roomForm.image.trim()]
          : [],
      };

      const url = editingRoomId
        ? `${API_URL}/rooms/${editingRoomId}`
        : `${API_URL}/rooms`;

      const response = await fetch(url, {
        method: editingRoomId ? "PUT" : "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save room."
        );
      }

      const wasEditing = Boolean(editingRoomId);

      setRoomForm(initialRoomForm);
      setEditingRoomId(null);
      setShowRoomForm(false);

      setSuccess(
        wasEditing
          ? "Room updated successfully!"
          : "Room added successfully!"
      );

      await fetchDashboardData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoomId(room._id);

    setRoomForm({
      hotelId: room.hotelId?._id || "",
      roomType: room.roomType || "",
      pricePerNight: room.pricePerNight ?? "",
      maximumGuests: room.maximumGuests ?? "",
      image: room.images?.[0] || "",
    });

    setShowRoomForm(true);
    setShowHotelForm(false);
    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAvailability = async (room) => {
    const newStatus =
      room.availabilityStatus === "Available"
        ? "Unavailable"
        : "Available";

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/rooms/${room._id}/availability`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            availabilityStatus: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update availability."
        );
      }

      setSuccess(`Room marked as ${newStatus}.`);

      await fetchDashboardData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/rooms/${roomId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete room."
        );
      }

      setSuccess("Room deleted successfully!");

      await fetchDashboardData();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelRoomForm = () => {
    setShowRoomForm(false);
    setEditingRoomId(null);
    setRoomForm(initialRoomForm);
  };

  if (!token || !isHotelOwner) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="page-container hotel-dashboard">
      <span className="eyebrow">HOTEL OWNER PORTAL</span>

      <h1 className="page-title">Hotel Dashboard</h1>

      <p className="page-subtitle">
        Manage your hotels, rooms and accommodation details.
      </p>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="success-message" role="status">
          {success}
        </p>
      )}

      {loading ? (
        <p>Loading your dashboard...</p>
      ) : (
        <>
          {/* Dashboard statistics */}
          <section className="dashboard-stats">
            {[
              ["Total Hotels", hotels.length],
              ["Total Rooms", rooms.length],
              ["Available Rooms", availableRooms],
              ["Unavailable Rooms", unavailableRooms],
            ].map(([label, value]) => (
              <article key={label} className="stat-card">
                <p>{label}</p>
                <h2>{value}</h2>
              </article>
            ))}
          </section>

          {/* Hotel management */}
          <section className="hotel-section">
            <div className="section-header">
              <h2>My Hotels ({hotels.length})</h2>

              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  if (showHotelForm) {
                    cancelHotelForm();
                  } else {
                    setEditingHotelId(null);
                    setHotelForm(initialHotelForm);
                    setShowHotelForm(true);
                    setError("");
                    setSuccess("");
                  }
                }}
              >
                {showHotelForm ? "Cancel" : "+ Add Hotel"}
              </button>
            </div>

            {showHotelForm && (
              <form
                className="dashboard-form"
                onSubmit={handleSaveHotel}
              >
                <h3>
                  {editingHotelId ? "Edit Hotel" : "Add New Hotel"}
                </h3>

                <label>
                  Hotel Name
                  <input
                    type="text"
                    required
                    value={hotelForm.hotelName}
                    onChange={(e) =>
                      setHotelForm({
                        ...hotelForm,
                        hotelName: e.target.value,
                      })
                    }
                    placeholder="Enter hotel name"
                  />
                </label>

                <label>
                  Description
                  <textarea
                    required
                    value={hotelForm.description}
                    onChange={(e) =>
                      setHotelForm({
                        ...hotelForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your hotel"
                    rows={3}
                  />
                </label>

                <label>
                  Location
                  <input
                    type="text"
                    required
                    value={hotelForm.location}
                    onChange={(e) =>
                      setHotelForm({
                        ...hotelForm,
                        location: e.target.value,
                      })
                    }
                    placeholder="e.g. Negombo, Sri Lanka"
                  />
                </label>

                <label>
                  Amenities (separate with commas)
                  <input
                    type="text"
                    value={hotelForm.amenities}
                    onChange={(e) =>
                      setHotelForm({
                        ...hotelForm,
                        amenities: e.target.value,
                      })
                    }
                    placeholder="WiFi, Swimming Pool, Restaurant"
                  />
                </label>

                <label>
                  Hotel Image URL
                  <input
                    type="url"
                    value={hotelForm.image}
                    onChange={(e) =>
                      setHotelForm({
                        ...hotelForm,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://example.com/hotel.jpg"
                  />
                </label>

                <div className="form-button-group">
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingHotelId
                        ? "Update Hotel"
                        : "Save Hotel"}
                  </button>

                  {editingHotelId && (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={cancelHotelForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            {hotels.length === 0 ? (
              <p>You haven't added any hotels yet.</p>
            ) : (
              <div className="hotel-list">
                {hotels.map((hotel) => (
                  <article
                    key={hotel._id}
                    className="hotel-card"
                  >
                    {hotel.images?.[0] && (
                      <img
                        src={hotel.images[0]}
                        alt={hotel.hotelName}
                        className="dashboard-card-image"
                      />
                    )}

                    <h3>{hotel.hotelName}</h3>

                    <p>{hotel.description}</p>

                    <p>
                      <strong>Location:</strong> {hotel.location}
                    </p>

                    <p>
                      <strong>Amenities:</strong>{" "}
                      {hotel.amenities?.join(", ") || "Not specified"}
                    </p>

                    <div className="hotel-card-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleEditHotel(hotel)}
                      >
                        Edit Hotel
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleDeleteHotel(hotel._id)}
                      >
                        Delete Hotel
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Room management */}
          <section className="room-section">
            <div className="section-header">
              <h2>My Rooms ({rooms.length})</h2>

              <button
                type="button"
                className="secondary-button"
                disabled={hotels.length === 0}
                onClick={() => {
                  if (showRoomForm && !editingRoomId) {
                    cancelRoomForm();
                  } else {
                    setEditingRoomId(null);
                    setRoomForm({
                      ...initialRoomForm,
                      hotelId: hotels[0]?._id || "",
                    });
                    setShowRoomForm(true);
                    setShowHotelForm(false);
                    setError("");
                    setSuccess("");
                  }
                }}
              >
                {showRoomForm && !editingRoomId
                  ? "Cancel"
                  : "+ Add Room"}
              </button>
            </div>

            {hotels.length === 0 && (
              <p>Add a hotel before creating rooms.</p>
            )}

            {showRoomForm && (
              <form
                className="dashboard-form"
                onSubmit={handleSaveRoom}
              >
                <h3>
                  {editingRoomId ? "Edit Room" : "Add New Room"}
                </h3>

                <label>
                  Select Hotel
                  <select
                    required
                    value={roomForm.hotelId}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        hotelId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a hotel</option>

                    {hotels.map((hotel) => (
                      <option
                        key={hotel._id}
                        value={hotel._id}
                      >
                        {hotel.hotelName}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Room Type
                  <input
                    type="text"
                    required
                    value={roomForm.roomType}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        roomType: e.target.value,
                      })
                    }
                    placeholder="e.g. Deluxe Double Room"
                  />
                </label>

                <label>
                  Price per Night (LKR)
                  <input
                    type="number"
                    min="1"
                    max={MAX_ROOM_PRICE}
                    step="1"
                    required
                    value={roomForm.pricePerNight}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "") {
                        setRoomForm({
                          ...roomForm,
                          pricePerNight: "",
                        });
                        return;
                      }

                      const number = Number(value);

                      if (
                        number >= 0 &&
                        number <= MAX_ROOM_PRICE
                      ) {
                        setRoomForm({
                          ...roomForm,
                          pricePerNight: value,
                        });
                      }
                    }}
                    placeholder="15000"
                  />

                  <small>
                    Maximum price: LKR 50,000 per night
                  </small>
                </label>

                <label>
                  Maximum Guests
                  <input
                    type="number"
                    min="1"
                    required
                    value={roomForm.maximumGuests}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        maximumGuests: e.target.value,
                      })
                    }
                    placeholder="2"
                  />
                </label>

                <label>
                  Room Image URL
                  <input
                    type="url"
                    value={roomForm.image}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://example.com/room.jpg"
                  />
                </label>

                <div className="form-button-group">
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingRoomId
                        ? "Update Room"
                        : "Save Room"}
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={cancelRoomForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {rooms.length === 0 ? (
              <p>You haven't added any rooms yet.</p>
            ) : (
              <div className="room-list">
                {rooms.map((room) => (
                  <article
                    key={room._id}
                    className="room-card"
                  >
                    {room.images?.[0] && (
                      <img
                        src={room.images[0]}
                        alt={room.roomType}
                        className="dashboard-card-image"
                      />
                    )}

                    <h3>{room.roomType}</h3>

                    <p>
                      Hotel: {room.hotelId?.hotelName || "Hotel"}
                    </p>

                    <p>
                      Location: {room.hotelId?.location || "Not available"}
                    </p>

                    <p>
                      Price per night: LKR{" "}
                      {Number(room.pricePerNight).toLocaleString("en-LK")}
                    </p>

                    <p>Maximum guests: {room.maximumGuests}</p>

                    <p>
                      Availability:{" "}
                      <strong>{room.availabilityStatus}</strong>
                    </p>

                    <div className="room-card-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleEditRoom(room)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleAvailability(room)}
                      >
                        {room.availabilityStatus === "Available"
                          ? "Mark Unavailable"
                          : "Mark Available"}
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleDeleteRoom(room._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
