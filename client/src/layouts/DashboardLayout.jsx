import { Link, Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "#1e3a5f",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Placement Portal</h2>

        <hr />

        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link style={{ color: "white" }} to="/student">
            Dashboard
          </Link>

          <Link style={{ color: "white" }} to="/student/profile">
            Profile
          </Link>

          <Link style={{ color: "white" }} to="/student/resume">
            Resume
          </Link>

          <Link style={{ color: "white" }} to="/student/eligibility">
            Eligibility
          </Link>

          <Link style={{ color: "white" }} to="/student/contest">
            Contest Round
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "40px",
          background: "#f4f6f8",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;