import { useState } from "react";

function AdminApplications() {
  const [applications, setApplications] = useState([
    {
      id: 1,
      student: "Rahul Sharma",
      company: "TCS",
      role: "Software Engineer",
      date: "2026-10-10",
      status: "Applied",
    },
    {
      id: 2,
      student: "Priya Singh",
      company: "Infosys",
      role: "Graduate Engineer",
      date: "2026-10-11",
      status: "Shortlisted",
    },
  ]);

  const [filter, setFilter] = useState("All");

  const updateStatus = (id, status) => {
    setApplications(
      applications.map((application) =>
        application.id === id
          ? { ...application, status }
          : application
      )
    );
  };

  const filteredApplications =
    filter === "All"
      ? applications
      : applications.filter(
          (application) => application.status === filter
        );

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <div>
          <h1>Applications</h1>
          <p>Monitor student applications and placement progress.</p>
        </div>
      </div>

      <div className="admin-panel">

        <div className="admin-toolbar">

          <select
            className="admin-search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Applications</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>

        </div>

        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No applications found</h3>
            <p>Applications will appear here.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>

                    <td>
                      <strong>{application.student}</strong>
                    </td>

                    <td>{application.company}</td>

                    <td>{application.role}</td>

                    <td>{application.date}</td>

                    <td>
                      <span className="status-badge">
                        {application.status}
                      </span>
                    </td>

                    <td>
                      <select
                        className="table-select"
                        value={application.status}
                        onChange={(e) =>
                          updateStatus(
                            application.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">
                          Shortlisted
                        </option>
                        <option value="Selected">
                          Selected
                        </option>
                        <option value="Rejected">
                          Rejected
                        </option>
                      </select>
                    </td>

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

export default AdminApplications;