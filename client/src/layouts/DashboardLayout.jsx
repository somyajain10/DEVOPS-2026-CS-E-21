import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">
          <h1>Placement Portal</h1>
          <p>Student</p>
        </div>

        <nav className="sidebar-nav">

          <Link
            to="/student"
            className={`sidebar-link ${
              isActive("/student") ? "active" : ""
            }`}
          >
            <span>📊</span>
            Dashboard
          </Link>

          <Link
            to="/student/profile"
            className={`sidebar-link ${
              isActive("/student/profile") ? "active" : ""
            }`}
          >
            <span>👤</span>
            My Profile
          </Link>

          <Link
            to="/student/resume"
            className={`sidebar-link ${
              isActive("/student/resume") ? "active" : ""
            }`}
          >
            <span>📄</span>
            Resume
          </Link>

          <Link
            to="/student/eligibility"
            className={`sidebar-link ${
              isActive("/student/eligibility") ? "active" : ""
            }`}
          >
            <span>✓</span>
            Eligibility
          </Link>

          <Link
            to="/student/contest"
            className={`sidebar-link ${
              isActive("/student/contest") ? "active" : ""
            }`}
          >
            <span>🏆</span>
            Contest
          </Link>

        </nav>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;