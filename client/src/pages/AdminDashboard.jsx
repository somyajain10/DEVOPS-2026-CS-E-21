import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from "../services/api";
import "../dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
  totalStudents: 0,
  profilesCompleted: 0,

});

useEffect(() => {
  fetchStats();
}, []);

const fetchStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      apiUrl("/api/admin/stats"),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setStats(data.stats);
    }
  } catch (error) {
    console.error("Failed to fetch admin statistics:", error);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    {
      label: "📊 Dashboard",
      path: "/admin",
    },
    {
      label: "👨‍🎓 Students",
      path: "/admin/students",
    },
    {
      label: "🏢 Companies",
      path: "/admin/companies",
    },
    {
      label: "💼 Placement Drives",
      path: "/admin/drives",
    },
    {
      label: "📝 Applications",
      path: "/admin/applications",
    },
    {
      label: "🏆 Contests",
      path: "/admin/contests",
    },
  ];

  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <div className="sidebar-brand">
          <h2>Placement Portal</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">

          {navItems.map((item) => (
            <button
              key={item.path}
              className={`admin-nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}

        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          ↪ Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="admin-main">

        {/* Header */}
        <header className="admin-header">

          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Manage students, companies, placement drives and applications.
            </p>
          </div>

          <div className="admin-user">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Placement Cell</span>
            </div>

          </div>

        </header>

        {/* Statistics */}
        <section className="admin-stats">

          <div
            className="admin-stat-card clickable"
            onClick={() => navigate("/admin/students")}
          >
            <div className="stat-icon">👨‍🎓</div>

            <div>
              <span>Total Students</span>
              <strong>{stats.totalStudents}</strong>
            </div>
          </div>


          <div
            className="admin-stat-card clickable"
            onClick={() => navigate("/admin/companies")}
          >
            <div className="stat-icon">🏢</div>

            <div>
              <span>Companies</span>
              <strong>0</strong>
            </div>
          </div>


          <div
            className="admin-stat-card clickable"
            onClick={() => navigate("/admin/drives")}
          >
            <div className="stat-icon">💼</div>

            <div>
              <span>Placement Drives</span>
              <strong>0</strong>
            </div>
          </div>


          <div
            className="admin-stat-card clickable"
            onClick={() => navigate("/admin/applications")}
          >
            <div className="stat-icon">📝</div>

            <div>
              <span>Applications</span>
              <strong>0</strong>
            </div>
          </div>

        </section>


        {/* Main Grid */}
        <section className="admin-content-grid">

          {/* Placement Overview */}
          <div className="admin-panel">

            <div className="panel-header">

              <div>
                <h2>Placement Overview</h2>
                <p>Current placement activity</p>
              </div>

            </div>

            <div className="overview-list">

              <div className="overview-row">
                <span>Students registered</span>
                <strong>{stats.totalStudents}</strong>
              </div>

              <div className="overview-row">
                <span>Profiles completed</span>
                <strong>{stats.profilesCompleted}</strong>
              </div>

              <div className="overview-row">
                <span>Eligible students</span>
                <strong>0</strong>
              </div>

              <div className="overview-row">
                <span>Students placed</span>
                <strong>0</strong>
              </div>

            </div>

          </div>


          {/* Quick Actions */}
          <div className="admin-panel">

            <div className="panel-header">

              <div>
                <h2>Quick Actions</h2>
                <p>Frequently used admin functions</p>
              </div>

            </div>


            <div className="admin-actions">

              <button
                className="admin-action-button"
                onClick={() => navigate("/admin/students")}
              >
                <span>👨‍🎓</span>

                <div>
                  <strong>Manage Students</strong>
                  <small>View and manage student profiles</small>
                </div>

              </button>


              <button
                className="admin-action-button"
                onClick={() => navigate("/admin/companies")}
              >
                <span>🏢</span>

                <div>
                  <strong>Manage Companies</strong>
                  <small>Add and manage recruiters</small>
                </div>

              </button>


              <button
                className="admin-action-button"
                onClick={() => navigate("/admin/drives")}
              >
                <span>💼</span>

                <div>
                  <strong>Create Placement Drive</strong>
                  <small>Post a new opportunity</small>
                </div>

              </button>

            </div>

          </div>

        </section>


        {/* Recent Activity */}
        <section className="admin-panel admin-recent">

          <div className="panel-header">

            <div>
              <h2>Recent Activity</h2>
              <p>Latest activity in the placement portal</p>
            </div>

          </div>


          <div className="empty-state">

            <div className="empty-icon">
              📋
            </div>

            <h3>No recent activity</h3>

            <p>
              Student registrations, company additions and applications
              will appear here.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
