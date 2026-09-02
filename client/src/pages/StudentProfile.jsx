import { useState } from "react";

function StudentProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    branch: "",
    cgpa: "",
    graduationYear: "",
    backlogs: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Student Profile:", formData);
    setMessage("Profile saved successfully!");
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>My Profile</h1>
        <p>
          Keep your academic and personal information up to date.
        </p>
      </div>

      <div className="content-card profile-card">
        <h2>Personal & Academic Information</h2>
        <p className="section-description">
          This information will be used to determine your eligibility for
          placement opportunities.
        </p>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
              >
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
              <label>CGPA</label>
              <input
                type="number"
                name="cgpa"
                min="0"
                max="10"
                step="0.01"
                placeholder="Example: 8.5"
                value={formData.cgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                placeholder="Example: 2027"
                value={formData.graduationYear}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Number of Backlogs</label>
              <input
                type="number"
                name="backlogs"
                min="0"
                placeholder="Enter number of backlogs"
                value={formData.backlogs}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-button">
            Save Profile
          </button>

          {message && (
            <p className="success-message">
              ✓ {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;