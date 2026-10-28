import { useState } from "react";
import { Link } from "react-router-dom";

const initialTrips = [
  {
    id: 1,
    destination: "Ella",
    region: "Uva Province",
    startDate: "2026-11-12",
    endDate: "2026-11-15",
    status: "Upcoming",
    image:
      "https://www.tracedirecte.com/media/original_images/pont-9-arcs-ella-sri-lanka.jpg.1920x0_q85.jpg",
    slug: "ella",
    description:
      "Discover mountain views, tea plantations and scenic railway journeys.",
    travellers: 2,
    budget: 50000,
  },
  {
    id: 2,
    destination: "Galle",
    region: "Southern Province",
    startDate: "2026-12-20",
    endDate: "2026-12-22",
    status: "Planning",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/cf/Galle_Fort%2C_Sri_Lanka.JPG",
    slug: "galle-fort",
    description:
      "Explore historic Galle Fort, charming streets and beautiful coastal views.",
    travellers: 2,
    budget: 40000,
  },
  {
    id: 3,
    destination: "Sigiriya",
    region: "Central Province",
    startDate: "2027-01-05",
    endDate: "2027-01-07",
    status: "Planning",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sigiriya%2CSri_Lanka.jpg",
    slug: "sigiriya",
    description:
      "Visit the iconic Lion Rock and discover Sri Lanka's ancient heritage.",
    travellers: 2,
    budget: 60000,
  },
];

const emptyTrip = {
  destination: "",
  region: "",
  startDate: "",
  endDate: "",
  description: "",
  travellers: "2",
  budget: "",
};

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

function getDuration(startDate, endDate) {
  if (!startDate || !endDate) return "";

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const nights = Math.round((end - start) / 86400000);

  return `${nights} ${nights === 1 ? "night" : "nights"}`;
}

function getStatus(startDate, endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (end < today) return "Completed";
  if (start <= today) return "Upcoming";

  return "Planning";
}

export default function MyTrips() {
  const [trips, setTrips] = useState(initialTrips);
  const [modalMode, setModalMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTrip);
  const [error, setError] = useState("");

  function openCreateModal() {
    setForm({ ...emptyTrip });
    setEditingId(null);
    setError("");
    setModalMode("create");
  }

  function openEditModal(trip) {
    setForm({
      destination: trip.destination,
      region: trip.region,
      startDate: trip.startDate,
      endDate: trip.endDate,
      description: trip.description,
      travellers: String(trip.travellers),
      budget: String(trip.budget),
    });

    setEditingId(trip.id);
    setError("");
    setModalMode("edit");
  }

  function closeModal() {
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

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const destination = form.destination.trim();
    const region = form.region.trim();
    const description = form.description.trim();
    const travellers = Number(form.travellers);
    const budget = Number(form.budget);

    if (!destination || !region || !description) {
      setError("Please complete all required fields.");
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

    if (!Number.isInteger(travellers) || travellers < 1 || travellers > 100) {
      setError("Enter a number of travellers between 1 and 100.");
      return;
    }

    if (!Number.isFinite(budget) || budget < 0 || form.budget === "") {
      setError("Enter a valid budget of zero or more LKR.");
      return;
    }

    const existingTrip = trips.find((trip) => trip.id === editingId);

    const slug = destination
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const tripData = {
      destination,
      region,
      startDate: form.startDate,
      endDate: form.endDate,
      description,
      travellers,
      budget,
      slug,
      status: getStatus(form.startDate, form.endDate),
      duration: getDuration(form.startDate, form.endDate),
      dates: `${formatDate(form.startDate)} – ${formatDate(form.endDate)}`,
      image:
        existingTrip?.image ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200",
    };

    if (modalMode === "create") {
      setTrips((previous) => [
        ...previous,
        {
          ...tripData,
          id: Date.now(),
        },
      ]);
    } else {
      setTrips((previous) =>
        previous.map((trip) =>
          trip.id === editingId
            ? { ...trip, ...tripData }
            : trip
        )
      );
    }

    closeModal();
  }

  function handleDelete(trip) {
    const confirmed = window.confirm(
      `Are you sure you want to delete your trip to ${trip.destination}?`
    );

    if (confirmed) {
      setTrips((previous) =>
        previous.filter((item) => item.id !== trip.id)
      );
    }
  }

  return (
    <main className="my-trips-page">
      <section className="my-trips-hero">
        <p className="my-trips-eyebrow">YOUR JOURNEY, YOUR STORY</p>
        <h1>My Trips</h1>
        <p>
          Keep your travel plans together and get ready for
          your next Sri Lankan adventure.
        </p>

        <Link
          to="/destinations"
          className="my-trips-primary-button"
        >
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
          >
            + Create Trip
          </button>
        </div>

        <p className="my-trips-count">
          {trips.length} {trips.length === 1 ? "trip" : "trips"}
        </p>

        {trips.length === 0 ? (
          <div className="my-trips-note">
            <span aria-hidden="true">✦</span>
            <div>
              <h3>No trips planned yet</h3>
              <p>
                Create your first trip to start planning your
                Sri Lankan adventure.
              </p>
            </div>
          </div>
        ) : (
          <div className="my-trips-grid">
            {trips.map((trip) => (
              <article className="my-trip-card" key={trip.id}>
                <div className="my-trip-image-wrapper">
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="my-trip-image"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />

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
                  <h3>{trip.destination}</h3>

                  <p className="my-trip-description">
                    {trip.description}
                  </p>

                  <div className="my-trip-meta">
                    <div>
                      <span className="my-trip-meta-label">
                        Travel dates
                      </span>
                      <strong>
                        {trip.dates ||
                          `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`}
                      </strong>
                    </div>

                    <div>
                      <span className="my-trip-meta-label">
                        Duration
                      </span>
                      <strong>
                        {trip.duration ||
                          getDuration(trip.startDate, trip.endDate)}
                      </strong>
                    </div>

                    <div>
                      <span className="my-trip-meta-label">
                        Travellers
                      </span>
                      <strong>{trip.travellers}</strong>
                    </div>

                    <div>
                      <span className="my-trip-meta-label">
                        Estimated budget
                      </span>
                      <strong>
                        LKR {Number(trip.budget).toLocaleString("en-LK")}
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
                      Explore destination <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
              {modalMode === "create"
                ? "Create a trip"
                : "Edit your trip"}
            </h2>

            <p className="trip-modal-subtitle">
              Plan your next memorable Sri Lankan adventure.
            </p>

            <form
              className="trip-modal-form"
              onSubmit={handleSubmit}
            >
              <label>
                Trip name / Destination
                <input
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  placeholder="e.g. Ella"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Province / Region
                <input
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  placeholder="e.g. Uva Province"
                  maxLength={100}
                  required
                />
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

              <label className="trip-modal-description">
                Trip description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What would you like to experience?"
                  rows="3"
                  maxLength={500}
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
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="my-trips-primary-button"
                >
                  {modalMode === "create"
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
