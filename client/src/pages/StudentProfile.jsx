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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary: we will connect this to MongoDB later
    console.log("Student Profile:", formData);

    alert("Profile saved successfully!");
  };

  return (
    <div>
      <h1>Student Profile</h1>
      <p>Complete your profile to check placement eligibility.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Phone Number</label>
          <br />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Branch</label>
          <br />
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

        <br />

        <div>
          <label>CGPA</label>
          <br />
          <input
            type="number"
            name="cgpa"
            min="0"
            max="10"
            step="0.01"
            value={formData.cgpa}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Graduation Year</label>
          <br />
          <input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Number of Backlogs</label>
          <br />
          <input
            type="number"
            name="backlogs"
            min="0"
            value={formData.backlogs}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default StudentProfile;