import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const emptyDrive = {
  jobTitle: "",
  description: "",
  requiredSkills: "",
  eligibilityCgpa: "",
  maxBacklogs: "0",
  package: "",
  location: "",
  applicationDeadline: "",
};

const sections = {
  drives: {
    title: "Placement Drives",
    description: "Manage placement opportunities for your company.",
  },
  applications: {
    title: "Applications",
    description: "Review applications submitted to your opportunities.",
  },
  students: {
    title: "Eligible Students",
    description: "Find students who meet a selected drive's requirements.",
  },
};

const applicationStatuses = ["applied", "shortlisted", "rejected", "selected"];

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

function driveIsOpen(drive) {
  return drive.status === "open" && new Date(drive.applicationDeadline) >= new Date();
}

function minimumDeadlineDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function CompanyWorkspace({ section }) {
  const page = sections[section];
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState("");
  const [updatingApplication, setUpdatingApplication] = useState("");
  const [driveForm, setDriveForm] = useState(emptyDrive);

  useEffect(() => {
    let active = true;

    async function loadSection() {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        if (section === "drives") {
          const data = await apiRequest("/api/company/drives");
          if (active) setDrives(data.drives || []);
        } else if (section === "applications") {
          const data = await apiRequest("/api/company/applications");
          if (active) setApplications(data.applications || []);
        } else if (section === "students") {
          const data = await apiRequest("/api/company/drives");
          if (active) {
            const companyDrives = data.drives || [];
            setDrives(companyDrives);
            setSelectedDrive((current) =>
              companyDrives.some((drive) => drive._id === current)
                ? current
                : companyDrives[0]?._id || ""
            );
          }
        }
      } catch (loadError) {
        if (active) setError(loadError.message || `Unable to load ${page.title.toLowerCase()}`);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (page) loadSection();
    return () => {
      active = false;
    };
  }, [page, section]);

  useEffect(() => {
    if (section !== "students" || !selectedDrive) {
      setStudents([]);
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError("");
    apiRequest(`/api/company/eligible-students?jobId=${encodeURIComponent(selectedDrive)}`)
      .then((data) => {
        if (active) setStudents(data.eligibleStudents || []);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Unable to load eligible students");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [section, selectedDrive]);

  async function createDrive(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest("/api/company/drives", {
        method: "POST",
        body: JSON.stringify({
          ...driveForm,
          eligibilityCgpa: Number(driveForm.eligibilityCgpa),
          maxBacklogs: Number(driveForm.maxBacklogs),
          requiredSkills: driveForm.requiredSkills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        }),
      });
      setDrives((current) => [result.drive, ...current]);
      setDriveForm(emptyDrive);
      setMessage("Placement drive created successfully.");
    } catch (saveError) {
      setError(saveError.message || "Unable to create placement drive");
    } finally {
      setSaving(false);
    }
  }

  async function updateApplicationStatus(applicationId, status) {
    setUpdatingApplication(applicationId);
    setError("");
    setMessage("");
    try {
      const result = await apiRequest(`/api/company/applications/${applicationId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setApplications((current) => current.map((application) =>
        application._id === applicationId ? result.application : application
      ));
      setMessage("Application status updated.");
    } catch (updateError) {
      setError(updateError.message || "Unable to update application status");
    } finally {
      setUpdatingApplication("");
    }
  }

  if (!page) return null;

  return (
    <div className="company-dashboard">
      <div className="company-page-heading">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}
      {message && <p className="success-message" role="status">{message}</p>}
      {loading && <p role="status">Loading {page.title.toLowerCase()}…</p>}

      {!loading && section === "drives" && (
        <>
          <section className="company-panel">
            <h2>Create a Placement Drive</h2>
            <form className="company-profile-form" onSubmit={createDrive}>
              <label>
                Job title *
                <input value={driveForm.jobTitle} onChange={(event) => setDriveForm({ ...driveForm, jobTitle: event.target.value })} required />
              </label>
              <label>
                Package *
                <input value={driveForm.package} onChange={(event) => setDriveForm({ ...driveForm, package: event.target.value })} required />
              </label>
              <label>
                Location *
                <input value={driveForm.location} onChange={(event) => setDriveForm({ ...driveForm, location: event.target.value })} required />
              </label>
              <label>
                Minimum CGPA *
                <input type="number" min="0" max="10" step="0.01" value={driveForm.eligibilityCgpa} onChange={(event) => setDriveForm({ ...driveForm, eligibilityCgpa: event.target.value })} required />
              </label>
              <label>
                Maximum backlogs
                <input type="number" min="0" step="1" value={driveForm.maxBacklogs} onChange={(event) => setDriveForm({ ...driveForm, maxBacklogs: event.target.value })} required />
              </label>
              <label>
                Application deadline *
                <input type="date" min={minimumDeadlineDate()} value={driveForm.applicationDeadline} onChange={(event) => setDriveForm({ ...driveForm, applicationDeadline: event.target.value })} required />
              </label>
              <label className="company-profile-full">
                Required skills (comma separated)
                <input value={driveForm.requiredSkills} onChange={(event) => setDriveForm({ ...driveForm, requiredSkills: event.target.value })} placeholder="JavaScript, SQL" />
              </label>
              <label className="company-profile-full">
                Description *
                <textarea rows={4} value={driveForm.description} onChange={(event) => setDriveForm({ ...driveForm, description: event.target.value })} required />
              </label>
              <div className="company-profile-full">
                <button className="company-save-button" type="submit" disabled={saving}>
                  {saving ? "Creating…" : "Create Drive"}
                </button>
              </div>
            </form>
          </section>

          <section className="company-panel">
            <h2>Your Placement Drives</h2>
            {drives.length === 0 ? (
              <p>No placement drives yet. Create one above to publish an opportunity.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Role</th><th>Package</th><th>Location</th><th>Deadline</th><th>Status</th></tr></thead>
                  <tbody>
                    {drives.map((drive) => (
                      <tr key={drive._id}>
                        <td><strong>{drive.jobTitle}</strong><br />{drive.description}</td>
                        <td>{drive.package}</td>
                        <td>{drive.location}</td>
                        <td>{formatDate(drive.applicationDeadline)}</td>
                        <td><span className="status-badge">{driveIsOpen(drive) ? "Open" : "Closed"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {!loading && section === "applications" && (
        <section className="company-panel">
          <h2>Applications to Your Drives</h2>
          {applications.length === 0 ? (
            <p>No applications have been submitted to your placement drives yet.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead><tr><th>Student</th><th>Profile</th><th>Placement drive</th><th>Applied</th><th>Status</th></tr></thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application._id}>
                      <td>{application.student?.userId?.name || "Student"}<br />{application.student?.userId?.email || ""}</td>
                      <td>{application.student?.rollNumber || "—"} · {application.student?.branch || "—"}<br />CGPA {application.student?.cgpa ?? "—"}</td>
                      <td>{application.job?.jobTitle || "Opportunity unavailable"}</td>
                      <td>{formatDate(application.appliedAt)}</td>
                      <td>
                        <select
                          className="table-select"
                          aria-label={`Application status for ${application.student?.userId?.name || "student"}`}
                          value={application.status}
                          disabled={updatingApplication === application._id}
                          onChange={(event) => updateApplicationStatus(application._id, event.target.value)}
                        >
                          {applicationStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {!loading && section === "students" && (
        <section className="company-panel">
          <h2>Students Matching a Drive</h2>
          {drives.length === 0 ? (
            <p>Create a placement drive to see students who meet its requirements.</p>
          ) : (
            <>
              <label>
                Placement drive
                <select value={selectedDrive} onChange={(event) => setSelectedDrive(event.target.value)}>
                  {drives.map((drive) => <option key={drive._id} value={drive._id}>{drive.jobTitle}</option>)}
                </select>
              </label>
              {students.length === 0 ? (
                <p>No students currently match this drive's CGPA, backlog, and skill requirements.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead><tr><th>Student</th><th>Roll number</th><th>Branch</th><th>CGPA</th><th>Backlogs</th><th>Skills</th></tr></thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td>{student.userId?.name || "Student"}<br />{student.userId?.email || ""}</td>
                          <td>{student.rollNumber}</td>
                          <td>{student.branch}</td>
                          <td>{student.cgpa}</td>
                          <td>{student.backlogs}</td>
                          <td>{student.skills?.join(", ") || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default CompanyWorkspace;
