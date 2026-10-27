import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

function StudentApplications() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    setError("");
    try {
      const [opportunityData, applicationData] = await Promise.all([
        apiRequest("/api/student/opportunities"),
        apiRequest("/api/student/applications")
      ]);
      setOpportunities(opportunityData.opportunities || []);
      setApplications(applicationData.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const apply = async (jobId) => {
    setApplyingTo(jobId);
    setError("");
    setMessage("");
    try {
      const result = await apiRequest("/api/student/applications", {
        method: "POST",
        body: JSON.stringify({ jobId })
      });
      setMessage(result.message);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setApplyingTo("");
    }
  };

  const appliedJobIds = new Set(applications.map((application) => application.job?._id));

  if (loading) return <p role="status">Loading opportunities and applications…</p>;

  return (
    <div>
      <div className="dashboard-header">
        <h1>Placement Opportunities</h1>
        <p>Browse open roles and track your application status.</p>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}
      {message && <p className="success-message" role="status">{message}</p>}

      <div className="content-card">
        <h2>Open Opportunities</h2>
        {opportunities.length === 0 ? (
          <p>No open placement opportunities are available right now.</p>
        ) : (
          <div className="form-grid">
            {opportunities.map((job) => (
              <article className="content-card" key={job._id}>
                <h3>{job.jobTitle}</h3>
                <p>{job.company?.companyName || "Company"} · {job.location}</p>
                <p>{job.package} · Minimum CGPA {job.eligibilityCgpa}</p>
                <p>Apply by {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                {appliedJobIds.has(job._id) ? (
                  <button className="primary-button" disabled>Applied</button>
                ) : (
                  <button
                    className="primary-button"
                    onClick={() => apply(job._id)}
                    disabled={Boolean(applyingTo)}
                  >
                    {applyingTo === job._id ? "Applying…" : "Apply"}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="content-card">
        <h2>My Applications</h2>
        {applications.length === 0 ? (
          <p>You have not applied to any opportunities yet.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Role</th><th>Company</th><th>Applied On</th><th>Status</th></tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td>{application.job?.jobTitle || "Opportunity unavailable"}</td>
                    <td>{application.job?.company?.companyName || "—"}</td>
                    <td>{new Date(application.appliedAt).toLocaleDateString()}</td>
                    <td><span className="status-badge">{application.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentApplications;
