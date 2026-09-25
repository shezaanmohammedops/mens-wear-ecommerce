import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const loginData = new URLSearchParams();

      loginData.append("username", formData.email);
      loginData.append("password", formData.password);

      const response = await api.post(
        "/api/auth/login",
        loginData
      );

      const token =
        response?.access_token ||
        response?.token ||
        response?.accessToken;

      if (!token) {
        throw new Error(
          "Login token was not returned by the server."
        );
      }

      // Save token first so api.get("/api/auth/me")
      // automatically sends Authorization header.
      localStorage.setItem("menswear_token", token);

      let user = response?.user;

      if (!user) {
        try {
          const meResponse = await api.get("/api/auth/me");
          user = meResponse;
        } catch {
          user = {
            email: formData.email,
          };
        }
      }

      login(user, token);

      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed. Please check your email and password.";

      setError(
        Array.isArray(message)
          ? message.map((item) => item.msg).join(", ")
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">
      <div className="form-card">
        <h1>Welcome Back</h1>

        <p>Login to your Men's Wear account.</p>

        {error && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            marginTop: "22px",
            marginBottom: 0,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ fontWeight: 700 }}
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;