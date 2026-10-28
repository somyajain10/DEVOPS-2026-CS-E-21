
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://devops-2026-cs-e-21.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token) {
        throw new Error("Backend ne login token nahi bheja.");
      }

      // Save token and user details
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Verify the selected role matches the account
      if (data.user?.role !== role) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error(
          `Ye account ${data.user?.role || "unknown"} role ka hai. Sahi role select karo.`
        );
      }

      if (role === "student") {
        navigate("/student");
      } else if (role === "company") {
        navigate("/company");
      } else if (role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Login nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-intro">
          <div className="login-mark" aria-hidden="true">CP</div>
          <p className="login-portal-name">College Placement Portal</p>
          <p className="login-subtitle">Sign in to continue</p>
        </header>

        <form className="login-form" onSubmit={handleLogin}>
          <h1 id="login-title">Welcome back</h1>

          <div className="login-field">
            <label htmlFor="login-role">Select role</label>
            <select
              id="login-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="login-error" role="alert">{error}</p>}
        </form>
      </section>
    </main>
  );
}

export default Login;
