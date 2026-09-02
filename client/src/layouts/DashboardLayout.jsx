import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome back, Student 👋</h1>
        <p>
          Track your placement progress and stay updated with new opportunities.
        </p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>Applications</h3>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <h3>Eligible Companies</h3>
          <h2>0</h2>
        </div>

        <div className="stat-card">
          <h3>Profile Status</h3>
          <h2>Incomplete</h2>
        </div>

        <div className="stat-card">
          <h3>Contest Score</h3>
          <h2>--</h2>
        </div>

      </div>

      {/* Placement Status */}
      <div className="content-card">
        <h2>Placement Journey</h2>

        <p>
          Complete your profile and upload your resume to unlock placement
          opportunities and eligibility checks.
        </p>

        <Link
          className="primary-button"
          to="/student/profile"
        >
          Complete Profile
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="content-card">
        <h2>Quick Actions</h2>

        <div className="quick-actions">

          {/* Upload Resume */}
          <Link
            className="primary-button"
            to="/student/resume"
          >
            Upload Resume
          </Link>

          {/* Logout */}
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

          {/* Check Eligibility */}
          <Link
            className="primary-button"
            to="/student/eligibility"
          >
            Check Eligibility
          </Link>

          {/* Join Contest Round */}
          <Link
            className="primary-button"
            to="/student/contest"
          >
            Join Contest Round
          </Link>

        </div>
      </div>

      {/* Upcoming Activity */}
      <div className="content-card">
        <h2>Upcoming Activity</h2>

        <div className="activity-item">
          <div>
            <h3>No upcoming placement drives</h3>

            <p>
              New company opportunities will appear here when they are added.
            </p>
          </div>
        </div>
      </div>

      {/* IMPORTANT:
          This displays StudentProfile, ResumeUpload,
          Eligibility, ContestRound, etc. inside the layout.
      */}
      <Outlet />

    </div>
  );
}

export default DashboardLayout;