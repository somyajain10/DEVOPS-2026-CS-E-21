import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

function StudentDashboard() {
  const [summary, setSummary] = useState({ loading: true, profile: null, name: "Student" });
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/api/student/profile")
      .then(({ profile, user }) => setSummary({ loading: false, profile, name: user?.name || "Student" }))
      .catch((err) => {
        setError(err.message);
        setSummary((current) => ({ ...current, loading: false }));
      });
  }, []);

  return (
    <div>
      <h1>Welcome back, {summary.name}! 👋</h1>
      <p>Here's an overview of your placement journey.</p>
      {error && <p className="error-message" role="alert">{error}</p>}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Applications</h3>
          <h2>—</h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Eligible Companies</h3>
          <h2>—</h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Profile Status</h3>
          <h2>{summary.loading ? "Loading…" : summary.profile ? "Complete" : "Incomplete"}</h2>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            minWidth: "180px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Contest Score</h3>
          <h2>—</h2>
        </div>
      </div>

      <div
        style={{
          background: "white",
          marginTop: "30px",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Placement Status</h2>

        <p>
          {summary.profile
            ? "Your academic profile is saved. Keep your resume up to date to prepare for placement opportunities."
            : "Complete your profile and upload your resume to prepare for placement opportunities."}
        </p>

        <Link to="/student/profile" className="primary-button"
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {summary.profile ? "View Profile" : "Complete Profile"}
        </Link>
      </div>
    </div>
  );
}

export default StudentDashboard;
