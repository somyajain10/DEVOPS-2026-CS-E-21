
import { useEffect, useState } from "react";

function CompanyDashboard() {
  const [profile, setProfile] = useState(null);
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    async function loadCompanyProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/company/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load company profile");
        }

        setProfile(data.profile);
        if (!data.profile) {
          setProfileMessage("Complete your company profile to save your details.");
        }
      } catch (error) {
        setProfileMessage(error.message || "Unable to load company profile.");
      }
    }

    loadCompanyProfile();
  }, []);

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
        {profile ? (
          <>
            <p>{profile.companyName}</p>
            <div className="company-overview-row">
              <span>Industry</span>
              <strong>{profile.industry}</strong>
            </div>
            <div className="company-overview-row">
              <span>Location</span>
              <strong>{profile.location}</strong>
            </div>
            <div className="company-overview-row">
              <span>Contact email</span>
              <strong>{profile.contactEmail}</strong>
            </div>
          </>
        ) : (
          <p>{profileMessage || "Complete your company profile, then create a placement drive to start recruiting students."}</p>
        )}
      </section>
    </div>
  );
}

export default CompanyDashboard;
