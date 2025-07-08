import React, { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
    stayLoggedIn: false,
    acceptedPrivacy: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptedPrivacy) {
      alert("You must accept the privacy policy to continue.");
      return;
    }
    // TODO: Implement login logic
    alert("Logging in...");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <h2 className="mb-4 text-center">Login to Your Account</h2>
      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Your password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        {/* Checkboxes */}
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="rememberMe">
            Remember me
          </label>
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="stayLoggedIn"
            name="stayLoggedIn"
            checked={formData.stayLoggedIn}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="stayLoggedIn">
            Stay logged in
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="acceptedPrivacy"
            name="acceptedPrivacy"
            checked={formData.acceptedPrivacy}
            onChange={handleChange}
            required
          />
          <label className="form-check-label" htmlFor="acceptedPrivacy">
            I agree to the{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-100 mb-3">
          Login
        </button>

        {/* Links */}
        <div className="d-flex justify-content-between">
          <a href="/forgot-password">Forgot Password?</a>
          <a href="/signup">Sign Up</a>
        </div>
      </form>
    </div>
  );
}
