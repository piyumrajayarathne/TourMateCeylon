import { useEffect, useState } from "react";

export default function AuthModal({
  initialMode = "login",
  onClose,
  onLoginSuccess,
}) {
  const [mode, setMode] = useState(initialMode);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
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
    setMode(initialMode);
    setMessage("");
  }, [initialMode]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const email = formData.email.trim().toLowerCase();

    if (!email || !formData.password) {
      setMessage("Please enter your email and password.");
      setMessageType("error");
      return;
    }

    if (mode === "register") {
      const fullName = formData.fullName.trim();

      if (!fullName) {
        setMessage("Please enter your full name.");
        setMessageType("error");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMessage("Please enter a valid email address.");
        setMessageType("error");
        return;
      }

      if (formData.password.length < 8) {
        setMessage("Your password must contain at least 8 characters.");
        setMessageType("error");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords do not match.");
        setMessageType("error");
        return;
      }

      if (!formData.terms) {
        setMessage("Please accept the terms and conditions.");
        setMessageType("error");
        return;
      }

      const newUser = {
        fullName,
        email,
        mobile: formData.mobile.trim(),
        travellerType: formData.travellerType,
        country: formData.country.trim() || "Sri Lanka",
      };

      try {
        localStorage.setItem(
          "tourmate-profile",
          JSON.stringify(newUser)
        );

        localStorage.setItem(
          "tourmate-user",
          JSON.stringify(newUser)
        );

        localStorage.setItem("tourmate-demo-auth", "true");

        setMessage(
          "Registration successful! Your details have been saved."
        );
        setMessageType("success");

        onLoginSuccess?.();

        // Close the modal after a short delay so the message can be read.
        setTimeout(() => {
          onClose?.();
        }, 1000);
      } catch {
        setMessage("Unable to save your details in this browser.");
        setMessageType("error");
      }

      return;
    }

    // Demo login only: this does not verify a password or authenticate
    // against the backend.
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("tourmate-user") || "null"
      );

      if (!savedUser || savedUser.email !== email) {
        setMessage(
          "No matching locally registered account was found. Please sign up first."
        );
        setMessageType("error");
        return;
      }

      setMessage("Login successful!");
      setMessageType("success");

      localStorage.setItem("tourmate-demo-auth", "true");
      onLoginSuccess?.();

      setTimeout(() => {
        onClose?.();
      }, 700);
    } catch {
      setMessage("Unable to read your saved account details.");
      setMessageType("error");
    }
  }

  return (
    <div
      className="auth-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close authentication dialog"
        >
          &times;
        </button>

        <div className="auth-modal-header">
          <span className="eyebrow">TOURMATECEYLON</span>

          <h2 id="auth-modal-title">
            {mode === "register"
              ? "Create your account"
              : "Welcome back"}
          </h2>

          <p>
            {mode === "register"
              ? "Start planning your Sri Lankan adventure."
              : "Your next journey is waiting for you."}
          </p>
        </div>

        <div className="auth-modal-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>

          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => switchMode("register")}
          >
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label htmlFor="auth-fullName">Full name</label>
              <input
                id="auth-fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />

              <label htmlFor="auth-mobile">Mobile number</label>
              <input
                id="auth-mobile"
                name="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
                autoComplete="tel"
              />

              <label htmlFor="auth-travellerType">
                Traveller type
              </label>
              <select
                id="auth-travellerType"
                name="travellerType"
                value={formData.travellerType}
                onChange={handleChange}
              >
                <option value="Local">Local traveller</option>
                <option value="Foreign">Foreign traveller</option>
              </select>

              <label htmlFor="auth-country">Country</label>
              <input
                id="auth-country"
                name="country"
                type="text"
                placeholder="Enter your country"
                value={formData.country}
                onChange={handleChange}
                autoComplete="country-name"
              />
            </>
          )}

          <label htmlFor="auth-email">Email address</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={
              mode === "register"
                ? "At least 8 characters"
                : "Enter your password"
            }
            value={formData.password}
            onChange={handleChange}
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
            minLength={mode === "register" ? 8 : undefined}
            required
          />

          {mode === "register" && (
            <>
              <label htmlFor="auth-confirmPassword">
                Confirm password
              </label>
              <input
                id="auth-confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </>
          )}

          <label className="auth-checkbox-row">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) =>
                setShowPassword(event.target.checked)
              }
            />
            Show password
          </label>

          {mode === "register" ? (
            <label className="auth-checkbox-row">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                required
              />
              I agree to the terms and conditions.
            </label>
          ) : (
            <label className="auth-checkbox-row">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
          )}

          {message && (
            <p
              className={`auth-message ${
                messageType === "success"
                  ? "auth-message-success"
                  : "auth-message-error"
              }`}
              role="status"
            >
              {message}
            </p>
          )}

          <button type="submit" className="auth-submit-button">
            {mode === "register" ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="auth-switch-text">
          {mode === "register"
            ? "Already have an account?"
            : "New to TourMateCeylon?"}{" "}
          <button
            type="button"
            onClick={() =>
              switchMode(mode === "register" ? "login" : "register")
            }
          >
            {mode === "register" ? "Log in" : "Create an account"}
          </button>
        </p>

        <p className="auth-demo-note">
          Demo mode: details are stored in this browser only.
        </p>
      </div>
    </div>
  );
}
