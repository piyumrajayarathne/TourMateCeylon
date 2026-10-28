import { useEffect, useState } from "react";

export default function AuthModal({ initialMode = "login", onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    travellerType: "Local",
    country: "Sri Lanka",
    mobile: "",
    password: "",
    confirmPassword: "",
    terms: false,
    remember: true,
  });

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "travellerType" && value === "Local"
        ? { country: "Sri Lanka" }
        : {}),
    }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (mode === "register") {
      if (form.password !== form.confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      if (!form.terms) {
        setMessage("Please accept the Terms and Conditions.");
        return;
      }

      setMessage(
        "Registration details validated. Backend registration connection is the next step."
      );
      return;
    }

    setMessage(
      "Login form is ready. Backend login connection is the next step."
    );
  }

  return (
    <div
      className="auth-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`auth-modal ${mode === "register" ? "auth-modal-register" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ×
        </button>

        <div className="auth-modal-brand">
          <span className="auth-brand-mark">♧</span>
          <span>TourMateCeylon</span>
        </div>

        <p className="auth-modal-eyebrow">
          {mode === "login" ? "WELCOME BACK" : "YOUR JOURNEY STARTS HERE"}
        </p>

        <h2 id="auth-modal-title">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>

        <p className="auth-modal-subtitle">
          {mode === "login"
            ? "Sign in to continue planning your Sri Lankan adventure."
            : "Join us and discover Sri Lanka your way."}
        </p>

        <form
          className={`auth-modal-form ${mode === "register" ? "auth-register-form" : ""}`}
          onSubmit={handleSubmit}
        >
          {mode === "register" && (
            <>
              <label>
                Full name
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Traveller type
                <select
                  name="travellerType"
                  value={form.travellerType}
                  onChange={updateField}
                  required
                >
                  <option value="Local">Local traveller</option>
                  <option value="Foreign">Foreign traveller</option>
                </select>
              </label>
            </>
          )}

          <label>
            Email address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>

          {mode === "register" && (
            <>
              {form.travellerType === "Foreign" && (
                <label>
                  Country of residence
                  <input
                    name="country"
                    value={form.country}
                    onChange={updateField}
                    autoComplete="country-name"
                    placeholder="Enter your country"
                    required
                  />
                </label>
              )}

              <label>
                Mobile number
                <input
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={updateField}
                  autoComplete="tel"
                  placeholder={
                    form.travellerType === "Local"
                      ? "+94 7X XXX XXXX"
                      : "Include your country code"
                  }
                  required
                />
              </label>
            </>
          )}

          <label>
            Password
            <span className="auth-password-field">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={updateField}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          {mode === "register" && (
            <label>
              Confirm password
              <span className="auth-password-field">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={updateField}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>
          )}

          {mode === "login" && (
            <label className="auth-remember">
              <input
                name="remember"
                type="checkbox"
                checked={form.remember}
                onChange={updateField}
              />
              Remember me
            </label>
          )}

          {mode === "register" && (
            <label className="auth-remember auth-terms">
              <input
                name="terms"
                type="checkbox"
                checked={form.terms}
                onChange={updateField}
                required
              />
              <span>
                I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms and Conditions</a> and{" "}
                <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
              </span>
            </label>
          )}

          {message && (
            <p className="auth-form-message" role="status">
              {message}
            </p>
          )}

          <button type="submit" className="auth-submit-button">
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="auth-switch-text">
          {mode === "login"
            ? "New to TourMateCeylon?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            className="auth-switch-button"
            onClick={() =>
              switchMode(mode === "login" ? "register" : "login")
            }
          >
            {mode === "login" ? "Create an account" : "Log in instead"}
          </button>
        </p>

        <p className="auth-modal-footer">
          Discover Sri Lanka, your way.
        </p>
      </section>
    </div>
  );
}
