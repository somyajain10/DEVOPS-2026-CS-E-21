
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isCompany = location.pathname.startsWith("/company");
  const basePath = isCompany ? "/company" : "/student";

  const handleLogout = () => {
    // Keep your existing authentication cleanup here if you have it.
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { path: "/student", icon: "📊", label: "Dashboard" },
    { path: "/student/profile", icon: "👤", label: "My Profile" },
    { path: "/student/applications", icon: "📑", label: "Applications" },
    { path: "/student/resume", icon: "📄", label: "Resume" },
    { path: "/student/eligibility", icon: "✓", label: "Eligibility" },
    { path: "/student/contest", icon: "🏆", label: "Contest" },
  ];

  const companyLinks = [
    { path: "/company", icon: "📊", label: "Dashboard" },
    { path: "/company/profile", icon: "🏢", label: "Company Profile" },
    { path: "/company/drives", icon: "💼", label: "Placement Drives" },
    { path: "/company/applications", icon: "📑", label: "Applications" },
    { path: "/company/students", icon: "👥", label: "Eligible Students" },
  ];

  const links = isCompany ? companyLinks : studentLinks;

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h1>Placement Portal</h1>
          <p>{isCompany ? "Company Panel" : "Student"}</p>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${
                isActive(link.path) ? "active" : ""
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
