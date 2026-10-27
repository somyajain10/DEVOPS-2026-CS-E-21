import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const emptyProfile = {
  rollNumber: "",
  branch: "",
  section: "",
  phone: "",
  cgpa: "",
  graduationYear: "",
  backlogs: 0,
  skills: "",
  resume: ""
};

function StudentProfile() {
  const [formData, setFormData] = useState(emptyProfile);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    apiRequest("/api/student/profile")
      .then(({ profile, user: profileUser }) => {
        setUser(profileUser);
        setHasProfile(Boolean(profile));
        if (profile) {
          setFormData({
            ...emptyProfile,
            ...profile,
            skills: (profile.skills || []).join(", ")
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...formData,
      cgpa: Number(formData.cgpa),
      graduationYear: Number(formData.graduationYear),
      backlogs: Number(formData.backlogs),
      skills: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    };

    try {
      const result = await apiRequest("/api/student/profile", {
        method: hasProfile ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      setFormData((current) => ({ ...current, ...result.profile, skills: payload.skills.join(", ") }));
      setHasProfile(true);
      setMessage(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p role="status">Loading your profile…</p>;

  return (
    <div>
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <p>Keep your academic and personal information up to date.</p>
      </div>

      <div className="content-card profile-card">
        <h2>Personal &amp; Academic Information</h2>
        <p className="section-description">
          This information is saved to your student profile and used for placement eligibility.
        </p>

        {error && <p className="error-message" role="alert">{error}</p>}
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="student-name">Full Name</label>
              <input id="student-name" value={user?.name || ""} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="student-email">Email Address</label>
              <input id="student-email" type="email" value={user?.email || ""} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="rollNumber">Roll Number</label>
              <input id="rollNumber" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="branch">Branch</label>
              <select id="branch" name="branch" value={formData.branch} onChange={handleChange} required>
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">Mechanical</option>
                <option value="CE">Civil</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="section">Section</label>
              <input id="section" name="section" value={formData.section} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="cgpa">CGPA</label>
              <input id="cgpa" type="number" name="cgpa" min="0" max="10" step="0.01" value={formData.cgpa} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="graduationYear">Graduation Year</label>
              <input id="graduationYear" type="number" name="graduationYear" min="2000" value={formData.graduationYear} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="backlogs">Number of Backlogs</label>
              <input id="backlogs" type="number" name="backlogs" min="0" value={formData.backlogs} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="skills">Skills (comma separated)</label>
              <input id="skills" name="skills" value={formData.skills} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Saving…" : "Save Profile"}
          </button>
          {message && <p className="success-message" role="status">✓ {message}</p>}
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;
