"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/auth";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const success = login(username, password);

    if (success) {
      router.replace("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
    }

    setSubmitting(false);
  }

  return (
    <div className="admin-login-card">
      <h2>Admin Login</h2>
      <p className="lead">
        Enter your credentials to access the admin panel.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="admin-form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            className="admin-input"
          />
        </div>

        <div className="admin-form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="admin-input"
          />
        </div>

        {error && <p className="admin-error">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-button"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
