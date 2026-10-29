import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const emptyTrip = {
  tripName: "",
  destinationId: "",
  startDate: "",
  endDate: "",
  travellers: "2",
  budget: "",
};

function makeSlug(value = "") {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDestinationImage(destination) {
  if (destination?.images?.length) {
    return destination.images[0];
  }

  if (typeof destination?.images === "string") {
    return destination.images;
  }

  if (destination?.image) {
    return destination.image;
  }

  const images = {
    sigiriya:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sigiriya%2CSri_Lanka.jpg",
    ella:
      "https://www.tracedirecte.com/media/original_images/pont-9-arcs-ella-sri-lanka.jpg.1920x0_q85.jpg",
    kandy: "/images/kandy.jpg",
    "galle-fort":
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Galle_Fort%2C_Sri_Lanka.JPG",
    galle:
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Galle_Fort%2C_Sri_Lanka.JPG",
    mirissa:
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Mirissa_Sri_lanka.jpg",
    "nuwara-eliya":
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nuwara-Eliya.jpg",
  };

  return images[makeSlug(destination?.name)] || "";
}

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(`${String(dateString).slice(0, 10)}T00:00:00`)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
}

function getDuration(startDate, endDate) {
  if (!startDate || !endDate) return "";

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const nights = Math.round((end - start) / 86400000);

  return `${nights} ${nights === 1 ? "night" : "nights"}`;
}

function getStatus(startDate, endDate) {
  if (!startDate || !endDate) return "Planning";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (end < today) return "Completed";
  if (start <= today) return "Upcoming";

  return "Planning";
}

function mapBackendTrip(trip) {
  const destinations = Array.isArray(trip.destinations)
    ? trip.destinations
    : [];

  const firstDestination = destinations[0] || null;

  return {
    id: trip._id,
    tripName: trip.tripName || "My Trip",
    destination: firstDestination?.name || trip.tripName || "Sri Lanka",
    region:
      firstDestination?.province ||
      firstDestination?.district ||
      "Sri Lanka",
    startDate: trip.startDate
      ? String(trip.startDate).slice(0, 10)
      : "",
    endDate: trip.endDate
      ? String(trip.endDate).slice(0, 10)
      : "",
    status: trip.tripStatus || getStatus(trip.startDate, trip.endDate),
    image: getDestinationImage(firstDestination),
    slug: makeSlug(firstDestination?.name || trip.tripName),
    description:
      "Your planned Sri Lankan travel adventure.",
    travellers: trip.numberOfTravelers ?? 1,
    budget: trip.totalBudget ?? 0,
    destinationIds: destinations.map((destination) =>
      typeof destination === "string"
        ? destination
        : destination._id
    ),
  };
}

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTrip);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const apiRequest = useCallback(async (path, options = {}) => {
    const token = getToken();

    if (!token) {
      throw new Error("Please log in to manage your trips.");
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

  const loadPageData = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    if (!getToken()) {
      setLoadError("Please log in to view and manage your trips.");
      setLoading(false);
      return;
    }

    try {
      const [tripData, destinationData] = await Promise.all([
        apiRequest("/trips/my-trips"),
        fetch(`${API_URL}/destinations`).then(async (response) => {
          const data = await response.json().catch(() => ({}));

          if (!response.ok) {
            throw new Error(
              data.message || "Could not load destinations."
            );
          }

          return data;
        }),
      ]);

      setTrips((tripData.trips || []).map(mapBackendTrip));
      setDestinations(destinationData.destinations || []);
    } catch (err) {
      setLoadError(err.message || "Unable to load your trips.");
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  function openCreateModal() {
    setForm({ ...emptyTrip });
    setEditingId(null);
    setError("");
    setModalMode("create");
  }

  function openEditModal(trip) {
    setForm({
      tripName: trip.tripName || trip.destination || "",
      destinationId: trip.destinationIds?.[0] || "",
      startDate: trip.startDate,
      endDate: trip.endDate,
      travellers: String(trip.travellers),
      budget: String(trip.budget),
    });

    setEditingId(trip.id);
    setError("");
    setModalMode("edit");
  }

  function closeModal() {
    if (saving) return;

    setModalMode(null);
    setEditingId(null);
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const tripName = form.tripName.trim();
    const travellers = Number(form.travellers);
    const budget = Number(form.budget);

    if (!tripName || !form.destinationId) {
      setError("Enter a trip name and select a destination.");
      return;
    }

    if (
      !form.startDate ||
      !form.endDate ||
      form.endDate < form.startDate
    ) {
      setError("The end date must be on or after the start date.");
      return;
    }

    if (
      !Number.isInteger(travellers) ||
      travellers < 1 ||
      travellers > 100
    ) {
      setError("Enter between 1 and 100 travellers.");
      return;
    }

    if (
      form.budget === "" ||
      !Number.isFinite(budget) ||
      budget < 0
    ) {
      setError("Enter a valid budget of zero or more LKR.");
      return;
    }

    const tripPayload = {
      tripName,
      numberOfTravelers: travellers,
      startDate: form.startDate,
      endDate: form.endDate,
      totalBudget: budget,
      currency: "LKR",
      destinations: [form.destinationId],
    };

    setSaving(true);

    try {
      if (modalMode === "create") {
        await apiRequest("/trips", {
          method: "POST",
          body: JSON.stringify(tripPayload),
        });
      } else {
        await apiRequest(`/trips/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(tripPayload),
        });
      }

      setModalMode(null);
      setEditingId(null);
      setForm({ ...emptyTrip });

      await loadPageData();
    } catch (err) {
      setError(err.message || "Could not save the trip.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(trip) {
    const confirmed = window.confirm(
      `Are you sure you want to delete your trip "${trip.tripName}"?`
    );

    if (!confirmed) return;

    setLoadError("");

    try {
      await apiRequest(`/trips/${trip.id}`, {
        method: "DELETE",
      });

      setTrips((previous) =>
        previous.filter((item) => item.id !== trip.id)
      );
    } catch (err) {
      setLoadError(err.message || "Could not delete the trip.");
    }
  }

  return (
    <main className="my-trips-page">
      <section className="my-trips-hero">
        <p className="my-trips-eyebrow">YOUR JOURNEY, YOUR STORY</p>

        <h1>My Trips</h1>

        <p>
          Keep your travel plans together and get ready for your next
          Sri Lankan adventure.
        </p>

        <Link to="/destinations" className="my-trips-primary-button">
          Explore destinations <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="my-trips-content">
        <div className="my-trips-heading">
          <div>
            <p className="my-trips-eyebrow">YOUR TRAVEL PLANNER</p>
            <h2>Journeys to remember</h2>
          </div>

          <button
            type="button"
            className="my-trips-primary-button"
            onClick={openCreateModal}
            disabled={loading || destinations.length === 0}
          >
            + Create Trip
          </button>
        </div>

        {loadError && (
          <div className="my-trips-note" role="alert">
            <div>
              <h3>Something went wrong</h3>
              <p>{loadError}</p>
              <button
                type="button"
                className="my-trip-view-button"
                onClick={loadPageData}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="my-trips-note">
            <p>Loading your trips...</p>
          </div>
        ) : (
          <>
            <p className="my-trips-count">
              {trips.length} {trips.length === 1 ? "trip" : "trips"}
            </p>

            {trips.length === 0 ? (
              <div className="my-trips-note">
                <span aria-hidden="true">✦</span>
                <div>
                  <h3>No trips planned yet</h3>
                  <p>
                    Create your first trip to start planning your Sri Lankan
                    adventure.
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-trips-grid">
                {trips.map((trip) => (
                  <article className="my-trip-card" key={trip.id}>
                    <div className="my-trip-image-wrapper">
                      {trip.image && (
                        <img
                          src={trip.image}
                          alt={trip.destination}
                          className="my-trip-image"
                          onError={(event) => {
                            event.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      )}

                      <span
                        className={`my-trip-status ${
                          trip.status === "Upcoming"
                            ? "my-trip-status-upcoming"
                            : "my-trip-status-planning"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>

                    <div className="my-trip-body">
                      <p className="my-trip-region">{trip.region}</p>
                      <h3>{trip.tripName}</h3>

                      <p className="my-trip-description">
                        {trip.description}
                      </p>

                      <div className="my-trip-meta">
                        <div>
                          <span className="my-trip-meta-label">
                            Travel dates
                          </span>
                          <strong>
                            {formatDate(trip.startDate)} –{" "}
                            {formatDate(trip.endDate)}
                          </strong>
                        </div>

                        <div>
                          <span className="my-trip-meta-label">Duration</span>
                          <strong>
                            {getDuration(trip.startDate, trip.endDate)}
                          </strong>
                        </div>

                        <div>
                          <span className="my-trip-meta-label">Travellers</span>
                          <strong>{trip.travellers}</strong>
                        </div>

                        <div>
                          <span className="my-trip-meta-label">
                            Estimated budget
                          </span>
                          <strong>
                            LKR{" "}
                            {Number(trip.budget).toLocaleString("en-LK")}
                          </strong>
                        </div>
                      </div>

                      <div className="my-trip-actions">
                        <button
                          type="button"
                          className="my-trip-view-button"
                          onClick={() => openEditModal(trip)}
                        >
                          Edit Trip
                        </button>

                        <button
                          type="button"
                          className="my-trip-delete-button"
                          onClick={() => handleDelete(trip)}
                        >
                          Delete Trip
                        </button>

                        <Link
                          to={`/destinations/${trip.slug}`}
                          className="my-trip-view-button"
                        >
                          Explore destination{" "}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {modalMode && (
        <div
          className="trip-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="trip-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-modal-title"
          >
            <button
              type="button"
              className="trip-modal-close"
              onClick={closeModal}
              aria-label="Close dialog"
            >
              ×
            </button>

            <p className="my-trips-eyebrow">YOUR TRAVEL PLANNER</p>

            <h2 id="trip-modal-title">
              {modalMode === "create" ? "Create a trip" : "Edit your trip"}
            </h2>

            <p className="trip-modal-subtitle">
              Plan your next memorable Sri Lankan adventure.
            </p>

            <form className="trip-modal-form" onSubmit={handleSubmit}>
              <label>
                Trip name
                <input
                  name="tripName"
                  value={form.tripName}
                  onChange={handleChange}
                  placeholder="e.g. My Ella Holiday"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Destination
                <select
                  name="destinationId"
                  value={form.destinationId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a destination</option>
                  {destinations.map((destination) => (
                    <option key={destination._id} value={destination._id}>
                      {destination.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Start date
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                End date
                <input
                  name="endDate"
                  type="date"
                  min={form.startDate || undefined}
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Number of travellers
                <input
                  name="travellers"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={form.travellers}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Estimated budget (LKR)
                <input
                  name="budget"
                  type="number"
                  min="0"
                  step="1"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="e.g. 50000"
                  required
                />
              </label>

              {error && (
                <p className="trip-modal-error" role="alert">
                  {error}
                </p>
              )}

              <div className="trip-modal-actions">
                <button
                  type="button"
                  className="trip-modal-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="my-trips-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : modalMode === "create"
                      ? "Create Trip"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}