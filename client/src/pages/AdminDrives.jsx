import { useState } from "react";

function AdminDrives() {
  const [drives, setDrives] = useState([
    {
      id: 1,
      company: "TCS",
      role: "Software Engineer",
      package: "7 LPA",
      deadline: "2026-11-15",
      status: "Open",
    },
    {
      id: 2,
      company: "Infosys",
      role: "Graduate Engineer",
      package: "6 LPA",
      deadline: "2026-11-20",
      status: "Open",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    company: "",
    role: "",
    package: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddDrive = (e) => {
    e.preventDefault();

    if (!form.company || !form.role || !form.package || !form.deadline) {
      alert("Please fill all fields.");
      return;
    }

    setDrives([
      ...drives,
      {
        id: Date.now(),
        ...form,
        status: "Open",
      },
    ]);

    setForm({
      company: "",
      role: "",
      package: "",
      deadline: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this placement drive?")) {
      setDrives(drives.filter((drive) => drive.id !== id));
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <div>
          <h1>Placement Drives</h1>
          <p>Create and manage company placement opportunities.</p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Create Drive"}
        </button>
      </div>

      {showForm && (
        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>Create Placement Drive</h2>
              <p>Enter the details of the new opportunity.</p>
            </div>
          </div>

          <form className="admin-form" onSubmit={handleAddDrive}>

            <div className="form-group">
              <label>Company</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
              />
            </div>

            <div className="form-group">
              <label>Job Role</label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Software Engineer"
              />
            </div>

            <div className="form-group">
              <label>Package</label>
              <input
                name="package"
                value={form.package}
                onChange={handleChange}
                placeholder="7 LPA"
              />
            </div>

            <div className="form-group">
              <label>Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="admin-primary-button">
              Create Drive
            </button>

          </form>
        </div>
      )}

      <div className="admin-panel">

        {drives.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <h3>No placement drives</h3>
            <p>Create a placement drive to get started.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {drives.map((drive) => (
                  <tr key={drive.id}>

                    <td><strong>{drive.company}</strong></td>

                    <td>{drive.role}</td>

                    <td>{drive.package}</td>

                    <td>{drive.deadline}</td>

                    <td>
                      <span className="status-badge">
                        {drive.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-button danger"
                        onClick={() => handleDelete(drive.id)}
                      >
                        Delete
                      </button>
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

export default AdminDrives;