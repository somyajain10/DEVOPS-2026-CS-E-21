import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const emptyForm = { title: "", company: "", date: "", duration: "" };

function AdminContests() {
  const [contests, setContests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadContests = useCallback(async () => {
    try {
      const result = await apiRequest("/api/contests/admin");
      setContests(result.contests || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContests();
  }, [loadContests]);

  const handleCreateContest = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiRequest("/api/contests/admin", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setForm(emptyForm);
      setShowForm(false);
      await loadContests();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contest?")) return;
    setError("");
    try {
      await apiRequest(`/api/contests/admin/${id}`, { method: "DELETE" });
      await loadContests();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Contests</h1>
          <p>Create and manage coding and assessment rounds.</p>
        </div>
        <button className="admin-primary-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Create Contest"}
        </button>
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}

      {showForm && (
        <div className="admin-panel">
          <div className="panel-header">
            <div><h2>Create Contest</h2><p>Schedule a new contest or assessment.</p></div>
          </div>
          <form className="admin-form" onSubmit={handleCreateContest}>
            <div className="form-group">
              <label htmlFor="contest-title">Contest Title</label>
              <input id="contest-title" name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="contest-company">Company</label>
              <input id="contest-company" name="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="contest-date">Contest Date</label>
              <input id="contest-date" type="date" name="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label htmlFor="contest-duration">Duration</label>
              <input id="contest-duration" name="duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="90 minutes" required />
            </div>
            <button type="submit" className="admin-primary-button" disabled={saving}>
              {saving ? "Creating…" : "Create Contest"}
            </button>
          </form>
        </div>
      )}

      <div className="admin-panel">
        {loading ? <p role="status">Loading contests…</p> : contests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3>No contests available</h3>
            <p>Create a contest to get started.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr><th>Contest</th><th>Company</th><th>Date</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {contests.map((contest) => (
                  <tr key={contest._id}>
                    <td><strong>{contest.title}</strong></td>
                    <td>{contest.company}</td>
                    <td>{new Date(contest.date).toLocaleDateString()}</td>
                    <td>{contest.duration}</td>
                    <td><span className="status-badge">{new Date(contest.date) >= new Date(new Date().setHours(0, 0, 0, 0)) ? "Upcoming" : "Completed"}</span></td>
                    <td><button className="table-button danger" onClick={() => handleDelete(contest._id)}>Delete</button></td>
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
