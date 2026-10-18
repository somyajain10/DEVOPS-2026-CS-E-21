import { useState } from "react";

function AdminContests() {
  const [contests, setContests] = useState([
    {
      id: 1,
      title: "Coding Challenge 2026",
      company: "TCS",
      date: "2026-11-05",
      duration: "90 minutes",
      status: "Upcoming",
    },
    {
      id: 2,
      title: "Technical Assessment",
      company: "Infosys",
      date: "2026-11-12",
      duration: "60 minutes",
      status: "Upcoming",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    date: "",
    duration: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateContest = (e) => {
    e.preventDefault();

    if (!form.title || !form.company || !form.date || !form.duration) {
      alert("Please fill all fields.");
      return;
    }

    setContests([
      ...contests,
      {
        id: Date.now(),
        ...form,
        status: "Upcoming",
      },
    ]);

    setForm({
      title: "",
      company: "",
      date: "",
      duration: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this contest?")) {
      setContests(
        contests.filter((contest) => contest.id !== id)
      );
    }
  };

  return (
    <div className="admin-page">

      <div className="admin-page-header">
        <div>
          <h1>Contests</h1>
          <p>Create and manage coding and assessment rounds.</p>
        </div>

        <button
          className="admin-primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Create Contest"}
        </button>
      </div>

      {showForm && (
        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>Create Contest</h2>
              <p>Schedule a new contest or assessment.</p>
            </div>
          </div>

          <form
            className="admin-form"
            onSubmit={handleCreateContest}
          >

            <div className="form-group">
              <label>Contest Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Coding Challenge"
              />
            </div>

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
              <label>Contest Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="90 minutes"
              />
            </div>

            <button
              type="submit"
              className="admin-primary-button"
            >
              Create Contest
            </button>

          </form>

        </div>
      )}

      <div className="admin-panel">

        {contests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3>No contests available</h3>
            <p>Create a contest to get started.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Company</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {contests.map((contest) => (
                  <tr key={contest.id}>

                    <td>
                      <strong>{contest.title}</strong>
                    </td>

                    <td>{contest.company}</td>

                    <td>{contest.date}</td>

                    <td>{contest.duration}</td>

                    <td>
                      <span className="status-badge">
                        {contest.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-button danger"
                        onClick={() =>
                          handleDelete(contest.id)
                        }
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

export default AdminContests;