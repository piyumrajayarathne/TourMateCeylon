import { useState } from "react";
import { Link } from "react-router-dom";

const initialProfile = {
  fullName: "",
  email: "",
  mobile: "",
  travellerType: "Local",
  country: "Sri Lanka",
};

export default function Profile({onAccountDeleted }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("tourmate-profile");
      return saved ? { ...initialProfile, ...JSON.parse(saved) } : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [form, setForm] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
      ...(name === "travellerType" && value === "Local"
        ? { country: "Sri Lanka" }
        : {}),
    }));
  }

  function handleSave(event) {
    event.preventDefault();

    if (!form.fullName.trim() || !form.email.trim()) {
      setMessage("Please enter your name and email address.");
      return;
    }

    const updatedProfile = {
      ...form,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
    };

    localStorage.setItem(
      "tourmate-profile",
      JSON.stringify(updatedProfile)
    );

    setProfile(updatedProfile);
    setForm(updatedProfile);
    setEditing(false);
    setMessage("Profile saved on this device.");
  }

  function handleCancel() {
    setForm(profile);
    setEditing(false);
    setMessage("");
  }

  function handleDeleteAccount() {
  localStorage.removeItem("tourmate-profile");
  localStorage.removeItem("tourmate-user");
  localStorage.removeItem("tourmate-demo-auth");
  localStorage.removeItem("token");

  setShowDeleteConfirm(false);

  if (onAccountDeleted) {
    onAccountDeleted();
  } else {
    window.location.href = "/";
  }
  }

  const initials =
    profile.fullName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "TM";

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <p className="profile-eyebrow">YOUR TOURMATE ACCOUNT</p>
        <h1>My Profile</h1>
        <p>Manage your personal details and account preferences.</p>
      </section>

      <section className="profile-content">
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">{initials}</div>
            <div>
              <h2>{profile.fullName || "Your profile"}</h2>
              <p>{profile.email || "Your account details"}</p>
            </div>
            {!editing && (
              <button
                type="button"
                className="profile-edit-button"
                onClick={() => {
                  setForm(profile);
                  setEditing(true);
                  setMessage("");
                }}
              >
                Edit profile
              </button>
            )}
          </div>

          {message && (
            <p className="profile-message" role="status">
              {message}
            </p>
          )}

          {editing ? (
            <form className="profile-form" onSubmit={handleSave}>
              <label>
                Full name
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                Mobile number
                <input
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange}
                  autoComplete="tel"
                  maxLength={25}
                />
              </label>

              <label>
                Traveller type
                <select
                  name="travellerType"
                  value={form.travellerType}
                  onChange={handleChange}
                >
                  <option value="Local">Local traveller</option>
                  <option value="Foreign">Foreign traveller</option>
                </select>
              </label>

              {form.travellerType === "Foreign" && (
                <label className="profile-form-full">
                  Country of residence
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    autoComplete="country-name"
                    required
                  />
                </label>
              )}

              <div className="profile-form-actions profile-form-full">
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="profile-save-button">
                  Save changes
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details-grid">
              <div>
                <span>Full name</span>
                <strong>{profile.fullName || "Not provided"}</strong>
              </div>
              <div>
                <span>Email address</span>
                <strong>{profile.email || "Not provided"}</strong>
              </div>
              <div>
                <span>Mobile number</span>
                <strong>{profile.mobile || "Not provided"}</strong>
              </div>
              <div>
                <span>Traveller type</span>
                <strong>{profile.travellerType}</strong>
              </div>
              <div>
                <span>Country of residence</span>
                <strong>{profile.country || "Not provided"}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="profile-shortcuts">
          <Link to="/my-trips" className="profile-shortcut">
            <span>✈</span>
            <div>
              <strong>My Trips</strong>
              <p>View and manage your travel plans.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>

          <Link to="/bookings" className="profile-shortcut">
            <span>▣</span>
            <div>
              <strong>My Bookings</strong>
              <p>View your accommodation bookings.</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <section className="profile-danger-zone">
          <div>
            <h2>Delete account</h2>
            <p>
              Account deletion is permanent. Your saved account
              information and related data may be affected.
            </p>
          </div>
          <button
            type="button"
            className="profile-delete-button"
            onClick={handleDeleteAccount}
          >
            Delete account
          </button>
        </section>
      </section>

      {showDeleteConfirm && (
        <div
          className="profile-confirm-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDeleteConfirm(false);
            }
          }}
        >
          <section
            className="profile-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-profile-title"
          >
            <h2 id="delete-profile-title">Delete your account?</h2>
            <p>
              This frontend demo can only clear locally saved profile
              data. It cannot permanently delete your account from
              the database yet.
            </p>
            
<div className="profile-form-actions">
  <button
    type="button"
    className="profile-cancel-button"
    onClick={() => setShowDeleteConfirm(false)}
  >
    Cancel
  </button>

  <button
    type="button"
    className="profile-delete-button"
    onClick={handleDeleteAccount}
  >
    Clear local data
  </button>
</div>

          </section>
        </div>
      )}
    </main>
  );
}
