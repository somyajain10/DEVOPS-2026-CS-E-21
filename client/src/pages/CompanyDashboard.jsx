
function CompanyDashboard() {
  return (
    <div className="company-dashboard">
      <div className="company-page-heading">
        <h1>Company Dashboard</h1>
        <p>Manage your campus recruitment and placement drives.</p>
      </div>

      <div className="company-stats">
        <div className="company-stat-card">
          <span>💼</span>
          <div>
            <p>Placement Drives</p>
            <h2>0</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <span>📑</span>
          <div>
            <p>Applications</p>
            <h2>0</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <span>👥</span>
          <div>
            <p>Eligible Students</p>
            <h2>0</h2>
          </div>
        </div>

        <div className="company-stat-card">
          <span>✅</span>
          <div>
            <p>Shortlisted</p>
            <h2>0</h2>
          </div>
        </div>
      </div>

      <section className="company-panel">
        <h2>Placement Overview</h2>
        <p>Track your recruitment activity from one place.</p>

        <div className="company-overview-row">
          <span>Active placement drives</span>
          <strong>0</strong>
        </div>

        <div className="company-overview-row">
          <span>Applications received</span>
          <strong>0</strong>
        </div>

        <div className="company-overview-row">
          <span>Students shortlisted</span>
          <strong>0</strong>
        </div>
      </section>

      <section className="company-panel">
        <h2>Getting Started</h2>
        <p>
          Complete your company profile, then create a placement
          drive to start recruiting students.
        </p>
      </section>
    </div>
  );
}

export default CompanyDashboard;
